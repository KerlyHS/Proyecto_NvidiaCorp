import { Button, Dialog, TextArea, TextField, VerticalLayout, ComboBox, Upload } from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useState } from 'react';
import { Notification } from '@vaadin/react-components/Notification';
import handleError from 'Frontend/views/_ErrorHandler';
import { ProductoService } from 'Frontend/generated/endpoints';
import Marca from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Marca';
import CategoriaEnum from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/CategoriaEnum';
import { MarcaService } from 'Frontend/generated/endpoints';
import { AdminOnly } from './proteccionRol';
type ProductoEntryFormProps = {
    onProductoCreated?: () => void;
};

type ProductoEntryFormPropsUpdate = {
    onProductoUpdated?: () => void;
    arguments: any;
};

// Registrar Producto
export function ProductoEntryForm(props: ProductoEntryFormProps) {
    const dialogOpened = useSignal(false);
    const [Marca, setMarcas] = useState<Marca[]>([]); // <-- solo array vacío
    const [imagenUrl, setImagenUrl] = useState('');

    const handleUploadSuccess = (event: any) => {
        const response = event.detail.xhr.response;
        setImagenUrl(response);
    };

    const open = () => { dialogOpened.value = true; };
    const close = () => { dialogOpened.value = false; };

    const nombre = useSignal('');
    const descripcion = useSignal('');
    const marca = useSignal(0);
    const precio = useSignal(0);
    const categoria = useSignal("");
    const stock = useSignal(0);

    useEffect(() => {
        const fetchMarcas = async () => {
            const result = await MarcaService.listAllMarca();
            // Agrega la opción "Seleccione una marca" al inicio
            setMarcas([{ id: 0, nombre: 'Seleccione una marca' }, ...(result || [])]);
        };
        fetchMarcas();
    }, []);

    const createProducto = async () => {
        try {
            if (nombre.value.trim().length > 0 && descripcion.value.trim().length > 0 && marca.value > 0 && precio.value > 0 && categoria.value.trim().length > 0 && imagenUrl) {
                await ProductoService.createProducto(nombre.value, descripcion.value, marca.value, precio.value, categoria.value, imagenUrl, stock.value);
                window.location.reload();
                if (props.onProductoCreated) props.onProductoCreated();
                nombre.value = '';
                descripcion.value = '';
                marca.value = 0;
                precio.value = 0;
                categoria.value = '';
                setImagenUrl('');
                dialogOpened.value = false;
                Notification.show('Producto creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
            }
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    return (
        <>
            <Dialog
                aria-label="Registrar Producto"
                draggable
                modeless
                opened={dialogOpened.value}
                onOpenedChanged={(event) => { dialogOpened.value = event.detail.value; }}
                header={
                    <header
                        style={{
                            width: '100%',
                            background: 'linear-gradient(90deg, #232323 60%, #76b900 100%)',
                            borderRadius: '16px 16px 0 0',
                            padding: '1.1rem 0 0.6rem 0',
                            marginBottom: '0',
                            boxShadow: '0 4px 24px #76b90033',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.7rem',
                            width: '100%'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#232323"/>
                                <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 16l.94-2h7.8a2 2 0 0 0 1.92-1.44l2.12-7.06A1 1 0 0 0 19 4H6.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 5 17h14v-2H7.42a.5.5 0 0 1-.26-.08z" fill="#b3ff00"/>
                            </svg>
                            <h2
                                style={{
                                    color: '#b3ff00',
                                    fontWeight: 900,
                                    fontSize: '2em',
                                    margin: 0,
                                    textAlign: 'center',
                                    letterSpacing: '1px',
                                    textShadow: '0 2px 16px #76b90055, 0 2px 8px #000',
                                    flex: 1
                                }}
                            >
                                Registrar Producto
                            </h2>
                        </span>
                        <span
                            style={{
                                color: '#b3ff00',
                                fontSize: '1rem',
                                marginTop: '0.2rem',
                                textAlign: 'center',
                                letterSpacing: '0.5px',
                                width: '100%'
                            }}
                        >
                            Ingresa los datos del nuevo producto
                        </span>
                    </header>
                }
            >
                <VerticalLayout
                    className="dialog-form-container"
                    theme="spacing"
                    style={{
                        width: '420px',
                        maxWidth: '98vw',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        alignItems: 'stretch',
                        gap: '1.2rem'
                    }}
                >
                    <VerticalLayout style={{ alignItems: 'stretch', gap: '1rem' }}>
                        <Upload
                            accept="image/png,image/jpeg"
                            maxFiles={1}
                            target="/api/upload"
                            onUploadSuccess={handleUploadSuccess}
                        />
                        {imagenUrl && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                                <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: 240, maxHeight: 180, borderRadius: 12, border: '2px solid #76b900', marginBottom: 8 }} />
                                <Button theme="error" onClick={() => setImagenUrl('')}>Eliminar imagen</Button>
                            </div>
                        )}
                        <TextField label="Nombre" placeholder='Ingrese el nombre del producto' aria-label='Ingrese el nombre del producto' value={nombre.value} onValueChanged={(evt) => (nombre.value = evt.detail.value)} style={{ width: '100%' }} />
                        <TextArea label="Descripción" placeholder='Ingrese la descripción del producto' aria-label='Ingrese la descripción del producto' value={descripcion.value} onValueChanged={(evt) => (descripcion.value = evt.detail.value)} style={{ width: '100%' }} />
                        <ComboBox
                            label="Marca"
                            placeholder="Seleccione la Marca"
                            items={Marca}
                            itemLabelPath="nombre"
                            itemValuePath="id"
                            value={marca.value}
                            onValueChanged={(evt) => (marca.value = evt.detail.value)}
                            style={{ width: '100%' }}
                        />
                        <TextField label="Precio" placeholder='Ingrese el precio del producto' aria-label='Ingrese el precio del producto' value={precio.value} onValueChanged={(evt) => (precio.value = evt.detail.value)} suffix="$" style={{ width: '100%' }} />
                        <ComboBox label="Categoría" placeholder="Seleccione la Categoría" items={Object.values(CategoriaEnum)} itemLabelPath="nombre" itemValuePath="id" value={categoria.value} onValueChanged={(evt) => (categoria.value = evt.detail.value)} style={{ width: '100%' }} />
                        <TextField
                            label="Stock"
                            type="number"
                            min={0}
                            value={stock.value === 0 ? '' : stock.value}
                            onValueChanged={e => {
                                const val = e.detail.value;
                                if (val === '' || val === null) {
                                    stock.value = 0; // O puedes dejarlo vacío si prefieres
                                } else {
                                    const num = parseInt(val, 10);
                                    stock.value = isNaN(num) ? 0 : num;
                                }
                            }}
                            suffix="unidades"
                            style={{ width: '100%' }}
                        />
                    </VerticalLayout>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="registrar" onClick={createProducto}>
                            Registrar
                        </Button>
                    </div>
                </VerticalLayout>
            </Dialog>
            <AdminOnly>
                <Button theme="registrar" onClick={open}>Registrar</Button>
            </AdminOnly>
        </>
    );
}

// Editar Producto
export function ProductoEntryFormUpdate(props: ProductoEntryFormPropsUpdate) {
    const Producto = props.arguments;
    const dialogOpened = useSignal(false);
    const [Marca, setMarcas] = useState<Marca[]>([{ id: 0, nombre: 'Seleccione una marca' }]);
    const [imagenUrl, setImagenUrl] = useState(Producto.imagen || '');

    // Inicializa los signals con los datos del producto
    const nombre = useSignal(Producto.nombre ?? '');
    const descripcion = useSignal(Producto.descripcion ?? '');
    const marca = useSignal(Producto.id_marca ?? 0);
    const precio = useSignal(Producto.precio ?? 0);
    const categoria = useSignal(Producto.categoria ?? '');
    const stock = useSignal(Producto.stock ?? 0);

    useEffect(() => {
        // Si el producto cambia, actualiza los valores
        nombre.value = Producto.nombre ?? '';
        descripcion.value = Producto.descripcion ?? '';
        marca.value = Producto.id_marca ?? 0;
        precio.value = Producto.precio ?? 0;
        categoria.value = Producto.categoria ?? '';
        stock.value = Producto.stock ?? 0;
        setImagenUrl(Producto.imagen || '');
    }, [Producto]);

    const handleUploadSuccess = (event: any) => {
        const response = event.detail.xhr.response;
        setImagenUrl(response);
    };

    const open = () => { dialogOpened.value = true; };
    const close = () => { dialogOpened.value = false; };
    const ident = props.arguments.id;
    const updateProducto = async () => {
        try {
            if (nombre.value.trim().length > 0 && descripcion.value.trim().length > 0 && marca.value > 0 && precio.value > 0 && categoria.value.trim().length > 0 && imagenUrl.trim().length > 0) {
                await ProductoService.updateProducto(parseInt(ident), nombre.value, descripcion.value, marca.value, precio.value, categoria.value, imagenUrl, stock.value);
                window.location.reload();
                if (props.onProductoUpdated) props.onProductoUpdated();
                nombre.value = '';
                descripcion.value = '';
                marca.value = 0;
                precio.value = 0;
                categoria.value = '';
                setImagenUrl('');
                dialogOpened.value = false;
                Notification.show('Producto creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
            }
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    useEffect(() => {
        const fetchMarcas = async () => {
            const result = await MarcaService.listAllMarca();
            setMarcas([{ id: 0, nombre: 'Seleccione una marca' }, ...(result || [])]);
        };
        fetchMarcas();
    }, []);

    return (
        <>
            <Dialog
                aria-label="Editar Producto"
                draggable
                modeless
                opened={dialogOpened.value}
                onOpenedChanged={(event) => { dialogOpened.value = event.detail.value; }}
                header={
                    <header
                        style={{
                            background: 'linear-gradient(90deg, #232323 60%, #181818 100%)',
                            borderRadius: '18px 18px 0 0',
                            padding: '1.2rem 0 0.7rem 0',
                            marginBottom: '1.2rem',
                            boxShadow: '0 4px 24px #23232399',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#232323"/>
                                <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 16l.94-2h7.8a2 2 0 0 0 1.92-1.44l2.12-7.06A1 1 0 0 0 19 4H6.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 5 17h14v-2H7.42a.5.5 0 0 1-.26-.08z" fill="#fff"/>
                            </svg>
                            <h2
                                style={{
                                    color: '#fff',
                                    textShadow: '0 2px 16px #000, 0 2px 8px #232323',
                                    fontWeight: 900,
                                    fontSize: '2em',
                                    margin: 0,
                                    textAlign: 'center',
                                    letterSpacing: '1px'
                                }}
                            >
                                Editar Producto
                            </h2>
                        </span>
                        <span
                            style={{
                                color: '#b3ff00',
                                fontSize: '1rem',
                                marginTop: '0.2rem',
                                textAlign: 'center',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Modifica los datos del producto
                        </span>
                    </header>
                }
            >
                <VerticalLayout
                    className="dialog-form-container"
                    theme="spacing"
                    style={{
                        width: '420px',
                        maxWidth: '98vw',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        alignItems: 'stretch',
                        gap: '1.2rem'
                    }}
                >
                    <VerticalLayout style={{ alignItems: 'stretch', gap: '1rem' }}>
                        <Upload
                            accept="image/png,image/jpeg"
                            maxFiles={1}
                            target="/api/upload"
                            onUploadSuccess={handleUploadSuccess}
                        />
                        {imagenUrl && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                                <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: 240, maxHeight: 180, borderRadius: 12, border: '2px solid #76b900', marginBottom: 8 }} />
                                <Button theme="error" onClick={() => setImagenUrl('')}>Eliminar imagen</Button>
                            </div>
                        )}
                        <TextField label="Nombre" placeholder='Ingrese el nombre del producto' aria-label='Ingrese el nombre del producto' value={nombre.value} onValueChanged={(evt) => (nombre.value = evt.detail.value)} style={{ width: '100%' }} />
                        <TextArea label="Descripción" placeholder='Ingrese la descripción del producto' aria-label='Ingrese la descripción del producto' value={descripcion.value} onValueChanged={(evt) => (descripcion.value = evt.detail.value)} style={{ width: '100%' }} />
                        <ComboBox
                            label="Marca"
                            placeholder="Seleccione la Marca"
                            items={Marca}
                            itemLabelPath="nombre"
                            itemValuePath="id"
                            value={marca.value}
                            onValueChanged={(evt) => (marca.value = evt.detail.value)}
                            style={{ width: '100%' }}
                        />
                        <TextField label="Precio" placeholder='Ingrese el precio del producto' aria-label='Ingrese el precio del producto' value={precio.value} onValueChanged={(evt) => (precio.value = evt.detail.value)} suffix="$" style={{ width: '100%' }} />
                        <ComboBox label="Categoría" placeholder="Seleccione la Categoría" items={Object.values(CategoriaEnum)} itemLabelPath="nombre" itemValuePath="id" value={categoria.value} onValueChanged={(evt) => (categoria.value = evt.detail.value)} style={{ width: '100%' }} />
                        <TextField
                            label="Stock"
                            type="number"
                            min={0}
                            value={stock.value === 0 ? '' : stock.value}
                            onValueChanged={e => {
                                const val = e.detail.value;
                                if (val === '' || val === null) {
                                    stock.value = 0; 
                                } else {
                                    const num = parseInt(val, 10);
                                    stock.value = isNaN(num) ? 0 : num;
                                }
                            }}
                            suffix="unidades"
                            style={{ width: '100%' }}
                        />
                    </VerticalLayout>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="registrar" onClick={updateProducto}>
                            Actualizar
                        </Button>
                    </div>
                </VerticalLayout>
            </Dialog>
            <AdminOnly>
            <Button theme="editar" onClick={open}>Editar</Button>
            </AdminOnly>
        </>
    );
}

