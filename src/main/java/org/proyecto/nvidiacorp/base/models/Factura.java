package org.proyecto.nvidiacorp.base.models;

import java.util.Date;


public class Factura {
    private Integer id;
    private Date Fecha;
    private Double SubTotal;
    private Double Total;
    private Boolean Entregado;
    private MetodoPagoEnum MetodoPago;
    private Double Iva;
    private Integer Id_Persona;
    private Integer Id_Orden_Pedido;

    public Integer getId() {
      return id;
    }
    public void setId(Integer id) {
      this.id = id;
    }

    public Date getFecha() {
      return this.Fecha;
    }
    public void setFecha(Date Fecha) {
      this.Fecha = Fecha;
    }

    public Double getSubTotal() {
      return this.SubTotal;
    }
    public void setSubTotal(Double SubTotal) {
      this.SubTotal = SubTotal;
    }

    public Double getTotal() {
        return this.Total;
    }
    public void setTotal(Double Total) {
        this.Total = Total;
    }

    public Boolean getEntregado() {
      return this.Entregado;
    }
    public void setEntregado(Boolean Entregado) {
      this.Entregado = Entregado;
    }

    public MetodoPagoEnum getMetodoPago() {
      return this.MetodoPago;
    }
    public void setMetodoPago(MetodoPagoEnum MetodoPago) {
      this.MetodoPago = MetodoPago;
    }

    public Double getIva() {
      return this.Iva;
    }
    public void setIva(Double Iva) {
      this.Iva = Iva;
    }

    public Integer getId_Persona() {
      return this.Id_Persona;
    }
    public void setId_Persona(Integer value) {
      this.Id_Persona = value;
    }

    public Integer getId_Orden_Pedido() {
      return this.Id_Orden_Pedido;
    }
    public void setId_Orden_Pedido(Integer value) {
      this.Id_Orden_Pedido = value;
    }
}










