import React, { useState, useEffect } from 'react';
import { PagoServices } from 'Frontend/generated/endpoints';

export default function PagoForm() {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Detecta si hay un parámetro id en la URL (cuando OPPWA redirige)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      PagoServices.consultarEstadoPago(id).then(async resultado => {
        if (resultado && resultado.estado === "true") {
          setMensaje("Pago realizado con éxito");
          // Guarda el pago en la base de datos (solo pasa el estado)
          await PagoServices.crearPago(true);
        } else {
          setMensaje("Pago rechazado");
          // Opcional: guarda pagos rechazados si lo deseas
          // await PagoServices.crearPago(false);
        }
        window.history.replaceState({}, '', window.location.pathname);
      });
    }
  }, []);

  const iniciarPago = async () => {
    const resp = await PagoServices.checkout(10.00, 'USD');
    if (resp && typeof resp.id === 'string') {
      setCheckoutId(resp.id);
    } else {
      alert('No se pudo iniciar el pago');
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
    <div>
      {!checkoutId && !mensaje && (
        <button onClick={iniciarPago}>Pagar</button>
      )}
      {checkoutId && !mensaje && (
        <form
          className="paymentWidgets"
          data-brands="VISA MASTER AMEX"
        ></form>
      )}
      {mensaje && (
        <div>{mensaje}</div>
      )}
    </div>
  );
}