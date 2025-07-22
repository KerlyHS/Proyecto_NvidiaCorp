import {configureAuth} from '@vaadin/hilla-react-auth'
import { UsuarioServices } from 'Frontend/generated/endpoints'

const auth = configureAuth(UsuarioServices.getAtentication,{
    getRoles: (user) => user.authorities?.map((v) => v?? '')
});

export const useAuth = auth.useAuth;
export const isLogin = UsuarioServices.isLogin;
export const AuthProvider = auth.AuthProvider;
export const role = UsuarioServices.viewRol;
export const user = UsuarioServices.login;