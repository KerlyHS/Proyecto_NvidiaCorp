import "themes/default/css/login.css";
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { LoginOverlay } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'Frontend/security/auth'; 
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
  const { login } = useAuth(); 
  const hasError = useSignal(false);

  useEffect(() => {
    isLogin().then(logeado => {
      if (logeado) navigate('/'); 
    }).catch(() => console.log("Usuario no logueado"));
  }, []);

  const i18n = {
    header: {
      title: 'NvidiaCorp Portal',
      description:'Solo los administradores pueden crear cuentas nuevas.', 
      subtitle: 'Acceso exclusivo para personal autorizado.'
    },
    form: {
      title: 'Iniciar Sesión',
      username: 'Correo Institucional',
      password: 'Contraseña',
      submit: 'Entrar al Sistema',
      forgotPassword: '¿Problemas con tu acceso?',
    },
    errorMessage: {
      title: 'Acceso Denegado',
      message: 'Credenciales incorrectas.',
      username: 'El correo es obligatorio',
      password: 'La contraseña es obligatoria'
    },
    additionalInformation: '¿No tienes cuenta? Contacta a soporte.', 
  };

  return (
    <main className="flex justify-center items-center h-full w-full relative flex-col" style={{ position: 'relative' }}>
      
      {/* Botón de Inicio - esquina superior izquierda */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: '#76b900',
          color: '#232323',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#9bc259';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#76b900';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ← Volver a Inicio
      </button>

      <LoginOverlay
        opened
        i18n={i18n}
        error={hasError.value}
        noForgotPassword
        
        onErrorChanged={(event) => {
          hasError.value = event.detail.value;
        }}

        onLogin={async ({ detail: { username, password } }) => {
          try {
            hasError.value = false;
            const data = await UsuarioServices.login(username, password);
            const response = data as any;

            if (response && response.success) {
              Notification.show('¡Bienvenido!', { duration: 3000, theme: 'success' });
              login({ name: username, roles: response.roles || [] });
              setTimeout(() => navigate('/'), 500);
            } else {
              Notification.show(response?.message || 'Error al ingresar', { duration: 4000, theme: 'error' });
              hasError.value = true;
            }
          } catch (error) {
            Notification.show('Error de conexión', { duration: 4000, theme: 'error' });
            hasError.value = true;
          }
        }}
      />
    </main>
  );
}