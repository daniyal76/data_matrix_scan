import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {LoginService} from "./login/login.service";
import {LocalStorageService} from "./common/localStorage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router, private localStorageService: LocalStorageService) {
  }

  canActivate(): boolean {
    if (this.localStorageService.getAuth() != null && this.localStorageService.getAuth().startsWith("Bearer")) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
