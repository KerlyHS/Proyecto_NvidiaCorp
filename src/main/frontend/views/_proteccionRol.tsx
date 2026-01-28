import { useAuth } from 'Frontend/security/auth';

// Modificamos para aceptar un array de roles o un string único
export function RoleProtected({ 
  roles, 
  children,
  fallback = null 
}: {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasAccess, state } = useAuth();

  // DEBUG: Esto imprimirá en la consola del navegador qué roles tienes realmente
  // Abre F12 -> Console para verlo.
  if (state.user) {
      console.log("Usuario logueado:", state.user.name);
      console.log("Roles detectados:", state.user.roles);
  }

  // Verificamos si tiene AL MENOS UNO de los roles permitidos
  return hasAccess({ rolesAllowed: roles }) ? <>{children}</> : <>{fallback}</>;
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  // AQUI EL TRUCO: Aceptamos "ROLE_ADMIN" O "ROLE_ADMINISTRADOR"
  return <RoleProtected roles={["ROLE_ADMIN", "ROLE_ADMINISTRADOR"]}>{children}</RoleProtected>;
}

export function ClientOnly({ children }: { children: React.ReactNode }) {
  return <RoleProtected roles={["ROLE_CLIENTE", "ROLE_USER"]}>{children}</RoleProtected>;
}