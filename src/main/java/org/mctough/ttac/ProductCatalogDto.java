package org.mctough.ttac;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCatalogDto {
  @JsonProperty("ProductCategoryCode")
  private Integer productCategoryCode;
  @JsonProperty("PackageCount")
  private Integer packageCount;
  private String productName;
  @JsonProperty("ProductCategory")
  private String productCategory;
  @JsonProperty("LicenseOwner")
  private String licenseOwner;
  @JsonProperty("EnglishProductName")
  private String englishProductName;
  @JsonProperty("PersianProductName")
  private String persianProductName;
  @JsonProperty("BatchCode")
  private String batch;
  @JsonProperty("Expiration")
  private String expiration;
  @JsonProperty("Manufacturing")
  private String manufacturing;
  @JsonProperty("UID")
  private String uid;
  @JsonProperty("IRC")
  private String irc;
  @JsonProperty("GTIN")
  private String gtin;
  @JsonProperty("GenericCode")
  private String genericCode;
  @JsonProperty("GenericName")
  private String genericName;
  @JsonProperty("StatusCode")
  private Integer statusCode;
  @JsonProperty("statusMessage")
  private String statusMessage;


  public ProductCatalogDto(String statusMessage, Integer statusCode) {
    this.statusMessage = statusMessage;
    this.statusCode = statusCode;
  }
}
