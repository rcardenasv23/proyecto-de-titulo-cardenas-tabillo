import { Component, OnInit } from "@angular/core";
import { SaleService } from "../../../../../shared/services/sale/sale.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserSaleDETAIL } from "../../../../../core/models/user_sale_detail";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { FileService } from "../../../../../shared/services/files/file.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";

@Component({
  selector: "app-buy-detail",
  templateUrl: "./buy-detail.component.html",
  styleUrls: ["./buy-detail.component.scss"],
})
export class BuyDetailComponent implements OnInit {
  loading = false;
  sale!: UserSaleDETAIL;
  media: any = {};
  metaData: any = "";
  isClose = false;

  constructor(
    private saleService: SaleService,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.saleService.GETDETAILBYUSER(params["id_sale"]).subscribe({
        next: (res) => {
          this.sale = res.data;
          this.media = res.data.sale_file;
          this.isClose =
            this.sale.sale_state.content_state === "completado" ||
            this.sale.sale_state.content_state === "rechazado";
          this.auth.GETUSER().subscribe({
            next: (res) => {
              if (res.data.id_user !== this.sale.id_user) {
                this.router.navigateByUrl("/user/home");
              }
            },
            error: () => {
              this.snackBar.openFromComponent(ErrorSnackBarComponent, {
                data: "Error al cargar usuario",
                panelClass: "snack-bar-error",
              });
              this.router.navigateByUrl("/user/home");
            },
          });
        },
      });
    });
  }

  ngOnInit(): void {}

  getQuantity(id_fixed: any) {
    return this.sale?.fixeds[id_fixed];
  }

  getState() {
    if (this.sale?.sale_state?.content_state === "completado") {
      return 0;
    }
    if (this.sale?.sale_state?.content_state === "rechazado") {
      return 1;
    }
    if (this.sale?.sale_state?.content_state === "espera") {
      return 2;
    }
    return -1;
  }

  revalidate() {
    this.activatedRoute.params.subscribe((params) => {
      this.saleService.GETDETAILBYUSER(params["id_sale"]).subscribe({
        next: (res) => {
          this.sale = res.data;
          this.media = res.data.sale_file;
        },
      });
    });
  }

  loadMedia(event: any) {
    let files = event.target.files;
    this.media["name"] = event.target.files[0].name;
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onloadend = async () => {
        this.metaData = reader.result;
      };
    }
  }

  deletemedia(): void {
    if (this.media.url) {
      this.handleDelete();
    } else {
      this.media = {};
      this.metaData = "";
    }
  }

  async handleAdd() {
    this.loading = true;
    let urlFirebase = await this.fileService.UPLOADUSERFILE(
      this.sale?.id_user + "/" + this.media.name,
      this.metaData
    );
    this.media = {
      ...this.media,
      extensions: [],
      height: undefined,
      id_file: undefined,
      width: undefined,
      url: urlFirebase as string,
    };
    this.saleService
      .UPLOADPAYMENTFILE(this.media, this.sale?.id_sale as string)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.snackBar.openFromComponent(SucceedSnackbarComponent, {
            data: "Archivo añadido de forma exitosa",
            panelClass: "snack-bar-success",
          });
          this.revalidate();
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al subir archivo, intente nuevamente",
            panelClass: "snack-bar-error",
          });
        },
      });
  }

  handleDelete() {
    this.saleService.DELETEPAYMENTFILE(this.media?.id_file).subscribe({
      next: async (res) => {
        this.loading = false;
        this.snackBar.openFromComponent(SucceedSnackbarComponent, {
          data: "Archivo borrado de forma exitosa",
          panelClass: "snack-bar-success",
        });
        try {
          await this.fileService.DELETEUSERFILE(
            this.media.url.split("o/")[1].split("?")[0].split("%2F").join("/")
          );
          this.revalidate();
        } catch (e) {
          console.log(e);
        }
        this.revalidate();
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al borrar el archivo, intente nuevamente",
          panelClass: "snack-bar-error",
        });
      },
    });
  }
}
