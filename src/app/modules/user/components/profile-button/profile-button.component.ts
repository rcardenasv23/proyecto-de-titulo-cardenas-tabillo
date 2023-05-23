import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-profile-button",
  templateUrl: "./profile-button.component.html",
  styleUrls: ["./profile-button.component.scss"],
})
export class ProfileButtonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }
}
