import {Component} from "@angular/core";
import {LoginModel} from "./login.model";
import {LoginService} from "./login.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {LocalStorageService} from "../common/localStorage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  public loginModel: LoginModel = new LoginModel();

  constructor(
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
  }

  login() {
    this.loginService.login(this.loginModel).subscribe(
      (res: string) => {
        this.localStorageService.setAuth(res);
        this._snackBar.open('ورود موفقیت آمیز', "بستن", {duration: 5});
        this.router.navigate(["/"])
      });
  }
}
