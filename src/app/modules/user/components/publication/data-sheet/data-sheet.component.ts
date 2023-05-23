import { Component, Input, OnInit } from "@angular/core";
import { Publication } from "../../../../../core/models/publication";
import { PropertiesService } from "../../../../../shared/services/properties/properties.service";
import { Category } from "../../../../../core/models/category";
import { Unity } from "../../../../../core/models/unity";
import { ProductState } from "../../../../../core/models/product-state";
import { Region } from "../../../../../core/models/region";
import { Commune } from "../../../../../core/models/commune";

@Component({
  selector: "app-data-sheet",
  templateUrl: "./data-sheet.component.html",
  styleUrls: ["./data-sheet.component.scss"],
})
export class DataSheetComponent implements OnInit {
  @Input() publication!: Publication;
  constructor(private info: PropertiesService) {
    this.info.GETPUBLICATIONPROPERTIES().subscribe({
      next: (res) => {
        console.log(res.data);
        this.publication.category = res.data.Categories.filter((v: Category) =>
          v.id_pubc === this.publication.category ? v : null
        )[0].publication_category;
        this.publication.unity = res.data.Unities.filter((v: Unity) =>
          v.id_unity === this.publication.unity ? v : null
        )[0].publication_unity;
        this.publication.product_state = res.data.States.filter(
          (v: ProductState) =>
            v.id_pubs === this.publication.product_state ? v : null
        )[0].product_state;
        let commune = this.publication.address.commune as Commune;
        let region = this.publication.address.region as Region;
        this.publication.address.commune = commune.commune;
        this.publication.address.region = region.region;
      },
    });
  }

  ngOnInit(): void {}
}
