import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./pages/login/login.component";
import { CoreRoutingModule } from "./core-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from "./pages/signup/signup.component";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./services/authService/auth.service";
import { SharedModule } from "../shared/shared.module";

import { BaseInfoService } from "../shared/services/baseInfoService/base-info.service";
import { CoreComponent } from "./core.component";
import { MapComponent } from "./pages/map/map.component";
import { UsComponent } from "./pages/us/us.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    CoreComponent,
    MapComponent,
    UsComponent,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatTooltipModule,
    CoreRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    AuthService,
    BaseInfoService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center",
      },
    },
  ],
  exports: [],
})
export class CoreModule {}
