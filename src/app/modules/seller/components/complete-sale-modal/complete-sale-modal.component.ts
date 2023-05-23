import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SaleService } from "../../../../shared/services/sale/sale.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SucceedSnackbarComponent } from "../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

declare var bootstrap: any;

@Component({
  selector: "app-complete-sale-modal",
  templateUrl: "./complete-sale-modal.component.html",
  styleUrls: ["./complete-sale-modal.component.scss"],
})
export class CompleteSaleModalComponent implements OnInit {
  @Input() id_sale!: string;
  @Output("revalidate") revalidate: EventEmitter<void> =
    new EventEmitter<void>();
  datePickForm: FormGroup;

  constructor(private saleService: SaleService, private snackBar: MatSnackBar) {
    this.datePickForm = new FormGroup({
      pickDate: new FormControl("", [Validators.required]),
      description: new FormControl("", []),
    });
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.saleService
      .ACCEPT(
        this.id_sale,
        this.datePickForm.value.pickDate,
        this.datePickForm.value.description
      )
      .subscribe({
        next: (res) => {
          let modal: any = document.getElementById("completeSale");
          let modalB = bootstrap.Modal.getInstance(modal);
          modalB.hide();
          this.snackBar.openFromComponent(SucceedSnackbarComponent, {
            data: "Venta aceptada con éxito",
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
