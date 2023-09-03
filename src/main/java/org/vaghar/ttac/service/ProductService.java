package org.vaghar.ttac.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.vaghar.ttac.ProductCatalogDto;
import org.vaghar.ttac.ProductDto;
import org.vaghar.ttac.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Log4j2
public class ProductService {

  @Value("${ttac.url}")
  private String ttacUrl;
  @Value("${ttac.url.key}")
  private String ttacUrlKey;
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
    HttpHeaders headers = new HttpHeaders();
    headers.set("X-SSP-API-KEY", ttacUrlKey);
    HttpEntity<String> entity = new HttpEntity<String>(headers);
    RestTemplate restTemplate = new RestTemplate();
    Map<String, Object> param = new HashMap<>();
    param.put("barcodeuid", barcodeuid);
    String uri = ttacUrl + "?barcodeuid=" + barcodeuid;
    ResponseEntity<String> result = null;
    try {
      result = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
      log.info("API :" + ttacUrl + " CALLED");
    } catch (Exception e) {
      log.error("FAILED TO GET API :" + ttacUrl);
    }

    JSONObject jsonObject = new JSONObject(result.getBody());
    Object data = jsonObject.get("data");
    ProductCatalogDto productCatalogDto;
    if (data != null && !data.toString().equals("null")) {
      productCatalogDto = new ObjectMapper().readValue(jsonObject.optString("data"), ProductCatalogDto.class);
      productCatalogDto.setStatusCode(Integer.parseInt(jsonObject.get("statusCode").toString()));
      productCatalogDto.setStatusMessage(jsonObject.get("statusMessage").toString());
    } else {
      log.error("FAILED TO GET DATA FROM API :" + ttacUrl + " WITH ERROR CODE :" + jsonObject.get("statusCode") + "AND MESSAGE :" + jsonObject.get("statusMessage"));
      productCatalogDto = new ProductCatalogDto(jsonObject.get("statusMessage").toString(), Integer.parseInt(jsonObject.get("statusCode").toString()));
    }


    return productCatalogDto;
  }
}
