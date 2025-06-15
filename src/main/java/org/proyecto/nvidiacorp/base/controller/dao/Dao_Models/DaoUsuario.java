package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
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

    
}
