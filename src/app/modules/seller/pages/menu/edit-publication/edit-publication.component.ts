import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { Seller } from "../../../../../core/models/seller";
import { PublicationService } from "../../../../../shared/services/publication/publication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Publication } from "../../../../../core/models/publication";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ContentState } from "../../../../../core/models/content_state";

@Component({
  selector: "app-edit-publication",
  templateUrl: "./edit-publication.component.html",
  styleUrls: ["./edit-publication.component.scss"],
})
export class EditPublicationComponent implements OnInit {
  seller: Seller | undefined;
  publication: Publication | undefined;
  available = true;
  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private publicationService: PublicationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.auth.GETSELLER().subscribe({
      next: (res) => {
        this.seller = res.data;
      },
    });
    this.activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.publicationService.GETPUBLICATION(id).subscribe({
        next: (res) => {
          this.publication = res.data;
          if (
            (this.publication?.content_state as ContentState).content_state ===
            "inactiva"
          ) {
            this.available = false;
          }
        },
        error: async (err) => {
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al cargar publicación o inexsistente",
            panelClass: "snack-bar-error",
          });
          await this.router.navigateByUrl(
            "/seller/menu/(seller-menu:publications)"
          );
        },
      });
    });
  }

  ngOnInit(): void {
    this.auth.GETSELLER().subscribe({
      next: (res) => {
        this.seller = res.data;
      },
    });
    this.activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.publicationService.GETPUBLICATION(id).subscribe({
        next: (res) => {
          this.publication = res.data;
          if (
            (this.publication?.content_state as ContentState).content_state ===
            "inactiva"
          ) {
            this.available = false;
          }
        },
        error: async (err) => {
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al cargar publicación o inexsistente",
            panelClass: "snack-bar-error",
          });
          await this.router.navigateByUrl(
            "/seller/menu/(seller-menu:publications)"
          );
        },
      });
    });
  }

  revalidate(id: string) {
    this.publicationService.GETPUBLICATION(id).subscribe({
      next: (res) => {
        this.publication = res.data;
        if (
          (this.publication?.content_state as ContentState).content_state ===
          "inactiva"
        ) {
          this.available = false;
        } else {
          this.available = true;
        }
      },
      error: async (err) => {
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al cargar publicación o inexsistente",
          panelClass: "snack-bar-error",
        });
        await this.router.navigateByUrl(
          "/seller/menu/(seller-menu:publications)"
        );
      },
    });
  }

  closePublication() {
    try {
      this.publicationService
        .CLOSEPUBLICATION(this.publication?.id_fixed as string)
        .subscribe({
          next: (res) => {
            this.revalidate(res.data.id_fixed);
            this.snackBar.openFromComponent(SucceedSnackbarComponent, {
              data: "Publicación deshabilitada",
              panelClass: "snack-bar-success",
            });
          },
          error: (err) => {
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al deshabilitar la publicación",
              panelClass: "snack-bar-error",
            });
          },
        });
    } catch (e: any) {
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Error al deshabilitar la publicación",
        panelClass: "snack-bar-error",
      });
    }
  }
  openPublication() {
    try {
      this.publicationService
        .OPENPUBLICATION(this.publication?.id_fixed as string)
        .subscribe({
          next: (res) => {
            this.revalidate(res.data.id_fixed);
            this.snackBar.openFromComponent(SucceedSnackbarComponent, {
              data: "Publicación habilitada",
              panelClass: "snack-bar-success",
            });
          },
          error: (err) => {
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al habilitar la publicación",
              panelClass: "snack-bar-error",
            });
          },
        });
    } catch (e: any) {
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Error al habilitar la publicación",
        panelClass: "snack-bar-error",
      });
    }
  }

  reActivate() {
    try {
      this.publicationService
          .REACTIVATEPUBLICATION(this.publication?.id_fixed as string)
          .subscribe({
            next: (res) => {
              this.revalidate(res.data.id_fixed);
              this.snackBar.openFromComponent(SucceedSnackbarComponent, {
                data: "Publicación reactivada",
                panelClass: "snack-bar-success",
              });
            },
            error: (err) => {
              this.snackBar.openFromComponent(ErrorSnackBarComponent, {
                data: "Error al habilitar la publicación",
                panelClass: "snack-bar-error",
              });
            },
          });
    } catch (e: any) {
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Error al habilitar la publicación",
        panelClass: "snack-bar-error",
      });
    }
  }
}
