import { Button, Dialog, TextArea, TextField, VerticalLayout, ComboBox, Upload } from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useState } from 'react';
import { Notification } from '@vaadin/react-components/Notification';
import handleError from 'Frontend/views/_ErrorHandler';
import { ProductoService } from 'Frontend/generated/endpoints';
import Marca from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Marca';
import CategoriaEnum from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/CategoriaEnum';
import { MarcaService } from 'Frontend/generated/endpoints';

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
    const [Marca, setMarcas] = useState<Marca[]>([]);
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
            setMarcas(result || []);
        };
        fetchMarcas();
    }, []);

    const createProducto = async () => {
        try {
            if (nombre.value.trim().length > 0 && descripcion.value.trim().length > 0 && marca.value > 0 && precio.value > 0 && categoria.value.trim().length > 0 && imagenUrl) {
                await ProductoService.createProducto(nombre.value, descripcion.value, marca.value, precio.value, categoria.value, imagenUrl, stock.value);
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
                    <h2 className="draggable" style={{
                        flex: 1, cursor: 'move', margin: 0, fontSize: '1.5em', fontWeight: 'bold', padding: 'var(--lumo-space-m) 0',
                    }}>
                        Registrar Producto
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={createProducto}>Registrar</Button>
                    </>
                )}
            >
                <VerticalLayout theme="spacing" style={{ width: '300px', maxWidth: '100%', alignItems: 'stretch' }}>
                    <VerticalLayout style={{ alignItems: 'stretch' }}>
                        <Upload
                            accept="image/png,image/jpeg"
                            maxFiles={1}
                            target="/api/upload"
                            onUploadSuccess={handleUploadSuccess}
                        />
                        {imagenUrl && (
                            <>
                                <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: 200, marginTop: 8 }} />
                                <Button theme="error" onClick={() => setImagenUrl('')}>Eliminar imagen</Button>
                            </>
                        )}
                        <TextField label="Nombre" placeholder='Ingrese el nombre de la Producto' aria-label='Ingrese el nombre de la Producto' value={nombre.value} onValueChanged={(evt) => (nombre.value = evt.detail.value)} />
                        <TextArea label="Descripcion" placeholder='Ingrese la descripcion de la Producto' aria-label='Ingrese la descripcion de la Producto' value={descripcion.value} onValueChanged={(evt) => (descripcion.value = evt.detail.value)} />
                        <ComboBox label="Marca" placeholder="Seleccione la Marca" items={Marca} itemLabelPath="nombre" itemValuePath="id" value={marca.value} onValueChanged={(evt) => (marca.value = evt.detail.value)} />
                        <TextField label="Precio" placeholder='Ingrese el precio de la Producto' aria-label='Ingrese el precio de la Producto' value={precio.value} onValueChanged={(evt) => (precio.value = evt.detail.value)} suffix="$" />
                        <ComboBox label="Categoria" placeholder="Seleccione la Categoria" items={Object.values(CategoriaEnum)} itemLabelPath="nombre" itemValuePath="id" value={categoria.value} onValueChanged={(evt) => (categoria.value = evt.detail.value)} />
                        <TextField label="Stock" type="number" min={0} value={stock.value} onValueChanged={e => stock.value = parseInt(e.detail.value)} suffix="unidades" />
                    </VerticalLayout>
                </VerticalLayout>
            </Dialog>
            <Button theme="registrar" onClick={open}>Registrar</Button>
        </>
    );
}

// Editar Producto
export function ProductoEntryFormUpdate(props: ProductoEntryFormPropsUpdate) {
    const Producto = props.arguments;
    const dialogOpened = useSignal(false);
    const [Marca, setMarcas] = useState<Marca[]>([]);
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

    return (
        <>
            <Dialog
                aria-label="Editar Producto"
                draggable
                modeless
                opened={dialogOpened.value}
                onOpenedChanged={(event) => { dialogOpened.value = event.detail.value; }}
                header={
                    <h2 className="draggable" style={{
                        flex: 1, cursor: 'move', margin: 0, fontSize: '1.5em', fontWeight: 'bold', padding: 'var(--lumo-space-m) 0',
                    }}>
                        Editar Producto
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={updateProducto}>Actualizar</Button>
                    </>
                )}
            >
                <VerticalLayout theme="spacing" style={{ width: '300px', maxWidth: '100%', alignItems: 'stretch' }}>
                    <VerticalLayout style={{ alignItems: 'stretch' }}>
                        <Upload
                            accept="image/png,image/jpeg"
                            maxFiles={1}
                            target="/api/upload"
                            onUploadSuccess={handleUploadSuccess}
                        />
                        {imagenUrl && (
                            <>
                                <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: 200, marginTop: 8 }} />
                                <Button theme="error" onClick={() => setImagenUrl('')}>Eliminar imagen</Button>
                            </>
                        )}
                        <TextField label="Nombre" placeholder='Ingrese el nombre de la Producto' aria-label='Ingrese el nombre de la Producto' value={nombre.value} onValueChanged={(evt) => (nombre.value = evt.detail.value)} />
                        <TextArea label="Descripcion" placeholder='Ingrese la descripcion de la Producto' aria-label='Ingrese la descripcion de la Producto' value={descripcion.value} onValueChanged={(evt) => (descripcion.value = evt.detail.value)} />
                        <ComboBox label="Marca" placeholder="Seleccione la Marca" items={Marca} itemLabelPath="nombre" itemValuePath="id" value={marca.value} onValueChanged={(evt) => (marca.value = evt.detail.value)} />
                        <TextField label="Precio" placeholder='Ingrese el precio de la Producto' aria-label='Ingrese el precio de la Producto' value={precio.value} onValueChanged={(evt) => (precio.value = evt.detail.value)} suffix="$" />
                        <ComboBox label="Categoria" placeholder="Seleccione la Categoria" items={Object.values(CategoriaEnum)} itemLabelPath="nombre" itemValuePath="id" value={categoria.value} onValueChanged={(evt) => (categoria.value = evt.detail.value)} />
                        <TextField label="Stock" type="number" min={0} value={stock.value} onValueChanged={e => stock.value = parseInt(e.detail.value)} suffix="unidades" />
                    </VerticalLayout>
                </VerticalLayout>
            </Dialog>
            <Button theme="editar" onClick={open}>Editar</Button>
        </>
    );
}

