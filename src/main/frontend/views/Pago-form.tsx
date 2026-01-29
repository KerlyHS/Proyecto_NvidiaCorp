import React, { useState, useEffect } from 'react';
import { PagoServices, ProductoService, FacturaServices } from 'Frontend/generated/endpoints';
import { Notification } from '@vaadin/react-components';
import { useNavigate } from 'react-router';
import { useCarrito } from './_CarritoContext';
import "themes/default/css/pago-list.css";

export default function PagoForm() {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { carrito, setCarrito } = useCarrito();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  // ⚠️ AJUSTA ESTO SEGÚN TU APP
  const idPersona = Number(localStorage.getItem('idPersona')); 

  useEffect(() => {
    if (!id) return;

    PagoServices.consultarEstadoPago(id).then(async resultado => {
      if (resultado && resultado.estado === "true") {
        Notification.show('Pago realizado con éxito', {
          duration: 2000,
          position: 'top-center',
          theme: 'success'
        });

        // 1️⃣ Reducir stock
        for (const item of carrito) {
          await ProductoService.reduceStock(item.id, item.cantidad || 1);
        }

        // 2️⃣ Calcular totales
        const subtotal = carrito.reduce(
          (acc, item) => acc + item.precio * (item.cantidad || 1),
          0
        );
        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        // 3️⃣ ✅ GUARDAR FACTURA (FORMA CORRECTA)
        await FacturaServices.createFactura(
          new Date(),     // fecha
          subtotal,       // subTotal
          total,          // total
          false,          // entregado
          'TARJETA',      // MetodoPagoEnum
          iva,            // iva
          idPersona       // idPersona (NO null)
        );

        // 4️⃣ Limpiar carrito
        setCarrito([]);
        localStorage.removeItem('carrito');

        // 5️⃣ (Opcional) datos para la vista factura
        localStorage.setItem('factura_items', JSON.stringify(carrito));
        localStorage.setItem('factura_subtotal', subtotal.toString());
        localStorage.setItem('factura_iva', iva.toString());
        localStorage.setItem('factura_total', total.toString());

        navigate('/factura-list');
      } else {
        Notification.show('Pago rechazado', {
          duration: 2000,
          position: 'top-center',
          theme: 'error'
        });
        navigate('/factura-list');
      }

      window.history.replaceState({}, '', window.location.pathname);
    });
  }, [id, carrito, navigate, setCarrito, idPersona]);

  useEffect(() => {
    if (!checkoutId) return;

    const script = document.createElement('script');
    script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [checkoutId]);

  const iniciarPago = async () => {
    const resp = await PagoServices.checkout(10.00, 'USD');
    if (resp && typeof resp.id === 'string') {
      setCheckoutId(resp.id);
    } else {
      Notification.show('No se pudo iniciar el pago', {
        duration: 2000,
        position: 'top-center',
        theme: 'error'
      });
    }
  };

  if (id) {
    return <main className="pago-main">Procesando pago...</main>;
  }

  return (
    <main className="pago-main">
      <h1 className="pago-title">Realizar Pago</h1>
      <div className="pago-grid" style={{ maxWidth: 500, margin: "0 auto" }}>
        {!checkoutId && (
          <button className="pago-btn-primary" onClick={iniciarPago}>
            Pagar
          </button>
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
