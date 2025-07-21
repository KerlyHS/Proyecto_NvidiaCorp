package org.proyecto.nvidiacorp.base.controller.services;
import org.proyecto.nvidiacorp.base.models.Factura;
import org.proyecto.nvidiacorp.base.models.MetodoPagoEnum;
import org.proyecto.nvidiacorp.base.models.Transaccion;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List; 


import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.micrometer.common.lang.NonNull;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoFactura;

import jakarta.validation.constraints.NotEmpty;


@BrowserCallable
@AnonymousAllowed
public class FacturaServices {
    private DaoFactura da;
    public FacturaServices(){
        da = new DaoFactura();
    }

    public void createFactura(@NonNull Date fecha,@NotEmpty double SubTotal,@NotEmpty double Total,@NotEmpty Boolean Entregado,@NotEmpty String MetodoPago,@NotEmpty double Iva )throws Exception {
        if ( fecha.toString().length() > 0 && SubTotal > 0 && Total > 0 && Entregado != null && MetodoPago.length() > 0 && Iva > 0) {
            da.getObj().setId(da.listAll().getLength() + 1);
            da.getObj().setFecha(fecha);
            da.getObj().setSubTotal(SubTotal);
            da.getObj().setTotal(Total);
            da.getObj().setEntregado(Entregado);
            da.getObj().setMetodoPago(MetodoPagoEnum.valueOf(MetodoPago));
            da.getObj().setIva(Iva);

            if (da.save()) {
                System.out.println("Guardado");
            } else {
                System.out.println("Error al guardar");
            
        }
            if(!da.save())
                throw new  Exception("No se pudo guardar los datos de la Cancion");
        }
    }
    public void updateFactura(@NonNull Date fecha,@NotEmpty double SubTotal,@NotEmpty double Total,@NotEmpty Boolean Entregado,@NotEmpty String MetodoPago,@NotEmpty double Iva )throws Exception {
        if ( fecha.toString().length() > 0 && SubTotal > 0 && Total > 0 && Entregado != null && MetodoPago.length() > 0 && Iva > 0) {
            da.getObj().setId(da.listAll().getLength() + 1);
            da.getObj().setFecha(fecha);
            da.getObj().setSubTotal(SubTotal);
            da.getObj().setTotal(Total);
            da.getObj().setEntregado(Entregado);
            da.getObj().setMetodoPago(MetodoPagoEnum.valueOf(MetodoPago));
            da.getObj().setIva(Iva);
            if (da.update(da.getObj().getId())) {
                System.out.println("Actualizado");
            } else {
                System.out.println("Error al actualizar");
            
        }
            if(!da.update(da.getObj().getId()))
                throw new  Exception("No se pudo actualizar los datos de la factura");
        }
    }
    
    public List<Factura> listAllFactura(){
        return Arrays.asList(da.listAll().toArray());
    }


     public List <HashMap> listFactura(){
         List<HashMap> lista = new ArrayList<>();
        if (!da.listAll().isEmpty()) {
            
            Factura[] arreglo=da.listAll().toArray();
            
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString());
                aux.put("fecha", arreglo[i].getFecha().toString());
                aux.put("subtotal", arreglo[i].getSubTotal().toString());
                aux.put("total", arreglo[i].getTotal().toString());
                aux.put("entregado", arreglo[i].getEntregado().toString());
                aux.put("metodoPago", arreglo[i].getMetodoPago().toString());
                aux.put("iva", arreglo[i].getIva().toString());
                aux.put("idPersona", arreglo[i].getId_Persona().toString());
                
                
                

                lista.add(aux);
        }
    }
        return lista;
     }

     
}
