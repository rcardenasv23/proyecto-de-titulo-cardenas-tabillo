import { Component, OnInit } from "@angular/core";
import { PropertiesService } from "../../../../shared/services/properties/properties.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PublicationService } from "../../../../shared/services/publication/publication.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Publication } from "../../../../core/models/publication";
import { Category } from "../../../../core/models/category";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent implements OnInit {
  categories!: Array<Category>;
  publications!: Array<Publication>;
  filter: any = { limit: 6, offset: 0, category: [], title: "" };
  total!: number;
  shown = true;
  totalPages!: number;

  constructor(
    private attrb: PropertiesService,
    private router: Router,
    private pubService: PublicationService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.activatedRoute.queryParams.subscribe({
      next: (res: any) => {
        if (res.category) {
          this.filter.category = res.category.split(",");
        }
        let navigate = false;
        if (res.limit) {
          this.filter.limit = Number(res.limit);
        } else {
          navigate = true;
        }
        if (res.offset) {
          this.filter.offset = Number(res.offset);
          navigate = true;
        } else {
          navigate = true;
        }
        if (res.title) {
          this.filter.title = res.title;
        } else {
          delete this.filter.title;
        }
        this.pubService
          .GETPUBLICATIONS({ category: res.category, ...this.filter })
          .subscribe({
            next: (res) => {
              for (let publication of res.data.items) {
                publication.files = publication.publication_files;
              }
              this.publications = res.data.items;
              this.total = res.data.count;
              this.totalPages = Math.round(this.total / this.filter.limit) | 1;
            },
          });
      },
    });
    this.attrb.GETPUBLICATIONPROPERTIES().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categories = res.data.Categories;
      },
      error: (err) => {},
    });
  }

  ngOnInit(): void {
    this.attrb.GETPUBLICATIONPROPERTIES().subscribe({
      next: (res) => {
        this.categories = res.data.Categories;
      },
      error: (err) => {},
    });
    this.activatedRoute.queryParams.subscribe({
      next: (res: any) => {
        if (res.category) {
          this.filter.category = res.category.split(",");
        }
        let navigate = false;
        if (res.limit) {
          this.filter.limit = Number(res.limit);
        } else {
          navigate = true;
        }
        if (res.offset) {
          this.filter.offset = Number(res.offset);
          navigate = true;
        } else {
          navigate = true;
        }
        if (res.title) {
          this.filter.title = res.title;
        } else {
          delete this.filter.title;
          navigate = true;
        }
        if (navigate) {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: this.filter,
            queryParamsHandling: "merge", // remove to replace all query params by provided
          });
        }
        this.pubService.GETPUBLICATIONS(this.filter).subscribe({
          next: (res) => {
            for (let publication of res.data.items) {
              publication.files = publication.publication_files;
            }
            this.publications = res.data.items;
            this.total = res.data.count;
            this.totalPages = Math.round(this.total / this.filter.limit) | 1;
          },
        });
      },
    });
  }

  revalidate() {
    this.pubService.GETPUBLICATIONS(this.filter).subscribe({
      next: (res) => {
        for (let publication of res.data.items) {
          publication.files = publication.publication_files;
        }
        this.publications = res.data.items;
        this.total = res.data.count;
        this.totalPages = Math.round(this.total / this.filter.limit) | 1;
      },
    });
  }

  checkChecked(id_category: string) {
    if (this.filter.category.includes(id_category)) {
      this.filter.category = this.filter.category.filter((id: string) =>
        id === id_category ? null : id
      );
    } else {
      this.filter.category = [...this.filter.category, id_category];
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.filter,
      queryParamsHandling: "merge", // remove to replace all query params by provided
    });
    this.revalidate();
  }

  nextPage() {
    this.filter.offset += 1;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.filter,
      queryParamsHandling: "merge", // remove to replace all query params by provided
    });
    this.revalidate();
  }
  previousPage() {
    this.filter.offset -= 1;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.filter,
      queryParamsHandling: "merge", // remove to replace all query params by provided
    });
    this.revalidate();
  }

  setLimit(event: any) {
    this.filter.limit = event.target.value;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.filter,
      queryParamsHandling: "merge", // remove to replace all query params by provided
    });
    this.revalidate();
  }
}
