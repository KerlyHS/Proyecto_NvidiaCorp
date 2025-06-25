package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.proyecto.nvidiacorp.base.models.Producto;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoProducto;
import org.proyecto.nvidiacorp.base.controller.Utiles;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;

import com.github.javaparser.quality.NotNull;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.mappedtypes.Pageable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class ProductoService {
    private DaoProducto db;

    public ProductoService() {
        db = new DaoProducto();
    }

    public void createProducto(@NotEmpty String nombre, @NotEmpty String descripcion, @NotNull Integer id_marca,
            Double precio, @NotNull CategoriaEnum categoria, @NotEmpty String imagen) throws Exception {
        if (nombre.trim().length() > 0 && descripcion.trim().length() > 0 && id_marca != null && precio != null
                && categoria != null && imagen.trim().length() > 0) {
            db.getObj().setNombre(nombre);
            db.getObj().setDescripcion(descripcion);
            db.getObj().setId_marca(id_marca);
            db.getObj().setPrecio(precio);
            db.getObj().setCategoria(categoria);
            db.getObj().setImagen(imagen);
            if (!db.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public void updateProducto(Integer id, @NotEmpty String nombre, @NotEmpty String descripcion,
            @NotNull Integer id_marca, Double precio, @NotNull CategoriaEnum categoria, @NotEmpty String imagen)
            throws Exception {
        if (id != null && id > 0 && nombre.trim().length() > 0 && descripcion.trim().length() > 0 && id_marca != null
                && precio != null && categoria != null && imagen.trim().length() > 0) {
            Producto aux = new Producto();
            aux.setId(id);
            aux.setNombre(nombre);
            aux.setDescripcion(descripcion);
            aux.setId_marca(id_marca);
            aux.setPrecio(precio);
            aux.setCategoria(categoria);
            aux.setImagen(imagen);
            db.update_by_id(aux, id);
        }
    }


        public List<Producto> list(Pageable pageable) {
        return Arrays.asList(db.listAll().toArray());
    }

    public List<Producto> listAll() {
        return (List<Producto>) Arrays.asList(db.listAll().toArray());
    }
        public List<HashMap<String, Object>> busqueda(@NotEmpty @NotBlank String atributo, 
                                            @NotBlank @NotEmpty String valor) throws Exception {
    try {
        // Verificar que tenemos productos
        LinkedList<Producto> productosLista = db.listAll();
        if (productosLista.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Usar una implementación más simple y directa
        List<HashMap<String, Object>> resultados = new ArrayList<>();
        
        for (Producto producto : productosLista.toArray()) {
            HashMap<String, Object> productoMap = new HashMap<>();
            
            // Agregar todos los campos del producto
            productoMap.put("id", producto.getId());
            productoMap.put("nombre", producto.getNombre());
            productoMap.put("descripcion", producto.getDescripcion());
            productoMap.put("precio", producto.getPrecio());
            productoMap.put("categoria", producto.getCategoria());
            productoMap.put("imagen", producto.getImagen());
            productoMap.put("id_marca", producto.getId_marca());
            
            // Filtrar por el atributo y valor especificados
            String valorProducto = getValorAtributo(producto, atributo);
            if (valorProducto != null && valorProducto.toLowerCase().contains(valor.toLowerCase())) {
                resultados.add(productoMap);
            }
        }
        
        return resultados;
        
    } catch (Exception e) {
        System.err.println("Error en búsqueda de productos: " + e.getMessage());
        e.printStackTrace();
        throw new Exception("Error al realizar la búsqueda: " + e.getMessage());
    }
}

// Método auxiliar para obtener el valor de un atributo específico
private String getValorAtributo(Producto producto, String atributo) {
    switch (atributo.toLowerCase()) {
        case "nombre":
            return producto.getNombre();
        case "descripcion":
            return producto.getDescripcion();
        case "precio":
            return producto.getPrecio() != null ? producto.getPrecio().toString() : null;
        case "categoria":
            return producto.getCategoria() != null ? producto.getCategoria().toString() : null;
        default:
            return null;
    }
}
}
