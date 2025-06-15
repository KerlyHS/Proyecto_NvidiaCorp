package org.proyecto.nvidiacorp.base.controller.services;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.dao.AdapterDao;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.*;
import org.proyecto.nvidiacorp.base.controller.DataEstruct.List.LinkedList;
import org.proyecto.nvidiacorp.base.models.IdentificacionEnum;
import org.proyecto.nvidiacorp.base.models.Persona;
import org.proyecto.nvidiacorp.base.models.RolEnum;
import org.proyecto.nvidiacorp.base.models.Usuario;
import org.springframework.boot.actuate.autoconfigure.tracing.TracingProperties.Propagation;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
@BrowserCallable
@AnonymousAllowed
public class PersonaService {
    private DaoPersona dp;

    public PersonaService(){
        dp = new DaoPersona();
    }    

    public List<Persona> list(){
        return Arrays.asList(dp.listAll().toArray());
    }

    public void createPerson(@NotBlank @NotEmpty String nombre,
                             @NotBlank @NotEmpty String apellido,
                             @NotBlank @NotEmpty String direccion,
                             @NotBlank @NotEmpty String identificacion,
                             @NotNull Integer edad) throws Exception{
    if(nombre.trim().length() > 0 && apellido.trim().length() > 0 && direccion.trim().length()>0 &&
       identificacion.trim().length() > 0 && edad != null){
        dp.getobj().setNombre(nombre);
        dp.getobj().setApellido(apellido);
        dp.getobj().setDireccion(direccion);
        dp.getobj().setIdentificacion(IdentificacionEnum.valueOf(identificacion));
        dp.getobj().setEdad(edad);
        if(dp.save()){
            System.out.println("aaaaaaa guardado");
        } else {
            System.out.println("no se guardo");
        }
    }

    }
}
