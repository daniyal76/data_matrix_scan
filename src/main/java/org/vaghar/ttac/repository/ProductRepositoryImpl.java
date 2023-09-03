package org.vaghar.ttac.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import org.hibernate.transform.Transformers;
import org.vaghar.ttac.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductRepositoryImpl implements ProductRepository {

  @Autowired
  private EntityManager entityManager;

  @Override
  public List<ProductDto> productList() {
    String sql = "select " +
      "                                             p.code as productCode," +
      "                                             p.name as productName," +
      "                                             c.code as companyCode," +
      "                                             c.name as companyName" +
      "              from dbo.product p , dbo.company c " +
      "            where p.cmpcode = c.code";
    return entityManager.createNativeQuery(sql).unwrap(org.hibernate.query.NativeQuery.class)
      .setResultTransformer(Transformers.aliasToBean(ProductDto.class))
      .getResultList();
  }

  @Override
  public String save(ProductDto productDto) {
    StoredProcedureQuery insertBatchIrc = entityManager.createStoredProcedureQuery("dbo.Insert_Batch_IRC").
      registerStoredProcedureParameter(1, Integer.class, ParameterMode.IN).
      registerStoredProcedureParameter(2, Integer.class, ParameterMode.IN).
      registerStoredProcedureParameter(3, Integer.class, ParameterMode.IN).
      registerStoredProcedureParameter(4, String.class, ParameterMode.IN).
      registerStoredProcedureParameter(5, String.class, ParameterMode.IN).
      registerStoredProcedureParameter(6, String.class, ParameterMode.IN).
      registerStoredProcedureParameter(7, String.class, ParameterMode.IN).
      registerStoredProcedureParameter(8, String.class, ParameterMode.IN).
      registerStoredProcedureParameter(9, String.class, ParameterMode.IN);
    insertBatchIrc.
      setParameter(1, productDto.getProductCode()).
      setParameter(2, productDto.getCompanyCode()).
      setParameter(3, productDto.getCount()).
      setParameter(4, productDto.getBatch()).
      setParameter(5, productDto.getExpiration().replace("-","")).
      setParameter(6, productDto.getManufacturing().replace("-","")).
      setParameter(7, productDto.getUid()).
      setParameter(8, productDto.getIrc()).
      setParameter(9, productDto.getGtin());
    return String.valueOf(insertBatchIrc.getResultList());
  }
}
