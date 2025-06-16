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

  const IVA_RATE = 0.15;

  useEffect(() => {
    setItems([
      { cantidad: 1, descripcion: 'GPU RTX 4090', unidad: 'pieza', precioUnitario: 1600 },
      { cantidad: 2, descripcion: 'Cable HDMI', unidad: 'unidad', precioUnitario: 20 },
    ]);
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
    <VerticalLayout style={{ padding: '2em', background: '#f4f6fa', gap: '1.5em' }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: '1em' }}>
        <h1 style={{ fontWeight: 'bold', fontSize: '28px', margin: 0 }}>🧾 Factura Electrónica</h1>
        <img
          src="https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Symbol.jpg"
          alt="NVIDIA Logo"
          style={{
            position: 'absolute',
            width: '500px',
            top: '0',
            right: '0',
            height: '200px',
            borderRadius: '8px',
          }}
        />
      </div>


      <Card style={{ padding: '1em', width: '100%', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Datos del Cliente</h3>
        <HorizontalLayout theme="spacing" style={{ flexWrap: 'wrap', rowGap: '1em' }}>
          <TextField label="Nombre" value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
          <TextField label="Apellido" value={apellido.value} onValueChanged={e => apellido.value = e.detail.value} />
          <TextField label="Cédula" value={cedula.value} onValueChanged={e => cedula.value = e.detail.value} />
          <TextField label="Dirección" value={direccion.value} onValueChanged={e => direccion.value = e.detail.value} />
          <TextField label="Teléfono" value={telefono.value} onValueChanged={e => telefono.value = e.detail.value} />
        </HorizontalLayout>
      </Card>

      <Grid items={items} style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
        <GridColumn path="cantidad" header="Cantidad" />
        <GridColumn path="descripcion" header="Descripción" />
        <GridColumn
          header="Precio Unitario"
          renderer={({ item }) => <span>$ {item.precioUnitario.toFixed(2)}</span>}
        />
        <GridColumn
          header="Precio Total"
          renderer={({ item }) => <span>$ {(item.precioUnitario * item.cantidad).toFixed(2)}</span>}
        />
      </Grid>

      <VerticalLayout
        theme="spacing"
        style={{
          alignSelf: 'flex-end',
          marginTop: '1em',
          padding: '1em',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#fff',
          minWidth: '250px'
        }}
      >
        <div><strong>Subtotal:</strong> $ {calcularSubtotal().toFixed(2)}</div>
        <div><strong>IVA (15%):</strong> $ {calcularIva().toFixed(2)}</div>
        <div><strong>Total:</strong> $ {calcularTotal().toFixed(2)}</div>
      </VerticalLayout>

      <HorizontalLayout style={{ justifyContent: 'end', marginTop: '1em', gap: '1em' }}>
        <Button theme="primary" onClick={() => alert('Guardar factura funcionalidad pendiente')}>
          💾 Guardar factura
        </Button>
        <Button theme="secondary" onClick={generarPDF}>
          ⬇️ Descargar PDF
        </Button>
      </HorizontalLayout>
    </VerticalLayout>
  );
}
