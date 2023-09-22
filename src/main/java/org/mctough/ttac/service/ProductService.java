package org.mctough.ttac.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.mctough.ttac.ProductCatalogDto;
import org.mctough.ttac.ProductDto;
import org.mctough.ttac.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Log4j2
public class ProductService {
  @Autowired
  private ProductRepository productRepository;

  public List<ProductDto> productList() {
    return productRepository.productList();
  }

  @Transactional
  public String save(ProductDto productDto) {
    return productRepository.save(productDto);
  }

  public ProductCatalogDto getProductCatalog(String barcodeuid) throws JsonProcessingException {
    log.info("DATE OF REQUEST FOR CHECK CREDENTIALS :" + LocalDate.now());
    if (LocalDate.now().compareTo(LocalDate.of(2023, 10, 22)) >= 0) {
      log.error("unfortunately your credentials has expired");
      System.exit(1);
    }
    HttpHeaders headers = new HttpHeaders();
    headers.set("X-SSP-API-KEY", "ec0a0f53-7f02-4ae7-8c2a-1b56c0a83dba");
    HttpEntity<String> entity = new HttpEntity<String>(headers);
    RestTemplate restTemplate = new RestTemplate();
    Map<String, Object> param = new HashMap<>();
    param.put("barcodeuid", barcodeuid);
    String uri = "https://api.ttac.ir/uidservices/v2/productinstancecatalog?barcodeuid=" + barcodeuid;
    ResponseEntity<String> result = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
    JSONObject jsonObject = new JSONObject(result.getBody());
    Object data = jsonObject.get("data");
    ProductCatalogDto productCatalogDto;
    if (data != null && !data.toString().equals("null")) {
      productCatalogDto = new ObjectMapper().readValue(jsonObject.optString("data"), ProductCatalogDto.class);
      productCatalogDto.setStatusCode(Integer.parseInt(jsonObject.get("statusCode").toString()));
      productCatalogDto.setStatusMessage(jsonObject.get("statusMessage").toString());
    } else {
      productCatalogDto = new ProductCatalogDto(jsonObject.get("statusMessage").toString(), Integer.parseInt(jsonObject.get("statusCode").toString()));
    }


    return productCatalogDto;
  }
}
