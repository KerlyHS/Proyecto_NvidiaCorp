package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import java.util.HashMap;

import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedListNew;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.utils.Utiles_login;
import org.proyecto.nvidiacorp.base.models.Usuario;

public class DaoUsuario extends AdapterDao<Usuario>{
    private Usuario user;
    private static Integer idEstatico = 1;

    public Integer initStatic(){
        for (Usuario u : listAll().toArray()){
            if(u.getId() >= idEstatico){
                idEstatico = u.getId() +1;
            }
        }
        return idEstatico;
    }

        public Boolean save(){
        try {
            this.user.setId(initStatic());
            this.persist(this.user);
            return true;
        } catch (Exception e) {
            System.out.println("Objerto no guardado" + e.getMessage());
            return false;
        }
    }

     public HashMap<String , Object> login (String correo, String clave) throws Exception{
        Utiles_login util = new Utiles_login();
        DaoPersona dp = new DaoPersona();
        DaoRol dr = new DaoRol();
        HashMap<String , AdapterDao> daos = new HashMap<>();
        daos.put("Persona", dp);
        daos.put("Rol", dr);
        if(this.listAll().isEmpty()) throw new Exception("No hay usuarios registrados");
        if(!this.listAll().isEmpty()){
            HashMap<String ,Object> [] array =  util.getHasMap("nombre",util.getAtributos(this.getUser()), this.listAll().quickSort("correo", 1, daos).toArray(), daos).toArray();
            LinkedListNew< HashMap<String ,Object> >listsearch = util.searchL("correo", correo, array);
            if(listsearch.isEmpty() || listsearch.getData(0) == null )  throw new Exception("NO SE ECNOTRO ESA HUEVADA");
            /* for (int i = 0 ; i < listsearch.getSize(); i++){
                System.out.println(listsearch.getData(i).toString() + "<<<<<<<<<<<<<<<<<<<< AQUI");
            } */
            HashMap<String ,Object> search = listsearch.getData(0);
            if (search != null) {
                if((Boolean) search.get("estado")){
                    if (search.get("clave").toString().equals(clave)) {
                                        //System.out.println(  "<<<<<<<<<<<<<<<<<<<< AQUI");
                        return util.createHasMao("id",util.getAtributos(this.getUser()), this.listAll().get((Integer)search.get("id")), daos);
                    } else throw new Exception("Su clave o usuario estan incorrectos");
                }else throw new Exception("Cuenta desactivada"); 
            } else throw new Exception("No se encontro el usuario");
        } else return null;
    } 


    public Boolean updateById(Integer pos){
        try {
            this.update_by_id(user, pos);
            return true;
        } catch (Exception e) {
            System.out.println("Objerto no guardado" + e.getMessage());
            return false;
        }
    }

    public Boolean delete(Integer id){
        try {
            this.deleteById(id);
            return true;
        } catch (Exception e) {
            System.out.println("Objerto no eliminado" + e.getMessage());
            return false;
        }
    }


    public DaoUsuario(){
        super(Usuario.class);
    }

    public Usuario getUser() {
        if (this.user == null) {
            this.user = new Usuario();
            System.out.println("SE CREO UN NUEVO USUARIO VACIO");
        }
        return this.user;
    }

    public void setUser(Usuario user) {
        this.user = user;
    }

    public static void main(String[] args) throws Exception {
        DaoUsuario us = new DaoUsuario();
        us.login("Pizza11@gmail.com", "1245");
    }
}
