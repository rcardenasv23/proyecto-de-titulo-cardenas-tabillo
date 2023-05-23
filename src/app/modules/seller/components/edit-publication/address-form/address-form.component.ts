import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Seller } from "../../../../../core/models/seller";
import { Publication } from "../../../../../core/models/publication";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseInfoService } from "../../../../../shared/services/baseInfoService/base-info.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Region } from "../../../../../core/models/region";
import { Commune } from "../../../../../core/models/commune";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { PublicationService } from "../../../../../shared/services/publication/publication.service";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";

@Component({
  selector: "app-address-form",
  templateUrl: "./address-form.component.html",
  styleUrls: ["./address-form.component.scss"],
})
export class AddressFormComponent implements OnInit, OnChanges {
  @Input() publication: Publication | undefined;
  @Input() seller: Seller | undefined;
  @Output("revalidate") revalidate: EventEmitter<void> =
    new EventEmitter<void>();

  id_region: string = "";
  id_commune: string = "";
  maker: any;
  center = { lat: 0, lng: 0 };
  lat: number = 0;
  lng: number = 0;
  loading = false;
  addressPublicationForm: FormGroup;
  regions: Array<Region>;
  communes: Array<Commune>;
  errors: any = {
    region: {
      required: "Region requerida",
    },
    commune: {
      required: "Comuna  requerida",
    },
    address: {
      required: "Dirección requerida",
      maxlength: "La dirección no puede sobrepasar los 200 caracteres",
    },
  };

