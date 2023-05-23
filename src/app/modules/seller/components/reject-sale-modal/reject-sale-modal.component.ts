import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SucceedSnackbarComponent } from "../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { SaleService } from "../../../../shared/services/sale/sale.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackBarComponent } from "../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

declare var bootstrap: any;

@Component({
  selector: "app-reject-sale-modal",
  templateUrl: "./reject-sale-modal.component.html",
  styleUrls: ["./reject-sale-modal.component.scss"],
})
export class RejectSaleModalComponent implements OnInit {
  @Input() id_sale!: string;
  @Output("revalidate") revalidate: EventEmitter<void> =
    new EventEmitter<void>();
  textForm: FormGroup;

  constructor(private saleService: SaleService, private snackBar: MatSnackBar) {
    this.textForm = new FormGroup({
      text: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.saleService.REJECT(this.id_sale, this.textForm.value.text).subscribe({
      next: (res) => {
        let modal: any = document.getElementById("rejectSale");
        let modalB = bootstrap.Modal.getInstance(modal);
        modalB.hide();
        this.snackBar.openFromComponent(SucceedSnackbarComponent, {
          data: "Venta rechazada con éxito",
          panelClass: "snack-bar-success",
        });
        this.revalidate.emit();
      },
      error: (err) => {
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al procesar su solicitud, intente nuevamente",
          panelClass: "snack-bar-error",
        });
      },
    });
  }
}
