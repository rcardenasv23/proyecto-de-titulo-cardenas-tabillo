import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-succeed",
  templateUrl: "./succeed.component.html",
  styleUrls: ["./succeed.component.scss"],
})
export class SucceedComponent implements OnInit {
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
