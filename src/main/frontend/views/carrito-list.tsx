import { Button, Notification } from '@vaadin/react-components';
import { useCarrito } from './CarritoContext';
import { ProductoCard } from './producto-list';
import { useNavigate, useLocation } from 'react-router';
import "themes/default/css/carrito-list.css";
import { useState, useEffect } from 'react';
import { PagoServices } from 'Frontend/generated/endpoints';
import { isLogin } from 'Frontend/generated/UsuarioServices';

export default function CarritoList() {
  const { carrito, eliminar, setCarrito } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();
  const [cantidades, setCantidades] = useState<{ [id: number]: number }>(
    Object.fromEntries(carrito.map((item: any) => [item.id, item.cantidad || 1]))
  );
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Cálculos del carrito
  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => {
      const cantidad = cantidades[item.id] || 1;
      return total + (item.precio * cantidad);
    }, 0);
  };

  const calcularIva = () => {
    return calcularSubtotal() * 0.15; // 15% IVA
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIva();
  };

  const handleCantidad = (id: number, valor: number) => {
    setCantidades((prev) => {
      const item = carrito.find(p => p.id === id);
      const stock = item?.stock ?? 1;
      let nuevaCantidad = Math.max(1, (prev[id] || 1) + valor);
      console.log("Stock:", stock, "Cantidad actual:", prev[id], "Nueva cantidad:", nuevaCantidad);
      if (nuevaCantidad > stock) {
        Notification.show('⚠️ No puedes superar el stock disponible', {
          position: 'top-center',
          duration: 3000,
          theme: 'error'
        });
        nuevaCantidad = stock;
      }
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
    const logueado = await isLogin();
    if (!logueado) {
      Notification.show('Inicie sesión para continuar con el pago', { duration: 3000, position: 'top-center', theme: 'error' });
      setTimeout(() => {
        navigate('/login', { state: { from: location.pathname } });
      }, 500); // Espera 0.5s para que el usuario vea la notificación
      return;
    }

    if (!aceptaTerminos) {
      Notification.show('⚠️ Debes aceptar los términos y condiciones para proceder con el pago', { 
        position: 'top-center', 
        duration: 5000, 
        theme: 'error' 
      });
      
      const terminosDiv = document.querySelector('.carrito-terminos');
      if (terminosDiv) {
        terminosDiv.classList.add('carrito-terminos-error');
        setTimeout(() => {
          terminosDiv.classList.remove('carrito-terminos-error');
        }, 3000);
      }
      
      const checkbox = document.getElementById('terminos');
      if (checkbox) {
        checkbox.focus();
        checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    const total = calcularTotal();
    const resp = await PagoServices.checkout(total, 'USD');
    if (resp && typeof resp.id === 'string') {
      setCheckoutId(resp.id);
      setShowPagoModal(true);
    } else {
      Notification.show('❌ No se pudo iniciar el pago. Intenta nuevamente', { 
        position: 'top-center', 
        duration: 3000, 
        theme: 'error' 
      });
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

  const onLoginSuccess = () => {
    const from = location.state?.from || '/home';
    navigate(from, { replace: true });
  };

  useEffect(() => {
    // Si viene un mensaje de notificación desde el carrito, muéstralo
    if (location.state?.notify) {
      Notification.show(location.state.notify, { duration: 3000, position: 'top-center', theme: 'error' });
    }
  }, [location.state]);

  return (
    <main className="carrito-main">
      <div className="carrito-header">
        <h1 className="carrito-title">🛒 Tu Carrito de Compras</h1>
        <Button
          theme="primary"
          onClick={() => navigate('/producto-list')}
          className="carrito-volver-btn"
        >
          ⬅️ Seguir Comprando
        </Button>
      </div>
      
      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <div className="carrito-vacio-container">
            <div className="carrito-vacio-icono">🛒</div>
            <h2 className="carrito-vacio-titulo">Tu carrito está vacío</h2>
            <p className="carrito-vacio-descripcion">
              Explora nuestros productos y encuentra algo increíble
            </p>
            <Button
              theme="primary"
              onClick={() => navigate('/producto-list')}
              className="carrito-vacio-btn"
            >
              🎮 Ver Productos
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="carrito-layout">
            <div className="carrito-productos">
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
            </div>
            <div className="carrito-resumen-flotante">
              {/* Aquí va tu resumen de compra actual */}
              <div className="carrito-resumen">
                <h2 className="carrito-resumen-titulo">📋 Resumen de Compra</h2>

                <div className="carrito-mini-factura">
                  <h3 className="carrito-mini-factura-titulo">Productos</h3>
                  <ul className="carrito-mini-factura-lista">
                    {carrito.map(item => (
                      <li key={item.id} className="carrito-mini-factura-item">
                        <span className="carrito-mini-factura-nombre">{item.nombre}</span>
                        <span className="carrito-mini-factura-cantidad">{cantidades[item.id] || 1}</span>
                        <span className="carrito-mini-factura-precio">
                          ${((item.precio || 0) * (cantidades[item.id] || 1)).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="carrito-resumen-linea">
                  <span>Subtotal ({carrito.length} producto{carrito.length !== 1 ? 's' : ''})</span>
                  <span>${calcularSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="carrito-resumen-linea">
                  <span>IVA (15%)</span>
                  <span>${calcularIva().toFixed(2)}</span>
                </div>
                
                <div className="carrito-resumen-linea">
                  <span className="carrito-resumen-total">TOTAL</span>
                  <span className="carrito-resumen-total">${calcularTotal().toFixed(2)}</span>
                </div>

                <div className="carrito-metodos-pago">
                  <div className="carrito-metodos-titulo">💳 Métodos de Pago Aceptados</div>
                  <div className="carrito-logos-pago">
                    <div className="carrito-logo-pago carrito-logo-visa">VISA</div>
                    <div className="carrito-logo-pago carrito-logo-master">MASTERCARD</div>
                    <div className="carrito-logo-pago carrito-logo-amex">AMEX</div>
                  </div>
                </div>

                <div className="carrito-terminos">
                  <input
                    type="checkbox"
                    id="terminos"
                    className="carrito-checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                  />
                  <label htmlFor="terminos" className="carrito-terminos-texto">
                    Acepto los{' '}
                    <span className="carrito-terminos-link" onClick={() => alert('Términos y Condiciones:\n\n1. Todos los precios incluyen IVA\n2. Garantía de 2 años en productos NVIDIA\n3. Política de devolución de 30 días\n4. Soporte técnico 24/7')}>
                      términos y condiciones
                    </span>
                    {' '}y la{' '}
                    <span className="carrito-terminos-link" onClick={() => alert('Política de Privacidad:\n\n- Protegemos tu información personal\n- No compartimos datos con terceros\n- Transacciones 100% seguras\n- Certificación SSL')}>
                      política de privacidad
                    </span>
                    . Confirmo que la información proporcionada es correcta y autorizo el procesamiento del pago.
                  </label>
                </div>

                <div className="carrito-botones-accion">
                  <Button
                    onClick={() => navigate('/producto-list')}
                    className="carrito-btn-continuar"
                  >
                    🛍️ Continuar Comprando
                  </Button>

                  <Button
                    onClick={iniciarPago}
                    className="carrito-btn-pagar"
                  >
                    PAGAR
                  </Button>
                </div>

                <div className="carrito-seguridad">
                  🛡️ Pago 100% Seguro • SSL Certificado • Protección de Datos
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showPagoModal && (
        <div className="modal-pago-overlay">
          <div className="modal-pago-content">
            <button className="modal-pago-close" onClick={() => setShowPagoModal(false)}>✕</button>
            <h2 className="pago-modal-titulo">Completa tu pago</h2>
            <div className="pago-modal-total">
              <strong>Total a pagar: ${calcularTotal().toFixed(2)}</strong>
            </div>
            {!mensaje && (
              <form
                className="paymentWidgets"
                data-brands="VISA MASTER AMEX"
              ></form>
            )}
            {mensaje && (
              <div className={`pago-modal-mensaje ${mensaje.includes("éxito") ? 'exito' : 'error'}`}>
                {mensaje}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}