import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/internal/Observable';
import {AppService} from "./app.service";
import {ProductModel} from "./product.model";
import {map, startWith} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ProductCatalogModel} from './productCatalog.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatSnackBar} from '@angular/material/snack-bar';
import {CameraScannerComponent} from "./camera-scanner/camera-scanner.component";
import {Html5Qrcode} from "html5-qrcode";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'ttac-web-client';
  public barcodeuid: string | undefined;
  public count: number | undefined;
  public productList: ProductModel[] = [];
  public product: ProductModel = new ProductModel();
  public productCatalog: ProductCatalogModel | undefined;
  public myControl = new FormControl('');
  @Inject(MAT_DIALOG_DATA) public data: string | undefined;
  public formGroup = new FormGroup({
    barcodeuid: new FormControl('', [Validators.required]),
    count: new FormControl('', [Validators.required])
  });
  public selectedProduct: Observable<ProductModel[]> = new Observable<ProductModel[]>();
  public currentScreenSize: any;

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  private selectedFile: any;

  constructor(
    private appService: AppService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
      ])
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            console.log("query", this.displayNameMap.get(query));
          }
        }
      });
  }

  ngOnInit(): void {
    this.formGroup.controls['count'].disable();
    this.getProductList();
    this.selectedProduct = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
  }

  private _filter(value: any): ProductModel[] {
    return this.productList.filter((product: ProductModel) => product.productName?.toLocaleLowerCase().includes(value) || product.productCode?.toString().includes(value));
  }

  getProductCatalog(barcodeuid: string | undefined) {
    if (barcodeuid != undefined) {
        this.appService.getProductCatalog(barcodeuid).subscribe((value) => {
          if (value.StatusCode != null && value.StatusCode == 0) {
            // @ts-ignore
            this.productCatalog = value;
            this.formGroup.controls['count'].enable();
            this.formGroup.controls['barcodeuid'].disable();
          } else {
            this._snackBar.open(value.statusMessage ? value.statusMessage : '', "بستن")
          }
        });
      }
  }

  selectProduct(e: MatAutocompleteSelectedEvent) {
    if (e.option.value != null) {
      this.product = e.option.value;
      this.myControl.setValue('');
    }
  }

  getProductList() {
    this.appService.getProductLists().subscribe((res: ProductModel[]) => {
      this.productList = res;
    })
  }

  save() {
    this.product.batch = this.productCatalog?.BatchCode;
    this.product.expiration = this.productCatalog?.Expiration;
    this.product.manufacturing = this.productCatalog?.Manufacturing;
    this.product.uid = this.productCatalog?.UID;
    this.product.gtin = this.productCatalog?.GTIN;
    this.product.irc = this.productCatalog?.IRC;
    this.appService.save(this.product).subscribe((res) => {
      if (res) {
        this._snackBar.open(res.toString(), "بستن");
        this.product = new ProductModel();
        this.clearUid();
      }
    });
  }

  clearUid() {
    this.barcodeuid = undefined;
    this.productCatalog = undefined;
    this.formGroup.controls['count'].disable();
    this.formGroup.controls['barcodeuid'].enable();
  }

  openScan() {
    let dialogRef = this.dialog.open(CameraScannerComponent, {
      height: '600px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined || result != '') {
        this.barcodeuid = result.slice(18, 38);
        this.getProductCatalog(this.barcodeuid);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.scanFile();
  }

  scanFile() {
    const html5QrCode = new Html5Qrcode(/* element id */ "reader");
    html5QrCode.scanFile(this.selectedFile, false)
      .then(decodedText => {
        // success, use decodedText
        this.barcodeuid = decodedText;
      })
      .catch(err => {
        this.barcodeuid = "oh fuck";
        // failure, handle it.
        console.log(`Error scanning file. Reason: ${err}`)
      });
  }
}
