package org.proyecto.nvidiacorp.base.repositories;

import org.proyecto.nvidiacorp.base.models.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {

}
