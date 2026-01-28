import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
// CORRECCIÓN 1: Importamos PasswordField y quitamos SelectItem que daba error
import { Button, Dialog, Grid, GridColumn, TextField, VerticalLayout, ComboBox, Select, PasswordField } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar'; // Asegúrate que este path exista, o cámbialo si es local
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { useEffect, useState } from 'react';

export const config: ViewConfig = {
    title: 'Usuario',
    menu: { icon: 'vaadin:user', order: 2, title: 'Usuario' },
};

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

            await UsuarioServices.createUser(correo, clave, estadoBool, rolNum, perNum);
            Notification.show("Usuario creado con éxito", { theme: "success" });
            onUsuarioCreated();
            close();
            setCorreo(""); setClave(""); setIdPersona(""); setIdRol(""); setEstado("true");
        } catch (error) {
            console.error(error);
            Notification.show("Error al guardar", { theme: "error" });
        }
    };

    return (
        <>
            <Button onClick={open} theme="primary">Nuevo Usuario</Button>
            <Dialog opened={dialogOpened.value} onOpenedChanged={(e) => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ alignItems: 'stretch', width: '20rem' }}>
                    <h2 className="text-l font-bold">Nuevo Usuario</h2>
                    
                    <TextField label="Correo" value={correo} onValueChanged={e => setCorreo(e.detail.value)} />
                    
                    {/* CORRECCIÓN 2: Usamos PasswordField */}
                    <PasswordField label="Clave" value={clave} onValueChanged={e => setClave(e.detail.value)} />
                    
                    {/* CORRECCIÓN 3: Select usando la propiedad 'items' en vez de hijos SelectItem */}
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
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={guardar}>Guardar</Button>
                    </div>
                </VerticalLayout>
            </Dialog>
        </>
    );
}

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
        
        setCorreo(usuario.correo);
        setClave(""); 
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
            <Button theme="tertiary" onClick={open}>Editar</Button>
            <Dialog opened={dialogOpened.value} onOpenedChanged={(e) => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ alignItems: 'stretch', width: '20rem' }}>
                    <h2 className="text-l font-bold">Editar Usuario #{usuario.id}</h2>
                    
                    <TextField label="Correo" value={correo} onValueChanged={e => setCorreo(e.detail.value)} />
                    
                    <PasswordField label="Nueva Clave (Opcional)" placeholder="Dejar vacía para mantener" 
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

export default function UsuarioListView() {
    const dataProvider = useDataProvider<any>({
        list: async (params) => {
            const datos = await UsuarioServices.listUsuario();
            return datos as any[]; 
        },
    });

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            {/* Si ViewToolbar da error, comenta esta línea temporalmente */}
             {/* <ViewToolbar title="Gestión de Usuarios"><Group><UsuarioEntryForm onUsuarioCreated={dataProvider.refresh} /></Group></ViewToolbar> */}
            
            <div className="flex justify-between items-center mb-m">
                <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
                <UsuarioEntryForm onUsuarioCreated={dataProvider.refresh} />
            </div>
            
            <Grid dataProvider={dataProvider.dataProvider}>
                <GridColumn path="id" header="ID" width="50px" flexGrow={0} />
                <GridColumn path="correo" header="Correo" autoWidth />
                <GridColumn path="persona" header="Persona Asignada" autoWidth />
                <GridColumn path="rol" header="Rol" autoWidth />
                <GridColumn path="estado" header="Estado" width="100px" 
                    renderer={({ item }) => (
                        <span style={{ color: item.estado === 'true' ? 'green' : 'red' }}>
                            {item.estado === 'true' ? 'Activo' : 'Inactivo'}
                        </span>
                    )}
                />
                <GridColumn header="Acciones"
                    renderer={({ item }) => (
                        <UsuarioEntryFormUpdate usuario={item} onUsuarioUpdated={dataProvider.refresh} />
                    )}
                />
            </Grid>
        </main>
    );
}