  constructor(
    private countryInfo: BaseInfoService,
    private snackBar: MatSnackBar,
    private pubService: PublicationService
  ) {
    this.regions = [];
    this.communes = [];
    this.addressPublicationForm = new FormGroup({
      region: new FormControl("", [Validators.required]),
      commune: new FormControl("", [Validators.required]),
      address: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
    });
    this.countryInfo.GETCOUNTRYINFO().subscribe({
      next: (res) => {
        this.regions = res.data.regions;
        this.communes = res.data.communes;
        let select: any = document.getElementById("region");
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
        for (let index = 0; index < this.regions.length; index++) {
          if (this.regions[index].id_region === this.id_region) {
            let nuevaopcion = new Option(
              this.regions[index].region,
              this.regions[index].id_region,
              true,
              true
            );
            select?.appendChild(nuevaopcion);
          } else {
            let nuevaopcion = new Option(
              this.regions[index].region,
              this.regions[index].id_region,
              false,
              false
            );
            select?.appendChild(nuevaopcion);
          }
        }
        select = document.getElementById("commune");
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
        for (let index = 0; index < this.communes.length; index++) {
          if (this.communes[index].id_region === this.id_region) {
            if (this.communes[index].id_commune === this.id_commune) {
              let nuevaopcion = new Option(
                this.communes[index].commune,
                this.communes[index].id_commune,
                true,
                true
              );
              select?.appendChild(nuevaopcion);
            } else {
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
      },
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["publication"]) {
      this.center = {
        lat: this.publication?.address.lat!,
        lng: this.publication?.address.lng!,
      };
      this.maker = {
        lat: this.publication?.address.lat!,
        lng: this.publication?.address.lng!,
      };
      this.lat = this.publication?.address.lat!;
      this.lng = this.publication?.address.lng!;
      let address: any = document.getElementById("address");
      address.value = this.publication?.address.address;
      let commune = this.publication?.address.commune as Commune;
      this.id_commune = commune.id_commune;
      this.id_region = commune.id_region;
      this.addressPublicationForm.patchValue({
        region: this.id_region,
        commune: this.id_commune,
        address: this.publication?.address.address,
      });
      this.addressPublicationForm.controls["region"].setValue(this.id_region);
      this.addressPublicationForm.controls["commune"].setValue(this.id_commune);
      this.addressPublicationForm.controls["address"].setValue(
        this.publication?.address.address
      );
    }
  }

  searchCity(e: any) {
    let select: any = document.getElementById("commune");
    let address: any = document.getElementById("address");
    this.addressPublicationForm.controls["commune"].setValue("");
    this.addressPublicationForm.controls["address"].setValue("");
    select.value = "";
    address.value = "";
    address.disabled = true;
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
    this.lat = 0;
    this.lng = 0;
    this.center = { lat: 0, lng: 0 };
  }

  enableAddress(e: any) {
    this.addressPublicationForm.controls["commune"].setValue(e.target.value);
    let address: any = document.getElementById("address");
    address.value = "";
    address.disabled = false;
    this.addressPublicationForm.controls["address"].setValue("");
  }

  showAddress(e: any) {
    let address: any = document.getElementById("address");
    if (address.value.trim() != "" && address.value != "") {
      let geocoder = new google.maps.Geocoder();
      let region = this.regions.filter((region) =>
        region.id_region ===
        this.addressPublicationForm.controls["region"].value
          ? region
          : null
      )[0].region;
      let commune = this.communes.filter((commune) =>
        commune.id_commune ===
        this.addressPublicationForm.controls["commune"].value
          ? region
          : null
      )[0].commune;
      geocoder.geocode(
        { address: address.value + "," + commune + "," + region },
        (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            let resp: any = results;
            this.lat = resp[0].geometry.location.lat();
            this.lng = resp[0].geometry.location.lng();
            this.center = { lat: this.lat, lng: this.lng };
            this.maker = { lat: this.lat, lng: this.lng };
          } else {
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al obtener localización de la dirección",
              panelClass: "snack-bar-error",
            });
          }
        }
      );
    }
  }

  moveMap(e: any) {
    this.lat = e.latLng.lat();
    this.lng = e.latLng.lng();
    this.maker = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  }

  getError(controlName: string): string {
    if (
      this.addressPublicationForm.controls[controlName].hasError("required")
    ) {
      return this.errors[controlName].required;
    } else if (
      this.addressPublicationForm.controls[controlName].hasError("maxlength")
    ) {
      return this.errors[controlName].maxlength;
    }
    return "";
  }

  handleUpdate() {
    this.loading = true;
    let loadingSnack = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Cargando datos, espere por favor",
        panelClass: "snack-bar-loading",
      }
    );
    try {
      this.pubService
        .UPDATEADDRESS({
          ...this.addressPublicationForm.value,
          description: undefined,
          lat: this.lat,
          lng: this.lng,
          id_address: this.publication?.address.id_address,
        })
        .subscribe({
          next: (res) => {
            loadingSnack.dismiss();
            this.snackBar.openFromComponent(SucceedSnackbarComponent, {
              data: "Dirección actualizada correctamente",
              panelClass: "snack-bar-success",
            });
            this.revalidate.emit();
          },
          error: (err) => {
            loadingSnack.dismiss();
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al actualizar su dirección",
              panelClass: "snack-bar-error",
            });
          },
          complete: () => {
            loadingSnack.dismiss();
            this.loading = false;
          },
        });
    } catch (e: any) {
      console.log(e);
      loadingSnack.dismiss();
      this.loading = false;
    } finally {
      loadingSnack.dismiss();
      this.loading = false;
    }
  }

  reset() {
    let form: any = document.getElementById("form");
    form.reset();
    this.addressPublicationForm.controls["region"].setValue(this.id_region);
    this.addressPublicationForm.controls["commune"].setValue(this.id_commune);
    this.addressPublicationForm.controls["address"].setValue(
      this.publication?.address.address
    );
    let select: any = document.getElementById("region");
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
    for (let index = 0; index < this.regions.length; index++) {
      if (this.regions[index].id_region === this.id_region) {
        let nuevaopcion = new Option(
          this.regions[index].region,
          this.regions[index].id_region,
          true,
          true
        );
        select?.appendChild(nuevaopcion);
      } else {
        let nuevaopcion = new Option(
          this.regions[index].region,
          this.regions[index].id_region,
          false,
          false
        );
        select?.appendChild(nuevaopcion);
      }
    }
    select = document.getElementById("commune");
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
    for (let index = 0; index < this.communes.length; index++) {
      if (this.communes[index].id_region === this.id_region) {
        if (this.communes[index].id_commune === this.id_commune) {
          let nuevaopcion = new Option(
            this.communes[index].commune,
            this.communes[index].id_commune,
            true,
            true
          );
          select?.appendChild(nuevaopcion);
        } else {
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
    this.center = {
      lat: this.publication?.address.lat!,
      lng: this.publication?.address.lng!,
    };
    this.maker = {
      lat: this.publication?.address.lat!,
      lng: this.publication?.address.lng!,
    };
    this.lat = this.publication?.address.lat!;
    this.lng = this.publication?.address.lng!;
    let address: any = document.getElementById("address");
    address.value = this.publication?.address.address;
    address.disabled = false;
    let commune = this.publication?.address.commune as Commune;
    this.id_commune = commune.id_commune;
    this.id_region = commune.id_region;
    this.addressPublicationForm.patchValue({
      region: this.id_region,
      commune: this.id_commune,
      address: this.publication?.address.address,
    });
  }
}
