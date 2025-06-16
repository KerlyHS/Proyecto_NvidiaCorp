import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  TextField,
  VerticalLayout,
  HorizontalLayout,
  Grid,
  GridColumn,
  Button,
  Card,
} from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import "themes/default/css/factura-list.css";

export const config: ViewConfig = {
  title: 'Factura',
  menu: {
    icon: 'vaadin:file-text',
    title: 'Factura',
    order: 1,
  },
};

export default function FacturaView() {
  const [items, setItems] = useState<Array<any>>([]);

  const nombre = useSignal('');
  const apellido = useSignal('');
  const cedula = useSignal('');
  const direccion = useSignal('');
  const telefono = useSignal('');

  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  const IVA_RATE = 0.15;

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('factura_items') || '[]').map((item: any) => ({
      ...item,
      precioUnitario: item.precioUnitario ?? item.precio ?? 0,
      cantidad: item.cantidad ?? 1,
      descripcion: item.descripcion ?? item.nombre ?? '',
    }));
    setItems(items);
    setSubtotal(Number(localStorage.getItem('factura_subtotal') || 0));
    setIva(Number(localStorage.getItem('factura_iva') || 0));
    setTotal(Number(localStorage.getItem('factura_total') || 0));
  }, []);

  const calcularSubtotal = () =>
    items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);

  const calcularIva = () => calcularSubtotal() * IVA_RATE;

  const calcularTotal = () => calcularSubtotal();

  const generarPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 14;
    let y = 20;

    doc.setFontSize(18);
    doc.text('FACTURA', marginLeft, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre.value} ${apellido.value}`, marginLeft, y); y += 8;
    doc.text(`Cédula: ${cedula.value}`, marginLeft, y); y += 8;
    doc.text(`Dirección: ${direccion.value}`, marginLeft, y); y += 8;
    doc.text(`Teléfono: ${telefono.value}`, marginLeft, y); y += 10;

    doc.line(marginLeft, y, 195, y); y += 8;

    doc.setFontSize(12);
    doc.text('Cant.', marginLeft, y);
    doc.text('Descripción', marginLeft + 20, y);
    doc.text('Unidad', marginLeft + 80, y);
    doc.text('P. Unit', marginLeft + 110, y);
    doc.text('P. Total', marginLeft + 150, y);
    y += 6;

    doc.line(marginLeft, y, 195, y); y += 6;

    items.forEach(item => {
      const total = item.precioUnitario * item.cantidad;
      doc.text(`${item.cantidad}`, marginLeft, y);
      doc.text(item.descripcion, marginLeft + 20, y);
      doc.text(item.unidad, marginLeft + 80, y);
      doc.text(`$${item.precioUnitario.toFixed(2)}`, marginLeft + 110, y);
      doc.text(`$${total.toFixed(2)}`, marginLeft + 150, y);
      y += 8;
    });

    y += 4;
    doc.line(marginLeft, y, 195, y);
    y += 8;

    doc.setFontSize(12);
    doc.text(`Subtotal:`, marginLeft + 110, y);
    doc.text(`$${calcularSubtotal().toFixed(2)}`, marginLeft + 150, y, { align: 'left' });
    y += 8;
    doc.text(`IVA (15%):`, marginLeft + 110, y);
    doc.text(`$${calcularIva().toFixed(2)}`, marginLeft + 150, y, { align: 'left' });
    y += 8;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL:`, marginLeft + 110, y);
    doc.text(`$${calcularTotal().toFixed(2)}`, marginLeft + 150, y, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    y += 12;
    doc.setFontSize(10);
    doc.text('Gracias por su compra.', marginLeft, y);

    doc.save('factura.pdf');
  };

  return (
    <VerticalLayout className="factura-main">
      <div className="factura-panel factura-print-area">
        <h1 className="factura-title">🧾 Factura Electrónica</h1>
        <Card className="factura-card">
          <h3>Datos del Cliente</h3>
          <HorizontalLayout theme="spacing" style={{ flexWrap: 'wrap', rowGap: '1em' }}>
            <TextField className="factura-input" label="Nombre" value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
            <TextField className="factura-input" label="Apellido" value={apellido.value} onValueChanged={e => apellido.value = e.detail.value} />
            <TextField className="factura-input" label="Cédula" value={cedula.value} onValueChanged={e => cedula.value = e.detail.value} />
            <TextField className="factura-input" label="Dirección" value={direccion.value} onValueChanged={e => direccion.value = e.detail.value} />
            <TextField className="factura-input" label="Teléfono" value={telefono.value} onValueChanged={e => telefono.value = e.detail.value} />
          </HorizontalLayout>
        </Card>
        <Grid className="factura-grid" items={items}>
          <GridColumn path="cantidad" header="Cantidad" />
          <GridColumn
            header="Producto"
            renderer={({ item }) => <span>{item.nombre ?? item.descripcion ?? ''}</span>}
          />
          <GridColumn
            header="Precio Unitario"
            renderer={({ item }) => {
              const precio = item.precioUnitario ?? item.precio ?? 0;
              return <span>$ {Number(precio).toFixed(2)}</span>;
            }}
          />
          <GridColumn
            header="Precio Total"
            renderer={({ item }) => {
              const precio = item.precioUnitario ?? item.precio ?? 0;
              const cantidad = item.cantidad ?? 1;
              return <span>$ {(Number(precio) * Number(cantidad)).toFixed(2)}</span>;
            }}
          />
        </Grid>
        <VerticalLayout className="factura-totales" style={{ marginTop: '1.5rem', alignSelf: 'flex-end', minWidth: 250 }}>
          <div><strong>Subtotal:</strong> $ {calcularSubtotal().toFixed(2)}</div>
          <div><strong>IVA (15%):</strong> $ {calcularIva().toFixed(2)}</div>
          <div><strong>Total:</strong> $ {calcularTotal().toFixed(2)}</div>
        </VerticalLayout>
        <HorizontalLayout style={{ justifyContent: 'end', marginTop: '1em', gap: '1em' }}>
          <Button className="factura-btn-primary" theme="primary" onClick={() => alert('Guardar factura funcionalidad pendiente')}>
            💾 Guardar factura
          </Button>
          <Button className="factura-btn-secondary" theme="secondary" onClick={() => window.print()}>
            ⬇️ Descargar PDF
          </Button>
        </HorizontalLayout>
      </div>
    </VerticalLayout>
  );
}
