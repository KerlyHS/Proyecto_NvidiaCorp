package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
import org.springframework.security.core.context.SecurityContext; // Importar
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository; // VITAL
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder; // VITAL
import org.springframework.web.context.request.ServletRequestAttributes; // VITAL

import jakarta.servlet.http.HttpServletRequest; // VITAL
import jakarta.servlet.http.HttpSession; // VITAL

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
@Service
public class UsuarioServices {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private RolRepository rolRepository;

    public HashMap<String, Object> login(String correo, String clave) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

            if (userOpt.isPresent()) {
                Usuario u = userOpt.get();
                // Verifica la contraseña (simple por ahora)
                if (u.getClave() != null && u.getClave().equals(clave)) {

                    if (u.getEstado() != null && !u.getEstado()) {
                        throw new Exception("Usuario inactivo");
                    }

                    // Obtener nombre del Rol
                    String rolNombre = "USER";
                    if (u.getId_Rol() != null) {
                        Optional<Rol> rolOpt = rolRepository.findById(u.getId_Rol());
                        if (rolOpt.isPresent())
                            rolNombre = rolOpt.get().getNombre();
                    }

                    // 1. Crear la Autenticación
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + rolNombre));

                    Authentication auth = new UsernamePasswordAuthenticationToken(u.getCorreo(), u.getId(),
                            authorities);

                    // 2. Establecer en el Contexto actual
                    SecurityContext sc = SecurityContextHolder.getContext();
                    sc.setAuthentication(auth);

                    // 3. --- EL TRUCO: FORZAR PERSISTENCIA EN SESIÓN HTTP ---
                    // Obtenemos la petición actual
                    ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder
                            .currentRequestAttributes();
                    HttpServletRequest request = attr.getRequest();

                    // Creamos la sesión si no existe (true)
                    HttpSession session = request.getSession(true);

                    // Guardamos el contexto de seguridad en la sesión manualmente
                    session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, sc);

                    // Respuesta al Frontend
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

    public boolean isLogin() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            // Verificamos que no sea nulo, esté autenticado y NO sea "anonymousUser"
            return auth != null && auth.isAuthenticated() &&
                    !auth.getPrincipal().equals("anonymousUser");
        } catch (Exception e) {
            return false;
        }
    }

    public HashMap<String, Object> logout() {
        SecurityContextHolder.clearContext();

        // También invalidamos la sesión HTTP para limpiar todo
        try {
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpSession session = attr.getRequest().getSession(false);
            if (session != null) {
                session.invalidate(); // Borra la memoria del servidor
            }
        } catch (Exception e) {
            // Ignorar si no hay request actual
        }

        HashMap<String, Object> aux = new HashMap<>();
        aux.put("mensaje", "OK");
        return aux;
    }

    // --- MÉTODOS DE GESTIÓN DE USUARIOS (Igual que antes) ---

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

    public void createUser(String correo, String clave, Boolean estado, Integer id_rol, Integer id_persona) {
        Usuario nuevo = new Usuario();
        nuevo.setCorreo(correo);
        nuevo.setClave(clave);
        nuevo.setEstado(estado);
        nuevo.setId_Rol(id_rol);
        nuevo.setId_Persona(id_persona);
        usuarioRepository.save(nuevo);
    }

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

    public List<HashMap<String, Object>> listPersonaCombo() {
        return personaRepository.findAll().stream().map(p -> {
            HashMap<String, Object> map = new HashMap<>();
            map.put("value", p.getId().toString());
            map.put("label", p.getNombre() + " " + (p.getApellido() != null ? p.getApellido() : ""));
            return map;
        }).collect(Collectors.toList());
    }

    public List<HashMap<String, Object>> listRol() {
        return rolRepository.findAll().stream().map(r -> {
            HashMap<String, Object> map = new HashMap<>();
            map.put("value", r.getId());
            map.put("label", r.getNombre());
            return map;
        }).collect(Collectors.toList());
    }

    public org.proyecto.nvidiacorp.base.models.Persona getPersonaLogueada() {
        // 1. Obtenemos la sesión actual
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication auth = context.getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            String correo = auth.getName(); // Spring Security guarda el correo aquí

            // 2. Buscamos el Usuario por su correo
            Optional<Usuario> user = usuarioRepository.findByCorreo(correo);

            // 3. Si existe y tiene una Persona asociada, la devolvemos
            if (user.isPresent() && user.get().getId_Persona() != null) {
                return personaRepository.findById(user.get().getId_Persona()).orElse(null);
            }
        }
        return null; // Si no hay nadie logueado o no tiene datos
    }
    public HashMap<String, Object> checkSession() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    HashMap<String, Object> response = new HashMap<>();

    // Verificamos si hay alguien logueado y que no sea "anónimo"
    if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
        response.put("isAuthenticated", true);
        response.put("username", auth.getName());
        
        // Extraemos los roles (Ej: ["ROLE_ADMINISTRADOR", "ROLE_USER"])
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