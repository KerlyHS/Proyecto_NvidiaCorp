import { useNavigate } from 'react-router';
import "themes/default/css/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src="https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Symbol.jpg" alt="NVIDIA" />
        <span className="navbar-title">NVIDIA</span>
      </div>
      <div className="navbar-links">
        <span onClick={() => navigate('/producto-list')}>Productos</span>
        <span onClick={() => navigate('/carrito-list')}>Carrito</span>
        <span onClick={() => navigate('/pago-list')}>Pagos</span>
        <span onClick={() => navigate('/soporte')}>Soporte</span>
      </div>
    </nav>
  );
}