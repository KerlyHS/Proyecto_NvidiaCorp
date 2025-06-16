package org.proyecto.nvidiacorp.base.controller.services;

import org.proyecto.nvidiacorp.base.models.Orden_Pedido;

import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.Dao_Orden_Pedido;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@BrowserCallable
@AnonymousAllowed
public class OrdenPedidoService {

    private Dao_Orden_Pedido dao;

    public OrdenPedidoService() {
        dao = new Dao_Orden_Pedido();
    }

    public void createOrdenPedido(@NotNull Integer cantidad, @NotNull Double precioUnitario, @NotNull Integer idProducto) throws Exception {
        if (cantidad > 0 && precioUnitario > 0 && idProducto != null) {
            dao.getObj().setId(dao.listAll().getLength() + 1);
            dao.getObj().setCantidad(cantidad);
            dao.getObj().setPrecioUnitario(precioUnitario);
            dao.getObj().setPrecioTotal(cantidad * precioUnitario);
            dao.getObj().setIdProducto(idProducto);

            if (!dao.save()) {
                throw new Exception("No se pudo guardar la orden de pedido");
            }
        }
    }

    public void updateOrdenPedido(@NotNull Integer id, @NotNull Integer cantidad, @NotNull Double precioUnitario, @NotNull Integer idProducto) throws Exception {
        if (id != null && cantidad > 0 && precioUnitario > 0 && idProducto != null) {
            dao.getObj().setId(id);
            dao.getObj().setCantidad(cantidad);
            dao.getObj().setPrecioUnitario(precioUnitario);
            dao.getObj().setPrecioTotal(cantidad * precioUnitario);
            dao.getObj().setIdProducto(idProducto);

            if (!dao.update(id)) {
                throw new Exception("No se pudo actualizar la orden de pedido");
            }
        }
    }

    public List<Orden_Pedido> listAllOrdenesPedido() {
        return List.of(dao.listAll().toArray());
    }

    public List<HashMap<String, String>> listOrdenesPedido() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        if (!dao.listAll().isEmpty()) {
            for (Orden_Pedido orden : dao.listAll().toArray()) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", orden.getId().toString());
                aux.put("cantidad", orden.getCantidad().toString());
                aux.put("precioUnitario", orden.getPrecioUnitario().toString());
                aux.put("precioTotal", orden.getPrecioTotal().toString());
                aux.put("idProducto", orden.getIdProducto().toString());
                lista.add(aux);
            }
        }
        return lista;
    }
}
