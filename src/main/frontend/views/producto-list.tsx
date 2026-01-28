import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, TextField, Select, Icon } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { ProductoService } from 'Frontend/generated/endpoints';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCarrito } from './_CarritoContext'; // Importación funcional
import "themes/default/css/producto-list.css"; // CSS Estético
import { AdminOnly } from './_proteccionRol'; // Importación funcional
import { ProductoEntryForm, ProductoEntryFormUpdate } from './_producto-admin'; // Importación funcional
import ProductoDTO from 'Frontend/generated/org/proyecto/nvidiacorp/base/controller/services/ProductoService/ProductoDTO'; // O el path correcto a tu DTO

export const config: ViewConfig = {
    title: 'Catálogo',
    menu: { icon: 'vaadin:cart', order: 0, title: 'Catálogo' },
};

// --- Notificación Estética del Código Base ---
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
                <button className="carrito-notification-ver-btn" onClick={handleVerCarrito}>
                    🛒 Ver
                </button>
                <button className="carrito-notification-close" onClick={onClose}>✕</button>
            </div>
        </div>
    );
}

// --- Tarjeta Fusionada: Estética Base + Funcionalidad Nueva ---
export function ProductoCard({ item, onProductoUpdated, onEliminar }: { item: any, onProductoUpdated?: () => void, onEliminar?: () => void }) {
    const { agregar, carrito } = useCarrito();
    const navigate = useNavigate();
    // Lógica funcional: verificar si está en carrito por ID
    const yaEnCarrito = carrito.some((p: any) => p.id === item.id);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationProduct, setNotificationProduct] = useState<any>(null);

    const handleCarritoAction = () => {
        if (yaEnCarrito) {
            navigate('/carrito-list');
        } else {
            if (item.stock > 0) {
                agregar(item);
                setNotificationProduct(item);
                setShowNotification(true);
            } else {
                Notification.show('Producto Agotado', { theme: 'error' });
            }
        }
    };

    const closeNotification = () => {
        setShowNotification(false);
        setTimeout(() => setNotificationProduct(null), 500);
    };

    return (
        <>
            <div className="producto-card">
                {item.imagen ? (
                    <img className="producto-imagen" src={item.imagen} alt={item.nombre} />
                ) : (
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>📷</div>
                )}
                
                <div className="producto-info">
                    <h3>{item.nombre}</h3>
                    <div className="producto-meta">
                        {/* Cambio Funcional: item.marcaNombre en lugar de item.marca */}
                        <span className="producto-marca">{item.marcaNombre || "General"}</span>
                        <span className="producto-categoria">{item.categoria}</span>
                    </div>
                    
                    <div className="producto-precio">${parseFloat(item.precio).toFixed(2)}</div>
                    
                    <div style={{ color: item.stock > 0 ? '#76b900' : 'red', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>
                        {item.stock > 0 ? `Stock: ${item.stock}` : 'Agotado'}
                    </div>

                    {onEliminar ? (
                        <Button theme="error" onClick={onEliminar} className="producto-btn-eliminar">
                            🗑️ Eliminar
                        </Button>
                    ) : (
                        <Button
                            theme="primary"
                            disabled={item.stock <= 0}
                            onClick={handleCarritoAction}
                            className={`producto-btn-carrito ${yaEnCarrito ? 'en-carrito' : 'agregar'}`}
                        >
                            {item.stock > 0 ? (yaEnCarrito ? "🛒 Ver en Carrito" : "➕ Agregar") : "Agotado"}
                        </Button>
                    )}

                    {/* Funcionalidad Nueva: Protección Admin */}
                    <AdminOnly>
                        {onProductoUpdated && (
                            <div className="producto-editar-container">
                                <ProductoEntryFormUpdate arguments={item} onProductoUpdated={onProductoUpdated} />
                            </div>
                        )}
                    </AdminOnly>
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

// --- Componentes Auxiliares de Filtros (Estética Base) ---
interface FiltrosState {
    categorias: string[];
    tiposGPU: string[];
    series: string[];
}

function FiltrosPanel({ productos, filtrosActivos, onFiltrosChange, onLimpiarFiltros }: any) {
    const [seccionesAbiertas, setSeccionesAbiertas] = useState({ categorias: true, tiposGPU: true, series: true });

    // Contadores basados en los datos actuales
    const contarPorCategoria = () => {
        const contador: { [key: string]: number } = {};
        productos.forEach((producto:any) => {
            const cat = producto.categoria || 'Sin categoría';
            contador[cat] = (contador[cat] || 0) + 1;
        });
        return contador;
    };

    const contarPorTipoGPU = () => {
        const contador: { [key: string]: number } = {};
        productos.forEach((producto:any) => {
            const nombre = producto.nombre?.toLowerCase() || '';
            if (nombre.includes('rtx')) contador['RTX'] = (contador['RTX'] || 0) + 1;
            else if (nombre.includes('gtx')) contador['GTX'] = (contador['GTX'] || 0) + 1;
            else contador['Otros'] = (contador['Otros'] || 0) + 1;
        });
        return contador;
    };

    const contarPorSerie = () => {
        const contador: { [key: string]: number } = {};
        productos.forEach((producto:any) => {
            const nombre = producto.nombre?.toLowerCase() || '';
            if (nombre.includes('50') || nombre.includes('5090')) contador['Serie 5000'] = (contador['Serie 5000'] || 0) + 1;
            else if (nombre.includes('40') || nombre.includes('4090')) contador['Serie 4000'] = (contador['Serie 4000'] || 0) + 1;
            else if (nombre.includes('30') || nombre.includes('3090')) contador['Serie 3000'] = (contador['Serie 3000'] || 0) + 1;
            else if (nombre.includes('20') || nombre.includes('2080')) contador['Serie 2000'] = (contador['Serie 2000'] || 0) + 1;
            else contador['Otras Series'] = (contador['Otras Series'] || 0) + 1;
        });
        return contador;
    };

    const toggleSeccion = (seccion: keyof typeof seccionesAbiertas) => {
        setSeccionesAbiertas(prev => ({ ...prev, [seccion]: !prev[seccion] }));
    };

    const handleFiltroChange = (tipo: keyof FiltrosState, valor: string, checked: boolean) => {
        const nuevosFiltros = { ...filtrosActivos };
        if (checked) {
            if (!nuevosFiltros[tipo].includes(valor)) nuevosFiltros[tipo] = [...nuevosFiltros[tipo], valor];
        } else {
            nuevosFiltros[tipo] = nuevosFiltros[tipo].filter((item: string) => item !== valor);
        }
        onFiltrosChange(nuevosFiltros);
    };

    const contadoresCategorias = contarPorCategoria();
    const contadoresTiposGPU = contarPorTipoGPU();
    const contadoresSeries = contarPorSerie();
    const totalFiltros = filtrosActivos.categorias.length + filtrosActivos.tiposGPU.length + filtrosActivos.series.length;

    return (
        <div className="filtros-panel">
            <h3 className="filtros-titulo">🔍 Filtros {totalFiltros > 0 && `(${totalFiltros})`}</h3>
            
            {/* Sección Categorías */}
            <div className="filtro-seccion">
                <div className="filtro-seccion-titulo" onClick={() => toggleSeccion('categorias')}>
                    📂 Categorías <span>{seccionesAbiertas.categorias ? '▼' : '▶'}</span>
                </div>
                <div className={`filtro-seccion-contenido ${!seccionesAbiertas.categorias ? 'collapsed' : ''}`}>
                    {Object.entries(contadoresCategorias).map(([cat, count]) => (
                        <div key={cat} className="filtro-opcion">
                            <input type="checkbox" id={`cat-${cat}`} className="filtro-checkbox"
                                checked={filtrosActivos.categorias.includes(cat)}
                                onChange={(e) => handleFiltroChange('categorias', cat, e.target.checked)} />
                            <label htmlFor={`cat-${cat}`} className="filtro-label">
                                <span>{cat}</span><span className="filtro-count">{count as any}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección GPU */}
            <div className="filtro-seccion">
                <div className="filtro-seccion-titulo" onClick={() => toggleSeccion('tiposGPU')}>
                    🎮 Tipo de GPU <span>{seccionesAbiertas.tiposGPU ? '▼' : '▶'}</span>
                </div>
                <div className={`filtro-seccion-contenido ${!seccionesAbiertas.tiposGPU ? 'collapsed' : ''}`}>
                    {Object.entries(contadoresTiposGPU).map(([tipo, count]) => (
                        <div key={tipo} className="filtro-opcion">
                            <input type="checkbox" id={`tipo-${tipo}`} className="filtro-checkbox"
                                checked={filtrosActivos.tiposGPU.includes(tipo)}
                                onChange={(e) => handleFiltroChange('tiposGPU', tipo, e.target.checked)} />
                            <label htmlFor={`tipo-${tipo}`} className="filtro-label">
                                <span>{tipo}</span><span className="filtro-count">{count as any}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección Series */}
            <div className="filtro-seccion">
                <div className="filtro-seccion-titulo" onClick={() => toggleSeccion('series')}>
                    🏷️ Series <span>{seccionesAbiertas.series ? '▼' : '▶'}</span>
                </div>
                <div className={`filtro-seccion-contenido ${!seccionesAbiertas.series ? 'collapsed' : ''}`}>
                    {Object.entries(contadoresSeries).map(([serie, count]) => (
                        <div key={serie} className="filtro-opcion">
                            <input type="checkbox" id={`serie-${serie}`} className="filtro-checkbox"
                                checked={filtrosActivos.series.includes(serie)}
                                onChange={(e) => handleFiltroChange('series', serie, e.target.checked)} />
                            <label htmlFor={`serie-${serie}`} className="filtro-label">
                                <span>{serie}</span><span className="filtro-count">{count as any}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {totalFiltros > 0 && (
                <Button onClick={onLimpiarFiltros} className="filtros-limpiar">🗑️ Limpiar Filtros</Button>
            )}
        </div>
    );
}

function FiltrosActivos({ filtros, onRemoveFiltro }: any) {
    const todos = [
        ...filtros.categorias.map((c:string) => ({ tipo: 'categorias', valor: c, label: `📂 ${c}` })),
        ...filtros.tiposGPU.map((t:string) => ({ tipo: 'tiposGPU', valor: t, label: `🎮 ${t}` })),
        ...filtros.series.map((s:string) => ({ tipo: 'series', valor: s, label: `🏷️ ${s}` })),
    ];
    if (todos.length === 0) return null;
    return (
        <div className="filtros-activos">
            {todos.map(f => (
                <div key={`${f.tipo}-${f.valor}`} className="filtro-activo-tag">
                    {f.label}
                    <button className="filtro-activo-remove" onClick={() => onRemoveFiltro(f.tipo, f.valor)}>✕</button>
                </div>
            ))}
        </div>
    );
}


// --- Componente Principal Fusionado ---
export default function ProductoListView() {
    // Estado funcional
    const [productos, setProductos] = useState<any[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<any[]>([]);
    const [filtrosActivos, setFiltrosActivos] = useState<FiltrosState>({
        categorias: [], tiposGPU: [], series: []
    });

    const criterio = useSignal('nombre');
    const text = useSignal('');
    const navigate = useNavigate();

    const itemSelect = [
        { label: '🏷️ Nombre', value: 'nombre' },
        { label: '📂 Categoría', value: 'categoria' }, // Ajustado para coincidir con backend
        { label: '🏢 Marca', value: 'marcaNombre' }   // Ajustado al DTO
    ];

    // Funcionalidad Nueva: Cargar DTOs
    const cargarProductos = async () => {
        try {
            const items = await ProductoService.listAllProductos();
            setProductos(items);
            // No seteamos filtrados aquí directamente para dejar que el useEffect de filtros maneje la lógica inicial
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => { cargarProductos(); }, []);

    // Lógica de Filtros (Estética Base adaptada a DTOs Nuevos)
    const aplicarFiltros = (lista: any[], filtros: FiltrosState) => {
        return lista.filter(producto => {
            // 1. Filtro por búsqueda de texto (del Nuevo)
            const termino = text.value.toLowerCase();
            if (termino) {
                const val = producto[criterio.value];
                if (!val || !String(val).toLowerCase().includes(termino)) return false;
            }

            // 2. Filtros Laterales (del Base)
            if (filtros.categorias.length > 0) {
                const cat = producto.categoria || 'Sin categoría'; // O toString() si es enum
                if (!filtros.categorias.includes(cat.toString())) return false;
            }
            if (filtros.tiposGPU.length > 0) {
                const nombre = producto.nombre?.toLowerCase() || '';
                let match = false;
                for (const t of filtros.tiposGPU) {
                    if (t === 'RTX' && nombre.includes('rtx')) match = true;
                    else if (t === 'GTX' && nombre.includes('gtx')) match = true;
                    else if (t === 'Otros' && !nombre.includes('rtx') && !nombre.includes('gtx')) match = true;
                }
                if (!match) return false;
            }
            if (filtros.series.length > 0) {
                const nombre = producto.nombre?.toLowerCase() || '';
                let match = false;
                for (const s of filtros.series) {
                    if (s === 'Serie 5000' && (nombre.includes('50') || nombre.includes('5090'))) match = true;
                    else if (s === 'Serie 4000' && (nombre.includes('40') || nombre.includes('4090'))) match = true;
                    else if (s === 'Serie 3000' && (nombre.includes('30') || nombre.includes('3090'))) match = true;
                    else if (s === 'Serie 2000' && (nombre.includes('20') || nombre.includes('2080'))) match = true;
                    else if (s === 'Otras Series' && !nombre.match(/[2-5][0-9]/)) match = true;
                }
                if (!match) return false;
            }
            return true;
        });
    };

    useEffect(() => {
        const resultado = aplicarFiltros(productos, filtrosActivos);
        setProductosFiltrados(resultado);
    }, [productos, filtrosActivos, text.value, criterio.value]); // Escuchamos text.value también

    const handleFiltrosChange = (nuevos: FiltrosState) => setFiltrosActivos(nuevos);
    const handleRemoveFiltro = (tipo: keyof FiltrosState, valor: string) => {
        const nuevos = { ...filtrosActivos };
        nuevos[tipo] = nuevos[tipo].filter(i => i !== valor);
        setFiltrosActivos(nuevos);
    };
    const limpiarFiltros = () => setFiltrosActivos({ categorias: [], tiposGPU: [], series: [] });

    // Renderizado (Estructura Estética Base con Botones Nuevos)
    return (
        <div className="producto-main-container">
            <FiltrosPanel
                productos={productos}
                filtrosActivos={filtrosActivos}
                onFiltrosChange={handleFiltrosChange}
                onLimpiarFiltros={limpiarFiltros}
            />

            <div className="contenido-principal">
                <ViewToolbar title={<span className="producto-toolbar-titulo">Productos ({productosFiltrados.length})</span>}>
                   <Group></Group>
                </ViewToolbar>

                <FiltrosActivos filtros={filtrosActivos} onRemoveFiltro={handleRemoveFiltro} />

                <div className="producto-barra-busqueda">
                    <Select
                        className="producto-select"
                        items={itemSelect}
                        value={criterio.value}
                        onValueChanged={(e) => criterio.value = e.detail.value}
                        label="🔍 Buscar por"
                    />

                    <TextField
                        className="producto-busqueda-input"
                        placeholder="Buscar producto..."
                        value={text.value}
                        onValueChanged={(e) => text.value = e.detail.value}
                        clearButtonVisible
                    >
                        <Icon slot="prefix" icon="vaadin:search" style={{ color: '#76b900' }} />
                    </TextField>

                    <Button onClick={cargarProductos} theme="secondary" className="producto-ver-todo-btn">
                        <Icon icon="vaadin:refresh" style={{ marginRight: '8px' }} /> Recargar
                    </Button>
                </div>

                <div style={{ margin: '0rem 11rem 0rem', display: 'flex', justifyContent: 'flex-start' }}>
                    {/* Funcionalidad Nueva: AdminOnly para crear */}
                    <AdminOnly>
                        <ProductoEntryForm onProductoCreated={cargarProductos} className="producto-btn-registrar" />
                    </AdminOnly>
                </div>

                <div className="producto-grid">
                    {productosFiltrados.length === 0 ? (
                        <div className="producto-sin-resultados">
                            🔍 No se encontraron productos
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