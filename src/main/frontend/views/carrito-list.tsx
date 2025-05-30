import { Button } from '@vaadin/react-components';
import { useCarrito } from './CarritoContext';
import { ProductoCard } from './producto-list';

export default function CarritoList() {
  const { carrito, eliminar } = useCarrito();

  return (
    <main style={{ padding: 32 }}>
      <h1>🛒 Carrito de compras</h1>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="producto-grid">
          {carrito.map((item) => (
            <ProductoCard
              key={item.id}
              item={item}
              onEliminar={() => eliminar(item.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}