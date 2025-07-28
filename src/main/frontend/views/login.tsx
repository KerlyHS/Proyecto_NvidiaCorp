import "themes/default/css/login.css";
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, GridSortColumn, HorizontalLayout, NumberField, Select, SelectItem, TextField, PasswordField, VerticalLayout, LoginForm, LoginOverlay } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect, useState } from 'react';
import { data, replace, useNavigate, useSearchParams, useLocation } from 'react-router';
import { isLogin } from 'Frontend/generated/UsuarioServices';
import { useAuth } from 'Frontend/security/auth';

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
  const location = useLocation();



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
  const { user } = useAuth(); // <--- agrega esto
  const[searchParams] = useSearchParams();
  const hasError = useSignal(false);
  const errores = searchParams.has('error');
  const i18n = {
    header: {
      title: 'Bienvenido a NvidiaCorp',
      description: 'Innovación y potencia para tus proyectos tecnológicos.',
      subtitle: 'Por favor, ingresa tus credenciales para continuar.'
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
      message: 'Credenciales incorrectas.',
      username: 'El correo es requerido',
      password: 'La contraseña es requerida'
    },
    additionalInformation: '¿No tienes una cuenta? Contacta a soporte para registrarte.',
  };
useEffect(()=> {
  UsuarioServices.createRoles().then(data =>
    hasError.value = false
  );
},[]);

const email = useSignal('');
const password = useSignal('');

const onLoginSuccess = () => {
  const from = location.state?.from || '/carrito-list';
  navigate(from, { replace: true });
};

useEffect(() => {
  if (location.state?.notify) {
    Notification.show(location.state.notify, { duration: 3000, position: 'top-center', theme: 'error' });
  }
  // eslint-disable-next-line
}, [location.state?.ts]);

return (
  <main className="flex justify-center items-center h-full w-full">
    <LoginOverlay opened i18n={i18n} error={errores} noForgotPassword
    onErrorChanged={(event)=>{
      console.log('Error en el login', event.detail.value);
          hasError.value = event.detail.value;
        }}
    
    onLogin={
      async ({detail : {username, password}}) => {
        UsuarioServices.login(username, password).then(async function (data) {
          if(data?.success){
            Notification.show('Bienvenido', { duration: 5000, theme: 'success' });
            window.location.reload();
          } else {
            Notification.show('Credenciales incorrectas', { duration: 3000, theme: 'error' });
            hasError.value = true;
          }
        });
}}
    ></LoginOverlay>
  </main>
);
}
