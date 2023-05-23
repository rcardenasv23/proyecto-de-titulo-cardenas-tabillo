import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../../services/authService/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad
{
  constructor(private router: Router, private auth: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      route.routeConfig?.path === "login" ||
      route.routeConfig?.path === "signup"
    ) {
      if (
        !(
          localStorage.getItem("token") === undefined ||
          localStorage.getItem("token") === null
        )
      ) {
        this.router.navigateByUrl("/user/home");
      }
      return true;
    } else if (
      route.routeConfig?.path === "profile" &&
      (localStorage.getItem("token") === undefined ||
        localStorage.getItem("token") === null)
    ) {
      this.router.navigateByUrl("/user/home");
    } else if (route.routeConfig?.path === "menu") {
      if (
        localStorage.getItem("token") === undefined ||
        localStorage.getItem("token") === null
      ) {
        this.router.navigateByUrl("/user/home");
      }
      this.auth.GETSELLER().subscribe({
        next: (res) => {
          if (!res.data?.id_seller) {
            this.router.navigateByUrl("/user/home");
          }
        },
        error: (err) => {
          this.router.navigateByUrl("/user/home");
        },
      });
    }
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
