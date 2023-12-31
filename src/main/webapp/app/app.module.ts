import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppService} from "./app.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {HttpRequestInterceptor} from "./httpRequest.interceptor";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {CameraScannerComponent} from "./camera-scanner/camera-scanner.component";

@NgModule({
  declarations: [
    AppComponent,
    CameraScannerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  providers: [
    AppService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
