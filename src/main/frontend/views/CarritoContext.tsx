import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext<any>(null);

export function useCarrito() {
  return useContext(CarritoContext);
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<any[]>([]);

  const agregar = (producto: any) => setCarrito((prev) => [...prev, producto]);
  const eliminar = (id: any) => setCarrito((prev) => prev.filter(p => p.id !== id));

  localStorage // Guardar el carrito en localStorage
    .setItem('carrito', JSON.stringify(carrito)); //guaraR CARRITO

  return (
    <CarritoContext.Provider value={{ carrito, agregar, eliminar }}>
      {children}
    </CarritoContext.Provider>
  );
}