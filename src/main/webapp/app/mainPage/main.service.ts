import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductModel} from "./product.model";
import {ProductCatalogModel} from "./productCatalog.model";

@Injectable({providedIn: "root"})
export class MainService {
  constructor(private httpClient: HttpClient) {
  }

  /*  public getProductCatalog(barcodeuid: number) {
      const param = new HttpParams().set("barcodeuid", barcodeuid);
      const headers = new HttpHeaders().set("Access-Control-Allow-Origin", "*").set('X-SSP-API-KEY', '2b5b7267-dc13-4e9f-8195-4855d0050571')
      return this.httpClient.get("https://api.ttac.ir/uidservices/v2/productinstancecatalog", {
        params: param,
        headers: headers,
        withCredentials: true
      });
    }*/

  public getProductCatalog(barcodeuid: string):Observable<ProductCatalogModel> {
    const param = new HttpParams().set("barcodeuid", barcodeuid);
    return this.httpClient.get("api/product/catalog", {
      params: param
    });
  }

  public getProductLists(): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>("api/product/list");
  }

  public save(product: ProductModel): Observable<String> {
    let httpOptions: Object = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }
    return this.httpClient.post<String>("api/product/save", product, httpOptions);
  }
}
