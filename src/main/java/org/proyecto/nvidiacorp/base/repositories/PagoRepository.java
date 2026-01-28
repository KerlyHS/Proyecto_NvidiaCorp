package org.proyecto.nvidiacorp.base.repositories;

import org.proyecto.nvidiacorp.base.models.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {

}
