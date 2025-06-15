import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { TextField, VerticalLayout, HorizontalLayout, Grid, GridColumn, Button } from '@vaadin/react-components';
//import '@vaadin/react-components/styles.css';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useState } from 'react';

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
  const direccion = useSignal('');
  const telefono = useSignal('');

  // Datos simulados (pueden ser mapeados desde tu backend)
  useEffect(() => {
    setItems([
      { cantidad: 1, descripcion: 'GPU RTX 4090', unidad: 'pieza', total: 1600 },
      { cantidad: 2, descripcion: 'Cable HDMI', unidad: 'unidad', total: 40 },
    ]);
  }, []);

  const calcularTotal = () => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  return (
    <VerticalLayout style={{ padding: '2em', gap: '1em', background: 'white' }}>
      <HorizontalLayout style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontWeight: 'bold' }}>FACTURA</h1>
        <img src="/nvidia-logo.png" alt="NVIDIA Logo" style={{ height: '50px' }} />
      </HorizontalLayout>

      <HorizontalLayout theme="spacing" style={{ justifyContent: 'space-between' }}>
        <TextField label="Nombre" value={nombre.value} onValueChanged={e => nombre.value = e.detail.value} />
        <TextField label="Dirección" value={direccion.value} onValueChanged={e => direccion.value = e.detail.value} />
        <TextField label="Teléfono" value={telefono.value} onValueChanged={e => telefono.value = e.detail.value} />
      </HorizontalLayout>

      <Grid items={items} style={{ backgroundColor: '#f9f9f9' }}>
        <GridColumn path="cantidad" header="Cantidad" />
        <GridColumn path="descripcion" header="Descripción" />
        <GridColumn path="unidad" header="Unidad" />
        <GridColumn path="total" header="Total" />
      </Grid>

      <HorizontalLayout style={{ justifyContent: 'flex-end', marginTop: '1em' }}>
        <strong style={{ fontSize: '1.2em', marginRight: '1em' }}>TOTAL:</strong>
        <span style={{ fontSize: '1.2em' }}>$ {calcularTotal()}</span>
      </HorizontalLayout>

      <Button theme="primary">Guardar factura</Button>
    </VerticalLayout>
  );
}
