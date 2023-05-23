import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"],
})
export class ErrorComponent implements OnInit {
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
