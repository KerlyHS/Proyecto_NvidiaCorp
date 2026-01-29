package org.proyecto.nvidiacorp.base.controller.services;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final GoogleAiGeminiChatModel model;

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.model = GoogleAiGeminiChatModel.builder()
            .apiKey(apiKey)
            .modelName("gemini-2.5-flash") // Puedes cambiar el modelo según tus necesidades
            .build();
        }
    public String consultarIA(String mensaje) {
        try {
            return model.generate(mensaje);
        } catch (Exception e) {
            return "Error al conectar con la IA: " + e.getMessage();
        }
    }
}