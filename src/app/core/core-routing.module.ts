import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreComponent } from "./core.component";
import { LoginComponent } from "./pages/login/login.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { AuthGuardGuard } from "./guards/authGuard/auth-guard.guard";
import { MapComponent } from "./pages/map/map.component";
import { UsComponent } from "./pages/us/us.component";
import { RecoveryComponent } from '../modules/user/pages/recovery/recovery.component';

const routes: Routes = [
  {
    path: "",
    component: CoreComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: "signup",
        component: SignupComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: "map",
        component: MapComponent,
      },
      {
        path: "us",
        component: UsComponent,
      },
      {
        path: "recovery",
        component: RecoveryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
