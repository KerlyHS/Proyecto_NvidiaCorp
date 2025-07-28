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

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('factura_items') || '[]').map((item: any) => ({
      ...item,
      precioUnitario: item.precioUnitario ?? item.precio ?? 0,
      cantidad: item.cantidad ?? 1,
      descripcion: item.descripcion ?? item.nombre ?? '',
    }));
    setItems(storedItems);
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
      <h1 className="factura-title" style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <img
      src="https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Symbol.jpg"
      alt="Logo Nvidia"
      style={{ height: '90px', borderRadius: '8px' }}
    />
    <span style={{ fontSize: '2rem' }}>Factura Electrónica</span>
  </div>
  <div style={{
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#b3ff00',
    background: '#1a1a1a',
    padding: '0.5rem 1rem',
    borderRadius: '90px'
  }}>
    N.º {localStorage.getItem('id') || '0001'}
  </div>
</h1>


        <Card className="factura-card">
          <HorizontalLayout theme="spacing" style={{ flexWrap: 'wrap', gap: '1em' }}>
            <TextField label="Fecha" style={{ flex: 1, minWidth: '200px' }} value={new Date().toLocaleDateString()} readonly />
            <TextField label="Nombre" style={{ flex: 1, minWidth: '200px' }} value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
            <TextField label="Apellido" style={{ flex: 1, minWidth: '200px' }} value={apellido.value} onValueChanged={e => apellido.value = e.detail.value} />
            <TextField label="Cédula/RUC" style={{ flex: 1, minWidth: '200px' }} value={cedula.value} onValueChanged={e => cedula.value = e.detail.value} />
            <TextField label="Dirección" style={{ flex: 1, minWidth: '200px' }} value={direccion.value} onValueChanged={e => direccion.value = e.detail.value} />
            <TextField label="Teléfono" style={{ flex: 1, minWidth: '200px' }} value={telefono.value} onValueChanged={e => telefono.value = e.detail.value} />
            <TextField label="Método de Pago"  style={{ flex: 1, minWidth: '200px' }} value={metodoPago.value} onValueChanged={e => metodoPago.value = e.detail.value} />
          </HorizontalLayout>
        </Card>

        <Grid className="factura-grid" items={items} style={{ marginTop: '1rem' }}>
          <GridColumn path="cantidad" header="Cantidad" />
          <GridColumn header="Producto" renderer={({ item }) => <span>{item.nombre}</span>} />
          <GridColumn header="Precio Unitario" renderer={({ item }) => <span>$ {item.precioUnitario.toFixed(2)}</span>} />
          <GridColumn header="Precio Total" renderer={({ item }) => <span>$ {(item.precioUnitario * item.cantidad).toFixed(2)}</span>} />
        </Grid>

        <VerticalLayout className="factura-totales" style={{
          background: '#060606',
          alignSelf: 'flex-end',
          minWidth: 350,
        }}>
          <div><strong>Subtotal:</strong> $ {subtotal.toFixed(2)}</div>
          <div><strong>IVA (15%):</strong> $ {iva.toFixed(2)}</div>
          <div><strong>Total:</strong> $ {total.toFixed(2)}</div>
        </VerticalLayout>

        <HorizontalLayout style={{ justifyContent: 'end', marginTop: '1em', gap: '1em' }}>
          
          <Button className="factura-btn-secondary" theme="secondary" onClick={generarPDF}>
            ⬇️ Descargar PDF
          </Button>
        </HorizontalLayout>
      </div>
    </VerticalLayout>
  );
}
