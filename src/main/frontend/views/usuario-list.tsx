import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextArea, TextField, VerticalLayout, ComboBox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { UsuarioServices } from 'Frontend/generated/endpoints';
import Usuario from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Usuario';
import { useEffect, useState } from 'react';
import { role } from 'Frontend/security/auth';
import { logout } from 'Frontend/generated/UsuarioServices';
import { useNavigate } from 'react-router';



export const config: ViewConfig = {
    title: 'Usuario',
    menu: {
        icon: 'vaadin:clipboard-check',
        order: 2,
        title: 'Usuario',
    },
};

type UsuarioEntryFormProps = {
    onUsuarioCreated?: () => void;
};

type UsuarioEntryFormUpdateProps = {
    onUsuarioUpdated?: () => void;
};

//Usuario CREATE
function UsuarioEntryForm(props: UsuarioEntryFormProps) {
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

    const correo = useSignal('');
    const clave = useSignal('');
    const estado = useSignal('');
    const persona = useSignal('');
    const rol = useSignal('');

    const createUsuario = async () => {
        try {
            if (correo.value.trim().length > 0 && clave.value.trim().length > 0 && estado.value.trim().length > 0 && persona.value.trim().length > 0 && rol.value.trim().length > 0) {
                const estadoBool = estado.value === 'Activo';
                await UsuarioServices.create(correo.value, clave.value, estadoBool, persona.value, rol.value);
                if (props.onUsuarioCreated) {
                    props.onUsuarioCreated();
                }
                correo.value = '';
                clave.value = '';
                estado.value = '';
                persona.value = '';
                rol.value = '';

                dialogOpened.value = false;
                Notification.show('Usuario creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    const listaRol = useSignal<String[]>([]);
    useEffect(() => {
        UsuarioServices.listRol().then(data =>
            listaRol.value = data
        );
    }, []);

    let listaPersona = useSignal<String[]>([]);
    useEffect(() => {
        UsuarioServices.listPersonaCombo().then(data =>
            listaPersona.value = data
        );
    }, []);

    return (
        <>
            <Dialog
                aria-label="Registrar Usuario"
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
                        Registrar Usuario
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={createUsuario}>
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
                        <TextField label="Correo"
                            placeholder='Ingrese el correo del Usuario'
                            aria-label='Ingrese el correo del Usuario'
                            value={correo.value}
                            onValueChanged={(evt) => (correo.value = evt.detail.value)}
                        />
                        <TextField label="Clave"
                            placeholder='Ingrese la clave del Usuario'
                            aria-label='Ingrese la clave del Usuario'
                            value={clave.value}
                            onValueChanged={(evt) => (clave.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Estado"
                            placeholder="Ingrese el estado del Usuario"
                            aria-label="Ingrese el estado del Usuario"
                            items={['Activo', 'Inactivo']} // <-- agrega esto
                            value={estado.value}
                            onValueChanged={(evt) => (estado.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Persona"
                            placeholder="Ingrese la persona del Usuario"
                            aria-label="Ingrese la persona del Usuario"
                            items={listaPersona.value} // <-- agrega esto
                            value={persona.value}
                            onValueChanged={(evt) => (persona.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Rol"
                            placeholder="Ingrese el rol del Usuario"
                            aria-label="Ingrese el rol del Usuario"
                            items={listaRol.value} // <-- agrega esto
                            value={rol.value}
                            onValueChanged={(evt) => (rol.value = evt.detail.value)}
                        />
                    </VerticalLayout>
                </VerticalLayout>
            </Dialog>
            <Button onClick={open}>Registrar</Button>
        </>
    );
}

//UPDATE Usuario
function UsuarioEntryFormUpdate(props: UsuarioEntryFormUpdateProps) {
    //console.log(props);
    const dialogOpened = useSignal(false);

    const open = () => {
        dialogOpened.value = true;
    };

    const close = () => {
        dialogOpened.value = false;
    };

    const correo = useSignal(props.arguments.correo);
    const clave = useSignal(props.arguments.clave);
    const estado = useSignal(props.arguments.estado);
    const persona = useSignal(props.arguments.persona);
    const rol = useSignal(props.arguments.rol);
    const ident = useSignal(props.arguments.id);

    const updateUsuario = async () => {
        try {
            if (correo.value.trim().length > 0 && clave.value.trim().length > 0 && estado.value.trim().length > 0 && persona.value.trim().length > 0 && rol.value.trim().length > 0) {
                await UsuarioServices.update(ident.value, correo.value, clave.value, estado.value, persona.value, rol.value);
                if (props.onUsuarioUpdated) {
                    props.onUsuarioUpdated();
                }
                correo.value = '';
                clave.value = '';
                estado.value = '';
                persona.value = '';
                rol.value = '';
                ident.value = '';

                dialogOpened.value = false;
                Notification.show('Usuario creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    const listaRol = useSignal<String[]>([]);
    useEffect(() => {
        UsuarioServices.listRol().then(data =>
            listaRol.value = data
        );
    }, []);

    let listaPersona = useSignal<String[]>([]);
    useEffect(() => {
        UsuarioServices.listPersonaCombo().then(data =>
            listaPersona.value = data
        );
    }, []);

    return (
        <>
            <Dialog
                aria-label="Editar Usuario"
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
                        Editar Usuario
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={updateUsuario}>
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
                        <TextField label="Correo"
                            placeholder='Ingrese el correo del Usuario'
                            aria-label='Ingrese el correo del Usuario'
                            value={correo.value}
                            onValueChanged={(evt) => (correo.value = evt.detail.value)}
                        />
                        <TextField label="Clave"
                            placeholder='Ingrese la clave del Usuario'
                            aria-label='Ingrese la clave del Usuario'
                            value={clave.value}
                            onValueChanged={(evt) => (clave.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Estado"
                            placeholder="Ingrese el estado del Usuario"
                            aria-label="Ingrese el estado del Usuario"
                            items={['Activo', 'Inactivo']} // <-- agrega esto
                            value={estado.value}
                            onValueChanged={(evt) => (estado.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Persona"
                            placeholder="Ingrese la persona del Usuario"
                            aria-label="Ingrese la persona del Usuario"
                            items={listaPersona.value} // <-- agrega esto
                            value={persona.value}
                            onValueChanged={(evt) => (persona.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Rol"
                            placeholder="Ingrese el rol del Usuario"
                            aria-label="Ingrese el rol del Usuario"
                            items={listaRol.value} // <-- agrega esto
                            value={rol.value}
                            onValueChanged={(evt) => (rol.value = evt.detail.value)}
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



function index({ model }: { model: GridItemModel<Usuario> }) {
    return (
        <span>
            {model.index + 1}
        </span>
    );
}

export default function UsuarioListView() {
    const dataProvider = useDataProvider<Usuario>({
        list: () => UsuarioServices.listUsuario(),
    });

    function link({ item }: { item: Usuario }) {
        return (
            <span>
                <UsuarioEntryFormUpdate arguments={item} onUsuarioUpdated={dataProvider.refresh} />
            </span>
        );
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Usuarios">
                <Group>
                    <UsuarioEntryForm onUsuarioCreated={dataProvider.refresh} />
                </Group>
            </ViewToolbar>
            <Grid dataProvider={dataProvider.dataProvider}>
                <GridColumn header="Nro" renderer={index} />
                <GridColumn header="Correo" path="correo" />
                <GridColumn header="Clave" path="clave" />
                <GridColumn header="Estado" path="estado" />
                <GridColumn header="Persona" path="persona" />
                <GridColumn header="Identificacion" path="codIdent" />
                <GridColumn header="Rol" path="rol" />
                <GridColumn header="Acciones" renderer={link} />
            </Grid>
        </main>
    );
}

