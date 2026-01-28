package org.proyecto.nvidiacorp.base.models;

import java.util.HashMap;
import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String descripcion;
    private Integer id_marca;
    private Double precio;
    
    @Enumerated(EnumType.STRING)
    private CategoriaEnum categoria;
    private String imagen;
    private Integer stock;          // ← nuevo

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getId_marca() {
        return this.id_marca;
    }

    public void setId_marca(Integer id_marca) {
        this.id_marca = id_marca;
    }

    public Double getPrecio() {
        return this.precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public CategoriaEnum getCategoria() {
        return this.categoria;
    }

    public void setCategoria(CategoriaEnum categoria) {
        this.categoria = categoria;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Integer getStock() {
        return this.stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Producto copy(Producto obj){
        Producto aux = new Producto();
        aux.setId(obj.getId());
        aux.setNombre(obj.getNombre());
        aux.setDescripcion(obj.getDescripcion());
        aux.setId_marca(obj.getId_marca());
        aux.setPrecio(obj.getPrecio());
        aux.setCategoria(obj.getCategoria());
        aux.setImagen(obj.getImagen());
        aux.setStock(obj.getStock());
        return aux;
    }

    public HashMap<String , String> toMap(){
        HashMap<String, String> diccionario = new HashMap<>();
        diccionario.put("id", this.id.toString());  
        diccionario.put("nombre", this.nombre);
        diccionario.put("descripcion", this.descripcion);
        diccionario.put("id_marca", this.id_marca.toString());
        diccionario.put("precio", this.precio.toString());
        diccionario.put("categoria", this.categoria.toString());
        diccionario.put("imagen", this.imagen);
        diccionario.put("stock", this.stock != null ? this.stock.toString() : "0");
        return diccionario;

    }

    @Override
    public String toString() {
        return "Producto{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", id_marca=" + id_marca +
                ", precio=" + precio +
                ", categoria=" + categoria +
                ", imagen='" + imagen + '\'' +
                ", stock=" + stock +
                '}';
    }

}
