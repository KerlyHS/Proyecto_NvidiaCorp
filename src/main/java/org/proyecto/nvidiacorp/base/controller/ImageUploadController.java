package org.proyecto.nvidiacorp.base.controller;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;

@BrowserCallable
@AnonymousAllowed
@RestController
@RequestMapping("/api/upload")
public class ImageUploadController {

@PostMapping
public String uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
    String folder = "src/main/frontend/themes/imagenes/";
    String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    Path path = Paths.get(folder + filename);
    Files.createDirectories(path.getParent());
    Files.write(path, file.getBytes());
    System.out.println("Imagen subida: " + path.toAbsolutePath()); 
    System.out.println("URL devuelta al frontend: /imagenes/" + filename); 
    return "/imagenes/" + filename;
}
}
