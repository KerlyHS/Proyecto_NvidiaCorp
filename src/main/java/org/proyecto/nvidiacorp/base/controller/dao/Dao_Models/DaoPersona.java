package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.Persona;

public class DaoPersona extends AdapterDao<Persona> {
    private Persona obj;
    private static Integer idEstatico = 1;

    public Integer initStatic(){
        for (Persona u : listAll().toArray()){
            if(u.getId() >= idEstatico){
                idEstatico = u.getId() +1;
            }
        }
        return idEstatico;
    }

        public Boolean save(){
        try {
            this.obj.setId(initStatic());
            this.persist(this.obj);
            return true;
        } catch (Exception e) {
            System.out.println("Objerto no guardado" + e.getMessage());
            return false;
        }
    }

    public Boolean updateById(Integer pos){
        try {
            this.update_by_id(obj, pos);
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


    public DaoPersona(){
        super(Persona.class);
    }

    public Persona getobj() {
        if (this.obj == null) {
            this.obj = new Persona();
            System.out.println("SE CREO UN NUEVO Persona VACIO");
        }
        return this.obj;
    }

    public void setobj(Persona obj) {
        this.obj = obj;
    }

}
