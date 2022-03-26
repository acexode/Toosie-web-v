import { AuthService } from './../service/auth/auth.service';

import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.authService.userAuthenticated()) {
      alert('Login to proceed')
      this.router.navigate(['pages/login']);
      return false;
    }
    return true;
  }
 
  // canLoad(): Observable<boolean> {    
  //   return this.authService.isAuthenticated.pipe(
  //     filter(val => val !== null), // Filter out initial Behaviour subject value
  //     take(1), // Otherwise the Observable doesn't complete!
  //     map(isAuthenticated => {
  //       if (isAuthenticated) {
  //         return true;
  //       } else {
  //         console.log(isAuthenticated)
  //         this.router.navigateByUrl('pages/login')
  //         return false;
  //       }
  //     })
  //   );
  // }
}
