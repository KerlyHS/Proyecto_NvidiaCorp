package org.proyecto.nvidiacorp.base.models;

public class Orden_Pedido {
    private Integer id;
    private Integer Cantidad;
    private Double precioUnitario;
    private Double precioTotal;
    private String Producto;
    private String Cliente;

    //constructor
 /*   public Orden_Pedido() {
        this.id = 0;    
        this.Cantidad = 0;
        this.precioUnitario = 0.0;
        this.precioTotal = 0.0;
        this.Producto = "";
        this.Cliente = "";
    }*/
    //getters and setters

        public Integer getId() {
      return this.id;
    }
    public void setId(Integer value) {
      this.id = value;
    }

    public Integer getCantidad() {
      return this.Cantidad;
    }
    public void setCantidad(Integer value) {
      this.Cantidad = value;
    }

    public Double getPrecioUnitario() {
      return this.precioUnitario;
    }
    public void setPrecioUnitario(Double value) {
      this.precioUnitario = value;
    }

    public Double getPrecioTotal() {
      return this.precioTotal;
    }
    public void setPrecioTotal(Double value) {
      this.precioTotal = value;
    }

    public String getProducto() {
      return this.Producto;
    }
    public void setProducto(String value) {
      this.Producto = value;
    }

    public String getCliente() {
      return this.Cliente;
    }
    public void setCliente(String value) {
      this.Cliente = value;
    }
   /* @Override
    public String toString() {
        return "Orden_Pedido{" +
                "id=" + id +
                ", Cantidad=" + Cantidad +
                ", precioUnitario=" + precioUnitario +
                ", precioTotal=" + precioTotal +
                ", Producto='" + Producto + '\'' +
                ", Cliente='" + Cliente + '\'' +
                '}';
    }   
 */
}
