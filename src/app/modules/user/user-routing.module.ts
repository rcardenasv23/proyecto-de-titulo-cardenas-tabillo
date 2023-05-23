import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { UserComponent } from "./user.component";
import { AuthGuardGuard } from "../../core/guards/authGuard/auth-guard.guard";
import { BasicInfoComponent } from "./components/profile/basic-info/basic-info.component";
import { ChangeAddressComponent } from "./components/profile/change-address/change-address.component";
import { ChangePasswordComponent } from "./components/profile/change-password/change-password.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { BuysComponent } from "./components/profile/buys/buys.component";
import { SellerSignUpComponent } from "./components/profile/seller-sign-up/seller-sign-up.component";
import { PublicationComponent } from "./pages/publication/publication.component";
import { ShoppingCartComponent } from "./pages/shopping-cart/shopping-cart.component";
import { BuyDetailComponent } from "./components/profile/buy-detail/buy-detail.component";
import { RecoveryComponent } from "./pages/recovery/recovery.component";
import { BrowseComponent } from "./pages/browse/browse.component";

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    children: [
      {
        path: "profile",
        canActivate: [AuthGuardGuard],
        component: ProfileComponent,
        children: [
          {
            path: "",
            component: BasicInfoComponent,
            outlet: "user-profile",
          },
          {
            path: "change-address",
            component: ChangeAddressComponent,
            outlet: "user-profile",
          },
          {
            path: "change-password",
            component: ChangePasswordComponent,
            outlet: "user-profile",
          },
          {
            path: "buys",
            component: BuysComponent,
            outlet: "user-profile",
          },
          {
            path: "buy/:id_sale",
            component: BuyDetailComponent,
            outlet: "user-profile",
          },
          {
            path: "seller-signup",
            component: SellerSignUpComponent,
            outlet: "user-profile",
          },
        ],
      },
      { path: "home", component: HomeComponent },
      { path: "publication/:id", component: PublicationComponent },
      { path: "shopping-cart", component: ShoppingCartComponent },
      { path: "recovery", component: RecoveryComponent },
      { path: "browse", component: BrowseComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
