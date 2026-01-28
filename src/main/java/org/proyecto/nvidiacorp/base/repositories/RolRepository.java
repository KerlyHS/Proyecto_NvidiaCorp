package org.proyecto.nvidiacorp.base.repositories;

import org.proyecto.nvidiacorp.base.models.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

}
