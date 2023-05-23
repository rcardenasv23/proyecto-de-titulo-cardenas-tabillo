import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuComponent } from "./pages/menu/menu.component";
import { SellerRoutingModule } from "./seller-routing.module";
import { SellerComponent } from "./seller.component";
import { MenuLayoutComponent } from "./components/menu-layout/menu-layout.component";
import { UserModule } from "../user/user.module";
import { BasicInfoComponent } from "./pages/menu/basic-info/basic-info.component";
import { SharedModule } from "../../shared/shared.module";
import { CreatePublicationComponent } from "./pages/menu/create-publication/create-publication.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { GoogleMapsModule } from "@angular/google-maps";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import { ViewPublicationsComponent } from "./pages/menu/view-publications/view-publications.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EditPublicationComponent } from "./pages/menu/edit-publication/edit-publication.component";
import { MediaFormComponent } from "./components/edit-publication/media-form/media-form.component";
import { AddressFormComponent } from "./components/edit-publication/address-form/address-form.component";
import { InfoFormComponent } from "./components/edit-publication/info-form/info-form.component";
import { RemainPaymentsComponent } from "./pages/menu/remain-payments/remain-payments.component";
import { ViewSaleComponent } from "./pages/menu/remain-payments/view-sale/view-sale.component";
import { CompleteSaleModalComponent } from "./components/complete-sale-modal/complete-sale-modal.component";
import { RejectSaleModalComponent } from "./components/reject-sale-modal/reject-sale-modal.component";

@NgModule({
  declarations: [
    MenuComponent,
    SellerComponent,
    MenuLayoutComponent,
    BasicInfoComponent,
    CreatePublicationComponent,
    ViewPublicationsComponent,
    EditPublicationComponent,
    MediaFormComponent,
    AddressFormComponent,
    InfoFormComponent,
    RemainPaymentsComponent,
    ViewSaleComponent,
    CompleteSaleModalComponent,
    RejectSaleModalComponent,
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    UserModule,
    SharedModule,
    ReactiveFormsModule,
    DragDropModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule,
    GoogleMapsModule,
    MatProgressSpinnerModule,
  ],
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
export class SellerModule {}
