import { Button, Notification } from '@vaadin/react-components';
import { useCarrito } from './CarritoContext';
import { ProductoCard } from './producto-list';
import { useNavigate } from 'react-router';
import "themes/default/css/carrito-list.css";
import { useState } from 'react';

export default function CarritoList() {
  const { carrito, eliminar, setCarrito } = useCarrito();
  const navigate = useNavigate();
  const [cantidades, setCantidades] = useState<{ [id: number]: number }>(
    Object.fromEntries(carrito.map((item: any) => [item.id, item.cantidad || 1]))
  );

  const handleCantidad = (id: number, valor: number) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + valor),
    }));
  };

  const handleComprar = async () => {
  // mandar datos al factuea
    navigate('/Pago-Form');
  };

  return (
    <main className="carrito-main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="carrito-title">🛒 Carrito de compras</h1>
        <Button
          theme="secondary"
          style={{
            background: '#fff',
            color: '#76b900',
            fontWeight: 'bold',
            border: '2px solid #76b900',
            borderRadius: 8,
            fontSize: '1.1rem',
          }}
          onClick={() => navigate('/producto-list')}
        >
          Ver Catálogo de Productos
        </Button>
      </div>
      {carrito.length === 0 ? (
        <p className="carrito-vacio">El carrito está vacío.</p>
      ) : (
        <div className="producto-grid">
          {carrito.map((item) => (
            <div key={item.id} className="producto-card">
              <ProductoCard
                item={item}
                onEliminar={() => eliminar(item.id)}
              />
              <div className="carrito-cantidad-selector">
                <Button
                  theme="tertiary"
                  className="carrito-cantidad-btn"
                  onClick={() => handleCantidad(item.id, -1)}
                >-</Button>
                <span className="carrito-cantidad-num">{cantidades[item.id] || 1}</span>
                <Button
                  theme="tertiary"
                  className="carrito-cantidad-btn"
                  onClick={() => handleCantidad(item.id, 1)}
                >+</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {carrito.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Button
            theme="primary"
            style={{
              background: 'linear-gradient(90deg, #76b900 60%, #b3ff00 100%)',
              color: '#222',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              borderRadius: 12,
              padding: '0.8rem 2.5rem',
              boxShadow: '0 4px 16px #76b90044',
              border: 'none',
            }}
            onClick={handleComprar}
          >
            Finalizar Compra
          </Button>
        </div>
      )}
    </main>
  );
}