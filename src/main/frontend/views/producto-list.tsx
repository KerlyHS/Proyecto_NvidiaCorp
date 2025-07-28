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
import { ProductoEntryForm, ProductoEntryFormUpdate } from './producto-admin';


function CarritoNotification({ producto, isVisible, onClose }: {
    producto: any | null,
    isVisible: boolean,
    onClose: () => void
}) {
    const navigate = useNavigate();

    useEffect(() => {
        if (isVisible && producto) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, producto, onClose]);

    const handleVerCarrito = () => {
        onClose();
        navigate('/carrito-list');
    };

    if (!isVisible || !producto) return null;

    return (
        <div className={`carrito-notification ${isVisible ? 'show' : 'hide'}`}>
            <div className="carrito-notification-icon">🛒</div>

            {producto.imagen && (
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="carrito-notification-imagen"
                />
            )}

            <div className="carrito-notification-content">
                <p className="carrito-notification-titulo">¡Agregado al carrito!</p>
                <p className="carrito-notification-producto">{producto.nombre}</p>
            </div>

            <div className="carrito-notification-actions">
                <button
                    className="carrito-notification-ver-btn"
                    onClick={handleVerCarrito}
                >
                    🛒 Ver
                </button>

                <button
                    className="carrito-notification-close"
                    onClick={onClose}
                    aria-label="Cerrar notificación"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}


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

//DELETE PRODUCTO




export function ProductoCard({ item, onProductoUpdated, onEliminar }: { item: any, onProductoUpdated?: () => void, onEliminar?: () => void }) {
    const { agregar, carrito } = useCarrito();
    const navigate = useNavigate();
    const yaEnCarrito = carrito.some((p: any) => p.id === item.id);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationProduct, setNotificationProduct] = useState<any>(null);

    const handleCarritoAction = () => {
        if (yaEnCarrito) {
            navigate('/carrito-list');
        } else {
            agregar(item);
            setNotificationProduct(item);
            setShowNotification(true);
        }
    };

    const closeNotification = () => {
        setShowNotification(false);
        setTimeout(() => {
            setNotificationProduct(null);
        }, 500);
    };

    return (
        <>
            <div className="producto-card">
                {item.imagen && (
                    <img className="producto-imagen" src={item.imagen} alt={item.nombre} />
                )}
                <div className="producto-info">
                    <h3>{item.nombre}</h3>
                    <div className="producto-meta">
                        <span className="producto-marca">{item.marca}</span>
                        <span className="producto-categoria">{item.categoria}</span>
                    </div>
                    <div className="producto-precio">${item.precio}</div>
                    <div>Stock: {item.stock ?? 0}</div>

                    {onEliminar ? (
                        <Button
                            theme="error"
                            onClick={onEliminar}
                            className="producto-btn-eliminar"
                        >
                            🗑️ Eliminar del Carrito
                        </Button>
                    ) : (
                        <Button
                            theme="primary"
                            disabled={item.stock <= 0}
                            onClick={handleCarritoAction}
                            className={`producto-btn-carrito ${yaEnCarrito ? 'en-carrito' : 'agregar'}`}
                        >
                            {item.stock > 0
                                ? yaEnCarrito ? "🛒 Ver en Carrito" : "➕ Agregar al Carrito"
                                : "Agotado"}
                        </Button>
                    )}

                    {onProductoUpdated && (
                        <div className="producto-editar-container">
                            <ProductoEntryFormUpdate arguments={item} onProductoUpdated={onProductoUpdated} />
                        </div>
                    )}
                </div>

                <div className="producto-descripcion-overlay">
                    <p>{item.descripcion || "No hay descripción disponible"}</p>
                </div>
            </div>
            <CarritoNotification
                producto={notificationProduct}
                isVisible={showNotification}
                onClose={closeNotification}
            />
        </>
    );
}

