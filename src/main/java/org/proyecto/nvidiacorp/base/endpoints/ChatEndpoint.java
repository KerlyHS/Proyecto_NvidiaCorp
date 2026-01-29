package org.proyecto.nvidiacorp.base.endpoints;

import org.proyecto.nvidiacorp.base.controller.services.GeminiService;
import org.proyecto.nvidiacorp.base.controller.services.ProductoService;
import org.proyecto.nvidiacorp.base.controller.services.ProductoService.ProductoDTO;
import org.proyecto.nvidiacorp.base.models.Producto;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@BrowserCallable
@AnonymousAllowed
public class ChatEndpoint {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ProductoService productoService; // Inyectamos tu servicio de base de datos

    public String getAsistencia(String mensaje) {
        // CAMBIO 1: Usa ProductoDTO y el nombre de método correcto
        List<ProductoDTO> listaProductos = productoService.listAllProductos();

        StringBuilder contexto = new StringBuilder("Catálogo actual de NvidiaCorp:\n");
        for (ProductoDTO p : listaProductos) { // CAMBIO 2: ProductoDTO aquí también
            contexto.append(String.format("- ID: %d | %s | Marca: %s | Precio: $%.2f | Cat: %s\n",
                    p.getId(), p.getNombre(), p.getMarcaNombre(), p.getPrecio(), p.getCategoria()));
        }
        String promptFinal = "Eres el Asistente Experto de NvidiaCorp. Tu objetivo es asesorar al cliente.\n" +
                "REGLAS:\n" +
                "1. Usa el contexto de productos abajo para dar specs y precios.\n" +
                "2. Si el usuario quiere comprar o dice 'añade esto', responde confirmando y añade al FINAL de tu respuesta: [ADD_TO_CART:ID]\n"
                +
                "3. Mantén un tono profesional y tecnológico (usa el color verde Nvidia en tus descripciones).\n" +
                "4. Si preguntan por Transformadas de Laplace o ingeniería, ayuda con cálculos precisos.\n\n" +
                contexto.toString() + "\n\nPregunta del cliente: " + mensaje;

        return geminiService.consultarIA(promptFinal);
    }
}