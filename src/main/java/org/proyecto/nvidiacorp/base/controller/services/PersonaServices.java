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

<<<<<<< HEAD
    public void create(@NotEmpty String nombre, @NotEmpty String apellido, @NonNull String telefono, @NonNull String identificacion,
        String direccion, @NonNull Integer edad, @NotEmpty String codIdent) throws Exception {
    if (nombre.trim().length() > 0 && apellido.trim().length() > 0 && identificacion.trim().length() > 0
            && edad != null && codIdent.trim().length() > 0) {
        dp.getPersona().setNombre(nombre);
        dp.getPersona().setApellido(apellido);
        dp.getPersona().setTelefono(telefono);
        dp.getPersona().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
        dp.getPersona().setDireccion(direccion);
        dp.getPersona().setEdad(edad);
        dp.getPersona().setCodIdent(codIdent); // <-- aquí
        if (identificacion.equals("CEDULA")) {
            if (!codIdent.matches("\\d{10}")) {
                throw new Exception("La cédula debe tener 10 dígitos numéricos");
            }
        } else if (identificacion.equals("PASAPORTE")) {
            if (!codIdent.matches("[A-Za-z0-9]{6,15}")) {
=======
    public void create(@NotEmpty String nombre, @NotEmpty String apellido, @NonNull String identificacion,
        String direccion, @NonNull Integer edad, @NotEmpty String nroIdentificacion) throws Exception {
    if (nombre.trim().length() > 0 && apellido.trim().length() > 0 && identificacion.trim().length() > 0
            && edad != null && nroIdentificacion.trim().length() > 0) {
        dp.getPersona().setNombre(nombre);
        dp.getPersona().setApellido(apellido);
        dp.getPersona().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
        dp.getPersona().setDireccion(direccion);
        dp.getPersona().setEdad(edad);
        dp.getPersona().setNroIdentificacion(nroIdentificacion); // <-- aquí
        if (identificacion.equals("CEDULA")) {
            if (!nroIdentificacion.matches("\\d{10}")) {
                throw new Exception("La cédula debe tener 10 dígitos numéricos");
            }
        } else if (identificacion.equals("PASAPORTE")) {
            if (!nroIdentificacion.matches("[A-Za-z0-9]{6,15}")) {
>>>>>>> origin/Josue_Asanza
                throw new Exception("El pasaporte debe tener entre 6 y 15 caracteres alfanuméricos");
            }
        }
        if (!dp.save()) {
            throw new Exception("Error al guardar datos");
        }
    }
}

<<<<<<< HEAD
    public void update(Integer id, @NotEmpty String nombre, @NotEmpty String apellido, @NonNull String telefono ,@NonNull String identificacion,
            String direccion, @NonNull Integer edad, @NotEmpty String codIdent) throws Exception {
=======
    public void update(Integer id, @NotEmpty String nombre, @NotEmpty String apellido, @NonNull String identificacion,
            String direccion, @NonNull Integer edad) throws Exception {
>>>>>>> origin/Josue_Asanza
        if (id != null && nombre.trim().length() > 0 && apellido.trim().length() > 0
                && identificacion.trim().length() > 0 && edad != null) {
            dp.setPersona(dp.listAll().get(id - 1));
            dp.getPersona().setNombre(nombre);
            dp.getPersona().setApellido(apellido);
<<<<<<< HEAD
            dp.getPersona().setTelefono(telefono);
            dp.getPersona().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
            dp.getPersona().setDireccion(direccion);
            dp.getPersona().setEdad(edad);
            dp.getPersona().setCodIdent(codIdent); // Mantener el código de identificación
=======
            dp.getPersona().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
            dp.getPersona().setDireccion(direccion);
            dp.getPersona().setEdad(edad);
>>>>>>> origin/Josue_Asanza
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
