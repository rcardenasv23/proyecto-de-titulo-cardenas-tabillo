import { Component, OnInit } from "@angular/core";
import { SaleService } from "../../../../../../shared/services/sale/sale.service";
import { AuthService } from "../../../../../../core/services/authService/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SellerSaleDetails } from "../../../../../../core/models/seller-sale-details";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorSnackBarComponent } from "../../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { Seller } from "../../../../../../core/models/seller";
import addDays from "date-fns/addDays";

@Component({
  selector: "app-view-sale",
  templateUrl: "./view-sale.component.html",
  styleUrls: ["./view-sale.component.scss"],
})
export class ViewSaleComponent implements OnInit {
  sale!: SellerSaleDetails;
  seller!: Seller;
  loading = false;
  rejectable = false;
  isClose = false;

  constructor(
    private saleService: SaleService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.loading = true;
    this.activatedRoute.params.subscribe((params) => {
      this.saleService.GETDETAILBYSELLER(params["id_sale"]).subscribe({
        next: (res) => {
          this.auth.GETSELLER().subscribe({
            next: (res) => {
              if (res.data.id_seller !== this.sale.id_seller) {
                this.router.navigateByUrl("/seller/menu");
              }
              this.loading = false;
              this.seller = res.data;
            },
            error: () => {
              this.snackBar.openFromComponent(ErrorSnackBarComponent, {
                data: "Error al cargar vendedor",
                panelClass: "snack-bar-error",
              });
              this.router.navigateByUrl("/seller/menu");
            },
          });
          this.sale = res.data;
          this.rejectable =
            addDays(new Date(this.sale.created_at), 5) < new Date();
          this.isClose =
            this.sale.sale_state.content_state === "completado" ||
            this.sale.sale_state.content_state === "rechazado";
        },
        error: (err) => {
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al cargar detalle",
            panelClass: "snack-bar-error",
          });
          this.router.navigateByUrl("/seller/menu");
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
      this.saleService.GETDETAILBYSELLER(params["id_sale"]).subscribe({
        next: (res) => {
          this.sale = res.data;
          this.rejectable =
            addDays(new Date(this.sale.created_at), 5) < new Date();
          this.isClose =
            this.sale.sale_state.content_state === "completado" ||
            this.sale.sale_state.content_state === "rechazado";
        },
        error: (err) => {
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al cargar detalle",
            panelClass: "snack-bar-error",
          });
          this.router.navigateByUrl("/seller/menu");
        },
      });
    });
  }
}
