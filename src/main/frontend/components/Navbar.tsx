import { useNavigate } from 'react-router';
import "themes/default/css/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

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
        <span className="navbar-link" onClick={() => navigate('/login')}>
          Iniciar sesión
        </span>
      </div>
    </nav>
  );
}