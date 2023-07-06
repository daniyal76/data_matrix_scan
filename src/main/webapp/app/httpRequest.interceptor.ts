import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    // @ts-ignore
    return next.handle(request)
      .pipe(finalize(() => this.spinner.hide()));
  }
}
