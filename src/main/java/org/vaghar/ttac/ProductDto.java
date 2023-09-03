package org.vaghar.ttac;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
  private Integer productCode;
  private String productName;
  private short companyCode;
  private String companyName;
  private Integer count;
  private String batch;
  private String expiration;
  private String manufacturing;
  private String uid;
  private String irc;
  private String gtin;
}
