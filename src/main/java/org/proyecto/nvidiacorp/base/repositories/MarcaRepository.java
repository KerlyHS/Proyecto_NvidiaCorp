package org.proyecto.nvidiacorp.base.repositories;

import org.proyecto.nvidiacorp.base.models.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Integer> {

}
