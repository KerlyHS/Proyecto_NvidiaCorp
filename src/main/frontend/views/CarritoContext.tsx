import { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@vaadin/react-components';

const CarritoContext = createContext<any>(null);

export function useCarrito() {
  return useContext(CarritoContext);
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<any[]>(() => {
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregar = (producto: any) => {
    if ((producto.stock ?? 0) <= 0) {
      Notification.show('❌ Producto agotado', {
        position: 'top-center',
        duration: 3000,
        theme: 'error'
      });
      return;
    }
    if (carrito.some(p => p.id === producto.id)) {
      Notification.show('⚠️ Ya tienes este producto en el carrito', {
        position: 'top-center',
        duration: 3000,
        theme: 'error'
      });
      return;
    }
    setCarrito(prev => [...prev, { ...producto, cantidad: 1 }]);
  };
  const eliminar = (id: any) => setCarrito(prev => prev.filter(p => p.id !== id));
  return (
    <CarritoContext.Provider value={{ carrito, agregar, eliminar, setCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}