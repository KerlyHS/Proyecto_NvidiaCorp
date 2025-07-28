import { useAuth } from 'Frontend/security/auth';

type Role = string;

export function RoleProtected({ 
  role, 
  children,
  fallback = null 
}: {
  role: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasAccess } = useAuth();
  return hasAccess({ rolesAllowed: [role] }) ? <>{children}</> : <>{fallback}</>;
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  return <RoleProtected role="ROLE_ADMIN">{children}</RoleProtected>;
}

export function ClientOnly({ children }: { children: React.ReactNode }) {
  return <RoleProtected role="ROLE_CLIENTE">{children}</RoleProtected>;
}