export default function ProductoListView() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
    const [filtrosActivos, setFiltrosActivos] = useState<FiltrosState>({
        categorias: [],
        tiposGPU: [],
        series: []
    });

    const criterio = useSignal('');
    const text = useSignal('');
    const navigate = useNavigate();

    const itemSelect = [
        { label: '🏷️ Nombre', value: 'nombre' },
        { label: '💰 Precio', value: 'precio' },
    ];

    const cargarProductos = async () => {
        const data = await ProductoService.listAll();
        setProductos(data);
        setProductosFiltrados(data);
        console.log("Productos recibidos:", data);
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const aplicarFiltros = (productos: Producto[], filtros: FiltrosState): Producto[] => {
        return productos.filter(producto => {
            if (filtros.categorias.length > 0) {
                const categoria = producto.categoria || 'Sin categoría';
                if (!filtros.categorias.includes(categoria)) {
                    return false;
                }
            }
            if (filtros.tiposGPU.length > 0) {
                const nombre = producto.nombre?.toLowerCase() || '';
                let tipoEncontrado = false;

                for (const tipo of filtros.tiposGPU) {
                    if (tipo === 'RTX' && nombre.includes('rtx')) {
                        tipoEncontrado = true;
                        break;
                    } else if (tipo === 'GTX' && nombre.includes('gtx')) {
                        tipoEncontrado = true;
                        break;
                    } else if (tipo === 'Otros' && !nombre.includes('rtx') && !nombre.includes('gtx')) {
                        tipoEncontrado = true;
                        break;
                    }
                }
                if (!tipoEncontrado) {
                    return false;
                }
            }
            if (filtros.series.length > 0) {
                const nombre = producto.nombre?.toLowerCase() || '';
                let serieEncontrada = false;

                for (const serie of filtros.series) {
                    if (serie === 'Serie 5000' && (nombre.includes('50') || nombre.includes('5090') || nombre.includes('5080') || nombre.includes('5070'))) {
                        serieEncontrada = true;
                        break;
                    } else if (serie === 'Serie 4000' && (nombre.includes('40') || nombre.includes('4090') || nombre.includes('4080') || nombre.includes('4070'))) {
                        serieEncontrada = true;
                        break;
                    } else if (serie === 'Serie 3000' && (nombre.includes('30') || nombre.includes('3090') || nombre.includes('3080') || nombre.includes('3070'))) {
                        serieEncontrada = true;
                        break;
                    } else if (serie === 'Serie 2000' && (nombre.includes('20') || nombre.includes('2080') || nombre.includes('2070') || nombre.includes('2060'))) {
                        serieEncontrada = true;
                        break;
                    } else if (serie === 'Otras Series' && !nombre.match(/[2-5][0-9]/)) {
                        serieEncontrada = true;
                        break;
                    }
                }
                if (!serieEncontrada) {
                    return false;
                }
            }
            return true;
        });
    };

    useEffect(() => {
        const productosFiltrados = aplicarFiltros(productos, filtrosActivos);
        setProductosFiltrados(productosFiltrados);
    }, [productos, filtrosActivos]);

    const handleFiltrosChange = (nuevosFiltros: FiltrosState) => {
        setFiltrosActivos(nuevosFiltros);
    };

    const handleRemoveFiltro = (tipo: keyof FiltrosState, valor: string) => {
        const nuevosFiltros = { ...filtrosActivos };
        nuevosFiltros[tipo] = nuevosFiltros[tipo].filter(item => item !== valor);
        setFiltrosActivos(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        setFiltrosActivos({
            categorias: [],
            tiposGPU: [],
            series: []
        });
    };

    const search = async () => {
        try {
            if (!criterio.value || !text.value) {
                Notification.show('Por favor, selecciona un criterio e ingresa texto para buscar', {
                    duration: 4000,
                    position: 'top-center',
                    theme: 'error'
                });
                return;
            }
            ProductoService.busqueda(criterio.value, text.value).then(function (data) {
                setProductos(data);
                console.log("Resultados de busqueda:", data);
                Notification.show(`Se encontraron ${data.length} resultado(s)`, {
                    duration: 3000,
                    position: 'bottom-end',
                    theme: 'success'
                });
            });
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    function FiltrosPanel({
        productos,
        filtrosActivos,
        onFiltrosChange,
        onLimpiarFiltros
    }: {
        productos: any[];
        filtrosActivos: FiltrosState;
        onFiltrosChange: (filtros: FiltrosState) => void;
        onLimpiarFiltros: () => void;
    }) {
        const [seccionesAbiertas, setSeccionesAbiertas] = useState({
            categorias: true,
            tiposGPU: true,
            series: true
        });

        const contarPorCategoria = () => {
            const contador: { [key: string]: number } = {};
            productos.forEach(producto => {
                const categoria = producto.categoria || 'Sin categoría';
                contador[categoria] = (contador[categoria] || 0) + 1;
            });
            return contador;
        };

        const contarPorTipoGPU = () => {
            const contador: { [key: string]: number } = {};
            productos.forEach(producto => {
                const nombre = producto.nombre?.toLowerCase() || '';
                if (nombre.includes('rtx')) {
                    contador['RTX'] = (contador['RTX'] || 0) + 1;
                } else if (nombre.includes('gtx')) {
                    contador['GTX'] = (contador['GTX'] || 0) + 1;
                } else {
                    contador['Otros'] = (contador['Otros'] || 0) + 1;
                }
            });
            return contador;
        };

        const contarPorSerie = () => {
            const contador: { [key: string]: number } = {};
            productos.forEach(producto => {
                const nombre = producto.nombre?.toLowerCase() || '';

                if (nombre.includes('50') || nombre.includes('5090') || nombre.includes('5080') || nombre.includes('5070')) {
                    contador['Serie 5000'] = (contador['Serie 5000'] || 0) + 1;
                } else if (nombre.includes('40') || nombre.includes('4090') || nombre.includes('4080') || nombre.includes('4070')) {
                    contador['Serie 4000'] = (contador['Serie 4000'] || 0) + 1;
                } else if (nombre.includes('30') || nombre.includes('3090') || nombre.includes('3080') || nombre.includes('3070')) {
                    contador['Serie 3000'] = (contador['Serie 3000'] || 0) + 1;
                } else if (nombre.includes('20') || nombre.includes('2080') || nombre.includes('2070') || nombre.includes('2060')) {
                    contador['Serie 2000'] = (contador['Serie 2000'] || 0) + 1;
                } else {
                    contador['Otras Series'] = (contador['Otras Series'] || 0) + 1;
                }
            });
            return contador;
        };

        const toggleSeccion = (seccion: keyof typeof seccionesAbiertas) => {
            setSeccionesAbiertas(prev => ({
                ...prev,
                [seccion]: !prev[seccion]
            }));
        };

        const handleFiltroChange = (tipo: keyof FiltrosState, valor: string, checked: boolean) => {
            const nuevosFiltros = { ...filtrosActivos };

            if (checked) {
                if (!nuevosFiltros[tipo].includes(valor)) {
                    nuevosFiltros[tipo] = [...nuevosFiltros[tipo], valor];
                }
            } else {
                nuevosFiltros[tipo] = nuevosFiltros[tipo].filter(item => item !== valor);
            }

            onFiltrosChange(nuevosFiltros);
        };

        const contadoresCategorias = contarPorCategoria();
        const contadoresTiposGPU = contarPorTipoGPU();
        const contadoresSeries = contarPorSerie();

        const totalFiltrosActivos = filtrosActivos.categorias.length +
            filtrosActivos.tiposGPU.length +
            filtrosActivos.series.length;

        return (
            <div className="filtros-panel">
                <h3 className="filtros-titulo">
                    🔍 Filtros {totalFiltrosActivos > 0 && `(${totalFiltrosActivos})`}
                </h3>
                <div className="filtro-seccion">
                    <div
                        className="filtro-seccion-titulo"
                        onClick={() => toggleSeccion('categorias')}
                    >
                        📂 Categorías
                        <span>{seccionesAbiertas.categorias ? '▼' : '▶'}</span>
                    </div>
                    <div className={`filtro-seccion-contenido ${!seccionesAbiertas.categorias ? 'collapsed' : ''}`}>
                        {Object.entries(contadoresCategorias).map(([categoria, count]) => (
                            <div key={categoria} className="filtro-opcion">
                                <input
                                    type="checkbox"
                                    id={`categoria-${categoria}`}
                                    className="filtro-checkbox"
                                    checked={filtrosActivos.categorias.includes(categoria)}
                                    onChange={(e) => handleFiltroChange('categorias', categoria, e.target.checked)}
                                />
                                <label htmlFor={`categoria-${categoria}`} className="filtro-label">
                                    <span>{categoria}</span>
                                    <span className="filtro-count">{count}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="filtro-seccion">
                    <div
                        className="filtro-seccion-titulo"
                        onClick={() => toggleSeccion('tiposGPU')}
                    >
                        🎮 Tipo de GPU
                        <span>{seccionesAbiertas.tiposGPU ? '▼' : '▶'}</span>
                    </div>
                    <div className={`filtro-seccion-contenido ${!seccionesAbiertas.tiposGPU ? 'collapsed' : ''}`}>
                        {Object.entries(contadoresTiposGPU).map(([tipo, count]) => (
                            <div key={tipo} className="filtro-opcion">
                                <input
                                    type="checkbox"
                                    id={`tipo-${tipo}`}
                                    className="filtro-checkbox"
                                    checked={filtrosActivos.tiposGPU.includes(tipo)}
                                    onChange={(e) => handleFiltroChange('tiposGPU', tipo, e.target.checked)}
                                />
                                <label htmlFor={`tipo-${tipo}`} className="filtro-label">
                                    <span>{tipo}</span>
                                    <span className="filtro-count">{count}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="filtro-seccion">
                    <div
                        className="filtro-seccion-titulo"
                        onClick={() => toggleSeccion('series')}
                    >
                        🏷️ Series
                        <span>{seccionesAbiertas.series ? '▼' : '▶'}</span>
                    </div>
                    <div className={`filtro-seccion-contenido ${!seccionesAbiertas.series ? 'collapsed' : ''}`}>
                        {Object.entries(contadoresSeries).map(([serie, count]) => (
                            <div key={serie} className="filtro-opcion">
                                <input
                                    type="checkbox"
                                    id={`serie-${serie}`}
                                    className="filtro-checkbox"
                                    checked={filtrosActivos.series.includes(serie)}
                                    onChange={(e) => handleFiltroChange('series', serie, e.target.checked)}
                                />
                                <label htmlFor={`serie-${serie}`} className="filtro-label">
                                    <span>{serie}</span>
                                    <span className="filtro-count">{count}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                {totalFiltrosActivos > 0 && (
                    <Button
                        onClick={onLimpiarFiltros}
                        className="filtros-limpiar"
                    >
                        🗑️ Limpiar Filtros
                    </Button>
                )}
            </div>
        );
    }

    function FiltrosActivos({
        filtros,
        onRemoveFiltro
    }: {
        filtros: FiltrosState;
        onRemoveFiltro: (tipo: keyof FiltrosState, valor: string) => void;
    }) {
        const todosFiltros = [
            ...filtros.categorias.map(c => ({ tipo: 'categorias' as const, valor: c, label: `📂 ${c}` })),
            ...filtros.tiposGPU.map(t => ({ tipo: 'tiposGPU' as const, valor: t, label: `🎮 ${t}` })),
            ...filtros.series.map(s => ({ tipo: 'series' as const, valor: s, label: `🏷️ ${s}` })),
        ];

        if (todosFiltros.length === 0) return null;

        return (
            <div className="filtros-activos">
                {todosFiltros.map(filtro => (
                    <div key={`${filtro.tipo}-${filtro.valor}`} className="filtro-activo-tag">
                        {filtro.label}
                        <button
                            className="filtro-activo-remove"
                            onClick={() => onRemoveFiltro(filtro.tipo, filtro.valor)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="producto-main-container">
            <FiltrosPanel
                productos={productos}
                filtrosActivos={filtrosActivos}
                onFiltrosChange={handleFiltrosChange}
                onLimpiarFiltros={limpiarFiltros}
            />

            <div className="contenido-principal">
                <ViewToolbar
                    title={
                        <span className="producto-toolbar-titulo">
                            Productos ({productosFiltrados.length})
                        </span>
                    }
                >
                    <Group>
                    </Group>
                </ViewToolbar>

                <FiltrosActivos
                    filtros={filtrosActivos}
                    onRemoveFiltro={handleRemoveFiltro}
                />

                <div className="producto-barra-busqueda">
                    <Select
                        className="producto-select"
                        items={itemSelect}
                        value={criterio.value}
                        onValueChanged={(e) => (criterio.value = e.detail.value)}
                        label="🔍 Buscar por"
                        placeholder="Selecciona criterio..."
                    />

                    <TextField
                        className="producto-busqueda-input"
                        placeholder="¿Qué producto estas buscando? 🎯"
                        value={text.value}
                        onValueChanged={(evt) => (text.value = evt.detail.value)}
                        onKeyDown={handleKeyPress}
                        clearButtonVisible
                    >
                        <Icon slot="prefix" icon="vaadin:search" style={{ color: '#76b900', fontSize: '1.2rem' }} />
                    </TextField>

                    <Button
                        onClick={search}
                        theme="primary"
                        className="producto-buscar-btn"
                        disabled={!criterio.value || !text.value}
                    >
                        <Icon icon="vaadin:search" style={{ marginRight: '8px', fontSize: '1.1rem' }} />
                        Buscar
                    </Button>

                    <Button
                        onClick={cargarProductos}
                        theme="secondary"
                        className="producto-ver-todo-btn"
                    >
                        <Icon icon="vaadin:refresh" style={{ marginRight: '8px', fontSize: '1.1rem' }} />
                        Ver Todo
                    </Button>
                </div>

                <div style={{ margin: '0rem 11rem 0rem', display: 'flex', justifyContent: 'flex-start' }}>
                    <ProductoEntryForm
                        onProductoCreated={cargarProductos}
                        className="producto-btn-registrar"
                    />
                </div>

                <div className="producto-grid">
                    {productosFiltrados.length === 0 ? (
                        <div className="producto-sin-resultados">
                            🔍 No se encontraron productos
                            <br />
                            <span className="producto-sin-resultados-subtitle">
                                Intenta con otros criterios de búsqueda o filtros
                            </span>
                        </div>
                    ) : (
                        productosFiltrados.map((item: any, idx: number) => (
                            <ProductoCard
                                key={item.id ?? idx}
                                item={item}
                                onProductoUpdated={cargarProductos}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

interface FiltrosState {
    categorias: string[];
    tiposGPU: string[];
    series: string[];
}

