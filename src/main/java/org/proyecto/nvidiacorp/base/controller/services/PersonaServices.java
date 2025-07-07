package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoPersona;
import org.proyecto.nvidiacorp.base.models.IdentificacionEnum;
import org.proyecto.nvidiacorp.base.models.Persona;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class PersonaServices {
    private DaoPersona dp;

    public PersonaServices() {
        this.dp = new DaoPersona();
    }

    public void create(@NotEmpty String nombre, @NotEmpty String apellido, @NonNull String telefono, @NonNull String identificacion,
        String direccion, @NonNull Integer edad, @NotEmpty String codIdent) throws Exception {
    if (nombre.trim().length() > 0 && apellido.trim().length() > 0 && identificacion.trim().length() > 0
            && edad != null && codIdent.trim().length() > 0) {
        dp.getObj().setNombre(nombre);
        dp.getObj().setApellido(apellido);
        dp.getObj().setTelefono(telefono);
        dp.getObj().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
        dp.getObj().setDireccion(direccion);
        dp.getObj().setEdad(edad);
        dp.getObj().setCodIdent(codIdent);
        if (identificacion.equals("CEDULA")) {
            if (!codIdent.matches("\\d{10}")) {
                throw new Exception("La cédula debe tener 10 dígitos numéricos");
            }
        } else if (identificacion.equals("PASAPORTE")) {
            if (!codIdent.matches("[A-Za-z0-9]{6,15}")) {
                throw new Exception("El pasaporte debe tener entre 6 y 15 caracteres alfanuméricos");
            }
        }
        if (!dp.save()) {
            throw new Exception("Error al guardar datos");
        }
    }
}

    public void update(Integer id, @NotEmpty String nombre, @NotEmpty String apellido, @NonNull String telefono ,@NonNull String identificacion,
            String direccion, @NonNull Integer edad, @NotEmpty String codIdent) throws Exception {
        if (id != null && nombre.trim().length() > 0 && apellido.trim().length() > 0
                && identificacion.trim().length() > 0 && edad != null) {
            dp.setObj(dp.listAll().get(id - 1));
            dp.getObj().setNombre(nombre);
            dp.getObj().setApellido(apellido);
            dp.getObj().setTelefono(telefono);
            dp.getObj().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
            dp.getObj().setDireccion(direccion);
            dp.getObj().setEdad(edad);
            dp.getObj().setCodIdent(codIdent); // Mantener el código de identificación
            if (!dp.update(id - 1)) {
                throw new Exception("Error al actualizar");
            }
        }
    }

    public List<Persona> listAllPersona() {
        return Arrays.asList(dp.listAll().toArray());
    }

    public List<String> listID() {
        List<String> lista = new ArrayList<>();
        for (IdentificacionEnum identificacion : IdentificacionEnum.values()) {
            lista.add(identificacion.toString());
        }
        return lista;
    }
}
