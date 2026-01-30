package org.proyecto.nvidiacorp.base.controller.services;

import org.proyecto.nvidiacorp.base.models.Producto;
import org.proyecto.nvidiacorp.base.models.CategoriaEnum;
import org.proyecto.nvidiacorp.base.repositories.ProductoRepository;
import org.proyecto.nvidiacorp.base.repositories.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import java.util.List;
import java.util.stream.Collectors;

@BrowserCallable
@AnonymousAllowed
@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private MarcaRepository marcaRepository;

    // 1. Creamos una clase interna que extiende tu Modelo original.
    // Esto respeta tu regla de NO tocar el archivo Producto.java
    public static class ProductoDTO extends Producto {
        private String marcaNombre;
        
        public String getMarcaNombre() { return marcaNombre; }
        public void setMarcaNombre(String marcaNombre) { this.marcaNombre = marcaNombre; }
        
        // Constructor para copiar datos del modelo original
        public ProductoDTO(Producto p, String nombreMarca) {
            this.setId(p.getId());
            this.setNombre(p.getNombre());
            this.setDescripcion(p.getDescripcion());
            this.setId_marca(p.getId_marca());
            this.setPrecio(p.getPrecio());
            this.setCategoria(p.getCategoria());
            this.setImagen(p.getImagen());
            this.setStock(p.getStock());
            this.marcaNombre = nombreMarca;
        }
    }

    // 2. Cambiamos el retorno de HashMap a List<ProductoDTO>
    public List<ProductoDTO> listAllProductos() {
        return productoRepository.findAll().stream().map(p -> {
            String nombreMarca = "General";
            if (p.getId_marca() != null) {
                nombreMarca = marcaRepository.findById(p.getId_marca())
                    .map(m -> m.getNombre())
                    .orElse("General");
            }
            return new ProductoDTO(p, nombreMarca);
        }).collect(Collectors.toList());
    }

    // CAMBIO CLAVE: Recibir CategoriaEnum obliga a Hilla a generar el archivo TS
    public void createProducto(String nombre, String descripcion, Integer id_marca, 
                               Double precio, CategoriaEnum categoria, 
                               String imagen, Integer stock) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setId_marca(id_marca);
        p.setPrecio(precio);
        p.setImagen(imagen);
        p.setStock(stock != null ? stock : 0);
        p.setCategoria(categoria);
        productoRepository.save(p);
    }

    public void updateProducto(Integer id, String nombre, String descripcion, 
                               Integer id_marca, Double precio, 
                               CategoriaEnum categoria, 
                               String imagen, Integer stock) throws Exception {
        Producto p = productoRepository.findById(id).orElseThrow(() -> new Exception("Producto no encontrado"));
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setId_marca(id_marca);
        p.setPrecio(precio);
        p.setStock(stock);
        if (imagen != null && !imagen.isEmpty()) p.setImagen(imagen);
        p.setCategoria(categoria);
        
        productoRepository.save(p);
    }

    public void reduceStock(Integer id, Integer cantidad) throws Exception {
    Producto p = productoRepository.findById(id).orElseThrow(() -> new Exception("No encontrado"));
    int nuevoStock = p.getStock() != null ? p.getStock() - cantidad : 0;
    p.setStock(nuevoStock < 0 ? 0 : nuevoStock);
    productoRepository.save(p);
    }

public List<ProductoDTO> busqueda(String atributo, String valor) {
        List<Producto> productosLista = productoRepository.findAll();
        
        return productosLista.stream()
            .filter(producto -> {
                if (valor == null || valor.trim().isEmpty()) return true;
                
                String valorProducto = getValorAtributo(producto, atributo);
                return valorProducto != null && valorProducto.toLowerCase().contains(valor.toLowerCase());
            })
            .map(p -> {
                String nombreMarca = "General";
                if (p.getId_marca() != null) {
                    nombreMarca = marcaRepository.findById(p.getId_marca())
                        .map(m -> m.getNombre())
                        .orElse("General");
                }
                return new ProductoDTO(p, nombreMarca);
            })
            .collect(Collectors.toList());
    }

    private String getValorAtributo(Producto producto, String atributo) {
        if (atributo == null) return null;
        switch (atributo.toLowerCase()) {
            case "nombre": return producto.getNombre();
            case "descripcion": return producto.getDescripcion();
            case "precio": return producto.getPrecio() != null ? producto.getPrecio().toString() : null;
            case "categoria": return producto.getCategoria() != null ? producto.getCategoria().toString() : null;
            default: return null;
        }
    }
}