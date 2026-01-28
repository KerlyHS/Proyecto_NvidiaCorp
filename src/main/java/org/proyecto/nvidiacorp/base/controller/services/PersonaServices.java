package org.proyecto.nvidiacorp.base.controller.services;

import org.proyecto.nvidiacorp.base.models.Persona;
import org.proyecto.nvidiacorp.base.models.IdentificacionEnum;
import org.proyecto.nvidiacorp.base.repositories.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.stream.Collectors;

@BrowserCallable
@AnonymousAllowed
@Service
public class PersonaServices {

    @Autowired
    private PersonaRepository personaRepository;

    public List<Persona> listAllPersona() {
        return personaRepository.findAll();
    }

    // Usamos el Enum aquí
    public void create(String nombre, String apellido, String telefono, 
                       IdentificacionEnum identificacion, 
                       String direccion, Integer edad, String codIdent) {
        Persona p = new Persona();
        p.setNombre(nombre);
        p.setApellido(apellido);
        p.setTelefono(telefono);
        p.setIdentificacion(identificacion);
        p.setDireccion(direccion);
        p.setEdad(edad);
        p.setCodIdent(codIdent);
        personaRepository.save(p);
    }

    public void update(Integer id, String nombre, String apellido, String telefono, 
                       IdentificacionEnum identificacion, 
                       String direccion, Integer edad, String codIdent) throws Exception {
        Persona p = personaRepository.findById(id).orElseThrow(() -> new Exception("Persona no encontrada"));
        p.setNombre(nombre);
        p.setApellido(apellido);
        p.setTelefono(telefono);
        p.setIdentificacion(identificacion);
        p.setDireccion(direccion);
        p.setEdad(edad);
        p.setCodIdent(codIdent);
        personaRepository.save(p);
    }

    public List<String> listID() {
        return Arrays.stream(IdentificacionEnum.values())
                     .map(Enum::name)
                     .collect(Collectors.toList());
    }
    // PÉGALO AL FINAL DE UsuarioServices.java, ANTES DE LA ÚLTIMA '}'

    public HashMap<String, Object> checkSession() {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Object> response = new HashMap<>();

        // Verificamos si hay alguien logueado y que no sea "anónimo"
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            response.put("isAuthenticated", true);
            response.put("username", auth.getName());
            
            // Extraemos los roles
            List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
                
            response.put("roles", roles);
        } else {
            response.put("isAuthenticated", false);
            response.put("roles", new ArrayList<>());
        }
        return response;
    }
}