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
        String folder = "uploads/";
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(folder + filename);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        return "/uploads/" + filename;
    }
}
