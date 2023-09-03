import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, Observable, throwError} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {LocalStorageService} from "./common/localStorage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();

    if (!request.url.includes("authenticate")) {
      request = request.clone({setHeaders: {Authorization: this.localStorageService.getAuth()}});
    }

    // @ts-ignore
    return next.handle(request)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.handleServerSideError(err);
        return throwError(err);
      }))
      .pipe(finalize(() => this.spinner.hide()));
  }

  private handleServerSideError(error: HttpErrorResponse) {
    switch (error.status) {

      case 400: //  means the request could not be understood by the server.
        this._snackBar.open("Bad Request, please try again later .");
        break;
      case 401: // means lacks valid authentication credentials for the target resource.
        this._snackBar.open("دسترسی شما منقضی شده است.لطفا مجددا تلاش کنید");
        this.localStorageService.deleteAuth();
        this.router.navigate(["/login"]);
        break;
      case 403: //  means you are not allowed access to the target resource.
        this._snackBar.open("دسترسی غیر مجاز");
        this.localStorageService.deleteAuth();
        this.router.navigate(["/login"]);
        break;
      case 500: // means there's an issue or temporary glitch with the application's programming
        this._snackBar.open("Internal server error, please try again later.");
        break;
    }
  }
}
