import { Component, OnInit } from "@angular/core";
import { PublicationService } from "../../../../../shared/services/publication/publication.service";
import { Publication } from "../../../../../core/models/publication";
import { Seller } from "../../../../../core/models/seller";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-view-publications",
  templateUrl: "./view-publications.component.html",
  styleUrls: ["./view-publications.component.scss"],
})
export class ViewPublicationsComponent implements OnInit {
  publications: Array<Publication>;
  seller: Seller | undefined;
  loading = false;

  constructor(
    private publicationService: PublicationService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loading = true;
    this.publications = [];
    this.auth.GETSELLER().subscribe({
      next: (res) => {
        this.seller = res.data;
        this.publicationService
          .GETPUBLICATIONSBYSELLER(this.seller?.id_seller as string)
          .subscribe({
            next: (res) => {
              this.publications = res.data;
              this.loading = false;
            },
            error: (err) => {
              this.snackBar.openFromComponent(ErrorSnackBarComponent, {
                data: "Error al obtener publicaciones",
                panelClass: "snack-bar-error",
              });
              this.loading = false;
            },
          });
      },
      error: (err) => {
        console.log(err);
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al obtener la información de vendedor",
          panelClass: "snack-bar-error",
        });
        this.loading = false;
      },
    });
  }

  ngOnInit(): void {}
}
