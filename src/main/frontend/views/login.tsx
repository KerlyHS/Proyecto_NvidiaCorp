import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, GridSortColumn, HorizontalLayout, NumberField, Select, SelectItem, TextField, PasswordField, VerticalLayout, LoginForm, LoginOverlay } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect, useState } from 'react';
import { data, replace, useNavigate, useSearchParams } from 'react-router';
import { isLogin } from 'Frontend/generated/UsuarioServices';
import { useAuth, user } from 'Frontend/security/auth';

export const config: ViewConfig = {
  skipLayouts: true,
  menu: {
  exclude: true,
  title: 'Login',
  icon: 'vaadin:login',
  },
};
/* 
export function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // Simulate a login request
      if (username === 'admin' && password === 'admin') {
        Notification.show('Login successful!', { duration: 3000 });
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
      Notification.show(message, { duration: 3000, theme: 'error' });
    }
  };

  return (
    <VerticalLayout style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>  
      <TextField
        label="Username"
        value={username}
        onValueChanged={e => setUsername(e.detail.value)}
        style={{ width: '100%' }}
      />
      <PasswordField
        label="Password"
        value={password}
        onValueChanged={e => setPassword(e.detail.value)}
        style={{ width: '100%' }}
      />
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>
      )}
      <Button onClick={handleLogin} theme="primary" style={{ width: '100%' }}>
        Login
      </Button>
    </VerticalLayout>
  );
} */

export default function LoginVista(){
  console.log('hABER SI esta wea funciona');
  const navigate = useNavigate();
  
  useEffect(() => {
    isLogin().then(data =>{
      if(data == true){
        navigate('/');
        console.log('Ya estas logeado');
      }
    })
  },[])



  const dataUser = ('');

  const {state, login} = useAuth();
  const[searchParams] = useSearchParams();
  const hasError = useSignal(false);
  const errores = searchParams.has('error');
  const i18n = {
    header: {
      title: 'Login',
      description: 'ENVDIA mejorando tu vista',
      subtitle: 'Porfavor ingrese sus credenciales.'
    },
    form: {
      title: 'Iniciar Sesión',
      username: 'Correo Electrónico',
      password: 'Contraseña',
      submit : 'Iniciar Sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
  },
    errorMessage: {
      title: 'Error',
      message: 'Cree que somos adivinos o que.',
      username: 'El nombre de usuario es requerido',
      password: 'La contraseña es requerida'
    },
    additionalInformation: '¿No tienes una cuenta? pos que pendejo jasjdasjdas',
};
useEffect(()=> {
  UsuarioServices.createRoles().then(data =>
    hasError.value = false
  );
},[]);

const email = useSignal('');
const password = useSignal('');

return (
  <main className="flex justify-center items-center h-full w-full">
    <LoginOverlay opened i18n={i18n} error={errores} noForgotPassword
    onErrorChanged={(event)=>{
      console.log('Error en el login', event.detail.value);
      hasError.value = event.detail.value;
    }}
    
    onLogin={
      async ({detail : {username, password}}) => {
        console.log('Intentando iniciar sesión con:', username, password);
        UsuarioServices.login(username, password).then(async function (data) {
          console.log('Login exitoso:', data);
          if(data?.estado == 'false'){
            //Notification.show('Credenciales incorrectas, porfavor intente nuevamente.'+data?.mensaje, { duration: 3000, theme: 'error' });
            console.log('Credenciales incorrectas');
            hasError.value = Boolean("true");
            navigate('/login?error');

          }else{
            const {error} = await login(username, password);
            hasError.value = Boolean(error);
            const dato = await UsuarioServices.isLogin();
            console.log(dato);
            window.location.reload();
            Notification.show('Bienvenido ' + user.name, { duration: 5000000, theme: 'success' });
            navigate('/home', { replace: true });

          }
        })
    }
    
  }
    ></LoginOverlay>
  </main>
);
}