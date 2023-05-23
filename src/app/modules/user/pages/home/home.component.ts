import { Component, OnInit } from "@angular/core";
import { BaseInfoService } from "../../../../shared/services/baseInfoService/base-info.service";
import { Publication } from "../../../../core/models/publication";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  latest!: Array<Publication>;
  mostCommented!: Array<Publication>;
  recycled!: number;
  totalUsers!: number;

  constructor(private baseService: BaseInfoService, private router: Router) {
    this.baseService.GETHOMEINFO().subscribe({
      next: (res) => {
        this.totalUsers = res.data.users;
        this.recycled = Math.round(res.data.totalweight);
        this.latest = res.data.latest;
        this.mostCommented = res.data.moreComments;
      },
    });
  }

  ngOnInit(): void {}

  setId(id: any) {
    this.router.navigateByUrl("/user/publication/" + id);
  }
  getheight() {
    return screen.height / 2;
  }
}
