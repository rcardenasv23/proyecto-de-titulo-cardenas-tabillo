import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "core",
    loadChildren: () =>
      import("../app/core/core.module").then((m) => m.CoreModule),
  },
  {
    path: "user",
    loadChildren: () =>
      import("../app/modules/user/user.module").then((m) => m.UserModule),
  },
  {
    path: "seller",
    loadChildren: () =>
      import("../app/modules/seller/seller.module").then((m) => m.SellerModule),
  },
  { path: "**", redirectTo: "/user/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
