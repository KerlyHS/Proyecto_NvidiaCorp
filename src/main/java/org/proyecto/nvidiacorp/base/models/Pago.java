package org.proyecto.nvidiacorp.base.models;

public class Pago {
     private Integer id;
    private Integer nroTransaccion;
    private Boolean estadoP;

    public Boolean getEstadoP() {
        return this.estadoP;
    }

    public void setEstadoP(Boolean estadoP) {
        this.estadoP = estadoP;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getNroTransaccion() {
        return this.nroTransaccion;
    }

    public void setNroTransaccion(Integer nroTransaccion) {
        this.nroTransaccion = nroTransaccion;
    }

}