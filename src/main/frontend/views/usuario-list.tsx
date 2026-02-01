import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Dialog, Grid, GridColumn, TextField, VerticalLayout, ComboBox, Select, PasswordField } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'Frontend/security/auth'; // Asegúrate que esta ruta sea correcta

export const config: ViewConfig = {
    title: 'Gestión de Usuarios',
    menu: { icon: 'vaadin:users', order: 2 },
};

// --- FORMULARIO PARA CREAR NUEVO USUARIO ---
function UsuarioEntryForm({ onUsuarioCreated }: { onUsuarioCreated: () => void }) {
    const dialogOpened = useSignal(false);
    const [personas, setPersonas] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [estado, setEstado] = useState("true");
    const [idPersona, setIdPersona] = useState("");
    const [idRol, setIdRol] = useState("");

    const open = () => {
        // Cargamos los combos al abrir
        UsuarioServices.listPersonaCombo().then(setPersonas as any);
        UsuarioServices.listRol().then(setRoles as any);
        dialogOpened.value = true; 
    };

    const close = () => { dialogOpened.value = false; };

    const guardar = async () => {
        try {
            const rolNum = parseInt(idRol);
            const perNum = parseInt(idPersona);
            const estadoBool = estado === "true";

            if(!correo || !clave || isNaN(rolNum) || isNaN(perNum)) {
                Notification.show("Todos los campos son obligatorios", { theme: "error" });
                return;
            }

            // OJO: El orden de parámetros debe coincidir con Java: correo, clave, estado, id_rol, id_persona
            await UsuarioServices.createUser(correo, clave, estadoBool, rolNum, perNum);
            
            Notification.show("Usuario creado con éxito", { theme: "success" });
            onUsuarioCreated(); // Refrescar la tabla
            close();
            
            // Limpiar campos
            setCorreo(""); setClave(""); setIdPersona(""); setIdRol(""); setEstado("true");
        } catch (error) {
            console.error(error);
            Notification.show("Error al guardar. Verifique los datos.", { theme: "error" });
        }
    };

    return (
        <>
            <Button onClick={open} theme="primary">Nuevo Usuario</Button>
            <Dialog opened={dialogOpened.value} onOpenedChanged={(e) => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ alignItems: 'stretch', width: '25rem', padding: 'var(--lumo-space-m)' }}>
                    <h2 className="text-l font-bold">Nuevo Usuario</h2>
                    
                    <TextField label="Correo Electrónico" value={correo} onValueChanged={e => setCorreo(e.detail.value)} />
                    <PasswordField label="Contraseña" value={clave} onValueChanged={e => setClave(e.detail.value)} />
                    
                    <Select 
                        label="Estado" 
                        value={estado} 
                        onValueChanged={e => setEstado(e.detail.value)}
                        items={[
                            { label: 'Activo', value: 'true' },
                            { label: 'Inactivo', value: 'false' }
                        ]}
                    />

                    <ComboBox label="Persona Asignada" items={personas} itemLabelPath="label" itemValuePath="value"
                        value={idPersona} onValueChanged={e => setIdPersona(e.detail.value)} />

                    <ComboBox label="Rol de Sistema" items={roles} itemLabelPath="label" itemValuePath="value"
                        value={idRol} onValueChanged={e => setIdRol(e.detail.value)} />

                    <div className="flex gap-m justify-end mt-m">
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={guardar}>Guardar</Button>
                    </div>
                </VerticalLayout>
            </Dialog>
        </>
    );
}

