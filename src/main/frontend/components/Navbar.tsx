import { useNavigate } from 'react-router';
import { useAuth } from 'Frontend/security/auth';
import "themes/default/css/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("Usuario autenticado:", user); // <-- Agrega esto

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
          // Si está logueado, muestra un icono/avatar por defecto
          <span className="navbar-link" title="Usuario logueado">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Usuario"
              style={{ width: 32, height: 32, borderRadius: '50%' }}
            />
          </span>
        ) : (
          // Si NO está logueado, muestra el botón de iniciar sesión
          <span className="navbar-link" onClick={() => navigate('/login', { state: { from: location.pathname } })}>
            Iniciar sesión
          </span>
        )}
      </div>
    </nav>
  );
}