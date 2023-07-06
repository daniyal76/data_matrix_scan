package org.mctough.ttac.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.mctough.ttac.ProductCatalogDto;
import org.mctough.ttac.ProductDto;
import org.mctough.ttac.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/product/")
public class ProductController {

  @Autowired
  private ProductService productService;

  @GetMapping("list")
  public List<ProductDto> productList() {
    return productService.productList();
  }

  @GetMapping("catalog")
  public ProductCatalogDto getProductCatalog(@RequestParam String barcodeuid) throws JsonProcessingException {
    return productService.getProductCatalog(barcodeuid);
  }

  @PostMapping("save")
  public String productList(@RequestBody ProductDto productDto) {
    return productService.save(productDto);
  }

}
