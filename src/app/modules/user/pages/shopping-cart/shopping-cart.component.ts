import { Component, OnInit } from "@angular/core";
import { PublicationService } from "../../../../shared/services/publication/publication.service";
import { Publication } from "../../../../core/models/publication";
import { AuthService } from "../../../../core/services/authService/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackBarComponent } from "../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { Buy } from "../../../../core/models/buy";
import { LoadingSnackBarComponent } from "../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { SaleService } from "../../../../shared/services/sale/sale.service";

@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.component.html",
  styleUrls: ["./shopping-cart.component.scss"],
})
export class ShoppingCartComponent implements OnInit {
  stocks: Array<any> = [];
  buys: any;
  total = 0;

  constructor(
    private publicationService: PublicationService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private sale: SaleService
  ) {
    this.buys = JSON.parse(localStorage.getItem("shopping-cart") as string);
    if (this.buys && Object.keys(this.buys).length > 0) {
      this.publicationService
        .GETPUBLICATIONSBYID(Object.keys(this.buys))
        .subscribe({
          next: (res) => {
            for (let publication of res.data) {
              this.stocks.push({
                ...publication,
                files: [...publication.publication_files],
                address: { ...publication.address },
              });
            }
            this.refreshTotal();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  ngOnInit(): void {}

  refreshProducts() {
    this.buys = JSON.parse(localStorage.getItem("shopping-cart") as string);
    if (this.buys && Object.keys(this.buys).length > 0) {
      this.publicationService
        .GETPUBLICATIONSBYID(Object.keys(this.buys))
        .subscribe({
          next: (res) => {
            let aux: Array<Publication> = [];
            for (let publication of res.data) {
              aux.push({
                ...publication,
                files: [...publication.publication_files],
                address: { ...publication.address },
              });
            }
            this.stocks = aux;
            this.refreshTotal();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  refreshTotal(): void {
    this.total = 0;
    for (let publication of this.stocks) {
      this.total += publication.price * this.buys[publication.id_fixed];
    }
  }

  updateStock(e: any, id: string) {
    let current_Cart = JSON.parse(
      localStorage.getItem("shopping-cart") as string
    );
    current_Cart[id] = e.target.value;
    localStorage.setItem("shopping-cart", JSON.stringify(current_Cart));
    this.refreshProducts();
    this.refreshTotal();
  }

  emptyObject() {
    if (Object.keys(this.buys).length > 0) {
      return false;
    }
    return true;
  }

  deleteStock(e: any, id: string) {
    let current_Cart = JSON.parse(
      localStorage.getItem("shopping-cart") as string
    );
    delete current_Cart[id];
    localStorage.setItem("shopping-cart", JSON.stringify(current_Cart));
    this.refreshProducts();
    this.refreshTotal();
  }

  async handleBuy() {
    if (!this.auth.getToken()) {
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Para poder finalizar la compra debe iniciar sesión o crear una cuenta",
        panelClass: "snack-bar-error",
      });
      return;
    }
    let loadingSnackbar: any = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Cargando compra, por favor espere",
        panelClass: "snack-bar-loading",
      }
    );
    this.auth.GETUSER().subscribe({
      next: (res: any) => {
        let current_Cart = JSON.parse(
          localStorage.getItem("shopping-cart") as string
        );
        const sellers: any = {};
        for (let publication of this.stocks) {
          if (!Object.keys(sellers).includes(publication.id_seller)) {
            if (!sellers[publication.id_seller]) {
              sellers[publication.id_seller] = {};
              sellers[publication.id_seller][publication.id_fixed] =
                current_Cart[publication.id_fixed];
            } else {
              sellers[publication.id_seller][publication.id_fixed] =
                current_Cart[publication.id_fixed];
            }
          }
        }
        const buy: Buy = {
          sellers: sellers,
          user: { email: res.data.email, id_user: res.data.id_user },
        };
        this.sale.BUY(buy).subscribe({
          next: (res: any) => {
            loadingSnackbar.dismiss();
            localStorage.removeItem("shopping-cart");
            this.snackBar.openFromComponent(SucceedSnackbarComponent, {
              data: "Compra realizada con éxito",
              panelClass: "snack-bar-success",
            });
            this.refreshProducts();
            this.refreshTotal();
          },
          error: (err: any) => {
            loadingSnackbar.dismiss();
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al efectuar compra.",
              panelClass: "snack-bar-error",
            });
          },
        });
      },
      error: (err) => {
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al efectuar compra.",
          panelClass: "snack-bar-error",
        });
      },
    });
  }
}
