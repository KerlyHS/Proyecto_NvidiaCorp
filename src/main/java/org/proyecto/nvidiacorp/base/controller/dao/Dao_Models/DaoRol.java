package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.Rol;

import org.proyecto.nvidiacorp.base.models.Usuario;

public class DaoRol extends AdapterDao<Rol>{
    private Rol rol;

    public DaoRol(){
        super(Rol.class);
    }

    private static Integer idEstatico = 1;

    public Integer initStatic(){
        for (Rol u : listAll().toArray()){
            if(u.getId() >= idEstatico){
                idEstatico = u.getId() +1;
            }
        }
        return idEstatico;
    }

    public Boolean save(){
        try {
            this.rol.setId(initStatic());
            this.persist(this.rol);
            return true;
        } catch (Exception e) {
            System.out.println("Objerto no guardado" + e.getMessage());
            return false;
        }
    }

    public Boolean updateById(Integer pos){
        try {
            this.update_by_id(rol, pos);
            return true;
        } catch (Exception e) {
            System.out.println("Objerto no guardado" + e.getMessage());
            return false;
        }
    }

    public Rol getrol() {
        if (this.rol == null) {
            this.rol = new Rol();
            System.out.println("SE CREO UN NUEVO USUARIO VACIO");
        }
        return this.rol;
    }

    public void setrol(Rol rol) {
        this.rol = rol;
    }

    
    
}
