package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;
import org.proyecto.nvidiacorp.base.models.Producto;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoProducto;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoMarca;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;

import com.github.javaparser.quality.NotNull;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import java.text.SimpleDateFormat;
import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotEmpty;


@BrowserCallable
@AnonymousAllowed
public class ProductoService {
    private DaoProducto db;

    public ProductoService() {
        db = new DaoProducto();
    }

    public void createProducto(@NotEmpty String nombre, @NotEmpty String descripcion,@NotNull Integer id_marca , Double precio , @NotNull CategoriaEnum categoria ) throws Exception {
        if (nombre.trim().length() > 0 && descripcion.trim().length() > 0 && id_marca != null && precio != null && categoria != null) {
            db.getObj().setNombre(nombre);
            db.getObj().setDescripcion(descripcion);
            db.getObj().setId_marca(id_marca);
            db.getObj().setPrecio(precio);
            db.getObj().setCategoria(categoria);   
            if (!db.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public void updateProducto(Integer id, @NotEmpty String nombre,@NotEmpty String descripcion, @ NotNull Integer id_marca ,  Double precio , @NotNull CategoriaEnum categoria) throws Exception {
        if (id != null && id > 0 && nombre.trim().length() > 0 && descripcion.trim().length() > 0 && id_marca != null && precio != null && categoria != null) {
            Producto aux = new Producto();
            aux.setId(id);
            aux.setNombre(nombre);
            aux.setDescripcion(descripcion);
            aux.setId_marca(id_marca);
            aux.setPrecio(precio);
            aux.setCategoria(categoria);
            db.update_by_id(aux , id);
        }
    }
        

    public List<Producto> listAllProducto() {
        return Arrays.asList(db.listAll().toArray());
    }

    public List<HashMap> listAll() {
        List<HashMap> lista = new ArrayList<>();
        if(!db.listAll().isEmpty()){
            Producto[] arreglo = db.listAll().toArray();
            DaoMarca da = new DaoMarca();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", String.valueOf(arreglo[i].getId()));
                aux.put("nombre", arreglo[i].getNombre());
                aux.put("descripcion", arreglo[i].getDescripcion());
                aux.put("marca", da.listAll().get(arreglo[i].getId_marca() - 1).getNombre());
                aux.put("precio", String.valueOf(arreglo[i].getPrecio()));
                aux.put("categoria", arreglo[i].getCategoria().toString());
                lista.add(aux);
            }

        }
        return lista;

}
}
