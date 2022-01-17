import {Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {TokenStorageService} from "../Services/token-storage.service";


@Injectable({
  providedIn: 'root'
})
export class ModGuard implements CanActivate{

  constructor(
    private route: Router,
    private tokenStorage: TokenStorageService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    let userLocalJSON =window.localStorage.getItem('auth-user')
    let userSesionJSON =window.sessionStorage.getItem('auth-user')
    if(userLocalJSON){
      let UserLocal=JSON.parse(userLocalJSON)
      if (!UserLocal.roles.includes('moderator')) {
        this.route.navigate(['Home'])
      }
      return true
    }
    else if(userSesionJSON){
      let UserSesion=JSON.parse(userSesionJSON)
      if (!UserSesion.roles.includes('moderator')) {
        this.route.navigate(['Home'])
      }
      return true
    }
    this.route.navigate(['Home'])
    return false;
  }
}
