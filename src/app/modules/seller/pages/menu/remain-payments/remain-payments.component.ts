import { Component, OnInit } from "@angular/core";
import { SaleService } from "../../../../../shared/services/sale/sale.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { Seller } from "../../../../../core/models/seller";
import { SellerSale } from "../../../../../core/models/seller_sale";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-remain-payments",
  templateUrl: "./remain-payments.component.html",
  styleUrls: ["./remain-payments.component.scss"],
})
export class RemainPaymentsComponent implements OnInit {
  seller!: Seller;
  sales!: Array<SellerSale>;
  constructor(
    private saleService: SaleService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.auth.GETSELLER().subscribe({
      next: (res) => {
        this.seller = res.data;
        this.saleService.GETBYSELLER(res.data.id_seller).subscribe({
          next: (res) => {
            this.sales = res.data;
          },
          error: (err) => {
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al cargar las ventas.",
              panelClass: "snack-bar-error",
            });
          },
        });
      },
      error: () => {},
    });
  }

  ngOnInit(): void {}
}
