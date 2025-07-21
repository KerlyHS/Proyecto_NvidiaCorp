package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import java.util.HashMap;

import org.proyecto.nvidiacorp.base.controller.Utiles;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.Usuario;

public class DaoUsuario extends AdapterDao<Usuario> {
    private Usuario obj;

    public DaoUsuario(){
        super(Usuario.class);
    }

     public HashMap<String , Object> login (String correo, String clave) throws Exception{
        Utiles util = new Utiles();
        DaoPersona dp = new DaoPersona();
        DaoRol dr = new DaoRol();
        HashMap<String , AdapterDao> daos = new HashMap<>();
        daos.put("Persona", dp);
        daos.put("Rol", dr);
        if(this.listAll().isEmpty()) throw new Exception("No hay usuarios registrados");
        if(!this.listAll().isEmpty()){
            HashMap<String ,Object> [] array =  util.getHasMap("nombre",util.getAtributos(this.getUsuario()), this.listAll().quickSort("correo", 1, daos).toArray(), daos).toArray();
            LinkedList< HashMap<String ,Object> >listsearch = util.searchL("correo", correo, array);
            if(listsearch.isEmpty() || listsearch.get(0) == null )  throw new Exception("NO SE ECNOTRO ESA HUEVADA");
            /* for (int i = 0 ; i < listsearch.getSize(); i++){
                System.out.println(listsearch.get(i).toString() + "<<<<<<<<<<<<<<<<<<<< AQUI");
            } */
            HashMap<String ,Object> search = listsearch.get(0);
            //System.out.println(this.listAll().getId((Integer) search.get("id")).getCorreo() + "<<<<<<<<<<<<<<<<<<<<<<<<<<");
            if (search != null) {
                if((Boolean) search.get("estado")){
                    if (search.get("clave").toString().equals(clave)) {
                        Object data = this.listAll().get((Integer) search.get("id"));
                        //System.out.println("dsdfasddadad"+util.createHasMao("id",util.getAtributos(this.getUsuario()), data, daos));
                        HashMap<String ,Object> aux = util.createHasMao("id",util.getAtributos(this.getUsuario()),data, daos);
                        Object c = aux.remove("clave");
                        System.out.println(aux);
                        return aux;
                    } else throw new Exception("Su clave o usuario estan incorrectos");
                }else throw new Exception("Cuenta desactivada"); 
            } else throw new Exception("No se encontro el usuario");
        } else return null;
    }

    public Boolean save(){
        try {
            obj.setId(listAll().getLength() + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            // Log de errores
            e.printStackTrace();
            System.out.println(e);
            return false;
            // TODO: handle exception
        }
    }

    public Boolean update(Integer pos){
        try {
            this.update(obj,pos);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Usuario getUsuario(){
        if(this.obj == null){
            obj = new Usuario();
        }
        return this.obj;
    }

    public void setUsuario(Usuario usuario){
        this.obj = usuario;
    }
}
