package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoPersona;
import org.proyecto.nvidiacorp.base.models.IdentificacionEnum;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class PersonaService {
    private DaoPersona dp;

    public PersonaService() {
        this.dp = new DaoPersona();
    }
    
    public void create(@NotEmpty String nombre, @NotEmpty String apellido, @NonNull String identificacion, String direccion, @NonNull Integer edad) throws Exception {
        if (nombre.trim().length() > 0 && apellido.trim().length() > 0 && identificacion.trim().length() > 0 && edad != null) {
            dp.getPersona().setNombre(nombre);
            dp.getPersona().setApellido(apellido);
            dp.getPersona().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
            dp.getPersona().setDireccion(direccion);
            dp.getPersona().setEdad(edad);
            if (!dp.save()) {
                throw new Exception("Error al guardar los datos del usuario");
            }
        }
    }

    public void update( Integer id, @NotEmpty String nombre, @NotEmpty String apellido, @NonNull String identificacion, String direccion, @NonNull Integer edad) throws Exception {
        if (id != null && nombre.trim().length() > 0 && apellido.trim().length() > 0 && identificacion.trim().length() > 0 && edad != null) {
            dp.setPersona(dp.listAll().get(id - 1));
            dp.getPersona().setNombre(nombre);
            dp.getPersona().setApellido(apellido);
            dp.getPersona().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
            dp.getPersona().setDireccion(direccion);
            dp.getPersona().setEdad(edad);
            if (!dp.update(id - 1)) {
                throw new Exception("Error al actualizar los datos del usuario");
            }
        }
    }

    public List<String> listID(){
        List<String> lista = new ArrayList<>();
        for(IdentificacionEnum identificacion : IdentificacionEnum.values()){
            lista.add(identificacion.toString());
        }
        return lista;
    }
}