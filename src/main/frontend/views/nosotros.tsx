import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import "themes/default/css/nosotros.css";

export default function NosotrosView() {
  const location = useLocation();

  useEffect(() => {
    const sections = document.querySelectorAll(".nosotros-section-anim");
    sections.forEach((sec, i) => {
      setTimeout(() => sec.classList.add("visible"), 200 + i * 200);
    });

    // ← NUEVO: Si viene del login, desplazarse a contacto
    if (location.state?.scrollTo === 'contacto') {
      setTimeout(() => {
        const contactoSection = document.querySelector('.nosotros-contacto');
        if (contactoSection) {
          contactoSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location.state]);

  return (
    <main className="nosotros-main">
      <div className="nosotros-bg-anim"></div>

      {/* Presentación */}
      <section className="nosotros-section-anim nosotros-presentacion">
        <h1>NvidiaCorp</h1>
        <p className="empresa-desc">
          <b>Somos NvidiaCorp</b>, un equipo ecuatoriano enfocado en la comercialización y gestión tecnológica de productos Nvidia. Nuestro objetivo es optimizar las ventas, mejorar la atención al cliente y automatizar procesos para consumidores en Loja y todo el Ecuador.
        </p>
        <div className="presentacion-destacados">
          <div><span role="img" aria-label="Innovación">🚀</span><span>Innovación tecnológica</span></div>
          <div><span role="img" aria-label="Atención">👥</span><span>Atención personalizada</span></div>
          <div><span role="img" aria-label="Compromiso">🤝</span><span>Compromiso y confianza</span></div>
        </div>
      </section>

      {/* Historia */}
      <section className="nosotros-section-anim nosotros-historia">
        <h2>Nuestra Historia</h2>
        <p>
          NvidiaCorp nació en 2025 como un proyecto académico impulsado por estudiantes de la Universidad Nacional de Loja. Identificamos la falta de una plataforma especializada en la venta de productos Nvidia y decidimos desarrollar una solución moderna, escalable y centrada en la experiencia del usuario.
        </p>
        <div className="historia-imagenes">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" alt="Equipo NvidiaCorp en desarrollo" />
          <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80" alt="Entorno de trabajo" />
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="nosotros-section-anim nosotros-mvv">
        <div className="mvv-grid">
          <div className="mvv-card">
            <span role="img" aria-label="Misión">💡</span>
            <h3>Misión</h3>
            <p>
              Brindar soluciones tecnológicas innovadoras y confiables para la comercialización de productos Nvidia, mejorando la experiencia del usuario y la eficiencia operativa.
            </p>
          </div>
          <div className="mvv-card">
            <span role="img" aria-label="Visión">🚀</span>
            <h3>Visión</h3>
            <p>
              Ser la empresa líder en Ecuador en la distribución y gestión de productos Nvidia, reconocida por su excelencia, innovación y compromiso.
            </p>
          </div>
          <div className="mvv-card">
            <span role="img" aria-label="Valores">🌟</span>
            <h3>Valores</h3>
            <ul>
              <li>Innovación</li>
              <li>Honestidad</li>
              <li>Compromiso</li>
              <li>Calidad</li>
              <li>Trabajo en equipo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Equipo humano */}
      <section className="nosotros-section-anim nosotros-integrantes">
        <h2>Nuestro Equipo</h2>
        <div className="integrantes-list">
          <a href="https://github.com/Crussader04" target="_blank" rel="noopener noreferrer" className="integrante-link">
            <article className="integrante-card card-anim">
              <img src="https://avatars.githubusercontent.com/u/166523346?v=4" alt="Cristian Tomalá - Backend Developer" />
              <h4>Cristian Tomalá</h4>
            </article>
          </a>
          <a href="https://github.com/Josue082004" target="_blank" rel="noopener noreferrer" className="integrante-link">
            <article className="integrante-card card-anim">
              <img src="https://avatars.githubusercontent.com/u/148294876?s=64&v=4" alt="Josue Asanza - UI/UX y Frontend" />
              <h4>Josue Asanza</h4>
            </article>
          </a>
          <a href="https://github.com/Geky36" target="_blank" rel="noopener noreferrer" className="integrante-link">
            <article className="integrante-card card-anim">
              <img src="https://avatars.githubusercontent.com/u/166522885?v=4" alt="Kevin Nole - Fullstack Developer" />
              <h4>Kevin Nole</h4>
            </article>
          </a>
          <a href="https://github.com/KerlyHS" target="_blank" rel="noopener noreferrer" className="integrante-link">
            <article className="integrante-card card-anim">
              <img src="https://avatars.githubusercontent.com/u/133796983?s=64&v=4" alt="Kerly Huachaca - Documentación y QA" />
              <h4>Kerly Huachaca</h4>
            </article>
          </a>
        </div>
      </section>

      {/* Contacto */}
      <section className="nosotros-section-anim nosotros-contacto">
        <h2>¿Quieres saber más?</h2>
        <p>Contáctanos y descubre cómo NvidiaCorp puede ayudarte a potenciar tu proyecto con tecnología de alto nivel.</p>
        <a
          href="https://wa.me/593999716365"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-contacto whatsapp-btn"
        >
          <span className="icono-btn" role="img" aria-label="WhatsApp">💬</span> Contáctanos 
        </a>
      </section>
    </main>
  );
}
