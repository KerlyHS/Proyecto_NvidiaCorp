package org.proyecto.nvidiacorp.base.models;

public class Usuario {
    private Integer id;
    private String correo;
    private String clave;
    private Boolean estado;
    //private RolEnum rol;
    private Integer id_Rol;

    public Integer getId_Rol() {
        return this.id_Rol;
    }

    public void setId_Rol(Integer id_Rol) {
        this.id_Rol = id_Rol;
    }
    private Integer id_Persona;


    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCorreo() {
        return this.correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getClave() {
        return this.clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public Boolean isEstado() {
        return this.estado;
    }

    public Boolean getEstado() {
        return this.estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

/*     public RolEnum getRol() {
        return this.rol;
    }

    public void setId_Rol(Integer id_Rol) {
        this.id_Rol = id_Rol;
    }
 */
    public Integer getId_Persona() {
        return this.id_Persona;
    }

    public void setId_Persona(Integer id_Persona) {
        this.id_Persona = id_Persona;
    }
}
