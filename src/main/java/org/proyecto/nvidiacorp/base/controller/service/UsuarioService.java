package org.proyecto.nvidiacorp.base.controller.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoPersona;
import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoUsuario;
import org.proyecto.nvidiacorp.base.models.RolEnum;
import org.proyecto.nvidiacorp.base.models.Usuario;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class UsuarioService {
    private DaoUsuario du;

    public UsuarioService() {
        this.du = new DaoUsuario();
    }
    
    public void create(@NotEmpty String correo, @NotEmpty String clave, Boolean estado, @NonNull String direccion, Integer id_Persona, @NonNull String rol) throws Exception {
        if (correo.trim().length() > 0 && clave.trim().length() > 0 && estado != null) {
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);
            du.getUsuario().setEstado(estado);
            du.getUsuario().setDireccion(direccion);
            du.getUsuario().setId_Persona(id_Persona);
            du.getUsuario().setRol(RolEnum.valueOf(rol));
            if (!du.save()) {
                throw new Exception("Error al guardar datos");
            }
        }
    }

    public void update(Integer id,@NotEmpty String correo, @NotEmpty String clave, Boolean estado, @NonNull String direccion, Integer id_Persona, @NonNull String rol) throws Exception {
        if (correo.trim().length() > 0 && clave.trim().length() > 0 && estado != null) {
            du.setUsuario(du.listAll().get(id - 1));
            du.getUsuario().setCorreo(correo);
            du.getUsuario().setClave(clave);
            du.getUsuario().setEstado(estado);
            du.getUsuario().setDireccion(direccion);
            du.getUsuario().setId_Persona(id_Persona);
            du.getUsuario().setRol(RolEnum.valueOf(rol));
            if (!du.save()) {
                throw new Exception("Error al actualizar");
            }
        }
    }

    public List<String> listRol(){
        List<String> lista = new ArrayList<>();
        for(RolEnum rol : RolEnum.values()){
            lista.add(rol.toString());
        }
        return lista;
    }

    public List<HashMap> listUsuario(){
        List<HashMap> lista = new ArrayList<>();
        if (!du.listAll().isEmpty()){
            Usuario[] arreglo = du.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("correo", arreglo[i].getCorreo().toString());
                aux.put("clave", arreglo[i].getClave().toString());
                aux.put("estado", arreglo[i].getEstado().toString());
                aux.put("direccion", arreglo[i].getDireccion().toString());
                aux.put("persona", new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getNombre());
                aux.put("id_persona", new DaoPersona().listAll().get(arreglo[i].getId_Persona() - 1).getId().toString());
                lista.add(aux);
            }
        }
        return lista;
    }
}
