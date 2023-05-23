import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-menu-layout",
  templateUrl: "./menu-layout.component.html",
  styleUrls: ["./menu-layout.component.scss"],
})
export class MenuLayoutComponent implements OnInit {
  @Output() option = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}
  changeOption(nmbOption: number) {
    this.option.emit(nmbOption);
  }
}
