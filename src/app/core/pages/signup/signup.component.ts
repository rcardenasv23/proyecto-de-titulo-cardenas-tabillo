import { Component, OnInit } from "@angular/core";
import { Region } from "../../models/region";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Commune } from "../../models/commune";
import { BaseInfoService } from "../../../shared/services/baseInfoService/base-info.service";
import { User } from "../../models/user";
import { AuthService } from "../../services/authService/auth.service";
import { LoadingSnackBarComponent } from "../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SucceedSnackbarComponent } from "../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  msgToast: any = {};
  signupcontrol: FormGroup;
  regions: Array<Region>;
  communes: Array<Commune>;
  loading = false;
  region = false;
  commune = false;
  lng: number;
  lat: number;
  errors: any = {
    email: {
      required: "Email requerido",
      maxlength: "Largo máximo sobrepasado",
      email: "Formato incorrecto",
    },
    first_name: {
      required: "Nombre requerido",
      maxlength: "Largo máximo sobrepasado",
    },
    lastname: {
      required: "Apellido requerido",
      maxlength: "Largo máximo sobrepasado",
    },
    phone: {
      required: "Teléfono requerido",
      maxlength: "Largo máximo sobrepasado",
      pattern: "Formato Incorrecto, ingresar +56911223344 ó 911223344",
    },
    pass: {
      required: "Contraseña requerida",
      maxlength: "Largo máximo sobrepasado",
      minlength: "Largo mínimo de 6 caracteres",
    },
    repeatpass: {
      required: "Por favor, confirme la contraseña",
      maxlength: "Largo máximo sobrepasado",
      minlength: "Largo mínimo de 6 caracteres",
      passwordMatch: "Las contraseñas no coinciden",
    },
    region: {
      required: "Region requerida",
    },
    commune: {
      required: "Comuna requerida",
    },
    address: {
      required: "Dirección requerida",
      maxlength: "Largo máximo sobrepasado",
    },
  };

  validatePasswordMatch = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const password = this.signupcontrol?.get("pass")?.value as string;
    const passwordConfirm = control.value as string;

    if (password !== passwordConfirm) {
      return { passwordMatch: true };
    }

    return null;
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private country: BaseInfoService,
    private signup: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.lat = 0;
    this.lng = 0;
    this.regions = [];
    this.communes = [];
    this.country.GETCOUNTRYINFO().subscribe((countryInfo) => {
      this.regions = countryInfo.data.regions;
      this.communes = countryInfo.data.communes;
    });

    this.signupcontrol = new FormGroup({});
    this.signupcontrol = fb.group({
      first_name: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      pass: new FormControl("", [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(6),
        Validators.maxLength(15),
      ]),
      lastname: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]{9}"),
      ]),
      repeatpass: new FormControl("", [
        Validators.required,
        Validators.nullValidator,
        this.validatePasswordMatch,
        Validators.minLength(6),
        Validators.maxLength(15),
      ]),
      region: new FormControl("", [Validators.required]),
      commune: new FormControl("", [Validators.required]),
      address: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  ngOnInit(): void {}

  buscar_ciudad(e: any) {
    let select: any = document.getElementById("comuna");
    this.commune = false;
    this.signupcontrol.controls["commune"].setValue(null);
    this.signupcontrol.controls["address"].setValue(null);
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
    let nuevaopcion = new Option("", "", true, true);
    nuevaopcion.disabled = true;
    select?.appendChild(nuevaopcion);
    for (let index = 0; index < this.communes.length; index++) {
      if (this.communes[index].id_region === e.target.value) {
        let nuevaopcion = new Option(
          this.communes[index].commune,
          this.communes[index].id_commune,
          false,
          false
        );
        select?.appendChild(nuevaopcion);
      }
    }
    this.region = true;
  }

  enableAddress() {
    this.commune = true;
  }

  async direccionShow(e: any) {
    let region = this.regions.filter((region) =>
      region.id_region === this.signupcontrol.value.region ? region : null
    )[0];
    let comuna = this.communes.filter((commune) =>
      commune.id_commune === this.signupcontrol.value.commune ? commune : null
    )[0];

    let direccion: any = document.getElementById("direccion");
    if (direccion.value.trim() != "" && direccion.value != null) {
      try {
        let direccion = (<HTMLInputElement>document.getElementById("direccion"))
          .value;
        let geocoder = new google.maps.Geocoder();
        await geocoder.geocode(
          { address: direccion + "," + comuna.commune + "," + region.region },
          async (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              let resultados: any = results;
              this.lat = await resultados[0].geometry.location.lat();
              this.lng = await resultados[0].geometry.location.lng();
            }
          }
        );
      } catch (e: any) {
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al obtener dirección, por favor ingresar nuevamente",
          panelClass: "snack-bar-error",
        });
      }
    }
  }

  getError(controlName: string): string {
    if (this.signupcontrol.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (this.signupcontrol.controls[controlName].hasError("maxlength")) {
      return this.errors[controlName].maxlength;
    } else if (this.signupcontrol.controls[controlName].hasError("minlength")) {
      return this.errors[controlName].min;
    } else if (this.signupcontrol.controls[controlName].hasError("email")) {
      return this.errors[controlName].email;
    } else if (
      this.signupcontrol.controls[controlName].hasError("passwordMatch")
    ) {
      return this.errors[controlName].passwordMatch;
    } else if (this.signupcontrol.controls[controlName].hasError("pattern")) {
      return this.errors[controlName].pattern;
    }
    return "";
  }

  async handleSubmit() {
    this.loading = true;
    const loadingSnackBar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Por favor, espere mientras se procesa su solicitud",
        panelClass: "snack-bar-loading",
      }
    );
    if (this.lng && this.lat) {
      let user: User = {
        id_user: undefined,
        address: {
          id_address: undefined,
          address: this.signupcontrol.value.address,
          lat: this.lat,
          lng: this.lng,
          region: this.signupcontrol.value.region,
          commune: this.signupcontrol.value.commune,
          description: "",
        },
        created_at: new Date(),
        email: this.signupcontrol.value.email,
        file: [],
        first_name: this.signupcontrol.value.first_name,
        last_name: this.signupcontrol.value.lastname,
        phone: this.signupcontrol.value.phone,
        user_name: "",
        seller: false,
        user_password: this.signupcontrol.value.pass,
      };
      this.signup.SIGNUP(user).subscribe({
        next: (res: any) => {
          this.loading = false;
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(SucceedSnackbarComponent, {
            data: "Su registro ha sido realizado con éxito, en breve seras redirigido al inicio de sesión",
            panelClass: "snack-bar-success",
          });
          setInterval(() => {
            this.router.navigateByUrl("/core/login").then(() => {
              window.location.reload();
            });
          }, 1500);
        },
        error: (err: any) => {
          this.loading = false;
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Ha ocurrido un error al procesar su registro, intente nuevamente",
            panelClass: "snack-bar-error",
          });
        },
        complete: () => {
          this.loading = false;
          loadingSnackBar.dismiss();
        },
      });
    }
  }
}
