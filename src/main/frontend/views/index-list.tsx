import { Button } from '@vaadin/react-components';
import { useNavigate } from 'react-router';
import "themes/default/css/index.css";

export default function IndexList() {
    const navigate = useNavigate();

    return (
        <main className="main-nvidia">
            <nav className="nvidia-navbar nvidia-navbar-white">
                <div className="nvidia-navbar-logo">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg"
                        alt="Nvidia Logo"
                        className="nvidia-logo"
                    />
                </div>
                <div className="nvidia-navbar-actions">
                    <Button
                        theme="primary"
                        className="nvidia-navbar-btn"
                        style={{
                            background: '#76b900',
                            color: '#0f0f0f',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: 'none',
                        }}
                        onClick={() => navigate('/login-list')}
                    >
                        Iniciar Sesión
                    </Button>
                    <Button
                        theme="secondary"
                        className="nvidia-navbar-btn"
                        style={{
                            background: '#fff',
                            color: '#76b900',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: '2px solid #76b900',
                            marginLeft: '1rem',
                        }}
                        onClick={() => navigate('/producto-list')}
                    >
                        Ver Catálogo de Productos
                    </Button>
                </div>
            </nav>
            <div className="nvidia-card">
                <h1 className="nvidia-title">Bienvenido a NvidiaCorp</h1>
                <div className="producto-card">
                    <img
                        src="https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Symbol.jpg"
                        alt="Producto Nvidia"
                        className="producto-imagen"
                    />
                </div>
                <p className="nvidia-desc">
                    Innovación y potencia para tus proyectos tecnológicos.
                </p>
                {/* Aquí puedes seguir mejorando el contenido */}
            </div>
        </main>
    );
}