import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuComponent } from "./pages/menu/menu.component";
import { SellerComponent } from "./seller.component";
import { BasicInfoComponent } from "./pages/menu/basic-info/basic-info.component";
import { ViewPublicationsComponent } from "./pages/menu/view-publications/view-publications.component";
import { CreatePublicationComponent } from "./pages/menu/create-publication/create-publication.component";
import { EditPublicationComponent } from "./pages/menu/edit-publication/edit-publication.component";
import { AuthGuardGuard } from "../../core/guards/authGuard/auth-guard.guard";
import { RemainPaymentsComponent } from "./pages/menu/remain-payments/remain-payments.component";
import { ViewSaleComponent } from "./pages/menu/remain-payments/view-sale/view-sale.component";

const routes: Routes = [
  {
    path: "",
    component: SellerComponent,
    children: [
      {
        path: "menu",
        component: MenuComponent,
        canActivate: [AuthGuardGuard],
        children: [
          { path: "", component: BasicInfoComponent, outlet: "seller-menu" },
          {
            path: "publications",
            component: ViewPublicationsComponent,
            outlet: "seller-menu",
          },
          {
            path: "post",
            component: CreatePublicationComponent,
            outlet: "seller-menu",
          },
          {
            path: "publication/:id",
            component: EditPublicationComponent,
            outlet: "seller-menu",
          },
          {
            path: "remain-payments",
            component: RemainPaymentsComponent,
            outlet: "seller-menu",
          },
          {
            path: "detail/:id_sale",
            component: ViewSaleComponent,
            outlet: "seller-menu",
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}
