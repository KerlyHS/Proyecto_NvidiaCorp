import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Dialog, Grid, GridColumn, TextField, VerticalLayout, ComboBox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { PersonaServices, UsuarioServices } from 'Frontend/generated/endpoints';
import Persona from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Persona';
import { useEffect } from 'react';
// IMPORTACIÓN CLAVE
import IdentificacionEnum from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/IdentificacionEnum';
import "themes/default/css/persona-list.css";
import { useNavigate } from 'react-router';

export const config: ViewConfig = {
    title: 'Persona',
    menu: { icon: 'vaadin:clipboard-check', order: 2, title: 'Persona' },
};

type PersonaEntryFormProps = { onPersonaCreated?: () => void; };
type PersonaEntryFormUpdateProps = { onPersonaUpdated?: () => void; arguments: any; };

// --- CREAR PERSONA ---
function PersonaEntryForm(props: PersonaEntryFormProps) {
    
    const dialogOpened = useSignal(false);
    const navigate = useNavigate();
    
    // Verificación de rol (Simplificada)
    useEffect(() => {
        // Tu lógica de rol aquí
    },[])

    const open = () => dialogOpened.value = true;
    const close = () => dialogOpened.value = false;

    const nombre = useSignal('');
    const apellido = useSignal('');
    const telefono = useSignal('');
    const direccion = useSignal('');
    // Signal tipado con Enum
    const identificacion = useSignal<IdentificacionEnum | undefined>(undefined);
    const edad = useSignal('');
    const codIdent = useSignal('');

    const createPersona = async () => {
        try {
            if (nombre.value && apellido.value && identificacion.value && codIdent.value) {
                // Validaciones simples
                if (identificacion.value === IdentificacionEnum.CEDULA && !/^\d{10}$/.test(codIdent.value)) {
                    Notification.show('La cédula debe tener 10 dígitos', { theme: 'error' });
                    return;
                }

                await PersonaServices.create(
                    nombre.value, 
                    apellido.value, 
                    telefono.value, 
                    identificacion.value, // ENVIAMOS ENUM
                    direccion.value, 
                    parseInt(edad.value) || 0, 
                    codIdent.value
                );

                if (props.onPersonaCreated) props.onPersonaCreated();
                close();
                Notification.show('Persona creada', { theme: 'success' });
                
                // Limpiar
                nombre.value = ''; apellido.value = ''; codIdent.value = '';
            } else {
                Notification.show('Faltan datos', { theme: 'error' });
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <>
            <Dialog header="Registrar Persona" opened={dialogOpened.value} onOpenedChanged={e => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ width: '300px' }}>
                    <TextField label="Nombre" value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
                    <TextField label="Apellido" value={apellido.value} onValueChanged={e => apellido.value = e.detail.value} />
                    <TextField label="Teléfono" value={telefono.value} onValueChanged={e => telefono.value = e.detail.value} />
                    <TextField label="Dirección" value={direccion.value} onValueChanged={e => direccion.value = e.detail.value} />
                    
                    <ComboBox
                        label="Identificación"
                        items={Object.values(IdentificacionEnum)}
                        value={identificacion.value}
                        onValueChanged={e => identificacion.value = e.detail.value as IdentificacionEnum}
                    />
                    
                    <TextField label="Nro Identificación" value={codIdent.value} onValueChanged={e => codIdent.value = e.detail.value} />
                    <TextField label="Edad" value={edad.value} onValueChanged={e => edad.value = e.detail.value} />
                    
                    <div className="flex justify-end mt-m gap-m">
                         <Button onClick={close}>Cancelar</Button>
                         <Button theme="primary" onClick={createPersona}>Guardar</Button>
                    </div>
                </VerticalLayout>
            </Dialog>
            <Button onClick={open}>Registrar</Button>
        </>
    );
}

// --- ACTUALIZAR PERSONA ---
function PersonaEntryFormUpdate({ arguments: item, onPersonaUpdated }: PersonaEntryFormUpdateProps) {
    const dialogOpened = useSignal(false);
    
    // Inicializamos signals con datos existentes
    const nombre = useSignal(item.nombre);
    const apellido = useSignal(item.apellido);
    const telefono = useSignal(item.telefono || '');
    const direccion = useSignal(item.direccion || '');
    
    // Convertir string del backend a Enum
    const identEnum = Object.values(IdentificacionEnum).find(x => x.toString() === item.identificacion) as IdentificacionEnum;
    const identificacion = useSignal<IdentificacionEnum | undefined>(identEnum);
    
    const edad = useSignal(item.edad?.toString() || '');
    const codIdent = useSignal(item.codIdent);

    const updatePersona = async () => {
        if(!identificacion.value) return;
        
        try {
             await PersonaServices.update(
                item.id, 
                nombre.value, 
                apellido.value, 
                telefono.value, 
                identificacion.value, 
                direccion.value, 
                parseInt(edad.value) || 0, 
                codIdent.value
            );
            if (onPersonaUpdated) onPersonaUpdated();
            dialogOpened.value = false;
            Notification.show('Actualizado', { theme: 'success' });
        } catch (e) { handleError(e); }
    };

    return (
        <>
             <Button theme="tertiary" onClick={() => dialogOpened.value = true}>✏️</Button>
             <Dialog header="Editar" opened={dialogOpened.value} onOpenedChanged={e => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ width: '300px' }}>
                    <TextField label="Nombre" value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
                    <TextField label="Apellido" value={apellido.value} onValueChanged={e => apellido.value = e.detail.value} />
                    <ComboBox
                        label="Identificación"
                        items={Object.values(IdentificacionEnum)}
                        value={identificacion.value}
                        onValueChanged={e => identificacion.value = e.detail.value as IdentificacionEnum}
                    />
                    <TextField label="Nro Identificación" value={codIdent.value} onValueChanged={e => codIdent.value = e.detail.value} />
                    <TextField label="Edad" value={edad.value} onValueChanged={e => edad.value = e.detail.value} />
                    
                    <Button theme="primary" onClick={updatePersona}>Actualizar</Button>
                </VerticalLayout>
             </Dialog>
        </>
    )
}

// --- VISTA PRINCIPAL ---
export default function PersonaListView() {
    const dataProvider = useDataProvider<Persona>({
        list: (params) => PersonaServices.listAllPersona(),
    });

    return (
        <main className="w-full h-full flex flex-col p-m">
            <ViewToolbar title="Personas">
                <Group><PersonaEntryForm onPersonaCreated={dataProvider.refresh} /></Group>
            </ViewToolbar>
            <Grid dataProvider={dataProvider.dataProvider}>
                <GridColumn path="nombre" header="Nombre" />
                <GridColumn path="apellido" header="Apellido" />
                <GridColumn path="identificacion" header="Tipo ID" />
                <GridColumn path="codIdent" header="Número ID" />
                <GridColumn header="Acciones" 
                    renderer={({ item }) => <PersonaEntryFormUpdate arguments={item} onPersonaUpdated={dataProvider.refresh} />} 
                />
            </Grid>
        </main>
    );
}