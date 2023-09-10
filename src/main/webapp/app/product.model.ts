export class ProductModel {
  productId?: number;
  productCode?: string;
  productName?: string;
  companyId?: number;
  companyCode?: string;
  companyName?: string;
  count?: number;
  batch?: string | undefined;
  expiration?: string;
  manufacturing?: string;
  uid?: string | undefined;
  gtin?: string | undefined;
  irc?: string | undefined;
}
