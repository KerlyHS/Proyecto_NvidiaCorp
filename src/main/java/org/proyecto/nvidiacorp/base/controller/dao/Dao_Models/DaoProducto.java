package org.proyecto.nvidiacorp.base.controller.dao.Dao_Models;

import java.util.HashMap;

import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;
import org.proyecto.nvidiacorp.base.models.Producto;

public class DaoProducto extends AdapterDao<Producto> {
    private Producto obj;

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

    public Boolean update(Integer pos) {
        try {
            this.update(obj, obj.getId());
            return true;
        } catch (Exception e) {
            // Log de errores
            return false;
            // TODO: handle exception
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

    public LinkedList<Producto> orderQuickSort (String attribute, Integer type) {
        LinkedList<Producto> lista = listAll();
        lista.quickSort(attribute, type);
        return lista;
    }

        public LinkedList<Producto> busquedaLineal(String attribute, String text, Integer type) throws Exception {
        LinkedList<Producto> lista = listAll();
        return lista.busquedaLineal(attribute, text, type);
    }

    public LinkedList<Producto> busquedaBinaria(String attribute, String text, Integer type) throws Exception {
        LinkedList<Producto> lista = listAll();
        return lista.busquedaBinaria(attribute, text, type);
    }

    public LinkedList<Producto> busquedaLinealBinaria (String attribute, String text, Integer type) throws Exception {
        LinkedList<Producto> lista = listAll();
        return lista.busquedaLinealBinaria(attribute, text, type);
    }
public static void main(String[] args) {
    DaoProducto dao = new DaoProducto();
    try {
        // Mostrar todos los productos
        System.out.println("=== Todos los productos ===");
        LinkedList<Producto> productos = dao.listAll();
        for (int i = 0; i < productos.getLength(); i++) {
            System.out.println(productos.get(i));
        }

        // Prueba de búsqueda lineal
        System.out.println("\n=== Búsqueda lineal por nombre 'rtx' ===");
        LinkedList<Producto> resultadoLineal = dao.busquedaLineal("nombre", "rtx", 0);
        for (int i = 0; i < resultadoLineal.getLength(); i++) {
            System.out.println(resultadoLineal.get(i));
        }

        // Prueba de búsqueda binaria
        System.out.println("\n=== Búsqueda binaria por nombre 'rtx' ===");
        LinkedList<Producto> resultadoBinaria = dao.busquedaBinaria("nombre", "rtx", 0);
        for (int i = 0; i < resultadoBinaria.getLength(); i++) {
            System.out.println(resultadoBinaria.get(i));
        }

        // Prueba de búsqueda combinada
        System.out.println("\n=== Búsqueda linealBinaria por nombre 'rtx' ===");
        LinkedList<Producto> resultadoLinealBinaria = dao.busquedaLinealBinaria("nombre", "rtx", 0);
        for (int i = 0; i < resultadoLinealBinaria.getLength(); i++) {
            System.out.println(resultadoLinealBinaria.get(i));
        }

    } catch (Exception e) {
        e.printStackTrace();
    }
}

}
