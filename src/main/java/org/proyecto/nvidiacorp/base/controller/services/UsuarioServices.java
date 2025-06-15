package org.proyecto.nvidiacorp.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoPersona;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoUsuario;
import org.proyecto.nvidiacorp.base.models.Persona;
import org.proyecto.nvidiacorp.base.models.RolEnum;
import org.proyecto.nvidiacorp.base.models.Usuario;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class UsuarioServices {
    private DaoUsuario du;

    public UsuarioServices() {
        this.du = new DaoUsuario();
    }

    public void create(@NotEmpty String correo, @NotEmpty String clave, Boolean estado, Integer id_Persona,
            @NonNull String rol) throws Exception {
        if (correo.trim().length() > 0 && clave.trim().length() > 0 && estado != null && id_Persona > 0
                && rol.trim().length() > 0) {
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);
            du.getUsuario().setEstado(estado);
            du.getUsuario().setId_Persona(id_Persona);
            du.getUsuario().setRol(RolEnum.valueOf(rol));
            if (!du.save()) {
                throw new Exception("Error al guardar datos");
            }
        }
    }

    public void update(Integer id, @NotEmpty String correo, @NotEmpty String clave, Boolean estado, Integer id_Persona,
            @NonNull String rol) throws Exception {
        if (correo.trim().length() > 0 && clave.trim().length() > 0 && estado != null && id_Persona > 0
                && rol.trim().length() > 0) {
            du.setUsuario(du.listAll().get(id - 1));
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);
            du.getUsuario().setEstado(estado);
            du.getUsuario().setId_Persona(id_Persona);
            du.getUsuario().setRol(RolEnum.valueOf(rol));
            if (!du.save()) {
                throw new Exception("Error al actualizar");
            }
        }
    }

    public List<Usuario> listAllUsuario() {
        return Arrays.asList(du.listAll().toArray());
    }

    public List<String> listRol() {
        List<String> lista = new ArrayList<>();
        for (RolEnum rol : RolEnum.values()) {
            lista.add(rol.toString());
        }
        return lista;
    }

    public List<HashMap> listPersonaCombo() {
        List<HashMap> lista = new ArrayList<>();
        DaoPersona dp = new DaoPersona();
        if (!dp.listAll().isEmpty()) {
            Persona[] arreglo = dp.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
<<<<<<< HEAD
                aux.put("label", arreglo[i].getNombre() + " (" + arreglo[i].getCodIdent() + ")");
=======
                aux.put("label", arreglo[i].getNombre() + " (" + arreglo[i].getNroIdentificacion() + ")");
>>>>>>> origin/Josue_Asanza
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listUsuario() {
        List<HashMap> lista = new ArrayList<>();
        if (!du.listAll().isEmpty()) {
            Usuario[] arreglo = du.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                Persona persona = new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1);
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("correo", arreglo[i].getCorreo().toString());
                aux.put("clave", arreglo[i].getClave().toString());
                aux.put("estado", arreglo[i].getEstado().toString());
<<<<<<< HEAD
                aux.put("persona", persona.getNombre() + " " + persona.getApellido());
                aux.put("codIdent",
                        new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getCodIdent());
=======
                aux.put("persona", new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getNombre());
                aux.put("nroIdentificacion",
                        new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getNroIdentificacion());
>>>>>>> origin/Josue_Asanza
                aux.put("id_persona",
                        new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getId().toString());
                aux.put("rol", arreglo[i].getRol().toString());
                lista.add(aux);
            }
        }
        return lista;
    }
}
