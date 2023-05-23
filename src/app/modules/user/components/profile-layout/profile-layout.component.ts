import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AuthService } from "../../../../core/services/authService/auth.service";
import { User } from "../../../../core/models/user";

@Component({
  selector: "app-profile-layout",
  templateUrl: "./profile-layout.component.html",
  styleUrls: ["./profile-layout.component.scss"],
})
export class ProfileLayoutComponent implements OnInit {
  @Output() option = new EventEmitter<number>();
  user: User | undefined;
  constructor(private auth: AuthService) {
    this.auth.GETUSER().subscribe({
      next: (res) => {
        this.user = res.data;
      },
    });
  }

  ngOnInit(): void {}

  changeOption(nmbOption: number) {
    this.option.emit(nmbOption);
  }
}
