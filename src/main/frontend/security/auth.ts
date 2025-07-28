import {configureAuth} from '@vaadin/hilla-react-auth'
import { UsuarioServices } from 'Frontend/generated/endpoints'

const authA = configureAuth(UsuarioServices.getAtentication, {
    getRoles: (user) => user?.authorities?.map((v) => v ?? '') ?? []
});
export const useAuthA = authA.useAuth;
export const role = UsuarioServices.viewRol;
interface CurrentUser {
  estado: boolean;
  Persona: number;
  correo: string;
  id: number;
  Rol: number;
}

interface AuthData {
  principal: string;
  credentials: string;
  authenticated: boolean;
  authorities: { authority: string }[];
  currentUser?: CurrentUser;
}

const auth = configureAuth<AuthData>(async () => {
  try {
    const authData = await UsuarioServices.getAtentication();
    console.log('Datos de autenticación:', authData);
    
    if (!authData?.authenticated) {
      return {
        principal: '',
        credentials: '',
        authenticated: false,
        authorities: [],
        currentUser: undefined
      };
    }

    let userData;
    try {
      userData = await UsuarioServices.getCurrentUser();
      console.log('Datos de usuario:', userData);
    } catch (error) {
      console.warn('Error obteniendo datos adicionales:', error);
      // Si falla pero está autenticado, usar datos mínimos
      userData = {
        success: true,
        correo: authData.principal,
        id: parseInt(authData.credentials),
        Rol: 2 // Valor por defecto
      };
    }

    return {
      principal: authData.principal,
      credentials: authData.credentials,
      authenticated: authData.authenticated,
      authorities: authData.authorities,
      currentUser: userData.success ? userData : undefined
    };

  } catch (error) {
    console.error('Error en autenticación:', error);
    return {
      principal: '',
      credentials: '',
      authenticated: false,
      authorities: [],
      currentUser: undefined
    };
  }
}, {
  getRoles: (user) => user?.authorities?.map(a => a.authority) ?? []
});


export const useAuth = auth.useAuth;
export const AuthProvider = auth.AuthProvider;

export function useUserRoles() {
  const { user } = useAuth();
  return user?.authorities?.map(authObj => authObj.authority) || [];
}
export function useIsClient() {
  const roles = useUserRoles();
  return roles.includes('ROLE_CLIENTE');
}

export function useIsAdmin() {
  const roles = useUserRoles();
  return roles.includes('ROLE_ADMIN');
}
