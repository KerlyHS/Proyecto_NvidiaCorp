import { Button } from '@vaadin/react-components';
import { useNavigate } from 'react-router';
import "themes/default/css/index.css";

export default function IndexList() {
    const navigate = useNavigate();

    return (
        <main className="main-nvidia">
            <div className="nvidia-card">
                <h1 className="nvidia-title">Bienvenido a NvidiaCorp</h1>

                <img
                    src="https://logos-world.net/wp-content/uploads/2020/11/Nvidia-Symbol.jpg"
                    alt="Producto Nvidia"
                    className="producto-imagen"
                />
                <p className="nvidia-desc">
                    Innovación y potencia para tus proyectos tecnológicos.
                </p>

                <Button
                    className="btn-productos"
                    onClick={() => navigate('/producto-list')}
                >
                    Ver Productos
                </Button>

            </div>
        </main>
    );
}