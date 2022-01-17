import {Injectable} from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService{
  constructor() {
  }

  signOut(): void{
    window.sessionStorage.clear()
    window.localStorage.clear();
  }

  public saveToken(token: string,path:number): void {
    if(path==0){
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.setItem(TOKEN_KEY, token);
    }
    else{
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    if(window.sessionStorage.getItem(TOKEN_KEY)){
      return window.sessionStorage.getItem(TOKEN_KEY);
    }
    else{
      return window.localStorage.getItem(TOKEN_KEY);
    }
  }

  public saveUser(user: any,path:number): void {
    if(path==0){
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    else{
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public getUser(): any {
    if(window.sessionStorage.getItem(TOKEN_KEY)) {
      const user = window.sessionStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
      return {};
    }
    else {
      const user = window.localStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }

      return {};
    }
  }
}
