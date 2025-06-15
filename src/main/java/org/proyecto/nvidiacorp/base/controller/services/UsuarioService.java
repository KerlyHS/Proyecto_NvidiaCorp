package org.proyecto.nvidiacorp.base.controller.services;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.*;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.models.RolEnum;
import org.proyecto.nvidiacorp.base.models.Usuario;
import org.proyecto.nvidiacorp.base.controller.utils.Utiles_login;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed

public class UsuarioService {
    private DaoUsuario du;

    public UsuarioService(){
        du = new DaoUsuario();
    }

    public List<Usuario> listUsers(){
        return Arrays.asList(du.listAll().toArray());
    }

    public void createUser(@NotEmpty @NotBlank String correo, 
                              @NotEmpty @NotBlank String clave,
                              Boolean estado,
                              @NotEmpty @NotBlank String rol,
                              @NotNull Integer id_persona) throws Exception{
        if (correo.trim().length() > 0 && clave != null && estado ==true 
        && rol.trim().length()>0 && id_persona!= null && id_persona >0 ) {
            du.getUser().setCorreo(correo);
            du.getUser().setClave(clave);;
            du.getUser().setEstado(estado);;
            du.getUser().setRol(RolEnum.valueOf(rol));
            du.getUser().setId_Persona(id_persona);
            if(du.save()){
             System.out.println("aaaaaaa guardado");
            } else {
                System.out.println("no se guardo");
            }
        }
    }

    public HashMap<String , Object> login (@NotEmpty @NotBlank String correo, @NotEmpty @NotBlank String clave) throws Exception{
        Utiles_login util = new Utiles_login();
        DaoPersona dp = new DaoPersona();
        HashMap<String , AdapterDao> daos = new HashMap<>();
        daos.put("persona", dp);
        if(du.listAll().isEmpty()) throw new Exception("No hay usuarios registrados");
        if(!du.listAll().isEmpty()){
            HashMap<String ,Object> [] array =  util.getHasMap(util.getAtributos(du.getUser()), du.listAll().quickSort("correo", 1, daos).toArray(), daos).toArray();
            LinkedList< HashMap<String ,Object> >listsearch = util.searchL("correo", correo, array);
            if(listsearch.isEmpty() || listsearch.get(0) == null )  throw new Exception("NO SE ECNOTRO ESA HUEVADA");
            /* for (int i = 0 ; i < listsearch.getSize(); i++){
                System.out.println(listsearch.getData(i).toString() + "<<<<<<<<<<<<<<<<<<<< AQUI");
            } */
            HashMap<String ,Object> search = listsearch.get(0);
            if (search != null) {
                if((Boolean) search.get("estado")){
                    if (search.get("clave").toString().equals(clave)) {
                                        //System.out.println(  "<<<<<<<<<<<<<<<<<<<< AQUI");

                        return util.createHasMao(util.getAtributos(du.getUser()), search, daos);
                    } else throw new Exception("Su clave o usuario estan incorrectos");
                }else throw new Exception("Cuenta desactivada"); 
            } else throw new Exception("No se encontro el usuario");
        } else return null;
    } 

    public static void main(String[] args) throws Exception{
        UsuarioService user = new UsuarioService();
        System.out.println(        user.login("Arroz78@gmail.com", "Caramelo"));
    }
}
