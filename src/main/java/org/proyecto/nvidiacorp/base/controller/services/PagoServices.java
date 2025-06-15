package org.proyecto.nvidiacorp.base.controller.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.controller.PagoController;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoPago;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class PagoServices {

    private DaoPago db;

    public PagoServices() {
        db = new DaoPago();
    }

    public void create(Integer nroTansaccion, Boolean estadoP) throws Exception {
        if (nroTansaccion != null && nroTansaccion > 0 && estadoP != null) {
            db.getObj().setNroTransaccion(nroTansaccion);
            db.getObj().setEstadoP(estadoP);
            if (!db.save()) {
                throw new Exception("No se pudo guardar los datos de Pago");
            }
        } else {
            throw new Exception("Datos incompletos para crear el pago");
        }
    }

    public void update(Integer id, Integer nroTansaccion, Boolean estadoP) throws Exception {
        if (id != null && nroTansaccion != null && nroTansaccion > 0 && estadoP != null) {
            db.setObj(db.listAll().get(id));
            db.getObj().setNroTransaccion(nroTansaccion);
            db.getObj().setEstadoP(estadoP);
            if (!db.update(id)) {
                throw new Exception("No se pudo guardar los datos de Pago");
            }
        } else {
            throw new Exception("Datos incompletos para actualizar el pago");
        }
    }

    public List<HashMap> listAll() throws Exception {
        return Arrays.asList(db.all().toArray());
    }

    public List<HashMap> order(String attribute, Integer type) throws Exception {
        return Arrays.asList(db.orderByPago(type, attribute).toArray());
    }

    public List<HashMap> search(String attribute, String text, Integer type) throws Exception {
        LinkedList<HashMap<String, Object>> lista = db.search(attribute, text, type);
        if (!lista.isEmpty()) {
            return Arrays.asList(lista.toArray());
        } else {
            return new ArrayList<>();
        }
    }

    public void crearPago(Boolean estado) throws Exception {
        System.out.println("Llamada a crearPago estado=" + estado);
        if (estado == null) {
            throw new Exception("Datos incompletos para crear el pago");
        }
        int nroTransaccion = db.listAll().getLength() + 1;
        org.proyecto.nvidiacorp.base.models.Pago nuevoPago = new org.proyecto.nvidiacorp.base.models.Pago();
        nuevoPago.setNroTransaccion(nroTransaccion);
        nuevoPago.setEstadoP(estado);
        db.setObj(nuevoPago);
        if (!db.save()) {
            throw new Exception("No se pudo guardar el pago");
        }
    }

    public Map<String, Object> checkout(float total, String currency) {
        try {
            HashMap<String, Object> response = new PagoController().request(total, currency);
            System.out.println("Respuesta checkout backend: " + response);
            return response;
        } catch (Exception e) {
            return Map.of("estado", "false", "error", e.getMessage());
        }
    }

    public HashMap<String, Object> consultarEstadoPago(String idCheckout) throws IOException {
        PagoController pagoControl = new PagoController();
        return pagoControl.requestPay(idCheckout);
    }

}