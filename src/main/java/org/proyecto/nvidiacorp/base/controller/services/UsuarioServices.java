package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

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

    /*  public void createUser(@NotEmpty @NotBlank String correo, 
                              @NotEmpty @NotBlank String clave,
                              Boolean estado,
                              @NotEmpty @NotBlank String rol,
                              @NotNull Integer id_persona) throws Exception{
        if (correo.trim().length() > 0 && clave != null && estado ==true 
        && rol.trim().length()>0 && id_persona!= null && id_persona >0 ) {
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);;
            du.getUsuario().setEstado(estado);;
            du.getUsuario().setRol(RolEnum.valueOf(rol));
            du.getUsuario().setId_Persona(id_persona);
            if(du.save()){
             System.out.println("aaaaaaa guardado");
            } else {
                System.out.println("no se guardo");
            }
        }
    } */

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

    public HashMap<String , Object> login (@NotEmpty @NotBlank String correo, @NotEmpty @NotBlank String clave) throws Exception{
        HashMap<String ,Object> obj = new HashMap<>();
        try {
            HashMap<String ,Object> aux = du.login(correo, clave);
            if(aux != null) {
                context.setAuthentication(
                    new UsernamePasswordAuthenticationToken(aux.get("correo").toString(), 
                        aux.get("id").toString(),getAuthorities(aux))
                        );
                obj.put("user", context.getAuthentication());
                obj.put("mensaje", "OK");
                obj.put("estado","true");

            }
        } catch (Exception e) {
            obj.put("user", new HashMap<>());
            obj.put("mensaje","Usuario inexistente o credenciales incorrectas");
            obj.put("estado", "false");
            context.setAuthentication(null);
            System.out.println(e);

        }
        return obj;
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

    //MOdulo Login 
    

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
