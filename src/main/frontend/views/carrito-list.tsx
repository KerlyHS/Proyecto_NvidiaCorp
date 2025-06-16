import { Button, Notification } from '@vaadin/react-components';
import { useCarrito } from './CarritoContext';
import { ProductoCard } from './producto-list';
import { useNavigate } from 'react-router';
import "themes/default/css/carrito-list.css";
import { useState, useEffect } from 'react';
import { PagoServices } from 'Frontend/generated/endpoints';

export default function CarritoList() {
  const { carrito, eliminar, setCarrito } = useCarrito();
  const navigate = useNavigate();
  const [cantidades, setCantidades] = useState<{ [id: number]: number }>(
    Object.fromEntries(carrito.map((item: any) => [item.id, item.cantidad || 1]))
  );
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [showPagoModal, setShowPagoModal] = useState(false);

  const handleCantidad = (id: number, valor: number) => {
    setCantidades((prev) => {
      const nuevaCantidad = Math.max(1, (prev[id] || 1) + valor);
      // Actualiza también el carrito global
      setCarrito((carritoActual) =>
        carritoActual.map((item) =>
          item.id === id ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
      return {
        ...prev,
        [id]: nuevaCantidad,
      };
    });
  };

  const iniciarPago = async () => {
    const resp = await PagoServices.checkout(10.00, 'USD');
    if (resp && typeof resp.id === 'string') {
      setCheckoutId(resp.id);
      setShowPagoModal(true);
    } else {
      Notification.show('No se pudo iniciar el pago', { position: 'top-center', duration: 3000, theme: 'error' });
    }
  };

  useEffect(() => {
    if (checkoutId && showPagoModal) {
      const script = document.createElement('script');
      script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [checkoutId, showPagoModal]);

  const handleComprar = async () => {
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
            onClick={iniciarPago}
          >
            Pagar
          </Button>
        </div>
      )}

      {/* MODAL DE PAGO */}
      {showPagoModal && (
        <div className="modal-pago-overlay">
          <div className="modal-pago-content">
            <button className="modal-pago-close" onClick={() => setShowPagoModal(false)}>✕</button>
            <h2 style={{ color: "#76b900", marginBottom: 16 }}>Completa tu pago</h2>
            {!mensaje && (
              <form
                className="paymentWidgets"
                data-brands="VISA MASTER AMEX"
              ></form>
            )}
            {mensaje && (
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem", color: mensaje.includes("éxito") ? "#76b900" : "#ff5722" }}>
                {mensaje}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}