package org.proyecto.nvidiacorp.base.controller.services;

import org.proyecto.nvidiacorp.base.controller.PagoController; // <--- Importamos el controlador real
import org.proyecto.nvidiacorp.base.models.Pago;
import org.proyecto.nvidiacorp.base.repositories.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import java.util.List;
import java.util.HashMap;

@BrowserCallable
@AnonymousAllowed
@Service
public class PagoServices {

    @Autowired
    private PagoRepository pagoRepository;

    public List<Pago> listAll() {
        return pagoRepository.findAll();
    }

    // CORRECCIÓN: Ahora llamamos al PagoController real
    public HashMap<String, String> checkout(Double monto, String moneda) {
        HashMap<String, String> response = new HashMap<>();
        try {
            // 1. Instanciamos tu controlador que tiene la lógica de conexión HTTP
            PagoController controller = new PagoController();
            
            // 2. Le pedimos un ID real a la API (convertimos Double a float)
            HashMap<String, Object> apiResponse = controller.request(monto.floatValue(), moneda);
            
            // 3. Extraemos el ID y lo mandamos al frontend
            if (apiResponse != null && apiResponse.containsKey("id")) {
                response.put("id", apiResponse.get("id").toString());
            } else {
                response.put("error", "La API no devolvió un ID válido");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Error interno: " + e.getMessage());
        }
        return response;
    }

    public HashMap<String, String> consultarEstadoPago(String checkoutId) {
        HashMap<String, String> response = new HashMap<>();
        try {
            // También usamos el controller para verificar el estado real
            PagoController controller = new PagoController();
            HashMap<String, Object> apiResponse = controller.requestPay(checkoutId);
            
            if (apiResponse != null && apiResponse.containsKey("estado")) {
                response.put("estado", apiResponse.get("estado").toString());
            } else {
                response.put("estado", "false");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("estado", "false");
        }
        return response;
    }

    public List<Pago> search(String criterio, String texto, Integer dummy) {
        return pagoRepository.findAll(); 
    }

    public List<Pago> order(String column, Integer dir) {
        return pagoRepository.findAll(); 
    }
}