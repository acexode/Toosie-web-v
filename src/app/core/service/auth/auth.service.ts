import { authEndpoints, baseEndpoints } from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import jwt_decode from "jwt-decode";

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
    console.log(this.userAuthenticated())
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
      tap(res => {
        console.log(res.data)
        localStorage.setItem(CURRENT_USER, JSON.stringify(res.data))
        const {token} = res.token
        localStorage.setItem(TOKEN_KEY,  token)
        this.isAuthenticated.next(true);

      })
    );
  }
  signup(credentials: {name: any; email: any; password: any}): Observable<any> {
    return this.reqS.post(authEndpoints.signup, credentials).pipe(
      tap(res => {
        localStorage.setItem(CURRENT_USER, JSON.stringify(res.data))
        localStorage.setItem(TOKEN_KEY,  res.token.token)
        this.isAuthenticated.next(true);
      })
    );
  }
  updateUser(id, credentials): Observable<any> {
    return this.reqS.put(baseEndpoints.user + '/' + id, credentials).pipe(     
      tap(res => {
        console.log(res)
        localStorage.setItem(CURRENT_USER, JSON.stringify(res.data))
        this.isAuthenticated.next(true);
      })
    );
  }
  getUsers(): Observable<any> {
    return this.reqS.get(baseEndpoints.user)
  }
  getUser(id): Observable<any> {
    return this.reqS.get(baseEndpoints.user + '/'+ id)
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
  public userAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if(token){
      const decode =  jwt_decode(token);
      if (Date.now() >= decode['exp'] * 1000) {
        return false;
      }
      console.log(decode['exp'], new Date(decode['exp'] * 1000))
      return true

    }else{
      return false
    }
  }
}

