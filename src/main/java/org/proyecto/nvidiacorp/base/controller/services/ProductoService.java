package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.proyecto.nvidiacorp.base.models.Producto;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoProducto;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;
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

    public void createProducto(String nombre, String descripcion, Integer id_marca,
            Double precio, CategoriaEnum categoria, String imagen, Integer stock) throws Exception {
        if (nombre.trim().length() > 0 && descripcion.trim().length() > 0 && id_marca != null && precio != null
                && categoria != null && imagen.trim().length() > 0) {
            db.getObj().setNombre(nombre);
            db.getObj().setDescripcion(descripcion);
            db.getObj().setId_marca(id_marca);
            db.getObj().setPrecio(precio);
            db.getObj().setCategoria(categoria);
            db.getObj().setImagen(imagen);
            db.getObj().setStock(stock);
            if (!db.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public void updateProducto(Integer id, String nombre, String descripcion,
            Integer id_marca, Double precio, CategoriaEnum categoria, String imagen, Integer stock)
            throws Exception {
        if (id != null && id > 0 && nombre.trim().length() > 0 && descripcion.trim().length() > 0 && id_marca != null
                && precio != null && categoria != null && imagen.trim().length() > 0) {
            Producto p = new Producto();
            p.setId(id);
            p.setNombre(nombre);
            p.setDescripcion(descripcion);
            p.setId_marca(id_marca);
            p.setPrecio(precio);
            p.setCategoria(categoria);
            p.setImagen(imagen);
            p.setStock(stock);
            db.setObj(p);
            if (!db.update(id))
                throw new Exception("No se pudo actualizar producto");
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
            LinkedList<Producto> productosLista = db.listAll();
            if (productosLista.isEmpty()) {
                return new ArrayList<>();
            }
            List<HashMap<String, Object>> resultados = new ArrayList<>();

            for (Producto producto : productosLista.toArray()) {
                HashMap<String, Object> productoMap = new HashMap<>();
                productoMap.put("id", producto.getId());
                productoMap.put("nombre", producto.getNombre());
                productoMap.put("descripcion", producto.getDescripcion());
                productoMap.put("precio", producto.getPrecio());
                productoMap.put("categoria", producto.getCategoria());
                productoMap.put("imagen", producto.getImagen());
                productoMap.put("id_marca", producto.getId_marca());
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

    public void reduceStock(Integer idProducto, Integer cantidad) throws Exception {
        List<Producto> lista = Arrays.asList((Producto[]) db.listAll().toArray());
        for (Producto p : lista) {
            if (p.getId().equals(idProducto)) {
                int nuevo = (p.getStock() != null ? p.getStock() : 0) - cantidad;
                p.setStock(Math.max(nuevo, 0));
                db.setObj(p);
                if (!db.update(idProducto))
                    throw new Exception("No se pudo reducir stock");
                return;
            }
        }
    }
}
