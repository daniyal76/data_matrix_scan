import {Routes} from '@angular/router';
import {MainComponent} from "./mainPage/main.component";
import {AuthGuard} from "./authGuard.component";
import {LoginComponent} from "./login/login.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: MainComponent, canActivate: [AuthGuard]},
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];
