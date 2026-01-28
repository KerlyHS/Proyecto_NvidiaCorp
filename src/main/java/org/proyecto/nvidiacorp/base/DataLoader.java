package org.proyecto.nvidiacorp.base;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.proyecto.nvidiacorp.base.models.*;
import org.proyecto.nvidiacorp.base.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    // Inyectamos TODOS los repositorios
    private final RolRepository rolRepository;
    private final PersonaRepository personaRepository;
    private final UsuarioRepository usuarioRepository;
    private final MarcaRepository marcaRepository;     // Nuevo
    private final ProductoRepository productoRepository;
    private final FacturaRepository facturaRepository; // Nuevo
    private final PagoRepository pagoRepository;       // Nuevo
    
    private final ObjectMapper mapper;

    public DataLoader(RolRepository rolRepo,
                      PersonaRepository personaRepo,
                      UsuarioRepository usuarioRepo,
                      MarcaRepository marcaRepo,
                      ProductoRepository productoRepo,
                      FacturaRepository facturaRepo,
                      PagoRepository pagoRepo,
                      ObjectMapper mapper) {
        this.rolRepository = rolRepo;
        this.personaRepository = personaRepo;
        this.usuarioRepository = usuarioRepo;
        this.marcaRepository = marcaRepo;
        this.productoRepository = productoRepo;
        this.facturaRepository = facturaRepo;
        this.pagoRepository = pagoRepo;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("=================================================");
        log.info("⚡ INICIANDO CARGA MASIVA DE DATOS ⚡");
        log.info("=================================================");

        // --- NIVEL 1: CATÁLOGOS BÁSICOS (No dependen de nadie) ---
        
        // 1. ROLES
        cargarDatos("Rol", "/data/Rol.json", rolRepository, new TypeReference<List<Rol>>(){});

        // 2. PERSONAS (Necesarias para Usuarios)
        cargarDatos("Persona", "/data/Persona.json", personaRepository, new TypeReference<List<Persona>>(){});

        // 3. MARCAS (Necesarias para Productos)
        cargarDatos("Marca", "/data/Marca.json", marcaRepository, new TypeReference<List<Marca>>(){});


        // --- NIVEL 2: ENTIDADES PRINCIPALES ---

        // 4. USUARIOS (Dependen de Personas y Roles)
        cargarDatos("Usuario", "/data/Usuario.json", usuarioRepository, new TypeReference<List<Usuario>>(){});
        
        // 5. PRODUCTOS (Dependen de Marcas)
        cargarDatos("Producto", "/data/Producto.json", productoRepository, new TypeReference<List<Producto>>(){});


        // --- NIVEL 3: TRANSACCIONALES (Dependen de Usuarios y Productos) ---

        // 6. FACTURAS
        cargarDatos("Factura", "/data/Factura.json", facturaRepository, new TypeReference<List<Factura>>(){});

        // 7. PAGOS
        cargarDatos("Pago", "/data/Pago.json", pagoRepository, new TypeReference<List<Pago>>(){});


        log.info("=================================================");
        log.info("🏁 CARGA MASIVA FINALIZADA 🏁");
    }

    // --- MÉTODOS DE AYUDA (NO TOCAR) ---

    private <T> void cargarDatos(String nombreEntidad, String rutaArchivo, org.springframework.data.jpa.repository.JpaRepository<T, ?> repositorio, TypeReference<List<T>> tipo) {
        if (repositorio.count() == 0) {
            try (InputStream is = getClass().getResourceAsStream(rutaArchivo)) {
                if (is == null) {
                    log.warn("⚠️ AVISO: No encontré el archivo " + rutaArchivo + ". Saltando...");
                    return;
                }
                List<T> datos = mapper.readValue(is, tipo);
                
                // Limpiamos los IDs para evitar conflictos con autoincrementables
                limpiarIds(datos); 
                
                repositorio.saveAll(datos);
                log.info("✅ " + nombreEntidad.toUpperCase() + ": " + datos.size() + " registros cargados.");
            } catch (Exception e) {
                log.error("❌ ERROR cargando " + nombreEntidad + ": " + e.getMessage());
                // e.printStackTrace(); // Descomenta si necesitas ver el error detallado
            }
        } else {
            log.info("ℹ️ " + nombreEntidad + " ya tiene datos (omitido).");
        }
    }

    private <T> void limpiarIds(List<T> lista) {
        for (T item : lista) {
            try {
                Field idField = item.getClass().getDeclaredField("id");
                idField.setAccessible(true);
                idField.set(item, null);
            } catch (Exception e) {
                // Si no tiene id, no importa
            }
        }
    }
}