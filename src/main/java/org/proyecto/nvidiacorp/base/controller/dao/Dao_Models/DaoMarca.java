package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.Marca;


public class DaoMarca extends AdapterDao<Marca> {
    private Marca obj;

    public DaoMarca() {
        super(Marca.class);

    }

    public Marca getObj() {
        if (obj == null) 
            this.obj = new Marca();
        return obj;
    }

    public void setObj(Marca obj) {
        this.obj = obj;
    }
    public Boolean save (){
        try {
            obj.setId(listAll ().getLength()+1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }  

    }
    public Boolean update(Integer pos) {
        try {
            this.update(obj ,obj.getId());
            return true;
        } catch (Exception e) {
            //Log de errores
            return false;
            // TODO: handle exception
        }
    }

    public static void main(String[] args) {
        DaoMarca da = new DaoMarca();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setNombre("NVIDIA");
        if (da.save()) {
            System.out.println("Guardado");
        } else {
            System.out.println("Error al guardar");
        }
    }
}
