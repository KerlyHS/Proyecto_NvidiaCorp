import "themes/default/css/login.css";
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { LoginOverlay } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
// Importamos isLogin que acabas de crear en Java
import { isLogin } from 'Frontend/generated/UsuarioServices';

export const config: ViewConfig = {
  skipLayouts: true,
  menu: {
    exclude: true,
    title: 'Login',
    icon: 'vaadin:login',
  },
};

export default function LoginVista() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasError = useSignal(false);

  // 1. Verificar si ya está logueado al entrar
  useEffect(() => {
    isLogin().then(logeado => {
      if (logeado) {
        navigate('/'); // Si ya entró, lo mandamos al inicio
      }
    }).catch(err => console.log("Usuario no logueado aún"));
  }, []);

  // 2. Textos en español
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
      submit: 'Iniciar Sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
    },
    errorMessage: {
      title: 'Error de acceso',
      message: 'Credenciales incorrectas o cuenta inactiva.',
      username: 'El correo es requerido',
      password: 'La contraseña es requerida'
    },
    additionalInformation: '¿No tienes una cuenta? Contacta a soporte.',
  };

  // 3. Manejo de notificaciones externas
  useEffect(() => {
    if (location.state?.notify) {
      Notification.show(location.state.notify, { duration: 3000, position: 'top-center', theme: 'error' });
    }
  }, [location.state]);

  return (
    <main className="flex justify-center items-center h-full w-full">
      <LoginOverlay
        opened
        i18n={i18n}
        error={hasError.value}
        noForgotPassword
        
        // Si el usuario escribe de nuevo, quitamos el error rojo
        onErrorChanged={(event) => {
          hasError.value = event.detail.value;
        }}

        // LÓGICA DE LOGIN CONECTADA A MARIADB
        onLogin={async ({ detail: { username, password } }) => {
          try {
            hasError.value = false;
            // Llamamos a tu servicio Java
            const data = await UsuarioServices.login(username, password);
            
            // Forzamos a TypeScript a entender el mapa
            const response = data as any; 

            if (response && response.success) {
              Notification.show('¡Bienvenido!', { duration: 3000, theme: 'success' });
              
              // Pequeña pausa para asegurar que la sesión se guardó
              setTimeout(() => {
                 navigate('/');
              }, 500);
              
            } else {
              // Si falla (contraseña mal o usuario inactivo)
              Notification.show(response?.message || 'Error al ingresar', { duration: 4000, theme: 'error' });
              hasError.value = true;
            }
          } catch (error) {
            console.error(error);
            Notification.show('Error de conexión con el servidor', { duration: 4000, theme: 'error' });
            hasError.value = true;
          }
        }}
      />
    </main>
  );
}