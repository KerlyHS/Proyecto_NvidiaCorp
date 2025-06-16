package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.proyecto.nvidiacorp.base.models.Producto;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoProducto;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;

import com.github.javaparser.quality.NotNull;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.mappedtypes.Pageable;

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


    public List<Producto> order(String atributo, Integer type) {
        return Arrays.asList(db.orderQuickSort(atributo, type).toArray());
    }

    // Metodo de busqueda   
public List<Producto> busqueda(String attribute, String text, Integer type) throws Exception {
    LinkedList<Producto> lista = db.busquedaLinealBinaria(attribute, text, type);
    if (!lista.isEmpty()) {
        return Arrays.asList(lista.toArray());
    } else {
        return new ArrayList<>();
    }
}
}
