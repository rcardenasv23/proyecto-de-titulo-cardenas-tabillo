import { Component, OnInit } from "@angular/core";
import { Publication } from "../../../../core/models/publication";
import { ActivatedRoute, Router } from "@angular/router";
import { PublicationService } from "../../../../shared/services/publication/publication.service";
import { File } from "../../../../core/models/file";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/authService/auth.service";
import { Seller } from "../../../../core/models/seller";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SucceedSnackbarComponent } from "../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { User } from "../../../../core/models/user";

@Component({
  selector: "app-publication",
  templateUrl: "./publication.component.html",
  styleUrls: ["./publication.component.scss"],
})
export class PublicationComponent implements OnInit {
  publication!: Publication;
  loading = false;
  imageSelected!: File;
  option: number = 0;
  quantityForm: FormGroup;
  seller: Seller | undefined;
  isWebView:boolean = false
  user: User | undefined;
  errors: any = {
    quantity: {
      required: "Cantidad requerida",
      min: "Mínimo de compra es 1",
      max: "Máximo superado",
    },
  };
  canComment = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicationService: PublicationService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.quantityForm = new FormGroup({
      quantity: new FormControl("", [Validators.required, Validators.min(1)]),
    });
    this.activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.publicationService.GETPUBLICATION(id).subscribe({
        next: (res) => {
          this.publication = res.data;
          this.imageSelected = this.publication.files[0]!;
          this.quantityForm.controls["quantity"].addValidators([
            Validators.max(this.publication.current_stock),
          ]);
          this.auth.GETSELLER().subscribe({
            next: (res) => {
              if (res.data.id_seller !== this.publication.id_seller) {
                this.seller = res.data;

              }else{
                this.isWebView = true
              }
            },
            error: (err) => {
              console.log("error",err);
            },
          });
          this.auth.GETUSER().subscribe({
            next: (res) => {
              this.user = res.data;
              this.publicationService
                .COMMENTPERMISSION(
                  this.user?.id_user as string,
                  this.publication.id_fixed as string
                )
                .subscribe({
                  next: (res) => {
                    this.canComment = res.data;
                  },
                  error:(err)=>{
                    console.log(err);
                  }
                });
            },
            error: () => {},
          });
        },
        error: (err) => {
          console.log(err);
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al carga la publicación",
            panelClass: "snack-bar-error",
          });
        },
      });
    });
  }

  ngOnInit(): void {
  }

  getError(controlName: string): string {
    if (this.quantityForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (this.quantityForm.controls[controlName].hasError("max")) {
      return this.errors[controlName].max;
    } else if (this.quantityForm.controls[controlName].hasError("min")) {
      return this.errors[controlName].min;
    }
    return "";
  }

  optionChange(option: number) {
    this.option = option;
  }

  revalidate(id: string) {
    this.publicationService.GETPUBLICATION(id).subscribe({
      next: (res) => {
        this.publication = res.data;
      },
      error: async (err) => {
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al cargar publicación o inexsistente",
          panelClass: "snack-bar-error",
        });
        await this.router.navigateByUrl("/user/home");
      },
    });
  }

  async handleBuy(reDirect: boolean) {
    let current_Cart = JSON.parse(
      localStorage.getItem("shopping-cart") as string
    );
    if (!current_Cart || current_Cart?.length === 0) {
      current_Cart = {};
    }
    current_Cart[this.publication.id_fixed as string] =
      this.quantityForm.controls["quantity"].value;
    localStorage.setItem("shopping-cart", JSON.stringify(current_Cart));
    this.snackBar.openFromComponent(SucceedSnackbarComponent, {
      data: "Carrito actualizado con éxito.",
      panelClass: "snack-bar-success",
    });
    if (reDirect) {
      await this.router.navigateByUrl("/user/shopping-cart");
    }
  }
}
