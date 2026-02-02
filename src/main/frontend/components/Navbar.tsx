import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../security/auth';
import "themes/default/css/navbar.css";
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { Notification } from '@vaadin/react-components/Notification';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
const { state } = useAuth(); 
const user = state?.user; // Sacamos el usuario del estado

  console.log("Usuario autenticado:", user);

  const handleLogout = () => {
    UsuarioServices.logout()
      .then(() => {
        logout();
        Notification.show('Sesión cerrada', { position: 'bottom-center' });
        navigate('/login');
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
        Notification.show('Error al cerrar sesión', { position: 'bottom-center' });
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img src="https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Symbol.jpg" alt="NVIDIA" />
          <span className="navbar-title">NVIDIA</span>
        </div>
        <span className="navbar-link" onClick={() => navigate('/producto-list')}>Productos</span>
        <span className="navbar-link" onClick={() => navigate('/nosotros')}>Nosotros</span>
      </div>
      
      <div className="navbar-right">
        <span className="navbar-link" onClick={() => navigate('/carrito-list')}>
          <i className="fas fa-shopping-cart"></i>
        </span>

        {user ? (
          /* --- CASO: USUARIO LOGUEADO --- */
          /* Aquí ponemos la foto Y el botón de salir */
          <>
            <span className="navbar-link" title="Usuario logueado">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Usuario"
                style={{ width: 32, height: 32, borderRadius: '50%' }}
              />
            </span>
            
            {/* AGREGADO AQUÍ: El botón de cerrar sesión */}
            <span 
              className="navbar-link logout-button" 
              onClick={handleLogout}
              style={{ cursor: 'pointer', marginLeft: '10px' }} 
            >
              <i className="fas fa-sign-out-alt"></i> Cerrar sesión
            </span>
          </>
        ) : (
          /* --- CASO: USUARIO NO LOGUEADO --- */
          /* Aquí solo dejamos el botón de entrar */
          <span className="navbar-link" onClick={() => navigate('/login', { state: { from: location.pathname } })}>
            Iniciar sesión
          </span>
        )}
      </div>
    </nav>
  );
}