package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.Usuario;

public class DaoUsuario extends AdapterDao<Usuario> {
    private Usuario obj;

    public DaoUsuario(){
        super(Usuario.class);
    }

    public Boolean save(){
        try {
            this.obj.setId(listAll().getLength()+1);
            this.persist(obj);
            this.save();
            return true;
        } catch (Exception e) {
            return false;
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
