package org.proyecto.nvidiacorp.base.models;

public class Transaccion {
    private Boolean isFinish;
    private String id;

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
