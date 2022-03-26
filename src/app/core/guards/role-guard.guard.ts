import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';

import { AuthService } from '../service/auth/auth.service';
@Injectable({
    providedIn: 'root'
  })
export class RoleGuard implements CanActivate {
  constructor(public authS: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user: any = localStorage.getItem('current-user');
    if (
      !this.authS.userAuthenticated() || 
      user.userType === 'admin'
    ) {
        alert("You need admin priviledges to view this page")
      this.router.navigate(['pages/login']);
      return false;
    }
    return true;
  }
}
