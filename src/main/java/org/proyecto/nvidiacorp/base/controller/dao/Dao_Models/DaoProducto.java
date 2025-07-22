package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import java.io.FileWriter;
import java.util.HashMap;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.Utiles;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;
import org.proyecto.nvidiacorp.base.models.Producto;

import com.google.gson.Gson;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public class DaoProducto extends AdapterDao<Producto> {
    private Producto obj;
    private Producto producto;

    public DaoProducto() {
        super(Producto.class);

    }

    public Producto getObj() {
        if (obj == null)
            this.obj = new Producto();
        return obj;
    }

    public void setObj(Producto obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            LinkedList<Producto> lista = listAll();
            int maxId = 0;
            for (int i = 0; i < lista.getLength(); i++) {
                int idActual = lista.get(i).getId();
                if (idActual > maxId) {
                    maxId = idActual;
                }
            }
            obj.setId(maxId + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            // TODO
            return false;
        }
    }

    public Boolean update(Integer id) {
        try {
            LinkedList<Producto> lista = listAll();
            boolean actualizado = false;

            // Busca el producto por id y actualiza sus datos
            for (int i = 0; i < lista.getLength(); i++) {
                Producto p = lista.get(i);
                if (p.getId().equals(id)) {
                    lista.set(i, obj); // obj es el producto actualizado
                    actualizado = true;
                    break;
                }
            }

            if (!actualizado)
                return false;

            // Guarda la lista actualizada en el archivo JSON
            Gson gson = new Gson();
            try (FileWriter writer = new FileWriter("data/Producto.json")) {
                Producto[] arreglo = lista.toArray();
                gson.toJson(arreglo, writer);
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private HashMap<String, String> toDict(Producto arreglo) throws Exception {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", arreglo.getId().toString());
        aux.put("nombre", arreglo.getNombre());
        aux.put("descripcion", arreglo.getDescripcion());
        aux.put("precio", arreglo.getPrecio().toString());
        aux.put("categoria", arreglo.getCategoria().toString());
        return aux;
    }

    public LinkedList<HashMap<String, String>> all() throws Exception {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Producto[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public Producto getProducto() {
        if (producto == null) {
            producto = new Producto();
        }
        return this.producto;
    }
}

