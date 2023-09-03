package org.vaghar.ttac.repository;

import org.vaghar.ttac.ProductDto;

import java.util.List;

public interface ProductRepository {
  List<ProductDto> productList();

  String save(ProductDto productDto);
}
