package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.annotation.security.RolesAllowed; // <--- NUEVO IMPORT NECESARIO

import org.proyecto.nvidiacorp.base.models.Rol;
import org.proyecto.nvidiacorp.base.models.Usuario;
import org.proyecto.nvidiacorp.base.repositories.PersonaRepository;
import org.proyecto.nvidiacorp.base.repositories.RolRepository;
import org.proyecto.nvidiacorp.base.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@Service
// ¡YA NO ESTÁ @AnonymousAllowed AQUÍ ARRIBA!
public class UsuarioServices {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private RolRepository rolRepository;

    // --- MÉTODOS PÚBLICOS (ACCESIBLES PARA TODOS) ---

    @AnonymousAllowed
    public HashMap<String, Object> login(String correo, String clave) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

            if (userOpt.isPresent()) {
                Usuario u = userOpt.get();
                if (u.getClave() != null && u.getClave().equals(clave)) {

                    if (u.getEstado() != null && !u.getEstado()) {
                        throw new Exception("Usuario inactivo");
                    }

                    String rolNombre = "USER";
                    if (u.getId_Rol() != null) {
                        Optional<Rol> rolOpt = rolRepository.findById(u.getId_Rol());
                        if (rolOpt.isPresent())
                            rolNombre = rolOpt.get().getNombre();
                    }

                    List<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + rolNombre));

                    Authentication auth = new UsernamePasswordAuthenticationToken(u.getCorreo(), u.getId(), authorities);

                    SecurityContext sc = SecurityContextHolder.getContext();
                    sc.setAuthentication(auth);

                    ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
                    HttpServletRequest request = attr.getRequest();
                    HttpSession session = request.getSession(true);
                    session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

                    response.put("success", true);
                    response.put("message", "OK");
                    response.put("user", u);
                    response.put("rol", rolNombre);
                } else {
                    throw new Exception("Contraseña incorrecta");
                }
            } else {
                throw new Exception("Usuario no encontrado");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            SecurityContextHolder.clearContext();
        }
        return response;
    }

    @AnonymousAllowed
    public boolean isLogin() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser");
        } catch (Exception e) {
            return false;
        }
    }

    @AnonymousAllowed
    public HashMap<String, Object> logout() {
        SecurityContextHolder.clearContext();
        try {
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpSession session = attr.getRequest().getSession(false);
            if (session != null) {
                session.invalidate();
            }
        } catch (Exception e) {
            // Ignorar
        }
        HashMap<String, Object> aux = new HashMap<>();
        aux.put("mensaje", "OK");
        return aux;
    }

    @AnonymousAllowed
    public HashMap<String, Object> checkSession() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Object> response = new HashMap<>();

        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            response.put("isAuthenticated", true);
            response.put("username", auth.getName());
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
    
    // Dejamos esto público por si usas un formulario de registro abierto
    @AnonymousAllowed 
    public void createUser(String correo, String clave, Boolean estado, Integer id_rol, Integer id_persona) {
        Usuario nuevo = new Usuario();
        nuevo.setCorreo(correo);
        nuevo.setClave(clave);
        nuevo.setEstado(estado);
        nuevo.setId_Rol(id_rol);
        nuevo.setId_Persona(id_persona);
        usuarioRepository.save(nuevo);
    }
    
    // Métodos auxiliares para combos (públicos para no romper UI)
    @AnonymousAllowed
    public List<HashMap<String, Object>> listPersonaCombo() {
        return personaRepository.findAll().stream().map(p -> {
            HashMap<String, Object> map = new HashMap<>();
            map.put("value", p.getId().toString());
            map.put("label", p.getNombre() + " " + (p.getApellido() != null ? p.getApellido() : ""));
            return map;
        }).collect(Collectors.toList());
    }

    @AnonymousAllowed
    public List<HashMap<String, Object>> listRol() {
        return rolRepository.findAll().stream().map(r -> {
            HashMap<String, Object> map = new HashMap<>();
            map.put("value", r.getId());
            map.put("label", r.getNombre());
            return map;
        }).collect(Collectors.toList());
    }

    @AnonymousAllowed
    public org.proyecto.nvidiacorp.base.models.Persona getPersonaLogueada() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication auth = context.getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            String correo = auth.getName();
            Optional<Usuario> user = usuarioRepository.findByCorreo(correo);
            if (user.isPresent() && user.get().getId_Persona() != null) {
                return personaRepository.findById(user.get().getId_Persona()).orElse(null);
            }
        }
        return null;
    }

    // --- MÉTODOS RESTRINGIDOS (SOLO ADMIN) ---
    // Aquí es donde cerramos la puerta para que el CLIENTE no vea la lista

    @RolesAllowed("ADMIN") 
    public List<HashMap<String, String>> listUsuario() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        List<Usuario> usuariosBD = usuarioRepository.findAll();

        for (Usuario u : usuariosBD) {
            HashMap<String, String> map = new HashMap<>();
            map.put("id", u.getId().toString());
            map.put("correo", u.getCorreo());
            map.put("estado", u.getEstado() != null ? u.getEstado().toString() : "false");

            if (u.getId_Persona() != null) {
                personaRepository.findById(u.getId_Persona()).ifPresent(p -> map.put("persona",
                        p.getNombre() + " " + (p.getApellido() != null ? p.getApellido() : "")));
                map.put("id_persona", u.getId_Persona().toString());
            }

            if (u.getId_Rol() != null) {
                rolRepository.findById(u.getId_Rol()).ifPresent(r -> map.put("rol", r.getNombre()));
                map.put("id_rol", u.getId_Rol().toString());
            }
            lista.add(map);
        }
        return lista;
    }

    @RolesAllowed("ADMIN")
    public void update(Integer id, String correo, String clave, Boolean estado, Integer id_persona, Integer id_rol)
            throws Exception {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new Exception("User not found"));
        u.setCorreo(correo);
        if (clave != null && !clave.isEmpty())
            u.setClave(clave);
        u.setEstado(estado);
        u.setId_Persona(id_persona);
        u.setId_Rol(id_rol);
        usuarioRepository.save(u);
    }
}