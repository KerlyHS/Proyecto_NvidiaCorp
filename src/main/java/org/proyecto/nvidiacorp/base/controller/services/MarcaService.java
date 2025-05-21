package org.proyecto.nvidiacorp.base.controller.services;

import java.util.Arrays;
import java.util.List;
import org.proyecto.nvidiacorp.base.models.Marca;

import org.proyecto.nvidiacorp.base.controller.dao.Dao_Models.DaoMarca;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;

@AnonymousAllowed
@BrowserCallable
public class MarcaService {
        private DaoMarca db;
        public MarcaService() {
        db = new DaoMarca();
    }

    public void createMarca(@NotEmpty String nombre) throws Exception {
        if(nombre.trim().length() > 0 ) {
            db.getObj().setNombre(nombre);
            if(!db.save())
                throw new  Exception("No se pudo guardar los datos de la Marca");
        }
    }

    public void updateMarca(Integer id, @NotEmpty String nombre ) throws Exception {
        if(id != null && id > 0 && nombre.trim().length() > 0 ) {
            db.setObj(db.listAll().get(id - 1));
            db.getObj().setNombre(nombre);
            if(!db.update(id ))
                throw new  Exception("No se pudo modificar los datos de la Marca");
        }
    }

    public List<Marca> listAllMarca(){
        return Arrays.asList(db.listAll().toArray());
    }
}
