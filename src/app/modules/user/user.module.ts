import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./pages/home/home.component";
import { ReactiveFormsModule } from "@angular/forms";
import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user.component";
import { ProfileButtonComponent } from "./components/profile-button/profile-button.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { ProfileLayoutComponent } from "./components/profile-layout/profile-layout.component";
import { SharedModule } from "../../shared/shared.module";
import { BasicInfoComponent } from "./components/profile/basic-info/basic-info.component";
import { ChangePasswordComponent } from "./components/profile/change-password/change-password.component";
import { ChangeAddressComponent } from "./components/profile/change-address/change-address.component";
import { BuysComponent } from "./components/profile/buys/buys.component";
import { SellerSignUpComponent } from "./components/profile/seller-sign-up/seller-sign-up.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import { PublicationComponent } from "./pages/publication/publication.component";
import { DescriptionComponent } from "./components/publication/description/description.component";
import { DataSheetComponent } from "./components/publication/data-sheet/data-sheet.component";
import { MatDividerModule } from "@angular/material/divider";
import { CommentsComponent } from "./components/publication/comments/comments.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ShoppingCartComponent } from "./pages/shopping-cart/shopping-cart.component";
import { RecoveryComponent } from "./pages/recovery/recovery.component";
import { BuyDetailComponent } from "./components/profile/buy-detail/buy-detail.component";
import { BrowseComponent } from "./pages/browse/browse.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { IvyCarouselModule } from "angular-responsive-carousel";

@NgModule({
  declarations: [
    HomeComponent,
    UserComponent,
    ProfileButtonComponent,
    ProfileComponent,
    ProfileLayoutComponent,
    BasicInfoComponent,
    ChangePasswordComponent,
    ChangeAddressComponent,
    BuysComponent,
    SellerSignUpComponent,
    PublicationComponent,
    DescriptionComponent,
    DataSheetComponent,
    CommentsComponent,
    ShoppingCartComponent,
    RecoveryComponent,
    BuyDetailComponent,
    BrowseComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    IvyCarouselModule,
  ],
  exports: [],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center",
      },
    },
  ],
})
export class UserModule {}
