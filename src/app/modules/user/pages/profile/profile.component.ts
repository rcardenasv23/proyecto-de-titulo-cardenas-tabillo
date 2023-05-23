import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../core/services/authService/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackBarComponent } from "../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  option = 0;

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.auth.GETUSER().subscribe({
      error: (err) => {
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al obtener usuario",
          panelClass: "snack-bar-error",
        });
      },
    });
  }

  ngOnInit(): void {}

  changeOption(nmbOption: any) {
    this.option = nmbOption;
  }
}
