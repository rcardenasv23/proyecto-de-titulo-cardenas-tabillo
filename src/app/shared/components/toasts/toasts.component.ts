import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-toasts",
  templateUrl: "./toasts.component.html",
  styleUrls: ["./toasts.component.scss"],
})
export class ToastsComponent implements OnInit {
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
