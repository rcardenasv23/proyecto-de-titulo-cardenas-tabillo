import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";

@Component({
  selector: "app-succeed-snackbar",
  templateUrl: "./succeed-snackbar.component.html",
  styleUrls: ["./succeed-snackbar.component.scss"],
})
export class SucceedSnackbarComponent implements OnInit {
  constructor(
    public succeedRef: MatSnackBarRef<SucceedSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