// --- FORMULARIO PARA EDITAR USUARIO ---
function UsuarioEntryFormUpdate({ usuario, onUsuarioUpdated }: { usuario: any, onUsuarioUpdated: () => void }) {
    const dialogOpened = useSignal(false);
    const [personas, setPersonas] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [estado, setEstado] = useState("true");
    const [idPersona, setIdPersona] = useState("");
    const [idRol, setIdRol] = useState("");

    const open = () => {
        UsuarioServices.listPersonaCombo().then(setPersonas as any);
        UsuarioServices.listRol().then(setRoles as any);
        
        // Llenar datos actuales
        setCorreo(usuario.correo);
        setClave(""); // La clave no se muestra por seguridad
        setEstado(usuario.estado);
        setIdPersona(usuario.id_persona);
        setIdRol(usuario.id_rol);
        
        dialogOpened.value = true;
    };

    const actualizar = async () => {
        try {
            const id = parseInt(usuario.id);
            const rolNum = parseInt(idRol);
            const perNum = parseInt(idPersona);
            const estadoBool = estado === "true";

            // Llamada al backend
            await UsuarioServices.update(id, correo, clave, estadoBool, perNum, rolNum);
            
            Notification.show("Usuario actualizado", { theme: "success" });
            onUsuarioUpdated();
            dialogOpened.value = false;
        } catch (error) {
            console.error(error);
            Notification.show("Error al actualizar", { theme: "error" });
        }
    };

    return (
        <>
            <Button theme="tertiary" onClick={open} style={{ cursor: 'pointer' }}>Editar</Button>
            <Dialog opened={dialogOpened.value} onOpenedChanged={(e) => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ alignItems: 'stretch', width: '25rem', padding: 'var(--lumo-space-m)' }}>
                    <h2 className="text-l font-bold">Editar Usuario #{usuario.id}</h2>
                    
                    <TextField label="Correo" value={correo} onValueChanged={e => setCorreo(e.detail.value)} />
                    
                    <PasswordField label="Nueva Clave (Opcional)" placeholder="Dejar vacía para mantener la actual" 
                        value={clave} onValueChanged={e => setClave(e.detail.value)} />

                    <Select 
                        label="Estado" 
                        value={estado} 
                        onValueChanged={e => setEstado(e.detail.value)}
                        items={[
                            { label: 'Activo', value: 'true' },
                            { label: 'Inactivo', value: 'false' }
                        ]}
                    />

                    <ComboBox label="Persona" items={personas} itemLabelPath="label" itemValuePath="value"
                        value={idPersona} onValueChanged={e => setIdPersona(e.detail.value)} />

                    <ComboBox label="Rol" items={roles} itemLabelPath="label" itemValuePath="value"
                        value={idRol} onValueChanged={e => setIdRol(e.detail.value)} />

                    <div className="flex gap-m justify-end mt-m">
                        <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
                        <Button theme="primary" onClick={actualizar}>Actualizar</Button>
                    </div>
                </VerticalLayout>
            </Dialog>
        </>
    );
}

// --- VISTA PRINCIPAL (CON PROTECCIÓN) ---
export default function UsuarioListView() {
    const { state } = useAuth();
    const navigate = useNavigate();

    // 1. DETECTOR DE INTRUSOS
    useEffect(() => {
        // Si ya terminó de cargar, hay usuario, pero NO TIENE el rol de ADMIN...
        if (!state.loading && state.user) {
            const roles = state.user.roles || [];
            if (!roles.includes("ROLE_ADMIN")) {
                console.warn("Acceso denegado: Se requiere rol de ADMIN");
                navigate("/"); // ¡Fuera!
            }
        }
    }, [state.user, state.loading]);

    const dataProvider = useDataProvider<any>({
        list: async (params) => {
            // Solo intentamos cargar si es admin, para evitar errores 403 en consola
            if (state.user && state.user.roles.includes("ROLE_ADMIN")) {
                try {
                    const datos = await UsuarioServices.listUsuario();
                    return datos as any[];
                } catch (e) {
                    return [];
                }
            }
            return [];
        },
    });

    // Si está cargando o no es admin, no mostramos la tabla (para evitar parpadeos)
    if (state.loading || !state.user || !state.user.roles.includes("ROLE_ADMIN")) {
        return <div className="p-m">Verificando permisos...</div>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <div className="flex justify-between items-center mb-m">
                <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
                <UsuarioEntryForm onUsuarioCreated={dataProvider.refresh} />
            </div>
            
            <Grid dataProvider={dataProvider.dataProvider} theme="row-stripes">
                <GridColumn path="id" header="ID" width="50px" flexGrow={0} />
                <GridColumn path="correo" header="Correo" autoWidth />
                <GridColumn path="persona" header="Persona Asignada" autoWidth />
                <GridColumn path="rol" header="Rol" autoWidth />
                <GridColumn path="estado" header="Estado" width="120px" flexGrow={0}
                    renderer={({ item }) => (
                        <span 
                            style={{ 
                                color: item.estado === 'true' ? 'var(--lumo-success-text-color)' : 'var(--lumo-error-text-color)',
                                fontWeight: 'bold',
                                backgroundColor: item.estado === 'true' ? 'var(--lumo-success-color-10pct)' : 'var(--lumo-error-color-10pct)',
                                padding: '0.2em 0.5em',
                                borderRadius: '4px'
                            }}
                        >
                            {item.estado === 'true' ? 'Activo' : 'Inactivo'}
                        </span>
                    )}
                />
                <GridColumn header="Acciones" width="100px" flexGrow={0}
                    renderer={({ item }) => (
                        <UsuarioEntryFormUpdate usuario={item} onUsuarioUpdated={dataProvider.refresh} />
                    )}
                />
            </Grid>
        </main>
    );
}   