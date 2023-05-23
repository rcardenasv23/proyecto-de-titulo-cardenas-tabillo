import { Component } from "@angular/core";
import { AuthService } from "./core/services/authService/auth.service";
import { User } from "./core/models/user";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "proyecto-de-titulo-cardenas-tabillo";
  user: User | undefined;
  constructor(private auth: AuthService) {}
}
