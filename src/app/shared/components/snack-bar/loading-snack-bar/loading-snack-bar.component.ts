import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";

@Component({
  selector: "app-loading-snack-bar",
  templateUrl: "./loading-snack-bar.component.html",
  styleUrls: ["./loading-snack-bar.component.scss"],
})
export class LoadingSnackBarComponent implements OnInit {
  constructor(
    public loadingRef: MatSnackBarRef<LoadingSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
