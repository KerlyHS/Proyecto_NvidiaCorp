package org.proyecto.nvidiacorp.base.repositories;

import org.proyecto.nvidiacorp.base.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    java.util.Optional<Usuario> findByCorreo(String correo);
}
