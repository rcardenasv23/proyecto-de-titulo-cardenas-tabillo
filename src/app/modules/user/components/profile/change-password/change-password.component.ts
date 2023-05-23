import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { UpdateServiceService } from "../../../services/update-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePassForm: FormGroup;
  errors: any = {
    currentPassword: {
      required: "Contraseña actual, requerida",
      minlength: "Mínimo 6 caracteres",
      maxlength: "Máximo de caracteres sobrepasado",
    },
    newPassword: {
      required: "Contraseña nueva requerida",
      minlength: "Mínimo 6 caracteres",
      maxlength: "Máximo de caracteres sobrepasado",
    },
    repeatPassword: {
      required: "Repita la contraseña",
      passwordMatch: "Las contraseñas no coinciden",
    },
  };
  loading = false;

  validatePasswordMatch = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const password = this.changePassForm?.get("newPassword")?.value as string;
    const passwordConfirm = control.value as string;

    if (password !== passwordConfirm) {
      return { passwordMatch: true };
    }

    return null;
  };

  constructor(
    private auth: AuthService,
    private update: UpdateServiceService,
    private snackBar: MatSnackBar
  ) {
    this.changePassForm = new FormGroup({
      currentPassword: new FormControl("", [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(6),
        Validators.maxLength(15),
      ]),
      newPassword: new FormControl("", [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(6),
        Validators.maxLength(15),
      ]),
      repeatPassword: new FormControl("", [
        Validators.required,
        this.validatePasswordMatch,
      ]),
    });
  }

  ngOnInit(): void {}

  getError(controlName: string): string {
    if (this.changePassForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (
      this.changePassForm.controls[controlName].hasError("maxlength")
    ) {
      return this.errors[controlName].maxlength;
    } else if (
      this.changePassForm.controls[controlName].hasError("minlength")
    ) {
      return this.errors[controlName].maxlength;
    } else if (
      this.changePassForm.controls[controlName].hasError("passwordMatch")
    ) {
      return this.errors[controlName].maxlength;
    }
    return "";
  }

  handleSubmit() {
    this.loading = true;
    let loadingSnackBar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Cargando, espere por favor",
        panelClass: "snack-bar-loading",
      }
    );
    this.update
      .UPDATEPASSWORD(
        this.changePassForm.value.currentPassword,
        this.changePassForm.value.newPassword
      )
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(SucceedSnackbarComponent, {
            data: "Contraseña actualizada con éxito",
            panelClass: "snack-bar-success",
          });
          this.changePassForm.reset();
        },
        error: (err: any) => {
          this.loading = false;
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Ha ocurrido un error al procesar sus cambios, intente nuevamente",
            panelClass: "snack-bar-error",
          });
        },
      });
  }
}
