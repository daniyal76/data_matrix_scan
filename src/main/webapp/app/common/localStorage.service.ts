import {Injectable} from "@angular/core";

@Injectable()
export class LocalStorageService {

  constructor() {
  }

  getAuth(): string {
    let item = localStorage.getItem('Authorization');
    if (item)
      return item;
    else
      return '';
  }

  setAuth(value: string): void {
    localStorage.setItem('Authorization', "Bearer " + value);
  }

  deleteAuth(): void {
    localStorage.removeItem('Authorization');
  }
}
