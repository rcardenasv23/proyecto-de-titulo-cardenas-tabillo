import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseInfoService } from "../../../../../shared/services/baseInfoService/base-info.service";
import { Region } from "../../../../../core/models/region";
import { Commune } from "../../../../../core/models/commune";
import { PropertiesService } from "../../../../../shared/services/properties/properties.service";
import { FileService } from "../../../../../shared/services/files/file.service";
import * as uuid from "uuid";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Publication } from "../../../../../core/models/publication";
import { AuthService } from "../../../../../core/services/authService/auth.service";
import { Seller } from "../../../../../core/models/seller";
import { File } from "../../../../../core/models/file";
import { PublicationService } from "../../../../../shared/services/publication/publication.service";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-publication",
  templateUrl: "./create-publication.component.html",
  styleUrls: ["./create-publication.component.scss"],
})
export class CreatePublicationComponent implements OnInit {
  seller: Seller | undefined;
  loading = false;
  publicationForm: FormGroup;
  regions: Array<Region>;
  communes: Array<Commune>;
  pubProperties: any;
  media: Array<any>;
  maker: any;
  center = { lat: 0, lng: 0 };
  lat: number = 0;
  lng: number = 0;
  errors: any = {
    title: {
      required: "Título requerido",
      maxlength: "El título no puede sobrepasar los 50 caracteres",
    },
    description: {
      required: "Descripción requerida",
      maxlength: "La descripción no puede sobrepasar los 200 caracteres",
    },
    dimentions: {
      required: "Dimensión requerida",
    },
    weight: {
      required: "Peso requerida",
      min: "El peso no puede ser menor a 0.001",
    },
    category: {
      required: "Categoría requerida",
    },
    unity: {
      required: "Unidad requerida",
    },
    productState: {
      required: "Estado del producto requerido",
    },
    price: {
      required: "Precio requerido",
      min: "Precio no puede ser menor a 0",
    },
    stock: {
      required: "Stock requerido",
      min: "Stock no puede ser menor a 1",
    },
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
    media: {
      required: "Media requerida",
    },
  };

  constructor(
    private auth: AuthService,
    private country: BaseInfoService,
    private pubProp: PropertiesService,
    private publish: PublicationService,
    private file: FileService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.pubProperties = {};
    this.media = [];
    this.regions = [];
    this.communes = [];
    this.auth.GETSELLER().subscribe({
      next: (res) => {
        this.seller = res.data;
      },
    });
    this.country.GETCOUNTRYINFO().subscribe({
      next: (res) => {
        this.regions = res.data.regions;
        this.communes = res.data.communes;
      },
    });
    this.pubProp.GETPUBLICATIONPROPERTIES().subscribe({
      next: (res) => {
        this.pubProperties = res.data;
      },
    });
    this.publicationForm = new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
      dimentions: new FormControl("", [Validators.required]),
      weight: new FormControl("", [Validators.required, Validators.min(0.001)]),
      category: new FormControl("", [Validators.required]),
      unity: new FormControl("", [Validators.required]),
      productState: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required, Validators.min(0)]),
      stock: new FormControl("", [Validators.required, Validators.min(1)]),
      region: new FormControl("", [Validators.required]),
      commune: new FormControl("", [Validators.required]),
      address: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
      media: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    let select: any = document.getElementById("commune");
    let direccion: any = document.getElementById("address");
    select.disabled = true;
    direccion.disabled = true;
    let media: any = document.getElementById("files");
    media.addEventListener("change", (e: any) => {
      if (e.target.files.length) {
        this.publicationForm.controls["media"].setErrors(null);
      }
    });
  }

  loadMedia(event: any) {
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onloadend = async () => {
        this.media.push(reader.result);
      };
    }
  }

  deletemedia(i: number): void {
    this.media = [
      ...this.media.slice(0, i),
      ...this.media.slice(i + 1, this.media.length),
    ];
    this.publicationForm.controls["media"].patchValue(this.media);
  }

  searchCity(e: any) {
    let select: any = document.getElementById("commune");
    select.disabled = false;
    let address: any = document.getElementById("address");
    select.value = undefined;
    this.publicationForm.controls["commune"].setValue(undefined);
    address.value = null;
    this.publicationForm.controls["address"].setValue(undefined);
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
  }

  showAddress(e: any) {
    let address: any = document.getElementById("address");
    if (address.value.trim() != "" && address.value != null) {
      let geocoder = new google.maps.Geocoder();
      let region = this.regions.filter((region) =>
        region.id_region === this.publicationForm.controls["region"].value
          ? region
          : null
      )[0].region;
      let commune = this.communes.filter((commune) =>
        commune.id_commune === this.publicationForm.controls["commune"].value
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
    if (this.publicationForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (
      this.publicationForm.controls[controlName].hasError("maxlength")
    ) {
      return this.errors[controlName].maxlength;
    } else if (this.publicationForm.controls[controlName].hasError("min")) {
      return this.errors[controlName].min;
    }
    return "";
  }

  enableAddress(e: any) {
    let address: any = document.getElementById("address");
    address.value = undefined;
    address.disabled = false;
    this.publicationForm.controls["address"].setValue(undefined);
    this.lat = 0;
    this.lng = 0;
    this.center = { lat: 0, lng: 0 };
  }

  async handleSubmit() {
    if (this.media.length > 15) {
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Máximo 15 archivos por publicación",
        panelClass: "snack-bar-error",
      });
      return;
    }
    const loadingSnackBar = this.snackBar.openFromComponent(
      LoadingSnackBarComponent,
      {
        data: "Subiendo publicación",
        panelClass: "snack-bar-loading",
      }
    );
    this.loading = true;
    try {
      const values = this.publicationForm.value;
      const urls: Array<File> = [];
      for (let url of this.media) {
        let name = uuid.v4();
        let urlFirebase = await this.file.UPLOADPUBLICATIONFILE(
          this.seller?.id_seller + "/" + name,
          url
        );
        urls.push({
          extensions: [],
          height: undefined,
          id_file: undefined,
          width: undefined,
          name: name,
          url: urlFirebase as string,
        });
      }
      const publication: Publication = {
        id_fixed: undefined,
        content_state: undefined,
        id_seller: this.seller?.id_seller as string,
        title: values.title,
        description: values.description,
        dimentions: values.dimentions,
        weight: values.weight,
        closed_by_admin:false,
        category: values.category,
        unity: values.unity,
        product_state: values.productState,
        price: values.price,
        stock: values.stock,
        current_stock: values.stock,
        address: {
          id_address: undefined,
          address: values.address,
          lat: this.lat,
          lng: this.lng,
          description: "",
          commune: values.commune,
          region: values.region,
        },
        files: urls,
        created_at: new Date(),
        comments: [],
      };
      this.publish.POSTPUBLICATION(publication).subscribe({
        next: (res) => {
          loadingSnackBar.dismiss();
          this.router.navigate([
            "/seller/menu/",
            {
              outlets: { "seller-menu": ["publication", res.data.id_fixed] },
            },
          ]);
          this.snackBar.openFromComponent(SucceedSnackbarComponent, {
            data: "Publicación ingresada correctamente, redirigiendo a publicación",
            panelClass: "snack-bar-success",
          });
        },
        error: (err) => {
          loadingSnackBar.dismiss();
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al ingresar la publicación",
            panelClass: "snack-bar-error",
          });
        },
      });
    } catch (e) {
      loadingSnackBar.dismiss();
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Error al ingresar la publicación",
        panelClass: "snack-bar-error",
      });
    } finally {
      loadingSnackBar.dismiss();
      this.loading = false;
    }
  }
}
