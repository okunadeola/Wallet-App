import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardguardGuard implements CanActivate {
  constructor(public route: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return true
      // if(localStorage.getItem('walletLogin') !== null) {
      //   let arr: any = localStorage.getItem("walletLogin")
      //   let arrData: any = JSON.parse(arr)
      //     return true
      // }else{
      //   alert("you are not login")
      //   this.route.navigate(['/login'])
      //   return false;
      // }
  
  }
  
}