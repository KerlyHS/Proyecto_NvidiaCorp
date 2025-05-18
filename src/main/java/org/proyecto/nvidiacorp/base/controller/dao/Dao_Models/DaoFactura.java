
package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;
import org.proyecto.nvidiacorp.base.models.Factura;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.MetodoPagoEnum;


public class DaoFactura extends AdapterDao<Factura> {
    private Factura obj;

    public DaoFactura() {
        super(Factura.class);

    }

    public Factura getObj() {
        if (obj == null) 
            this.obj = new Factura();
        return obj;
    }

    public void setObj(Factura obj) {
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
        DaoFactura da = new DaoFactura();
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
    }
 }
    