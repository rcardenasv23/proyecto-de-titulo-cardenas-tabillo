import { Component, OnInit } from "@angular/core";
import { Seller } from "../../../../../core/models/seller";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { banks } from "../../../../../core/lib/banks";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";

@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
})
export class BasicInfoComponent implements OnInit {
  loading: boolean = false;
  seller!: Seller;
  updateForm: FormGroup;
  banks = banks;
  errors: any = {
    email: {
      required: "Email requerido",
      email: "Email erroneo",
      maxLength: "Maximo de caracteres superado",
    },
    store_name: {
      required: "Nombre requerido",
      maxLength: "Máximo de caracteres superado",
    },
    rut: {
      required: "RUT requerido",
      pattern: "Formato erroneo",
    },
    phone: { required: "Telefono requerido", pattern: "Formato erroneo" },
    bank_name: {
      required: "Nombre de banco requerido",
    },
    bank_account_name: {
      required: "Nombre del destinatario requerido",
      maxLength: "Máximo de caracteres superado",
    },
    bank_account_type: {
      required: "Tipo de cuenta requerido",
    },
    bank_account_address: {
      required: "Número de cuenta requerido",
      maxLength: "Máximo de caracteres superado",
    },
    bank_account_email: {
      required: "Email de destinatario requerido",
      pattern: "Formato erroneo",
      maxLength: "Máximo de caracteres superado",
    },
    bank_account_rut: {
      required: "RUT de destinatario requerido",
      pattern: "Formato erroneo",
    },
  };

  constructor(private auth: AuthService, private snackBar: MatSnackBar) {
    this.loading = true;
    this.auth.GETSELLER().subscribe({
      next: (res) => {
        this.seller = res.data;
        this.updateForm.patchValue({
          ...res.data,
        });
        this.loading = false;
      },
    });
    this.updateForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      store_name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      rut: new FormControl("", [
        Validators.required,
        Validators.pattern(`^([0-9]{8,}-[0-9]{1})$`),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern(`^([0-9]{9}|[0-9]{11})$`),
      ]),
      bank_name: new FormControl("", [Validators.required]),
      bank_account_name: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
      bank_account_type: new FormControl("", [Validators.required]),
      bank_account_address: new FormControl("", [
        Validators.required,
        Validators.maxLength(100),
      ]),
      bank_account_email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(200),
      ]),
      bank_account_rut: new FormControl("", [
        Validators.required,
        Validators.pattern(`^([0-9]{8,}-[0-9]{1})$`),
      ]),
    });
  }

  ngOnInit(): void {
    console.log(this.updateForm.controls);
  }

  getError(controlName: string): string {
    if (this.updateForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (this.updateForm.controls[controlName].hasError("maxlength")) {
      return this.errors[controlName].maxlength;
    } else if (this.updateForm.controls[controlName].hasError("email")) {
      return this.errors[controlName].email;
    } else if (this.updateForm.controls[controlName].hasError("pattern")) {
      return this.errors[controlName].pattern;
    }
    return "";
  }

  reset() {
    this.updateForm.patchValue({ ...this.seller });
  }

  async handleUpdate() {
    this.loading = true;
    let loadingSnackbar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Cargando datos, espere por favor",
        panelClass: "snack-bar-loading",
      }
    );
    try {
      await this.auth
        .UPDATESELLER({
          ...this.updateForm.value,
          id_seller: this.seller.id_seller,
        })
        .subscribe({
          next: (res) => {
            this.loading = false;
            loadingSnackbar.dismiss();
            this.snackBar.openFromComponent(SucceedSnackbarComponent, {
              data: "Información actualizada correctamente",
              panelClass: "snack-bar-success",
            });
            this.updateForm.patchValue({ ...res.data });
          },
          error: (err) => {
            this.loading = false;
            loadingSnackbar.dismiss();
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al actualizar la información",
              panelClass: "snack-bar-error",
            });
          },
        });
    } catch (e) {
      this.loading = false;
      loadingSnackbar.dismiss();
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Error al actualizar la información",
        panelClass: "snack-bar-error",
      });
    }
  }
}
