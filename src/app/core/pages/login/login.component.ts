import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/authService/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingSnackBarComponent } from "../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  msgToast: any = {};

  send = false;
  cargando = false;
  subido = false;
  correoinvalido = false;
  contrasenainvalida = false;
  logincontrol: FormGroup;
  errors: any = {
    email: {
      required: "Email requerido",
      email: "Formato incorrecto",
      maxlength: "Largo máximo sobrepasado",
    },
    pass: {
      required: "Contraseña requerida",
      minlength: "Largo mínimo de 6 caracteres",
      maxlength: "Largo máximo sobrepasado",
    },
  };

  constructor(
    private router: Router,
    private http: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.logincontrol = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.nullValidator,
        Validators.maxLength(50),
      ]),
      pass: new FormControl("", [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(6),
        Validators.maxLength(15),
      ]),
    });
  }

  ngOnInit(): void {}

  getError(controlName: string): string {
    if (this.logincontrol.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (this.logincontrol.controls[controlName].hasError("maxlength")) {
      return this.errors[controlName].maxlength;
    } else if (this.logincontrol.controls[controlName].hasError("minlength")) {
      return this.errors[controlName].minlength;
    } else if (this.logincontrol.controls[controlName].hasError("email")) {
      return this.errors[controlName].email;
    }
    return "";
  }

  async handleSubmit() {
    const loadingSnackBar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Por favor, espere mientras se procesa su solicitud",
        panelClass: "snack-bar-loading",
      }
    );
    this.http
      .LOGIN(this.logincontrol.value.email, this.logincontrol.value.pass)
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            loadingSnackBar.dismiss();
            localStorage.setItem("token", res.token);
            this.snackBar.openFromComponent(SucceedSnackbarComponent, {
              data: "Sesión iniciada correctamente, en breve seras redirigido al inicio",
              panelClass: "snack-bar-success",
            });
            setInterval(() => {
              this.router.navigateByUrl("/user/home").then(() => {
                window.location.reload();
              });
            }, 1500);
          }
        },
        error: (error) => {
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al iniciar sesión",
            panelClass: "snack-bar-error",
          });
        },
        complete: () => {
          loadingSnackBar.dismiss();
        },
      });
  }
}
