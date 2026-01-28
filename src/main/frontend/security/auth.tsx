// frontend/security/auth.ts

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UsuarioServices } from 'Frontend/generated/endpoints';

// Definimos qué forma tiene un usuario en nuestro frontend
export interface User {
  name: string;
  roles: string[];
}

// Definimos qué datos comparte el contexto
interface AuthContextType {
  state: {
    user: User | undefined;
    loading: boolean;
  };
  login: (user: User) => void;
  logout: () => void;
  hasAccess: (params: { rolesAllowed?: string[] }) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // AL CARGAR LA PÁGINA: Preguntamos al backend "¿Quién soy?"
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Llamamos al NUEVO método que creamos en Java
        const data = await UsuarioServices.checkSession();
        
        if (data && data.isAuthenticated) {
          console.log("Sesión recuperada:", data); // Para depurar
          setUser({
            name: data.username as string,
            roles: data.roles as string[],
          });
        } else {
          setUser(undefined);
        }
      } catch (error) {
        console.error("No se pudo verificar la sesión:", error);
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (u: User) => setUser(u);
  
  const logout = () => {
    setUser(undefined);
    UsuarioServices.logout();
  };

  // Función para verificar si el usuario tiene permiso
  const hasAccess = ({ rolesAllowed }: { rolesAllowed?: string[] }) => {
    // Si no se piden roles, cualquiera pasa
    if (!rolesAllowed || rolesAllowed.length === 0) return true;
    
    // Si no hay usuario logueado, no pasa
    if (!user) return false;

    // Verifica si tengo al menos uno de los roles permitidos
    // Ejemplo: Si rolesAllowed es ['ROLE_ADMIN'] y yo tengo ['ROLE_ADMINISTRADOR'],
    // necesitamos que coincidan. 
    return rolesAllowed.some(role => user.roles.includes(role));
  };

  return (
    <AuthContext.Provider value={{ state: { user, loading }, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}