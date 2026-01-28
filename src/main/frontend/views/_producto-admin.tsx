import { Button, Dialog, TextArea, TextField, VerticalLayout, ComboBox, Upload } from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useState } from 'react';
import { Notification } from '@vaadin/react-components/Notification';
import handleError from 'Frontend/views/_ErrorHandler';
import { ProductoService } from 'Frontend/generated/endpoints';
// Ahora esta importación SÍ funcionará porque arreglaste el backend
import CategoriaEnum from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/CategoriaEnum';
import Marca from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/Marca';
import { MarcaService } from 'Frontend/generated/endpoints';
import { AdminOnly } from './_proteccionRol';

type ProductoEntryFormProps = {
    onProductoCreated?: () => void;
};

type ProductoEntryFormPropsUpdate = {
    onProductoUpdated?: () => void;
    arguments: any;
};

// --- FORMULARIO DE REGISTRO ---
export function ProductoEntryForm(props: ProductoEntryFormProps) {
    const dialogOpened = useSignal(false);
    const [marcas, setMarcas] = useState<Marca[]>([]); 
    const [imagenUrl, setImagenUrl] = useState('');

    const handleUploadSuccess = (event: any) => {
        const response = event.detail.xhr.response;
        setImagenUrl(response); // Asumimos que el controller devuelve la URL
    };

    const open = () => { dialogOpened.value = true; };
    const close = () => { dialogOpened.value = false; };

    const nombre = useSignal('');
    const descripcion = useSignal('');
    const marca = useSignal(0);
    const precio = useSignal(0);
    // Usamos el tipo correcto para el Enum
    const categoria = useSignal<CategoriaEnum | undefined>(undefined);
    const stock = useSignal(0);

    useEffect(() => {
        // Carga de marcas
        MarcaService.listAllMarcas().then(result => {
             setMarcas([{ id: 0, nombre: 'Seleccione una marca' }, ...(result || [])]);
        }).catch(console.error);
    }, []);

    const createProducto = async () => {
        try {
            // Validamos que categoria.value no sea undefined
            if (nombre.value.trim().length > 0 && precio.value > 0 && categoria.value) {
                
                await ProductoService.createProducto(
                    nombre.value, 
                    descripcion.value, 
                    marca.value, 
                    precio.value, 
                    categoria.value, // Enviamos el Enum, no un string
                    imagenUrl, 
                    stock.value
                );
                
                Notification.show('Producto creado exitosamente', { theme: 'success' });
                if (props.onProductoCreated) props.onProductoCreated();
                
                // Limpiar campos
                nombre.value = ''; descripcion.value = ''; marca.value = 0;
                precio.value = 0; categoria.value = undefined; stock.value = 0;
                setImagenUrl('');
                dialogOpened.value = false;
            } else {
                Notification.show('Faltan datos obligatorios', { theme: 'error' });
            }
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    return (
        <>
            <Dialog header="Registrar Producto" opened={dialogOpened.value} onOpenedChanged={(e) => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ width: '400px', maxWidth: '100%' }}>
                    <Upload accept="image/*" maxFiles={1} target="/api/upload" onUploadSuccess={handleUploadSuccess} />
                    {!imagenUrl && <TextField label="O URL de imagen" onValueChanged={e => setImagenUrl(e.detail.value)} />}
                    
                    <TextField label="Nombre" value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
                    <TextArea label="Descripción" value={descripcion.value} onValueChanged={e => descripcion.value = e.detail.value} />
                    
                    <ComboBox
                        label="Marca"
                        items={marcas}
                        itemLabelPath="nombre"
                        itemValuePath="id"
                        value={marca.value}
                        onValueChanged={e => marca.value = e.detail.value}
                    />
                    
                    <TextField label="Precio" value={precio.value.toString()} onValueChanged={e => precio.value = parseFloat(e.detail.value) || 0} />
                    
                    <ComboBox 
                        label="Categoría" 
                        items={Object.values(CategoriaEnum)} // Lista automática del Enum
                        value={categoria.value} 
                        onValueChanged={e => {
                            // TypeScript necesita ayuda para saber que el string viene del Enum
                            categoria.value = e.detail.value as CategoriaEnum;
                        }} 
                    />
                    
                    <TextField label="Stock" value={stock.value.toString()} onValueChanged={e => stock.value = parseInt(e.detail.value) || 0} />

                    <div className="flex gap-m justify-end mt-m">
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={createProducto}>Guardar</Button>
                    </div>
                </VerticalLayout>
            </Dialog>

            <AdminOnly>
                <Button theme="primary" onClick={open}>Registrar Nuevo</Button>
            </AdminOnly>
        </>
    );
}

// --- FORMULARIO DE EDICIÓN ---
export function ProductoEntryFormUpdate(props: ProductoEntryFormPropsUpdate) {
    const item = props.arguments;
    const dialogOpened = useSignal(false);
    
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [imagenUrl, setImagenUrl] = useState(item?.imagen || '');

    const nombre = useSignal(item?.nombre || '');
    const descripcion = useSignal(item?.descripcion || '');
    const marca = useSignal(item?.id_marca || 0);
    const precio = useSignal(item?.precio || 0);
    // Intentamos mapear el string que viene del backend al Enum, si es posible
    const categoriaInicial = Object.values(CategoriaEnum).find(c => c.toString() === item?.categoria) as CategoriaEnum;
    const categoria = useSignal<CategoriaEnum | undefined>(categoriaInicial);
    const stock = useSignal(item?.stock || 0);

    const open = () => { dialogOpened.value = true; };
    const close = () => { dialogOpened.value = false; };

    useEffect(() => {
        MarcaService.listAllMarcas().then(result => {
             setMarcas([{ id: 0, nombre: 'Seleccione' }, ...(result || [])]);
        });
    }, []);

    const updateProducto = async () => {
        try {
            if (!categoria.value) {
                Notification.show('Categoría requerida', { theme: 'error' });
                return;
            }

            await ProductoService.updateProducto(
                parseInt(item.id), 
                nombre.value, 
                descripcion.value, 
                marca.value, 
                precio.value, 
                categoria.value, 
                imagenUrl, 
                stock.value
            );
            
            Notification.show('Actualizado correctamente', { theme: 'success' });
            if (props.onProductoUpdated) props.onProductoUpdated();
            dialogOpened.value = false;
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    return (
        <>
            <Dialog header={`Editar ${item?.nombre}`} opened={dialogOpened.value} onOpenedChanged={e => dialogOpened.value = e.detail.value}>
                <VerticalLayout style={{ width: '400px', maxWidth: '100%' }}>
                     <TextField label="URL Imagen" value={imagenUrl} onValueChanged={e => setImagenUrl(e.detail.value)} />
                     <TextField label="Nombre" value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
                     <TextArea label="Descripción" value={descripcion.value} onValueChanged={e => descripcion.value = e.detail.value} />
                     
                     <ComboBox
                        label="Marca"
                        items={marcas}
                        itemLabelPath="nombre" itemValuePath="id"
                        value={marca.value} onValueChanged={e => marca.value = e.detail.value}
                    />

                    <TextField label="Precio" value={precio.value.toString()} onValueChanged={e => precio.value = parseFloat(e.detail.value)} />
                    
                    <ComboBox 
                        label="Categoría" 
                        items={Object.values(CategoriaEnum)}
                        value={categoria.value} 
                        onValueChanged={e => categoria.value = e.detail.value as CategoriaEnum} 
                    />

                    <TextField label="Stock" value={stock.value.toString()} onValueChanged={e => stock.value = parseInt(e.detail.value)} />

                    <div className="flex gap-m justify-end mt-m">
                        <Button onClick={close}>Cancelar</Button>
                        <Button theme="primary" onClick={updateProducto}>Actualizar</Button>
                    </div>
                </VerticalLayout>
            </Dialog>

            <AdminOnly>
                <Button theme="tertiary" onClick={open}>✏️ Editar</Button>
            </AdminOnly>
        </>
    );
}