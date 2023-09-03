import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginModel} from "./login.model";

@Injectable({providedIn: "root"})
export class LoginService {
  constructor(private httpClient: HttpClient) {
  }

  public login(login: LoginModel): Observable<string> {
    let httpOptions: Object = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }
    return this.httpClient.post<string>("api/authenticate", login, httpOptions);
  }
}
