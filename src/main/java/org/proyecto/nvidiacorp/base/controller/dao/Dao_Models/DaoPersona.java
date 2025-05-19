package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.Persona;

public class DaoPersona extends AdapterDao<Persona>{
    private Persona obj;

    public DaoPersona(){
        super(Persona.class);
    }

    public Boolean save(){
        try {
            this.obj.setId(listAll().getLength()+1);
            this.persist(obj);
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

    public Persona getPersona(){
        if(this.obj == null){
            obj = new Persona();
        }
        return this.obj;
    }

    public void setPersona(Persona Persona){
        this.obj = Persona;
    }
}
