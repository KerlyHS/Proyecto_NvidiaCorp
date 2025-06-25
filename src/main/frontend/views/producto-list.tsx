import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextArea, TextField, VerticalLayout, ComboBox, HorizontalLayout, Select, Icon } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { ProductoService } from 'Frontend/generated/endpoints';
import Producto from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Producto';
import Marca from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Marca';
import CategoriaEnum from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/CategoriaEnum';
import { MarcaService } from 'Frontend/generated/endpoints';
import { useEffect, useState } from 'react';
import { useCarrito } from './CarritoContext';
import "themes/default/css/producto-list.css";
import { Upload } from '@vaadin/react-components';
import { useNavigate } from 'react-router';



export const config: ViewConfig = {
    title: 'Producto',
    menu: {
        icon: 'vaadin:clipboard-check',
        order: 2,
        title: 'Productos',
    },
};

type ProductoEntryFormProps = {
    onProductoCreated?: () => void;
};

type ProductoEntryFormPropsUpdate = {
    onProductoUpdated?: () => void;
};


// Create Producto
function ProductoEntryForm(props: ProductoEntryFormProps) {
    const dialogOpened = useSignal(false);
    const [Marca, setMarcas] = useState<Marca[]>([]);
    const [imagenUrl, setImagenUrl] = useState('');

    const handleUploadSuccess = (event: any) => {
        const response = event.detail.xhr.response;
        setImagenUrl(response); // Guarda la URL devuelta por el backend
    };

    const open = () => {
        dialogOpened.value = true;

    };

    const close = () => {
        dialogOpened.value = false;
    };

    const nombre = useSignal('');
    const descripcion = useSignal('');
    const marca = useSignal(0);
    const precio = useSignal(0);
    const categoria = useSignal("");

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
                const CategoriaEnum = categoria.value as CategoriaEnum;
                await ProductoService.createProducto(nombre.value, descripcion.value, marca.value, precio.value, categoria.value, imagenUrl);
                if (props.onProductoCreated) {
                    props.onProductoCreated();
                }
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
                        Registrar Producto
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={createProducto}>
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
                        <TextField label="Nombre"
                            placeholder='Ingrese el nombre de la Producto'
                            aria-label='Ingrese el nombre de la Producto'
                            value={nombre.value}
                            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
                        />
                        <TextArea label="Descripcion"
                            placeholder='Ingrese la descripcion de la Producto'
                            aria-label='Ingrese la descripcion de la Producto'
                            value={descripcion.value}
                            onValueChanged={(evt) => (descripcion.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Marca"
                            placeholder="Seleccione la Marca"
                            items={Marca}
                            itemLabelPath="nombre"
                            itemValuePath="id"
                            value={marca.value}
                            onValueChanged={(evt) => (marca.value = evt.detail.value)}
                        />
                        <TextField label="Precio"
                            placeholder='Ingrese el precio de la Producto'
                            aria-label='Ingrese el precio de la Producto'
                            value={precio.value}
                            onValueChanged={(evt) => (precio.value = evt.detail.value)}
                            suffix="$"
                        />
                        <ComboBox
                            label="Categoria"
                            placeholder="Seleccione la Categoria"
                            items={Object.values(CategoriaEnum)}
                            itemLabelPath="nombre"
                            itemValuePath="id"
                            value={categoria.value}
                            onValueChanged={(evt) => (categoria.value = evt.detail.value)}
                        />
                    </VerticalLayout>
                </VerticalLayout>
            </Dialog>
            <Button theme="registrar" onClick={open}>
                Registrar
            </Button>
        </>
    );
}


//UPDATE Producto

function ProductoEntryFormUpdate(props: ProductoEntryFormPropsUpdate) {
    const Producto = props.arguments;
    const dialogOpened = useSignal(false);
    const [Marca, setMarcas] = useState<Marca[]>([]);
    const [imagenUrl, setImagenUrl] = useState(Producto.imagen || '');

    const handleUploadSuccess = (event: any) => {
        const response = event.detail.xhr.response;
        setImagenUrl(response); // Guarda la URL devuelta por el backend
    };

    const open = () => {
        dialogOpened.value = true;

    };

    const close = () => {
        dialogOpened.value = false;
    };
    const ident = props.arguments.id;
    const nombre = useSignal('');
    const descripcion = useSignal('');
    const marca = useSignal(0);
    const precio = useSignal(0);
    const categoria = useSignal("");

    useEffect(() => {
        const fetchMarcas = async () => {
            const result = await MarcaService.listAllMarca();
            setMarcas(result || []);
        };
        fetchMarcas();
    }, []);

    const updateProducto = async () => {
        try {
            if (nombre.value.trim().length > 0 && descripcion.value.trim().length > 0 && marca.value > 0 && precio.value > 0 && categoria.value.trim().length > 0 && imagenUrl.trim().length > 0) {
                const CategoriaEnum = categoria.value as CategoriaEnum;
                await ProductoService.updateProducto(parseInt(ident), nombre.value, descripcion.value, marca.value, precio.value, categoria.value, imagenUrl);
                if (props.onProductoUpdated) {
                    props.onProductoUpdated();
                }
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
                        Editar Producto
                    </h2>
                }
                footerRenderer={() => (
                    <>
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={updateProducto}>
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
                        <TextField label="Nombre"
                            placeholder='Ingrese el nombre de la Producto'
                            aria-label='Ingrese el nombre de la Producto'
                            value={nombre.value}
                            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
                        />
                        <TextArea label="Descripcion"
                            placeholder='Ingrese la descripcion de la Producto'
                            aria-label='Ingrese la descripcion de la Producto'
                            value={descripcion.value}
                            onValueChanged={(evt) => (descripcion.value = evt.detail.value)}
                        />
                        <ComboBox
                            label="Marca"
                            placeholder="Seleccione la Marca"
                            items={Marca}
                            itemLabelPath="nombre"
                            itemValuePath="id"
                            value={marca.value}
                            onValueChanged={(evt) => (marca.value = evt.detail.value)}
                        />
                        <TextField label="Precio"
                            placeholder='Ingrese el precio de la Producto'
                            aria-label='Ingrese el precio de la Producto'
                            value={precio.value}
                            onValueChanged={(evt) => (precio.value = evt.detail.value)}
                            suffix="$"
                        />
                        <ComboBox
                            label="Categoria"
                            placeholder="Seleccione la Categoria"
                            items={Object.values(CategoriaEnum)}
                            itemLabelPath="nombre"
                            itemValuePath="id"
                            value={categoria.value}
                            onValueChanged={(evt) => (categoria.value = evt.detail.value)}
                        />
                    </VerticalLayout>
                </VerticalLayout>
            </Dialog>
            <Button theme="editar" onClick={open}>
                Editar
            </Button>
        </>
    );
}

//DELETE PRODUCTO




export function ProductoCard({ item, onProductoUpdated, onEliminar }: { item: any, onProductoUpdated?: () => void, onEliminar?: () => void }) {
    const { agregar, carrito } = useCarrito();
    const yaEnCarrito = carrito.some((p: any) => p.id === item.id);

    return (
        <div className="producto-card">
            {item.imagen && (
                <img className="producto-imagen" src={item.imagen} alt={item.nombre} />
            )}
            <div className="producto-info">
                <h3>{item.nombre}</h3>
                <p className="producto-descripcion">{item.descripcion}</p>
                <div className="producto-meta">
                    <span className="producto-marca">{item.marca}</span>
                    <span className="producto-categoria">{item.categoria}</span>
                </div>
                <div className="producto-precio">${item.precio}</div>
                {onEliminar ? (
                    <Button theme="error" onClick={onEliminar}>
                        Eliminar
                    </Button>
                ) : (
                    <Button
                        theme="primary"
                        onClick={() => agregar(item)}
                        disabled={yaEnCarrito}
                    >
                        {yaEnCarrito ? "En el carrito" : "Agregar al Carrito"}
                    </Button>
                )}
                {onProductoUpdated && (
                    <ProductoEntryFormUpdate arguments={item} onProductoUpdated={onProductoUpdated} />
                )}
            </div>
        </div>
    );
}


export default function ProductoListView() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const criterio = useSignal('');
    const text = useSignal('');
    const navigate = useNavigate();
    const itemSelect = [
        { label: 'Nombre', value: 'nombre' },
        { label: 'Descripcion', value: 'descripcion' },
        { label: 'Precio', value: 'precio' },
        { label: 'Categoria', value: 'categoria' },
    ];

    const cargarProductos = async () => {
        const data = await ProductoService.listAll();
        setProductos(data);
        console.log("Productos recibidos:", data);
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const search = async () => {
        try {
            if (!criterio.value || !text.value) {
                Notification.show('Ingrese criterio y texto de búsqueda', { duration: 3000, position: 'top-center', theme: 'error' });
                return;
            }
            ProductoService.busqueda(criterio.value, text.value).then(function (data) {
                setProductos(data);
                console.log("Resultados de búsqueda:", data);
            });
            Notification.show('Busqueda realizada', { duration: 3000, position: 'bottom-end', theme: 'success' });
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    return (
        <main
            className="w-full h-full flex flex-col box-border gap-s p-m"
            style={{
                minHeight: '100vh',
                background: 'transparent', 
            }}
        >
            <ViewToolbar
                title={
                    <span style={{ color: '#76b900', fontWeight: 900, fontSize: '2rem', letterSpacing: 2 }}>
                        Productos
                    </span>
                }
            >
                <Group>
                    <Button
                        theme="primary"
                        style={{
                            background: '#76b900',
                            color: '#0f0f0f',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            marginRight: '1rem',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                        onClick={() => navigate('/carrito-list')}
                    >
                        <Icon icon="vaadin:cart" style={{ marginRight: 8 }} />
                        Ver Carrito
                    </Button>
                    <ProductoEntryForm onProductoCreated={cargarProductos} />
                </Group>
            </ViewToolbar>
            <HorizontalLayout className="producto-barra-busqueda" theme="spacing">
              <Select
                className="producto-select"
                items={itemSelect}
                value={criterio.value}
                onValueChanged={(e) => (criterio.value = e.detail.value)}
                label="Criterio"
                style={{ minWidth: 160 }}
              />
              <TextField
                className="producto-busqueda-input"
                placeholder="Buscar producto..."
                style={{ width: '50%' }}
                value={text.value}
                onValueChanged={(evt) => (text.value = evt.detail.value)}
              >
                <Icon slot="prefix" icon="vaadin:search" />
              </TextField>
              <Button
                onClick={search}
                theme="primary"
                className="producto-buscar-btn"
              >
                BUSCAR
              </Button>
              <Button
                onClick={cargarProductos}
                theme="secondary"
                className="producto-ver-todo-btn"
              >
                Ver toda la lista
              </Button>
            </HorizontalLayout>
            <div className="producto-grid">
                {productos.map((item: any, idx: number) => (
                    <ProductoCard key={item.id ?? idx} item={item} onProductoUpdated={cargarProductos} />
                ))}
            </div>
        </main>
    );
}

