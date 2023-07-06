package org.mctough.ttac.repository;

import org.mctough.ttac.ProductDto;

import java.util.List;

public interface ProductRepository {
  List<ProductDto> productList();

  String save(ProductDto productDto);
}
