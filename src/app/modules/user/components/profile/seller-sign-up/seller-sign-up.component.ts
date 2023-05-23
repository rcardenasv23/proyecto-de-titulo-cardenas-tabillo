import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UpdateServiceService } from "../../../services/update-service.service";
import { Seller } from "../../../../../core/models/seller";
import { User } from "../../../../../core/models/user";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { banks } from "../../../../../core/lib/banks";
import { Router } from "@angular/router";
@Component({
  selector: "app-seller-sign-up",
  templateUrl: "./seller-sign-up.component.html",
  styleUrls: ["./seller-sign-up.component.scss"],
})
export class SellerSignUpComponent implements OnInit {
  joinForm: FormGroup;
  banks = banks;
  user: User | undefined;
  errors: any = {
    email: {
      required: "Email requerido",
      email: "Email erroneo",
      maxLength: "Maximo de caracteres superado",
    },
    name: {
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

  constructor(
    private userService: UpdateServiceService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    auth.GETUSER().subscribe({
      next: (res) => {
        this.user = res.data;
      },
    });
    this.joinForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      rut: new FormControl("", [
        Validators.required,
        Validators.pattern(`^([0-9]{7,}-[0-9]{1})$`),
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
        Validators.pattern(`^([0-9]{7,}-[0-9]{1})$`),
      ]),
    });
  }

  ngOnInit(): void {}

  getError(controlName: string): string {
    if (this.joinForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (this.joinForm.controls[controlName].hasError("maxlength")) {
      return this.errors[controlName].maxlength;
    } else if (this.joinForm.controls[controlName].hasError("email")) {
      return this.errors[controlName].email;
    } else if (this.joinForm.controls[controlName].hasError("pattern")) {
      return this.errors[controlName].pattern;
    }
    return "";
  }

  handleSubmit() {
    const loadingSnackBar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Ingresando solicitud",
        panelClass: "snack-bar-loading",
      }
    );
    if (this.user !== undefined) {
      const seller: Seller = {
        id_seller: undefined,
        id_user: String(this.user.id_user),
        email: this.joinForm.value.email,
        store_name: this.joinForm.value.name,
        rut: this.joinForm.value.rut,
        phone: this.joinForm.value.phone,
        created_at: new Date(),
        file: null,
        bank_name: this.joinForm.value.bank_name,
        bank_account_name: this.joinForm.value.bank_account_name,
        bank_account_type: this.joinForm.value.bank_account_type,
        bank_account_address: this.joinForm.value.bank_account_address,
        bank_account_email: this.joinForm.value.bank_account_email,
        bank_account_rut: this.joinForm.value.bank_account_rut,
        publications: null,
      };
      this.userService.JOINASSELLER(seller).subscribe({
        next: (res) => {
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(SucceedSnackbarComponent, {
            data: "Su solicitud se ha ralizado con éxito, por favor vuelva a iniciar sesión.",
            panelClass: "snack-bar-success",
          });
          localStorage.removeItem("token");
          this.router
            .navigateByUrl("/user/home")
            .then(() => window.location.reload());
        },
        error: (err) => {
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Ha ocurrido un error al procesar sus solicitud, intente nuevamente",
            panelClass: "snack-bar-error",
          });
        },
        complete: () => {
          loadingSnackBar.dismiss();
        },
      });
    }
  }
}
