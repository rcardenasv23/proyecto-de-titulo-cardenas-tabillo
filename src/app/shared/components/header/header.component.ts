import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { User } from "../../../core/models/user";
import { AuthService } from "../../../core/services/authService/auth.service";
import { Category } from "../../../core/models/category";
import { PropertiesService } from "../../services/properties/properties.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnChanges {
  token: string | null;
  user: User | undefined;
  categories: Array<Category> = [];
  searchForm: FormGroup;
  constructor(
    private auth: AuthService,
    private info: PropertiesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl("", [Validators.required]),
    });
    this.token = auth.getToken();
    if (this.token) {
      this.auth.GETUSER().subscribe({
        next: (res) => {
          this.user = res.data;
        },
      });
    }

    this.categories = [];
    this.info.GETPUBLICATIONPROPERTIES().subscribe({
      next: (res) => {
        this.categories = [...res.data.Categories];
        console.log(this.categories);
      },
    });
  }

  ngOnInit(): void {
    this.token = this.auth.getToken();
    this.auth.GETUSER().subscribe({
      next: (res) => {
        this.user = res.data;
      },
    });
    this.info.GETPUBLICATIONPROPERTIES().subscribe({
      next: (res) => {
        this.categories = [...res.data.Categories];
        console.log(this.categories);
      },
    });
    let categories: any = document.querySelector("#collapseCategory");
    let less: any = document.getElementById("expand_less");
    less.hidden = true;
    categories.addEventListener("click", (val: any) => {
      let less: any = document.getElementById("expand_less");
      let more: any = document.getElementById("expand_more");
      if (val.target.ariaExpanded === "true") {
        more.hidden = true;
        less.hidden = false;
      } else {
        less.hidden = true;
        more.hidden = false;
      }
    });
  }

  logout() {
    this.auth.LOGOUT();
    this.router.navigateByUrl("/user/home").then(() => {
      window.location.reload();
    });
  }
  search(e: any) {
    if (e.target[0].value) {
      this.router.navigate(["/user/browse"], {
        relativeTo: this.activatedRoute,
        queryParams: { limit: 6, offset: 0, title: e.target[0].value },
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    } else {
      this.router.navigate(["/user/browse"], {
        relativeTo: this.activatedRoute,
        queryParams: { limit: 6, offset: 0 },
        queryParamsHandling: "", // remove to replace all query params by provided
      });
    }
  }

  onSearch(e: any) {
    if (e.target.value) {
      this.router.navigate(["/user/browse"], {
        relativeTo: this.activatedRoute,
        queryParams: { limit: 6, offset: 0, title: e.target.value },
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    } else {
      this.router.navigate(["/user/browse"], {
        relativeTo: this.activatedRoute,
        queryParams: { limit: 6, offset: 0 },
        queryParamsHandling: "", // remove to replace all query params by provided
      });
    }
  }

  browse(id: string) {
    this.router.navigate(["/user/browse"], {
      relativeTo: this.activatedRoute,
      queryParams: { limit: 6, offset: 0, category: id },
      queryParamsHandling: "merge", // remove to replace all query params by provided
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
