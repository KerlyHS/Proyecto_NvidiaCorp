package org.proyecto.nvidiacorp.base.controller.services;

import org.proyecto.nvidiacorp.base.models.Factura;
import org.proyecto.nvidiacorp.base.models.MetodoPagoEnum;
import org.proyecto.nvidiacorp.base.repositories.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import java.util.Date;
import java.util.List;

@BrowserCallable
@AnonymousAllowed
@Service
public class FacturaServices {

    @Autowired
    private FacturaRepository facturaRepository;

    public void createFactura(Date fecha, double subTotal, double total, 
                              Boolean entregado, MetodoPagoEnum metodoPago, 
                              double iva, Integer idPersona) {
        Factura f = new Factura();
        f.setFecha(fecha);
        f.setSubTotal(subTotal);
        f.setTotal(total);
        f.setEntregado(entregado);
        f.setIva(iva);
        f.setId_Persona(idPersona); 
        f.setMetodoPago(metodoPago);

        facturaRepository.save(f);
    }

    public List<Factura> listAllFactura() {
        return facturaRepository.findAll();
    }
}