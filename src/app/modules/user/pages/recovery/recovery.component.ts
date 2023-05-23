import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../core/services/authService/auth.service";
import { User } from "../../../../core/models/user";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackBarComponent } from "../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";

@Component({
  selector: "app-recovery",
  templateUrl: "./recovery.component.html",
  styleUrls: ["./recovery.component.scss"],
})
export class RecoveryComponent implements OnInit {
  recoverycontrol: FormGroup;
  loading = false;
  errors: any = {
    email: {
      required: "Email necesario",
      email: "Formato incorrecto",
    },
    phone: {
      required: "Teléfono necesario",
      pattern: "Formato incorrecto",
    },
  };

  user!: User;

  constructor(private auth: AuthService, private snackBar: MatSnackBar) {
    this.recoverycontrol = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]{9}"),
      ]),
    });
  }

  ngOnInit(): void {}

  getError(controlName: string): string {
    if (this.recoverycontrol.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (this.recoverycontrol.controls[controlName].hasError("email")) {
      return this.errors[controlName].maxlength;
    } else if (this.recoverycontrol.controls[controlName].hasError("pattern")) {
      return this.errors[controlName].maxlength;
    }
    return "";
  }

  sendRecovery() {
    this.loading = true;
    const values = this.recoverycontrol.value;
    this.auth.PASSWORDRECOVERY(values.email, values.phone).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.openFromComponent(SucceedSnackbarComponent, {
          data: "Contraseña reiniciada, revise el correo ingresado por favor",
          panelClass: "snack-bar-success",
        });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "No hay coincidencia entre correo y telefono",
          panelClass: "snack-bar-error",
        });
      },
    });
  }
}
