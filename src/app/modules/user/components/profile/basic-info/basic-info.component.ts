import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { User } from "../../../../../core/models/user";
import { UpdateServiceService } from "../../../services/update-service.service";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";

@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
})
export class BasicInfoComponent implements OnInit {
  basicInfoForm: FormGroup;
  loading = false;
  user: User | undefined;
  avaible = false;
  msgToast: any = {};
  errors: any = {
    first_name: {
      required: "Nombre requerido",
      maxlength: "Máximo de caracteres superado",
    },
    last_name: {
      required: "Apellido requerido",
      maxlength: "Máximo de caracteres superado",
    },
    user_name: {
      minlength: "Largo mínimo de 4",
      maxlength: "Máximo de caracteres superado",
    },
    phone: {
      required: "Teléfono requerido",
      pattern: "Formato incorrecto",
    },
  };

  constructor(
    private auth: AuthService,
    private update: UpdateServiceService,
    private snackBar: MatSnackBar
  ) {
    this.loading = true;
    this.auth.GETUSER().subscribe({
      next: (res) => {
        this.loading = false;
        this.user = res.data;
        this.avaible = true;
        this.basicInfoForm = new FormGroup({
          first_name: new FormControl(this.user?.first_name, [
            Validators.required,
            Validators.maxLength(50),
          ]),
          last_name: new FormControl(this.user?.last_name, [
            Validators.required,
            Validators.maxLength(50),
          ]),
          user_name: new FormControl(this.user?.user_name, [
            Validators.minLength(4),
            Validators.maxLength(15),
          ]),
          phone: new FormControl(this.user?.phone, [
            Validators.required,
            Validators.pattern(`^([0-9]{9}|[0-9]{11})$`),
          ]),
        });
      },
    });
    this.basicInfoForm = new FormGroup({
      first_name: new FormControl("", [Validators.maxLength(50)]),
      last_name: new FormControl("", [Validators.maxLength(50)]),
      user_name: new FormControl("", [
        Validators.minLength(4),
        Validators.maxLength(15),
      ]),
      phone: new FormControl("", [
        Validators.pattern("^([0-9]{9}|[0-9]{11})$"),
      ]),
    });
  }

  ngOnInit(): void {}

  getError(controlName: string): string {
    if (this.basicInfoForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (this.basicInfoForm.controls[controlName].hasError("maxlength")) {
      return this.errors[controlName].maxlength;
    } else if (this.basicInfoForm.controls[controlName].hasError("minlength")) {
      return this.errors[controlName].minlength;
    } else if (this.basicInfoForm.controls[controlName].hasError("pattern")) {
      return this.errors[controlName].pattern;
    }
    return "";
  }

  handleSubmit(): void {
    let loadingSnackBar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Cargando, espere por favor.",
        panelClass: "snack-bar-loading",
      }
    );

    if (this.user) {
      this.user.first_name = this.basicInfoForm.value.first_name;
      this.user.last_name = this.basicInfoForm.value.last_name;
      this.user.user_name = this.basicInfoForm.value.user_name;
      this.user.phone = this.basicInfoForm.value.phone;
    } else {
      this.snackBar.openFromComponent(LoadingSnackBarComponent, {
        data: "Cargando, espere por favor",
        panelClass: "snack-bar-loading",
      });
      return;
    }
    this.update.UPDATEBASICINFO(this.user).subscribe({
      next: (res: any) => {
        loadingSnackBar.dismiss();
        this.snackBar.openFromComponent(SucceedSnackbarComponent, {
          data: "Sus cambios se han ralizado con éxito",
          panelClass: "snack-bar-success",
        });
      },
      error: (err: any) => {
        loadingSnackBar.dismiss();
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Ha ocurrido un error al procesar sus cambios, intente nuevamente",
          panelClass: "snack-bar-error",
        });
      },
      complete: () => {
        loadingSnackBar.dismiss();
      },
    });
  }
}
