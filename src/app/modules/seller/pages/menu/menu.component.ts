import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../core/services/authService/auth.service";
import { Seller } from "../../../../core/models/seller";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ErrorSnackBarComponent } from "../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  option = 1;
  seller: Seller | undefined;

  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.auth.GETSELLER().subscribe({
      next: (res) => {
        this.seller = res.data;
      },
      error: (err) => {
        this.snackBar.openFromComponent(ErrorSnackBarComponent, {
          data: "Error al obtener información de vendedor",
          panelClass: "snack-bar-error",
        });
        this.router.navigateByUrl("/user/home");
      },
    });
  }

  ngOnInit(): void {}
  changeOption(nmbOption: any) {
    this.option = nmbOption;
  }
}
