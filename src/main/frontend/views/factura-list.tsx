import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  TextField,
  VerticalLayout,
  HorizontalLayout,
  Grid,
  GridColumn,
  Button,
  Card,
  ComboBox,
} from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import "themes/default/css/factura-list.css";
import { useNavigate } from 'react-router';
import { FacturaServices } from 'Frontend/generated/endpoints';
import MetodoPagoEnum from 'Frontend/generated/org/proyecto/nvidiacorp/base/models/MetodoPagoEnum';
import { UsuarioServices } from 'Frontend/generated/endpoints';

export const config: ViewConfig = {
  title: 'Factura',
  menu: {
    icon: 'vaadin:file-text',
    title: 'Factura',
    order: 1,
  },
};

type ItemFactura = {
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
  nombre?: string;
  precio?: number;
};

export default function FacturaView() {
  const [items, setItems] = useState<ItemFactura[]>([]);
  const navigate = useNavigate();

  const nombre = useSignal('');
  const apellido = useSignal('');
  const cedula = useSignal('');
  const direccion = useSignal('');
  const telefono = useSignal('');
  const metodoPago = useSignal('');

  const IVA_RATE = 0.15;

  // --- AGREGA ESTE EFECTO ---
  useEffect(() => {
    // 1. Cargar items del carrito (esto ya lo tenías)
    const storedItems = JSON.parse(localStorage.getItem('factura_items') || '[]').map((item: any) => ({
      ...item,
      precioUnitario: Number(item.precioUnitario || item.precio || 0),
      cantidad: Number(item.cantidad || 1),
      nombre: item.nombre || item.descripcion || 'Producto sin nombre',
    }));
    setItems(storedItems);

    // 2. CARGAR DATOS DEL USUARIO DESDE LA BASE DE DATOS <--- NUEVO
    UsuarioServices.getPersonaLogueada().then(persona => {
      if (persona) {
        // Llenamos los campos automáticamente
        nombre.value = persona.nombre || '';
        apellido.value = persona.apellido || '';
        cedula.value = persona.codIdent || ''; // Ojo: en tu modelo es codIdent
        direccion.value = persona.direccion || '';
        telefono.value = persona.telefono || '';

        // El método de pago lo podemos fijar porque acabamos de pagar con tarjeta
        metodoPago.value = 'Tarjeta (Online)';
      } else {
        console.log("No se encontró información de la persona logueada");
      }
    }).catch(console.error);

  }, []);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0),
    [items]
  );

  const iva = useMemo(() => subtotal * IVA_RATE, [subtotal]);
  const total = useMemo(() => subtotal + iva, [subtotal, iva]);

  useEffect(() => {
    localStorage.setItem('factura_items', JSON.stringify(items));
    localStorage.setItem('factura_subtotal', subtotal.toString());
    localStorage.setItem('factura_iva', iva.toString());
    localStorage.setItem('factura_total', total.toString());
  }, [items, subtotal, iva, total]);

  const camposValidos = () =>
    nombre.value && apellido.value && cedula.value && direccion.value && telefono.value && metodoPago.value;

  const guardarFactura = () => {
    if (!camposValidos()) {
      alert("Por favor, complete todos los campos del cliente.");
      return;
    }
    navigate('/factura-list');
  };
  const generarPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 14;
    let y = 20;

    const facturaId = localStorage.getItem('id') || '---';

    // Agregar logo (demo rectángulo verde, reemplaza por tu imagen real si tienes base64)
    doc.setFillColor(118, 185, 0); // Verde Nvidia
    doc.rect(marginLeft, y, 30, 15, 'F'); // Rectángulo como logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('NVIDIA', marginLeft + 5, y + 10);

    // Número de factura (a la derecha)
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`N.º de Factura: ${facturaId}`, 150, y + 10);

    y += 25;

    // Título
    doc.setFontSize(18);
    doc.text('FACTURA ELECTRÓNICA', marginLeft, y);
    y += 10;

    // Datos del cliente
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre.value} ${apellido.value}`, marginLeft, y); y += 8;
    doc.text(`Cédula: ${cedula.value}`, marginLeft, y); y += 8;
    doc.text(`Dirección: ${direccion.value}`, marginLeft, y); y += 8;
    doc.text(`Teléfono: ${telefono.value}`, marginLeft, y); y += 8;
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, marginLeft, y); y += 8;
    doc.text(`Método de Pago: ${metodoPago.value}`, marginLeft, y); y += 10;

    doc.line(marginLeft, y, 195, y); y += 8;

    doc.setFontSize(12);
    doc.text('Cant.', marginLeft, y);
    doc.text('Descripción', marginLeft + 20, y);
    doc.text('P. Unit', marginLeft + 110, y);
    doc.text('P. Total', marginLeft + 150, y);
    y += 6;

    doc.line(marginLeft, y, 195, y); y += 6;

    items.forEach(item => {
      const totalItem = item.precioUnitario * item.cantidad;
      const descripcion = item.nombre ?? '';
      const descripcionDividida = doc.splitTextToSize(descripcion, 65);

      descripcionDividida.forEach((linea: string, index: number) => {
        if (y >= 280) {
          doc.addPage();
          y = 20;
        }

        if (index === 0) {
          doc.text(`${item.cantidad}`, marginLeft, y);
          doc.text(linea, marginLeft + 20, y);
          doc.text(`$${item.precioUnitario.toFixed(2)}`, marginLeft + 110, y);
          doc.text(`$${totalItem.toFixed(2)}`, marginLeft + 150, y);
        } else {
          doc.text(linea, marginLeft + 20, y);
        }

        y += 6;
      });
    });

    y += 4;
    doc.line(marginLeft, y, 195, y);
    y += 8;

    doc.setFontSize(12);
    doc.text(`Subtotal:`, marginLeft + 110, y);
    doc.text(`$${subtotal.toFixed(2)}`, marginLeft + 150, y);
    y += 8;

    doc.text(`IVA (15%):`, marginLeft + 110, y);
    doc.text(`$${iva.toFixed(2)}`, marginLeft + 150, y);
    y += 8;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL:`, marginLeft + 110, y);
    doc.text(`$${total.toFixed(2)}`, marginLeft + 150, y);
    doc.setFont('helvetica', 'normal');

    y += 12;
    doc.setFontSize(10);
    doc.text('Gracias por su compra.', marginLeft, y);

    doc.save('factura.pdf');
  };

  return (
    <VerticalLayout className="factura-main">
      <div className="factura-panel factura-print-area">
        {/* CABECERA: Logo e Información de la Empresa */}
        <HorizontalLayout style={{ justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <VerticalLayout style={{ padding: 0, gap: '0.5rem' }}>
            <img
              src="https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Symbol.jpg"
              alt="Logo Nvidia"
              style={{ height: '60px', borderRadius: '4px' }}
            />
            <div style={{ color: '#76b900', fontSize: '0.9rem', fontWeight: 'bold' }}>
              NVIDIACORP S.A. <br />
              RUC: 1792456789001 <br />
              Dirección: Av. Tecnológica 123, Silicon Valley
            </div>
          </VerticalLayout>

          <div className="factura-numero-badge">
            FACTURA ELECTRÓNICA <br />
            <span style={{ fontSize: '1.4rem' }}>N.º {localStorage.getItem('id') || '0001'}</span>
          </div>
        </HorizontalLayout>

        {/* SECCIÓN CLIENTE: Organizada en dos columnas */}
        <Card className="factura-card">
          <h3 style={{ borderBottom: '1px solid #ffffff', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
            DATOS DEL RECEPTOR
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <TextField label="Razón Social / Nombres" value={`${nombre.value} ${apellido.value}`} readonly />
            <TextField label="Identificación (Cédula/RUC)" value={cedula.value} readonly />
            <TextField label="Dirección" value={direccion.value} readonly />
            <TextField label="Teléfono" value={telefono.value} readonly />
            <TextField label="Fecha de Emisión" value={new Date().toLocaleDateString()} readonly />
            <TextField label="Forma de Pago" value={metodoPago.value} readonly />
          </div>
        </Card>

        {/* TABLA DE PRODUCTOS */}
        <Grid className="factura-grid" items={items} allRowsVisible>
          <GridColumn path="cantidad" header="Cant." width="80px" flexGrow={0} />
          <GridColumn header="Descripción del Producto" renderer={({ item }) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold' }}>{item.nombre || item.descripcion}</span>
            </div>
          )} />
          <GridColumn header="V. Unitario" renderer={({ item }) => <span>$ {item.precioUnitario.toFixed(2)}</span>} textAlign="end" />
          <GridColumn header="V. Total" renderer={({ item }) => <span>$ {(item.precioUnitario * item.cantidad).toFixed(2)}</span>} textAlign="end" />
        </Grid>

        {/* TOTALES Y NOTAS */}
        <HorizontalLayout style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ color: '#888', fontSize: '0.8rem', maxWidth: '300px' }}>
            <strong>Información Adicional:</strong> <br />
            Esta factura es un documento tributario electrónico autorizado conforme a las leyes vigentes.
          </div>

          <VerticalLayout className="factura-totales">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Subtotal:</span> <span>$ {subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>IVA (15%):</span> <span>$ {iva.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <strong>TOTAL:</strong> <strong>$ {total.toFixed(2)}</strong>
            </div>
          </VerticalLayout>
        </HorizontalLayout>
      </div>
    </VerticalLayout>
  );
}
