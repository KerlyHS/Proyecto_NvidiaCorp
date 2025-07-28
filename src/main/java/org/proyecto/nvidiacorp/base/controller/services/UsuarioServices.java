package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.proyecto.nvidiacorp.base.controller.Utiles;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoPersona;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoRol;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoUsuario;
import org.proyecto.nvidiacorp.base.models.Persona;
import org.proyecto.nvidiacorp.base.models.Rol;
import org.proyecto.nvidiacorp.base.models.RolEnum;
import org.proyecto.nvidiacorp.base.models.Usuario;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.annotation.security.PermitAll;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@BrowserCallable
@AnonymousAllowed
public class UsuarioServices {
    private SecurityContext context;
    private DaoUsuario du;
    
    public UsuarioServices(){
        du = new DaoUsuario();
        context = SecurityContextHolder.getContext();
    }

    @PermitAll // Solo usuarios autenticados
    public String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
            .findFirst()
            .map(GrantedAuthority::getAuthority)
            .orElse("ROLE_GUEST");
    }

    public Map<String, Object> getCurrentUser() throws Exception {
    Utiles util = new Utiles();
    Map<String, Object> response = new HashMap<>();
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    System.out.println("AUTH: " + auth);
    if (auth != null) {
    System.out.println("AUTH CLASS: " + auth.getClass().getName());
    System.out.println("isAuthenticated: " + auth.isAuthenticated());
    System.out.println("Principal: " + auth.getPrincipal());
    System.out.println("Name: " + auth.getName());
}

    if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
        response.put("success", false);
    response.put("message", "No autenticado");
    response.put("correo", null);
    response.put("id", null);
    response.put("Rol", null);
    return response;
    }
    String correoBuscado = auth.getName();


    try {

        System.out.println("Buscando usuario con correo: " + correoBuscado); 
        
        LinkedList<Usuario> todosUsuarios = du.listAll();
        System.out.println("Total usuarios: " + todosUsuarios.getLength()); 
        
        DaoPersona dp = new DaoPersona();
        DaoRol dr = new DaoRol();
        HashMap<String , AdapterDao> daos = new HashMap<>();
        daos.put("Persona", dp);
        daos.put("Rol", dr);
        HashMap<String ,Object> [] array =  util.getHasMap("nombre",util.getAtributos(du.getUsuario()), du.listAll().quickSort("correo", 1, daos).toArray(), daos).toArray();
        LinkedList<HashMap<String,Object>> users = util.searchL("correo", correoBuscado, null);
        HashMap<String ,Object> usuarioEncontrado = du.login(users.get(0).get("correo").toString(), users.get(0).get("clave").toString());
        /* for (Usuario u : todosUsuarios.toArray()) {
            System.out.println("Comparando con: " + u.getCorreo()); 
            if (correoBuscado.equalsIgnoreCase(u.getCorreo())) {
                usuarioEncontrado = u;
                break;
            }
        } */

        if (usuarioEncontrado == null) {
            System.out.println("Usuario no encontrado en la lista de usuarios"); 
            response.put("success", false);
            response.put("message", "Usuario no registrado en la lista de usuarios");
            return response;
        }

        response.put("success", true);
        response.put("correo", usuarioEncontrado.get("correo"));
        response.put("id", usuarioEncontrado.get("id"));
        response.put("estado", usuarioEncontrado.get("estado"));

        Persona persona = new DaoPersona().get((Integer) usuarioEncontrado.get("id_Persona"));
        if (persona != null) {
            response.put("Persona", persona.getNombre());
        }

        Rol rol = new DaoRol().get((Integer) usuarioEncontrado.get("id_Rol"));
        if (rol != null) {
            response.put("Rol", rol.getNombre());
        }

    } catch (Exception e) {
        System.err.println("Error en getCurrentUser: " + e.getMessage());
        e.printStackTrace();
        response.put("success", false);
        response.put("message", "Error del servidor: " + e.getMessage());
    }
    return response;
    }


    public HashMap<String, String> createRoles(){
        HashMap<String,String> map = new HashMap<>();
        map.put("resp", "Ya creado");
        map.put("code", "201");
        DaoRol rol = new DaoRol();
        if(rol.listAll().isEmpty()){
            rol.getrol().setNombre("ADMIN");
            rol.save();
            rol.setrol(null);
            rol.getrol().setNombre("CLIENTE");
            rol.save();
            rol.setrol(null);
            map.put("resp", "Creado");
            map.put("code", "200");
        }
        return map;
    }

    public Authentication getAtentication(){
        System.out.println("INDENTIQUESE CTM >:!");
        System.out.println(context.getAuthentication());
        System.out.println("-------------------------");
        return context.getAuthentication();
    }

    public Boolean isLogin(){
        if(getAtentication() != null){
            return getAtentication().isAuthenticated();
        }
        return false;
    }

    public List<Usuario> listUsers(){
        return Arrays.asList(du.listAll().toArray());
    }

    public HashMap<String , Object> login (@NotEmpty @NotBlank String correo, @NotEmpty @NotBlank String clave) throws Exception{
        HashMap<String ,Object> obj = new HashMap<>();
        try {
            HashMap<String ,Object> aux = du.login(correo, clave);
            if(aux != null) {
                context.setAuthentication(
                    new UsernamePasswordAuthenticationToken(aux.get("correo").toString(), 
                        aux.get("id").toString(),getAuthorities(aux))
                        );
                obj.put("success", true);
                obj.put("message", "OK");
                obj.put("user",aux);
            }
        } catch (Exception e) {
            obj.put("success", false);
            obj.put("message", "Usuario inexistente o credenciales incorrectas");
            obj.put("user", null);
            context.setAuthentication(null);
            System.out.println(e);

        }
        System.out.println(obj);
        return obj;
    }

    public HashMap<String,String> viewRol(){
        HashMap<String,String> map = new HashMap<>();
        if(context.getAuthentication()!= null){
            Object[] obj =context.getAuthentication().getAuthorities().toArray();
            map.put("rol",obj[0].toString());

        }
        return map;
    }

    public HashMap<String, Object>logout(){
        context.setAuthentication(null);
        HashMap<String, Object> aux = new HashMap<>();
        aux.put("mensaje", "OK");
        return aux;
    }

    public static List<GrantedAuthority> getAuthorities(HashMap<String , Object> obj)throws Exception{
        DaoRol dr = new DaoRol();
        dr.setrol(dr.listAll().getId(Integer.parseInt(obj.get("Rol").toString())));
        List<GrantedAuthority> li = new ArrayList<>();
        li.add(new SimpleGrantedAuthority("ROLE_"+ dr.getrol().getNombre()));
        return li;
    }

    public static void main(String[] args) throws Exception {
        UsuarioServices usr = new UsuarioServices();
       System.out.println( usr.login("Ras77@unl.com", "cigarro"));
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Modulo de clientes
     public void create(@NotEmpty String correo, @NotEmpty String clave, Boolean estado, Integer id_Persona,
            Integer id_rol) throws Exception {
        if (correo.trim().length() > 0 && clave.trim().length() > 0 && estado != null && id_Persona > 0
                && id_rol!=null) {
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);
            du.getUsuario().setEstado(estado);
            du.getUsuario().setId_Persona(id_Persona);
            du.getUsuario().setId_Rol(id_rol);
            if (!du.save()) {
                throw new Exception("Error al guardar datos");
            }
        }
    } 

    public void createUser(@NotEmpty @NotBlank String correo, 
                              @NotEmpty @NotBlank String clave,
                              Boolean estado,
                              @NotNull Integer id_rol,
                              @NotNull Integer id_persona) throws Exception{
        if (correo.trim().length() > 0 && clave != null && estado ==true 
        && id_rol != null && id_persona!= null && id_persona >0 ) {
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);;
            du.getUsuario().setEstado(estado);;
            du.getUsuario().setId_Rol(id_rol);
            du.getUsuario().setId_Persona(id_persona);
            if(du.save()){
             System.out.println("aaaaaaa guardado");
            } else {
                System.out.println("no se guardo");
            }
        }
    }

    public void update(Integer id, @NotEmpty String correo, @NotEmpty String clave, Boolean estado, Integer id_Persona,
             Integer id_rol) throws Exception {
        if (correo.trim().length() > 0 && clave.trim().length() > 0 && estado != null && id_Persona > 0
                && id_rol != null) {
            du.setUsuario(du.listAll().get(id - 1));
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);
            du.getUsuario().setEstado(estado);
            du.getUsuario().setId_Persona(id_Persona);
            //du.getUsuario().setRol(RolEnum.valueOf(rol));
            du.getUsuario().setId_Rol(id_rol);
            if (!du.save()) {
                throw new Exception("Error al actualizar");
            }
        }
    }

    public List<Usuario> listAllUsuario() {
        return Arrays.asList(du.listAll().toArray());
    }

    public List<HashMap<String, Integer>> listRol() {
        DaoRol dr = new DaoRol();
        List<HashMap<String, Integer>> lista = new ArrayList<>();
        for (Rol rol : dr.listAll().toArray()) {
            HashMap<String, Integer> aux = new HashMap<>();
            lista.add(aux);
        }
        return lista;
    }

    public List<HashMap> listPersonaCombo() {
        List<HashMap> lista = new ArrayList<>();
        DaoPersona dp = new DaoPersona();
        if (!dp.listAll().isEmpty()) {
            Persona[] arreglo = dp.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre() + " (" + arreglo[i].getCodIdent() + ")");
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listRolCombo() {
        List<HashMap> lista = new ArrayList<>();
        for (RolEnum rol : RolEnum.values()) {
            HashMap<String, String> aux = new HashMap<>();
            aux.put("value", rol.toString());
            aux.put("label", rol.toString());
            lista.add(aux);
        }
        return lista;
    }

    public List<HashMap> listUsuario()  throws Exception{
        List<HashMap> lista = new ArrayList<>();
        DaoRol dao = new DaoRol();
        if (!du.listAll().isEmpty()) {
            Usuario[] arreglo = du.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                Persona persona = new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1);
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("correo", arreglo[i].getCorreo().toString());
                aux.put("clave", arreglo[i].getClave().toString());
                aux.put("estado", arreglo[i].getEstado().toString());
                aux.put("persona", persona.getNombre() + " " + persona.getApellido());
                aux.put("codIdent",
                        new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getCodIdent());
                aux.put("id_persona",
                        new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getId().toString());
                //aux.put("rol", arreglo[i].getRol().toString());
                aux.put("rol", dao.listAll().getDataId(arreglo[i].getId_Rol()).getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
}
