package org.proyecto.nvidiacorp.base.models;

import jakarta.persistence.*;

@Entity
@Table(name = "personas")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;

    @Enumerated(EnumType.STRING)
    private IdentificacionEnum identificacion; // Tipo (Cédula/RUC)

    private Integer edad;

    @Column(nullable = false, unique = true) // <--- IMPORTANTE: Esto evita cédulas repetidas
    private String codIdent; // Tu campo para el número (en String)

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

    public String getApellido() {
        return this.apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return this.direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public IdentificacionEnum getIdentificacion() {
        return this.identificacion;
    }

    public void setIdentificacion(IdentificacionEnum identificacion) {
        this.identificacion = identificacion;
    }

    public Integer getEdad() {
        return this.edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public String getCodIdent() {
        return this.codIdent;
    }

    public void setCodIdent(String codIdent) {
        this.codIdent = codIdent;
    }
}
