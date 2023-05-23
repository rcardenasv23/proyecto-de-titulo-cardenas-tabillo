import { Component, OnInit } from "@angular/core";
import { SaleService } from "../../../../../shared/services/sale/sale.service";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { UserSale } from "../../../../../core/models/user_sale";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-buys",
  templateUrl: "./buys.component.html",
  styleUrls: ["./buys.component.scss"],
})
export class BuysComponent implements OnInit {
  sales: Array<UserSale>;
  constructor(
    private saleService: SaleService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.sales = [];
    this.auth.GETUSER().subscribe({
      next: (res) => {
        this.saleService.GETBYUSER(res.data.id_user).subscribe({
          next: (res) => {
            this.sales = res.data;
            console.log(this.sales);
          },
          error: (err) => {
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al cargar las compras.",
              panelClass: "snack-bar-error",
            });
          },
        });
      },
      error: (err) => {},
    });
  }

  ngOnInit(): void {}
}
