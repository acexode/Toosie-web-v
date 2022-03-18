import { authEndpoints } from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';


const TOKEN_KEY = 'my-token';
const CURRENT_USER = 'current-user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';

  constructor(private reqS: RequestService) {
    this.loadToken();
  }

  async loadToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      console.log('set token: ', token);
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  async getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    return (token && token) ? token : null;
  }

  login(credentials: {email: any; password: any}): Observable<any> {
    return this.reqS.post(authEndpoints.login, credentials).pipe(
      tap(data => {
        localStorage.setItem(CURRENT_USER, JSON.stringify(data.user))
        localStorage.setItem(TOKEN_KEY,  data.token)
        this.isAuthenticated.next(true);

      })
    );
  }
  signup(credentials: {name: any; email: any; password: any}): Observable<any> {
    return this.reqS.post(authEndpoints.signup, credentials).pipe(
      tap(data => {
        localStorage.setItem(CURRENT_USER, JSON.stringify(data.user))
        localStorage.setItem(TOKEN_KEY,  data.token)
        this.isAuthenticated.next(true);
      })
    );
  }
  updateUser(credentials: {fullname: any; phone: any; address: any}): Observable<any> {
    return this.reqS.patch(authEndpoints.updateProfile, credentials).pipe(     
      tap(data => {
        console.log(data)
        localStorage.setItem(CURRENT_USER, JSON.stringify(data.userInfo))
        this.isAuthenticated.next(true);
      })
    );
  }
  private save_token(data: { success: any; token: string; }) {
    if (data.success) {
        localStorage.setItem('token', data.token);
        return;
    }
}
  currentUser(){
    const user = localStorage.getItem(CURRENT_USER)
    return JSON.parse(user || '{}');

  }

  logout() {
    this.isAuthenticated.next(false);
    localStorage.remove( TOKEN_KEY);
  }
}

