
package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;
import org.proyecto.nvidiacorp.base.models.Orden_Pedido;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;


public class Dao_Orden_Pedido extends AdapterDao<Orden_Pedido> {
    private Orden_Pedido obj;

    public Dao_Orden_Pedido() {
        super(Orden_Pedido.class);

    }

    public Orden_Pedido getObj() {
        if (obj == null) 
            this.obj = new Orden_Pedido();
        return obj;
    }

    public void setObj(Orden_Pedido obj) {
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
/*
     public static void main(String[] args) {
        Dao_Orden_Pedido da = new Dao_Orden_Pedido();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setFecha(new java.util.Date());
        da.getObj().setSubTotal(100.0);
        da.getObj().setTotal(100.0);
        da.getObj().setEntregado(true);
        da.getObj().setMetodoPago(MetodoPagoEnum.valueOf("TARJETA"));
        da.getObj().setIva(0.15);
        if (da.save()) {
            System.out.println("Guardado");
        } else {
            System.out.println("Error al guardar");
        }
    }*/

}
