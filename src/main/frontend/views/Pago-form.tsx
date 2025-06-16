import React, { useState, useEffect } from 'react';
import { PagoServices } from 'Frontend/generated/endpoints';
import { Notification } from '@vaadin/react-components';
import { useNavigate } from 'react-router';
import { useCarrito } from './CarritoContext';
import "themes/default/css/pago-list.css";

export default function PagoForm() {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { carrito } = useCarrito();

  // Detecta si hay un parámetro id en la URL (cuando OPPWA redirige)
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      PagoServices.consultarEstadoPago(id).then(async resultado => {
        if (resultado && resultado.estado === "true") {
          Notification.show('Pago realizado con éxito', { duration: 2000, position: 'top-center', theme: 'success' });
          // Aquí puedes guardar datos de factura en localStorage si lo necesitas
          navigate('/factura-list');
        } else {
          Notification.show('Pago rechazado', { duration: 2000, position: 'top-center', theme: 'error' });
          navigate('/factura-list');
        }
        window.history.replaceState({}, '', window.location.pathname);
      });
    }
  }, [navigate, carrito, id]);

  if (id) return null;

  const iniciarPago = async () => {
    const resp = await PagoServices.checkout(10.00, 'USD');
    if (resp && typeof resp.id === 'string') {
      setCheckoutId(resp.id);
    } else {
      Notification.show('No se pudo iniciar el pago', { duration: 2000, position: 'top-center', theme: 'error' });
    }
  };

  useEffect(() => {
    if (checkoutId) {
      const script = document.createElement('script');
      script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [checkoutId]);

  return (
    <main className="pago-main">
      <h1 className="pago-title">Realizar Pago</h1>
      <div className="pago-grid" style={{ maxWidth: 500, margin: "0 auto" }}>
        {!checkoutId && (
          <button className="pago-btn-primary" onClick={iniciarPago}>Pagar</button>
        )}
        {checkoutId && (
          <form
            className="paymentWidgets"
            data-brands="VISA MASTER AMEX"
          ></form>
        )}
      </div>
    </main>
  );
}