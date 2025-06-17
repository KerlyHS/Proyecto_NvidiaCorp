package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.*;
import org.proyecto.nvidiacorp.base.models.RolEnum;
import org.proyecto.nvidiacorp.base.models.Usuario;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.proyecto.nvidiacorp.base.controller.utils.Utiles_login;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@BrowserCallable
@AnonymousAllowed

public class UsuarioService {
     private DaoUsuario du;
    private SecurityContext context;
    

    public UsuarioService(){
        du = new DaoUsuario();
        context = SecurityContextHolder.getContext();
    }

    public List<String> listRoles(){
        List<String> lista = new ArrayList<>();
        for(RolEnum r : RolEnum.values()){
            lista.add(r.toString());
        }
        return lista;
    }

    public HashMap<String, String> createRol(){
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

     public void createUser(@NotEmpty @NotBlank String correo, 
                              @NotEmpty @NotBlank String clave,
                              Boolean estado,
                              @NotNull Integer id_rol,
                              @NotNull Integer id_persona) throws Exception{
        if (correo.trim().length() > 0 && clave != null && estado ==true 
        && id_rol != null && id_persona!= null && id_persona >0 ) {
            du.getUser().setCorreo(correo);
            du.getUser().setClave(clave);;
            du.getUser().setEstado(estado);;
            du.getUser().setId_Rol(id_rol);
            du.getUser().setId_Persona(id_persona);
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
            obj.put("mensaje",e.getMessage());
            obj.put("estado", "false");
            context.setAuthentication(null);
            System.out.println(e);

        }
        return obj;
    }

    public static List<GrantedAuthority> getAuthorities(HashMap<String , Object> obj)throws Exception{
        Utiles_login util = new Utiles_login();
        DaoRol dr = new DaoRol();
        dr.setrol(dr.listAll().get(Integer.parseInt(obj.get("Rol").toString())));
        List<GrantedAuthority> li = new ArrayList<>();
        li.add(new SimpleGrantedAuthority("ROLE_"+ dr.getrol().getNombre()));
        return li;
    }

    public static void main(String[] args) throws Exception {
        UsuarioService usr = new UsuarioService();
       System.out.println( usr.login("Sas44@unl.com", "222345"));
    }
}
