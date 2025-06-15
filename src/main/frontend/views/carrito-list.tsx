import { Button } from '@vaadin/react-components';
import { useCarrito } from './CarritoContext';
import { ProductoCard } from './producto-list';
import "themes/default/css/carrito-list.css";

export default function CarritoList() {
  const { carrito, eliminar } = useCarrito();

  return (
    <main className="carrito-main">
      <h1 className="carrito-title">🛒 Carrito de compras</h1>
      {carrito.length === 0 ? (
        <p className="carrito-vacio">El carrito está vacío.</p>
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