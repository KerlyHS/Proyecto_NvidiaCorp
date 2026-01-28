package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.models.Persona;
import org.proyecto.nvidiacorp.base.models.Rol;
import org.proyecto.nvidiacorp.base.models.Usuario;
import org.proyecto.nvidiacorp.base.repositories.PersonaRepository;
import org.proyecto.nvidiacorp.base.repositories.RolRepository;
import org.proyecto.nvidiacorp.base.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // <--- Importante

import java.util.HashMap;

@Service // <--- Esto lo convierte en una herramienta oficial de Spring
public class DaoUsuario {

    // Inyectamos las conexiones a la base de datos
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private RolRepository rolRepository;

    public HashMap<String, Object> login(String correo, String clave) throws Exception {
        // 1. Buscamos al usuario en la Base de Datos
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new Exception("No se encontró el usuario con ese correo"));

        // 2. Verificamos la contraseña (simple por ahora)
        if (!usuario.getClave().equals(clave)) {
            throw new Exception("Clave incorrecta");
        }

        // 3. Verificamos si está activo
        if (!Boolean.TRUE.equals(usuario.getEstado())) {
             throw new Exception("Cuenta desactivada");
        }

        // 4. Recuperamos los datos extra (Persona y Rol) usando los IDs
        Persona persona = personaRepository.findById(usuario.getId_Persona()).orElse(null);
        Rol rol = rolRepository.findById(usuario.getId_Rol()).orElse(null);

        // 5. Construimos el MAPA que espera tu Frontend
        HashMap<String, Object> resultado = new HashMap<>();
        
        // Datos del Usuario
        resultado.put("id", usuario.getId());
        resultado.put("correo", usuario.getCorreo());
        resultado.put("estado", usuario.getEstado());

        // Datos de la Persona (nombre, apellido, etc.)
        if (persona != null) {
            resultado.put("nombre", persona.getNombre());
            resultado.put("apellido", persona.getApellido());
            resultado.put("identificacion", persona.getIdentificacion()); 
            // Agrega aquí otros campos si tu frontend los usa (ej: direccion, telefono)
        }

        // Datos del Rol
        if (rol != null) {
            resultado.put("rol", rol.getNombre());
        }

        return resultado;
    }
    
    // Métodos viejos para compatibilidad (puedes dejarlos vacíos o borrarlos si nadie más los usa)
    public Boolean save() { return false; }
}