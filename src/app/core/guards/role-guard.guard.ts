import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "../service/auth/auth.service";
@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(
    public authS: AuthService,
    public router: Router,
    private toastrService: ToastrService
  ) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user: any = JSON.parse(localStorage.getItem("current-user"));
    console.log(user?.userType);
    console.log(this.authS.userAuthenticated(), !this.authS.userAuthenticated());
    if (this.authS.userAuthenticated() === false || user?.userType !== "admin") {
      this.toastrService.info("You need admin priviledges to view this page", '', {
        timeOut: 3000,
      });
      console.log("You need admin priviledges to view this page");
      this.router.navigate(["pages/login"]);
      return false;
    }
    return true;
  }
}
