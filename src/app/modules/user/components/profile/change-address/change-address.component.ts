import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseInfoService } from "../../../../../shared/services/baseInfoService/base-info.service";
import { Region } from "../../../../../core/models/region";
import { Commune } from "../../../../../core/models/commune";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { User } from "../../../../../core/models/user";
import { UpdateServiceService } from "../../../services/update-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-change-address",
  templateUrl: "./change-address.component.html",
  styleUrls: ["./change-address.component.scss"],
})
export class ChangeAddressComponent implements OnInit {
  user: User | undefined;
  changeAddressForm: FormGroup;
  regions: Array<Region>;
  communes: Array<Commune>;
  loading = false;
  lng: number;
  lat: number;
  errors: any = {
    region: {
      required: "Región requerida",
    },
    commune: {
      required: "Comuna requerida",
    },
    address: {
      required: "Dirección requerida",
      maxlength: "Máximo de caracteres sobrepasado",
    },
  };
  constructor(
    private country: BaseInfoService,
    private auth: AuthService,
    private userService: UpdateServiceService,
    private snackBar: MatSnackBar
  ) {
    this.regions = [];
    this.communes = [];
    this.lat = 0;
    this.lng = 0;
    this.changeAddressForm = new FormGroup({
      region: new FormControl("", [Validators.required]),
      commune: new FormControl("", [Validators.required]),
      address: new FormControl("", [
        Validators.required,
        Validators.nullValidator,
        Validators.maxLength(50),
      ]),
    });
    this.country.GETCOUNTRYINFO().subscribe((countryInfo) => {
      this.regions = countryInfo.data.regions;
      this.communes = countryInfo.data.communes;
      this.auth.GETUSER().subscribe({
        next: (res) => {
          this.user = res.data;
          let select: any = document.getElementById("region");
          let userRegion: Region = this.user?.address.region as Region;
          let nuevaopcion = new Option(
            userRegion.region,
            userRegion.id_region,
            true,
            true
          );
          select?.appendChild(nuevaopcion);
          for (let index = 0; index < this.regions.length; index++) {
            if (this.regions[index].id_region !== userRegion.id_region) {
              let nuevaopcion = new Option(
                this.regions[index].region,
                this.regions[index].id_region,
                false,
                false
              );
              select?.appendChild(nuevaopcion);
            }
          }
          select = document.getElementById("comuna");
          let userCommune: Commune = this.user?.address.commune as Commune;
          nuevaopcion = new Option(
            userCommune.commune,
            userCommune.id_commune,
            true,
            true
          );
          select?.appendChild(nuevaopcion);
          for (let index = 0; index < this.communes.length; index++) {
            if (
              this.communes[index].id_region === userRegion.id_region &&
              this.communes[index].id_commune !== userCommune.id_commune
            ) {
              let nuevaopcion = new Option(
                this.communes[index].commune,
                this.communes[index].id_commune,
                false,
                false
              );
              select?.appendChild(nuevaopcion);
            }
          }
          this.changeAddressForm.controls["region"].setValue(
            userRegion.id_region
          );
          this.changeAddressForm.controls["commune"].setValue(
            userCommune.id_commune
          );
          this.changeAddressForm.controls["address"].setValue(
            this.user?.address.address
          );
        },
      });
    });
  }

  ngOnInit(): void {}

  buscar_ciudad(e: any) {
    let select: any = document.getElementById("comuna");
    select.disabled = false;
    this.changeAddressForm.controls["commune"].setValue("");
    let direccion: any = document.getElementById("direccion");
    direccion.value = null;
    this.changeAddressForm.controls["address"].setValue("");
    direccion.disabled = true;
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
  }
  enableAddress(e: any) {
    let direccion: any = document.getElementById("direccion");
    direccion.disabled = false;
    direccion.value = "";
    this.changeAddressForm.controls["address"].setValue("");
  }

  async direccionShow(e: any) {
    let region = this.regions.filter((region) =>
      region.id_region === this.changeAddressForm.value.region ? region : null
    )[0];
    let comuna = this.communes.filter((commune) =>
      commune.id_commune === this.changeAddressForm.value.commune
        ? commune
        : null
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
        console.log("Error: ", e);
      }
    }
  }

  getError(controlName: string): string {
    if (this.changeAddressForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (
      this.changeAddressForm.controls[controlName].hasError("maxlength")
    ) {
      return this.errors[controlName].maxlength;
    }
    return "";
  }

  handleSubmit(): void {
    this.loading = false;
    let loadingSnackBar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Cargando, espere por favor",
        panelClass: "snack-bar-loading",
      }
    );
    if (this.user) {
      this.user.address.lat = this.lat;
      this.user.address.lng = this.lng;
      this.user.address.commune = this.changeAddressForm.value.commune;
      this.user.address.region = this.changeAddressForm.value.region;
      this.user.address.address = this.changeAddressForm.value.address;
    } else {
      loadingSnackBar.dismiss();
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Ha ocurrido un error al procesar sus cambios, intente nuevamente",
        panelClass: "snack-bar-error",
      });
      return;
    }
    this.userService.UPDATEADDRESS(this.user.address).subscribe({
      next: (res: any) => {
        this.loading = false;
        loadingSnackBar.dismiss();
        this.snackBar.openFromComponent(SucceedSnackbarComponent, {
          data: "Dirección actualizada con éxito",
          panelClass: "snack-bar-success",
        });
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
