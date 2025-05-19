package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;
import org.proyecto.nvidiacorp.base.models.Producto;

public class DaoProducto extends AdapterDao<Producto> {
    private Producto obj;

    public DaoProducto() {
        super(Producto.class);

    }

    public Producto getObj() {
        if (obj == null) 
            this.obj = new Producto();
        return obj;
    }

    public void setObj(Producto obj) {
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
        DaoProducto da = new DaoProducto();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setNombre("RTX 3070");
        da.getObj().setDescripcion("Tarjeta grafica de alta gama");
        da.getObj().setPrecio(800.0);
        da.getObj().setId_marca(1);
        da.getObj().setCategoria(CategoriaEnum.ACCESORIOS);
        if (da.save()) {
            System.out.println("Guardado");
        } else {
            System.out.println("Error al guardar");
        }
    }

    
}
