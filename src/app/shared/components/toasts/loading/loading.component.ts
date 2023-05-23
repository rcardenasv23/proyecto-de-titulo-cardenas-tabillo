import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent implements OnInit {
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
