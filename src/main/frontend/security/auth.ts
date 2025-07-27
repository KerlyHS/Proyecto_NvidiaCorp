import {configureAuth} from '@vaadin/hilla-react-auth'
import { UsuarioServices } from 'Frontend/generated/endpoints'

const auth = configureAuth(UsuarioServices.getAtentication, {
    getRoles: (user) => user?.authorities?.map((v) => v ?? '') ?? []
});

export const useAuth = auth.useAuth;
export const AuthProvider = auth.AuthProvider;