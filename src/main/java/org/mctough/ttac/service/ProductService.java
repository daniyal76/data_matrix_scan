package org.mctough.ttac.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
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
    HttpHeaders headers = new HttpHeaders();
    headers.set("X-SSP-API-KEY", "2b5b7267-dc13-4e9f-8195-4855d0050571");
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
