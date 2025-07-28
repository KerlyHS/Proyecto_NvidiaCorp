import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextArea, TextField, VerticalLayout, ComboBox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { PersonaServices, UsuarioServices } from 'Frontend/generated/endpoints';
import Persona from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Persona';
import { useEffect, useState } from 'react';
import IdentificacionEnum from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/IdentificacionEnum';
import "themes/default/css/persona-list.css";
import { useNavigate } from 'react-router';
import { role } from 'Frontend/security/auth';
import { logout } from 'Frontend/generated/UsuarioServices';


export const config: ViewConfig = {
    title: 'Persona',
    menu: {
        icon: 'vaadin:clipboard-check',
        order: 2,
        title: 'Persona',
    },
};

type PersonaEntryFormProps = {
    onPersonaCreated?: () => void;
};

type PersonaEntryFormUpdateProps = {
    onPersonaUpdated?: () => void;
};

//Persona CREATE
function PersonaEntryForm(props: PersonaEntryFormProps) {
    const dialogOpened = useSignal(false);

    const navigate = useNavigate();
    
    
      useEffect(() => {
        role().then(async data =>{
          if(data?.rol != 'ROLE_ADMIN'){
            Notification.show('No tienes permisos de administrador', { duration: 5000, position: 'top-center', theme: 'error' });
            await UsuarioServices.logout();
            await logout();
            navigate('/');
          }
        })
      },[])
    

    const open = () => {
        dialogOpened.value = true;
    };

    const close = () => {
        dialogOpened.value = false;
    };

    const nombre = useSignal('');
    const apellido = useSignal('');
    const telefono = useSignal('');
    const direccion = useSignal('');
    const identificacion = useSignal('');
    const edad = useSignal('');
    const codIdent = useSignal('');

    console.log(identificacion.value);

    const createPersona = async () => {
        try {
            if (nombre.value.trim().length > 0 && apellido.value.trim().length > 0 && telefono.value.trim().length > 0 && direccion.value.trim().length > 0 && 
            identificacion.value.trim().length > 0 && edad.value.trim().length > 0 && codIdent.value.trim().length > 0) {

                if (identificacion.value === 'CEDULA') {
                    if (!/^\d{10}$/.test(codIdent.value)) {
                        Notification.show('La cédula debe tener 10 dígitos numéricos', { theme: 'error' });
                        return;
                    }
                } else if (identificacion.value === 'PASAPORTE') {
                    if (!/^(?=.*[A-Za-z])[A-Za-z\d]{6,15}$/.test(codIdent.value)) {
                        Notification.show('El pasaporte debe tener entre 6 y 15 caracteres alfanuméricos', { theme: 'error' });
                        return;
                    }
                }

                await PersonaServices.create(nombre.value, apellido.value, telefono.value ,identificacion.value, direccion.value, parseInt(edad.value), codIdent.value);
                if (props.onPersonaCreated) {
                    props.onPersonaCreated();
                }
                nombre.value = '';
                apellido.value = '';
                direccion.value = '';
                identificacion.value = '';
                edad.value = '';
                codIdent.value = '';

                dialogOpened.value = false;
                Notification.show('Persona creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    const listaidentificacion = useSignal<String[]>([]);
    useEffect(() => {
        PersonaServices.listID().then(data =>
            listaidentificacion.value = data
        );
    }, []);

    return (
        <>
            <Dialog
                aria-label="Registrar Persona"
                draggable
                modeless
                opened={dialogOpened.value}
                onOpenedChanged={(event) => {
                    dialogOpened.value = event.detail.value;
                }}
                header={
                    <h2
                        className="draggable"
                        style={{
                            flex: 1,
                            cursor: 'move',
                            margin: 0,
                            fontSize: '1.5em',
                            fontWeight: 'bold',
                            padding: 'var(--lumo-space-m) 0',
                        }}
                    >
                        Registrar Persona
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={createPersona}>
                            Registrar
                        </Button>
                    </>
                )}
            >
                <VerticalLayout
                    theme="spacing"
                    style={{ width: '300px', maxWidth: '100%', alignItems: 'stretch' }}
                >
                    <VerticalLayout style={{ alignItems: 'stretch' }}>
                        <TextField label="Nombre"
                            placeholder='Ingrese el nombre de la Persona'
                            aria-label='Ingrese el nombre de la Persona'
                            value={nombre.value}
                            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
                        />
                        <TextField label="Apellido"
                            placeholder='Ingrese el apellido de la Persona'
                            aria-label='Ingrese el apellido de la Persona'
                            value={apellido.value}
                            onValueChanged={(evt) => (apellido.value = evt.detail.value)}
                        />
                        <TextField label="Telefono"
                            placeholder='Ingrese el telefono de la Persona'
                            aria-label='Ingrese el telefono de la Persona'
                            value={telefono.value}
                            onValueChanged={(evt) => (telefono.value = evt.detail.value)}
                        />
                        <TextField label="Direccion"
                            placeholder='Ingrese la direccion de la Persona'
                            aria-label='Ingrese la direccion de la Persona'
                            value={direccion.value}
                            onValueChanged={(evt) => (direccion.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Identificacion"
                            placeholder="Ingrese la identificacion de la Persona"
                            aria-label="Ingrese la identificacion de la Persona"
                            items={listaidentificacion.value}
                            value={identificacion.value}
                            onValueChanged={(evt) => (identificacion.value = evt.detail.value)}
                        />
                        <TextField
                            label={identificacion.value === 'CEDULA' ? 'Nro de cédula' : 'Nro de pasaporte'}
                            placeholder={identificacion.value === 'CEDULA' ? 'Ej: 0123456789' : 'Ej: X123456'}
                            aria-label="Ingrese el número de identificación"
                            value={codIdent.value}
                            onValueChanged={(evt) => (codIdent.value = evt.detail.value)}
                        />
                        <TextField label="Edad"
                            placeholder='Ingrese la edad de la Persona'
                            aria-label='Ingrese la edad de la Persona'
                            value={edad.value}
                            onValueChanged={(evt) => (edad.value = evt.detail.value)}
                        />
                    </VerticalLayout>
                </VerticalLayout>
            </Dialog>
            <Button onClick={open}>Registrar</Button>
        </>
    );
}

//UPDATE Persona
function PersonaEntryFormUpdate(props: PersonaEntryFormUpdateProps) {
    //console.log(props);
    const dialogOpened = useSignal(false);

    const open = () => {
        dialogOpened.value = true;
    };

    const close = () => {
        dialogOpened.value = false;
    };

    const nombre = useSignal(props.arguments.nombre);
    const apellido = useSignal(props.arguments.apellido);
    const telefono = useSignal(props.arguments.telefono);
    const direccion = useSignal(props.arguments.direccion);
    const identificacion = useSignal(props.arguments.identificacion);
    const edad = useSignal(props.arguments.edad?.toString() ?? '');
    const codIdent = useSignal(props.arguments.codIdent);
    const ident = useSignal(props.arguments.id);

    useEffect(() => {
        nombre.value = props.arguments.nombre;
        apellido.value = props.arguments.apellido;
        telefono.value = props.arguments.telefono?.toString() ?? '';
        direccion.value = props.arguments.direccion;
        identificacion.value = props.arguments.identificacion;
        edad.value = props.arguments.edad?.toString() ?? '';
        codIdent.value = props.arguments.codIdent;
        ident.value = props.arguments.id;
    }, [props.arguments]);

    const updatePersona = async () => {
        try {
            if (nombre.value.trim().length > 0 && apellido.value.trim().length > 0 && telefono.value.trim().length > 0 && direccion.value.trim().length > 0 && 
            identificacion.value.trim().length > 0 && edad.value.trim().length > 0 && codIdent.value.trim().length > 0) {
                if (identificacion.value === 'CEDULA') {
                    if (!/^\d{10}$/.test(codIdent.value)) {
                        Notification.show('La cédula debe tener 10 dígitos numéricos', { theme: 'error' });
                        return;
                    }
                } else if (identificacion.value === 'PASAPORTE') {
                    if (!/^(?=.*[A-Za-z])[A-Za-z\d]{6,15}$/.test(codIdent.value)) {
                        Notification.show('El pasaporte debe tener entre 6 y 15 caracteres alfanuméricos', { theme: 'error' });
                        return;
                    }
                }

                await PersonaServices.update(parseInt(ident.value), nombre.value, apellido.value, telefono.value ,identificacion.value, direccion.value, parseInt(edad.value), codIdent.value);
                if (props.onPersonaUpdated) {
                    props.onPersonaUpdated();
                }
                nombre.value = '';
                apellido.value = '';
                direccion.value = '';
                identificacion.value = '';
                edad.value = '';
                codIdent.value = '';
                ident.value = '';

                dialogOpened.value = false;
                Notification.show('Persona creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    const listaidentificacion = useSignal<String[]>([]);
    useEffect(() => {
        PersonaServices.listID().then(data =>
            listaidentificacion.value = data
        );
    }, []);

    return (
        <>
            <Dialog
                aria-label="Editar Persona"
                draggable
                modeless
                opened={dialogOpened.value}
                onOpenedChanged={(event) => {
                    dialogOpened.value = event.detail.value;
                }}
                header={
                    <h2
                        className="draggable"
                        style={{
                            flex: 1,
                            cursor: 'move',
                            margin: 0,
                            fontSize: '1.5em',
                            fontWeight: 'bold',
                            padding: 'var(--lumo-space-m) 0',
                        }}
                    >
                        Editar Persona
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={updatePersona}>
                            Actualizar
                        </Button>
                    </>
                )}
            >
                <VerticalLayout
                    theme="spacing"
                    style={{ width: '300px', maxWidth: '100%', alignItems: 'stretch' }}
                >
                    <VerticalLayout style={{ alignItems: 'stretch' }}>
                        <TextField label="Nombre"
                            placeholder='Ingrese el nombre de la Persona'
                            aria-label='Ingrese el nombre de la Persona'
                            value={nombre.value}
                            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
                        />
                        <TextField label="Apellido"
                            placeholder='Ingrese el apellido de la Persona'
                            aria-label='Ingrese el apellido de la Persona'
                            value={apellido.value}
                            onValueChanged={(evt) => (apellido.value = evt.detail.value)}
                        />
                        <TextField label="Telefono"
                            placeholder='Ingrese el telefono de la Persona'
                            aria-label='Ingrese el telefono de la Persona'
                            value={telefono.value}
                            onValueChanged={(evt) => (telefono.value = evt.detail.value)}
                        />
                        <TextField label="Direccion"
                            placeholder='Ingrese la direccion de la Persona'
                            aria-label='Ingrese la direccion de la Persona'
                            value={direccion.value}
                            onValueChanged={(evt) => (direccion.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Identificacion"
                            placeholder="Ingrese la identificacion de la Persona"
                            aria-label="Ingrese la identificacion de la Persona"
                            items={listaidentificacion.value}
                            value={identificacion.value}
                            onValueChanged={(evt) => (identificacion.value = evt.detail.value)}
                        />
                        <TextField
                            label={identificacion.value === 'CEDULA' ? 'Nro de cédula' : 'Nro de pasaporte'}
                            placeholder={identificacion.value === 'CEDULA' ? 'Ej: 0123456789' : 'Ej: X123456'}
                            aria-label="Ingrese el número de identificación"
                            value={codIdent.value}
                            onValueChanged={(evt) => (codIdent.value = evt.detail.value)}
                        />
                        <TextField label="Edad"
                            placeholder='Ingrese la edad de la Persona'
                            aria-label='Ingrese la edad de la Persona'
                            value={edad.value}
                            onValueChanged={(evt) => (edad.value = evt.detail.value)}
                        />
                    </VerticalLayout>
                </VerticalLayout>
            </Dialog>
            <Button onClick={open}>Editar</Button>
        </>
    );
}
//*************************** */

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});



function index({ model }: { model: GridItemModel<Persona> }) {
    return (
        <span>
            {model.index + 1}
        </span>
    );
}

export default function PersonaListView() {
    const dataProvider = useDataProvider<Persona>({
        list: () => PersonaServices.listAllPersona(),
    });

    function index({ model }: { model: GridItemModel<Persona> }) {
        return <span>{model.index + 1}</span>;
    }

    function link({ item }: { item: Persona }) {
        return (
            <span>
                <PersonaEntryFormUpdate arguments={item} onPersonaUpdated={dataProvider.refresh} />
            </span>
        );
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Personas">
                <Group>
                    <PersonaEntryForm onPersonaCreated={dataProvider.refresh} />
                </Group>
            </ViewToolbar>
            <Grid dataProvider={dataProvider.dataProvider}>
                <GridColumn header="Nro" renderer={index} />
                <GridColumn path="nombre" header="Nombre" />
                <GridColumn path="apellido" header="Apellido" />
                <GridColumn path="telefono" header="Telefono" />
                <GridColumn path="direccion" header="Direccion" />
                <GridColumn path="identificacion" header="Identificacion del usuario" />
                <GridColumn path="codIdent" header="codigo de identificacion" />
                <GridColumn path="edad" header="Edad" />
                <GridColumn header="Acciones" renderer={link} />
            </Grid>
        </main>
    );
}

