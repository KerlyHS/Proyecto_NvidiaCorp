package org.proyecto.nvidiacorp.base.models;

import jakarta.persistence.*; // <--- 1. IMPORTAR ESTO ES VITAL

@Entity // <--- 2. Esto le dice a Java: "Crea una tabla para esta clase"
@Table(name = "usuarios") // <--- 3. (Opcional) Nombre que tendrá en MariaDB
public class Usuario {

    @Id // <--- 4. Esto dice: "Esta es la llave primaria"
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <--- 5. Esto dice: "Autoincremental (1, 2, 3...)"
    private Integer id;

    @Column(nullable = false, unique = true) // Validación extra: No permite correos repetidos ni vacíos
    private String correo;

    private String clave;
    private Boolean estado;

    // NOTA: Por ahora los dejamos como columnas simples de números.
    // En el futuro, lo ideal es usar relaciones (@OneToOne o @ManyToOne)
    // para conectar con las tablas reales de Rol y Persona.
    @Column(name = "id_rol")
    private Integer id_Rol;

    @Column(name = "id_persona")
    private Integer id_Persona;

    // --- GETTERS Y SETTERS (Se mantienen igual) ---

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

    public Integer getId_Rol() {
        return this.id_Rol;
    }

    public void setId_Rol(Integer id_Rol) {
        this.id_Rol = id_Rol;
    }

    public Integer getId_Persona() {
        return this.id_Persona;
    }

    public void setId_Persona(Integer id_Persona) {
        this.id_Persona = id_Persona;
    }
}