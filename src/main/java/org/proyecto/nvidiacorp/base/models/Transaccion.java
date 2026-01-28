package org.proyecto.nvidiacorp.base.models;

import jakarta.persistence.*;

@Entity
@Table(name = "transacciones")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // <--- CAMBIO CLAVE: UUID en vez de IDENTITY
    private String id; // Ahora sí puede ser String sin problemas

    @Column(nullable = false)
    private Boolean isFinish;

    public Boolean getIsFinish() {
      return this.isFinish;
    }
    public void setIsFinish(Boolean value) {
      this.isFinish = value;
    }

    public String getId() {
      return this.id;
    }
    public void setId(String value) {
      this.id = value;
    }

    
}
