package org.proyecto.nvidiacorp.base.controller.services;

import org.proyecto.nvidiacorp.base.models.Marca;
import org.proyecto.nvidiacorp.base.repositories.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import java.util.List;

@BrowserCallable
@AnonymousAllowed
@Service
public class MarcaService { // Ojo: Singular "Service" como en tu frontend

    @Autowired
    private MarcaRepository marcaRepository;

    public List<Marca> listAllMarcas() {
        return marcaRepository.findAll();
    }
}