import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SucceedComponent } from "./components/toasts/succeed/succeed.component";
import { WarningComponent } from "./components/toasts/warning/warning.component";
import { ErrorComponent } from "./components/toasts/error/error.component";
import { LoadingComponent } from "./components/toasts/loading/loading.component";
import { ToastsComponent } from "./components/toasts/toasts.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { SucceedSnackbarComponent } from "./components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "./components/snack-bar/error-snack-bar/error-snack-bar.component";
import { LoadingSnackBarComponent } from "./components/snack-bar/loading-snack-bar/loading-snack-bar.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    SucceedComponent,
    WarningComponent,
    ErrorComponent,
    LoadingComponent,
    ToastsComponent,
    LoaderComponent,
    SucceedSnackbarComponent,
    ErrorSnackBarComponent,
    LoadingSnackBarComponent,
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SucceedComponent,
    LoadingComponent,
    ErrorComponent,
    ToastsComponent,
    LoaderComponent,
    SucceedSnackbarComponent,
    AngularFireModule,
    AngularFireStorageModule,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class SharedModule {}
