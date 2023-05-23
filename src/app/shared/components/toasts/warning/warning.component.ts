import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-warning",
  templateUrl: "./warning.component.html",
  styleUrls: ["./warning.component.scss"],
})
export class WarningComponent implements OnInit {
  @Input() msg:
    | {
        succeed: string | undefined;
        error: string | undefined;
        warning: string | undefined;
        loading: string | undefined;
      }
    | undefined;
  constructor() {}

  ngOnInit(): void {}
}
