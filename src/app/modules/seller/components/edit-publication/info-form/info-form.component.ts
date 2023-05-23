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
import { PropertiesService } from "../../../../../shared/services/properties/properties.service";
import { Region } from "../../../../../core/models/region";
import { Commune } from "../../../../../core/models/commune";
import { Category } from "../../../../../core/models/category";
import { ProductState } from "../../../../../core/models/product-state";
import { Unity } from "../../../../../core/models/unity";
import { LoadingSnackBarComponent } from "../../../../../shared/components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { PublicationService } from "../../../../../shared/services/publication/publication.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-info-form",
  templateUrl: "./info-form.component.html",
  styleUrls: ["./info-form.component.scss"],
})
export class InfoFormComponent implements OnInit, OnChanges {
  @Input() publication: Publication | undefined;
  @Input() seller: Seller | undefined;
  @Output("revalidate") revalidate: EventEmitter<void> =
    new EventEmitter<void>();

  publicationEditForm: FormGroup;
  loading = false;
  pubProperties: {
    Categories: Array<Category>;
    States: Array<ProductState>;
    Unities: Array<Unity>;
  };
  regions: Array<Region>;
  communes: Array<Commune>;
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
    current_stock: {
      required: "Cantidad requerida",
      min: "Cantidad debe ser mayor a 0",
    },
  };

  constructor(
    private country: BaseInfoService,
    private pubProp: PropertiesService,
    private pubService: PublicationService,
    private snackBar: MatSnackBar
  ) {
    this.pubProperties = { Categories: [], Unities: [], States: [] };
    this.regions = [];
    this.communes = [];
    this.country.GETCOUNTRYINFO().subscribe({
      next: (res) => {
        this.regions = res.data.regions;
        this.communes = res.data.communes;
      },
    });
    this.pubProp.GETPUBLICATIONPROPERTIES().subscribe({
      next: (res) => {
        this.pubProperties = res.data;
        let select: any = document.getElementById("category");
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
        for (
          let index = 0;
          index < this.pubProperties["Categories"].length;
          index++
        ) {
          if (
            this.pubProperties["Categories"][index].id_pubc ===
            this.publication?.category
          ) {
            let nuevaopcion = new Option(
              this.pubProperties["Categories"][index].publication_category,
              this.pubProperties["Categories"][index].id_pubc,
              true,
              true
            );
            select?.appendChild(nuevaopcion);
          } else {
            let nuevaopcion = new Option(
              this.pubProperties["Categories"][index].publication_category,
              this.pubProperties["Categories"][index].id_pubc,
              false,
              false
            );
            select?.appendChild(nuevaopcion);
          }
        }
        select = document.getElementById("unity");
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
        for (
          let index = 0;
          index < this.pubProperties["Unities"].length;
          index++
        ) {
          if (
            this.pubProperties["Unities"][index].id_unity ===
            this.publication?.unity
          ) {
            let nuevaopcion = new Option(
              this.pubProperties["Unities"][index].publication_unity,
              this.pubProperties["Unities"][index].id_unity,
              true,
              true
            );
            select?.appendChild(nuevaopcion);
          } else {
            let nuevaopcion = new Option(
              this.pubProperties["Unities"][index].publication_unity,
              this.pubProperties["Unities"][index].id_unity,
              false,
              false
            );
            select?.appendChild(nuevaopcion);
          }
        }
        select = document.getElementById("productState");
        while (select.firstChild) {
          select.removeChild(select.firstChild);
        }
        for (
          let index = 0;
          index < this.pubProperties["States"].length;
          index++
        ) {
          if (
            this.pubProperties["States"][index].id_pubs ===
            this.publication?.product_state
          ) {
            let nuevaopcion = new Option(
              this.pubProperties["States"][index].product_state,
              this.pubProperties["States"][index].id_pubs,
              true,
              true
            );
            select?.appendChild(nuevaopcion);
          } else {
            let nuevaopcion = new Option(
              this.pubProperties["States"][index].product_state,
              this.pubProperties["States"][index].id_pubs,
              false,
              false
            );
            select?.appendChild(nuevaopcion);
          }
        }
      },
    });
    this.publicationEditForm = new FormGroup({
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
      current_stock: new FormControl("", [
        Validators.required,
        Validators.min(0),
      ]),
    });
  }

  ngOnInit(): void {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["publication"]) {
      this.publicationEditForm.controls["title"].setValue(
        this.publication?.title
      );
      this.publicationEditForm.controls["description"].setValue(
        this.publication?.description
      );
      this.publicationEditForm.controls["dimentions"].setValue(
        this.publication?.dimentions
      );
      this.publicationEditForm.controls["weight"].setValue(
        this.publication?.weight
      );
      this.publicationEditForm.controls["category"].setValue(
        this.publication?.category
      );
      this.publicationEditForm.controls["unity"].setValue(
        this.publication?.unity
      );
      this.publicationEditForm.controls["productState"].setValue(
        this.publication?.product_state
      );
      this.publicationEditForm.controls["price"].setValue(
        this.publication?.price
      );
      this.publicationEditForm.controls["current_stock"].setValue(
        this.publication?.current_stock
      );
    }
  }

  getError(controlName: string): string {
    if (this.publicationEditForm.controls[controlName].hasError("required")) {
      return this.errors[controlName].required;
    } else if (
      this.publicationEditForm.controls[controlName].hasError("maxlength")
    ) {
      return this.errors[controlName].maxlength;
    } else if (this.publicationEditForm.controls[controlName].hasError("min")) {
      return this.errors[controlName].min;
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
        .UPDATEPUBLICATION({
          ...this.publication,
          ...this.publicationEditForm.value,
        })
        .subscribe({
          next: (res) => {
            loadingSnack.dismiss();
            this.snackBar.openFromComponent(SucceedSnackbarComponent, {
              data: "Información actualizada correctamente",
              panelClass: "snack-bar-success",
            });
            this.revalidate.emit();
          },
          error: (err) => {
            loadingSnack.dismiss();
            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
              data: "Error al actualizar   informacion de publicación",
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

  disabled() {
    if (
      JSON.stringify(this.publicationEditForm.value) ===
      JSON.stringify({
        title: this.publication?.title,
        description: this.publication?.description,
        dimentions: this.publication?.dimentions,
        weight: this.publication?.weight,
        category: this.publication?.category,
        unity: this.publication?.unity,
        productState: this.publication?.product_state,
        price: this.publication?.price,
        current_stock: this.publication?.current_stock,
      }) || this.publication?.current_stock === 0 ||this.publication?.closed_by_admin
    ) {
      return true;
    }
    return false;
  }

  reset() {
    let form: any = document.getElementById("info-form");
    form.reset();
    this.publicationEditForm.patchValue({
      title: this.publication?.title,
      description: this.publication?.description,
      dimentions: this.publication?.dimentions,
      weight: this.publication?.weight,
      category: this.publication?.category,
      unity: this.publication?.unity,
      productState: this.publication?.product_state,
      price: this.publication?.price,
      current_stock: this.publication?.current_stock,
    });
  }
}
