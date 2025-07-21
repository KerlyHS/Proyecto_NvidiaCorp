import { Notification } from '@vaadin/react-components/Notification';
import { Grid, GridColumn, GridItemModel, GridSortColumn } from '@vaadin/react-components';
import { PagoServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useEffect, useState } from 'react';
import "themes/default/css/pago.css"; 

export default function PagoView() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    PagoServices.listAll().then((data) => {
      if (Array.isArray(data)) {
        setItems(data.filter(Boolean));
      } else {
        setItems([]);
      }
    });
  }, []);

  const order = (event: any, columnId: string) => {
    const direction = event.detail.value;
    if (!direction) {
      PagoServices.listAll().then((data) => {
        if (Array.isArray(data)) {
          setItems(data.filter(Boolean));
        } else {
          setItems([]);
        }
      });
    } else {
      const dir = direction === 'asc' ? 1 : 2;
      PagoServices.order(columnId, dir).then((data) => {
        if (Array.isArray(data)) {
          setItems(data.filter(Boolean));
        } else {
          setItems([]);
        }
      });
    }
  };

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  // BUSCAR
  const criterio = useSignal('');
  const texto = useSignal('');

  const itemSelect = [
    {
      label: 'Nro Transaccion',
      value: 'nroTransaccion',
    },
    {
      label: 'Estado',
      value: 'estadoP',
    }
  ];

  const search = async () => {
    try {
      PagoServices.search(criterio.value, texto.value, 0).then((data) => {
        if (Array.isArray(data)) {
          setItems(data.filter(Boolean));
        } else {
          setItems([]);
        }
      });

      criterio.value = '';
      texto.value = '';

      Notification.show('Busqueda realizada', { duration: 5000, position: 'bottom-end', theme: 'success' });

    } catch (error) {
      handleError(error);
    }
  };

  return (
    <main className="pago-main">
      <ViewToolbar title={<span className="pago-title">Lista de Pagos</span>}>
        <Group>
          {/* Aquí puedes agregar filtros o botones si lo necesitas */}
        </Group>
      </ViewToolbar>
      <div className="pago-grid">
        <Grid items={items}>
          <GridColumn path="id" header="ID" />
          <GridColumn renderer={indexIndex} header="Nro" />
          <GridSortColumn onDirectionChanged={(e) => order(e, "nroTransaccion")} path="nroTransaccion" header="nroTransaccion" />
          <GridSortColumn onDirectionChanged={(e) => order(e, "estadoP")} path="estadoP" header="Estado" />
        </Grid>
      </div>
    </main>
  );
}