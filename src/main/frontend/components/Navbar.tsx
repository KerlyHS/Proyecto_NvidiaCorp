import { useLocation, useNavigate } from 'react-router';
import { useAuth } from 'Frontend/security/auth';
import "themes/default/css/navbar.css";
import { UsuarioServices } from 'Frontend/generated/endpoints';
import { Notification } from '@vaadin/react-components/Notification';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: { user }, logout } = useAuth(); // ← CORREGIDO: acceder a state.user y usar logout del contexto

  console.log("Usuario autenticado:", user); // Para depurar

  const handleLogout = () => {
    logout(); // Llama a logout del contexto (que ya hace setUser(undefined))
    Notification.show('Sesión cerrada', { position: 'bottom-center' });
    navigate('/login');
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
          <>
            <span className="navbar-link" title="Usuario logueado">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Usuario"
                style={{ width: 32, height: 32, borderRadius: '50%' }}
              />
            </span>
            <span 
              className="navbar-link logout-button" 
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i> Cerrar sesión
            </span>
          </>
        ) : (
          <span className="navbar-link" onClick={() => navigate('/login', { state: { from: location.pathname } })}>
            Iniciar sesión
          </span>
        )}
      </div>
    </nav>
  );
}