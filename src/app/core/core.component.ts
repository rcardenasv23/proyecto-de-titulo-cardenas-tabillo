import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/authService/auth.service";

@Component({
  selector: "app-core",
  templateUrl: "./core.component.html",
  styleUrls: ["./core.component.scss"],
})
export class CoreComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {}
}
