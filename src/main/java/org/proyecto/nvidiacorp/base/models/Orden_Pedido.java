package org.proyecto.nvidiacorp.base.models;

public class Orden_Pedido {
    private Integer id;
    private Integer cantidad;
    private Double precioUnitario;
    private Double precioTotal;
    private Integer idProducto;
    

    public Integer getId() {
      return this.id;
    }
    public void setId(Integer id) {
      this.id = id;
    }

    public Integer getCantidad() {
      return this.cantidad;
    }
    public void setCantidad(Integer cantidad) {
      this.cantidad = cantidad;
    }

    public Double getPrecioUnitario() {
      return this.precioUnitario;
    }
    public void setPrecioUnitario(Double precioUnitario) {
      this.precioUnitario = precioUnitario;
    }

    public Double getPrecioTotal() {
      return this.precioTotal;
    }
    public void setPrecioTotal(Double precioTotal) {
      this.precioTotal = precioTotal;
    }

    public Integer getIdProducto() {
      return this.idProducto;
    }
    public void setIdProducto(Integer idProducto) {
      this.idProducto = idProducto;
    }
}
