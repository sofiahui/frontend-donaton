import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Waves, AlertTriangle, CloudRain } from 'lucide-react';
import Footer from '../components/Footer';
import './Home.css';

// ── Hook animación al entrar en pantalla ─────────
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

// ── Datos ────────────────────────────────────────
const slides = [
  { bg: 'src/assets/estassi.jpg',  title: 'Donaton',          subtitle: 'Juntos,ayudamos donde mas se necesita.',              btn: 'Has tu Donacion'  },
  { bg: 'src/assets/camion.jpg', title: 'Apoyo Comunitario', subtitle: 'Se voluntario y apoya a los necesitados',     btn: 'Voluntariado'   },
  { bg: 'src/assets/niño.png', title: 'Necesidades',            subtitle: 'Conoce en tiempo real las necesidades de la comunidad.',           btn: 'Conoce mas'      },
  { bg: 'src/assets/ayuda_incendio.jpg', title: 'Ayuda en Emergencias', subtitle: 'Estamos aquí para ayudarte en los momentos más difíciles.', btn: 'Transparencia' },
];

const spaceCards = [
  { img: 'src/assets/alimentos-donacion.jpeg', title: 'Donacion de Alimentos',  },
  { img: 'src/assets/ropa-donacion.png', title: 'Donacion de Ropa',   },
  { img: 'src/assets/materiales-donacion.png', title: 'Donacion de Materiales',    },
  { img: 'src/assets/unnamed.jpg', title: 'Apoyar una causa',     },
  { img: 'src/assets/manos.avif', title: 'Voluntarios', },
];

// ── Subcomponente animado ────────────────────────
function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={`home-fade home-fade--${direction} ${inView ? 'home-fade--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  // Hero carousel
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const heroPrev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const heroNext = () => setCurrent(c => (c + 1) % slides.length);

  // Spaces carousel — avanza solo cada 4 seg
  const [spaceIndex, setSpaceIndex] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(1);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.matchMedia('(min-width: 992px)').matches) {
        setCardsVisible(3);
      } else if (window.matchMedia('(min-width: 600px)').matches) {
        setCardsVisible(2);
      } else {
        setCardsVisible(1);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxSpaceIndex = Math.max(0, spaceCards.length - cardsVisible);

  useEffect(() => {
    if (spaceIndex > maxSpaceIndex) {
      setSpaceIndex(maxSpaceIndex);
    }
  }, [cardsVisible, maxSpaceIndex, spaceIndex]);

  useEffect(() => {
    const t = setInterval(() => {
      setSpaceIndex(i => (i + 1) % (maxSpaceIndex + 1));
    }, 4000);
    return () => clearInterval(t);
  }, [maxSpaceIndex]);

  const spacePrev = () => setSpaceIndex(i => (i - 1 + maxSpaceIndex + 1) % (maxSpaceIndex + 1));
  const spaceNext = () => setSpaceIndex(i => (i + 1) % (maxSpaceIndex + 1));

  // Refs para animaciones de sección
  const statsRef    = useRef(null);
  const featuresRef = useRef(null);
  const statsInView    = useInView(statsRef, 0.2);
  const featuresInView = useInView(featuresRef, 0.15);

  return (
    <>
      {/* ══ HERO CAROUSEL ══════════════════════════ */}
      <section className="hero-carousel">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === current ? 'hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.bg})` }}
          >
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <Link to="/voluntarios" className="btn-outline">{slide.btn}</Link>
            </div>
          </div>
        ))}
        <button className="carousel-control prev" onClick={heroPrev}>&#8249;</button>
        <button className="carousel-control next" onClick={heroNext}>&#8250;</button>

        {/* Dots hero */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'hero-dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══ STATS ══════════════════════════════════ */}
      <section className="features">
        <div className="features-inner">
          <div className="features__stats" ref={statsRef}>
            {[
              { value: '+1.300.000',  label: 'Beneficiados'    },
              { value: '+5.000', label: 'Voluntarios'      },
              { value: '+3.000',  label: 'Donaciones' },
              { value: '100%', label: 'Transparencia'    },
            ].map((s, i) => (
              <div
                key={i}
                className={`stat ${statsInView ? 'stat--visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <h2 className="stat__value">{s.value}</h2>
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Features header ── */}
          <FadeIn direction="up" className="features__header">
            <h2 className="features__title">¿Quieres ser parte de la acción?</h2>
            <p className="features__description">
             Chile enfrenta diversos desastres naturales. Estamos preparados para actuar rápidamente cuando ocurren.
            </p>
          </FadeIn>

          {/* ── Feature cards ── */}
          <div className="features__cards" ref={featuresRef}>
            {[
              { icon: <Flame size ={32} />,     title: 'Incendios Forestales',      text: 'Apoyamos a comunidades afectadas por incendios que arrasan hogares y ecosistemas.'     },
              { icon: <CloudRain size ={32} />,    title: 'Inundaciones',  text: 'Asistencia a regiones afectadas por lluvias extremas y aluviones.'         },
              { icon: <Waves size ={32} />,  title: 'Maremotos y Tsunamis',      text: 'Reconstrucción de zonas costeras devastadas por olas gigantes.'         },
              { icon: <AlertTriangle size ={32} />,  title: 'Desastres Naturales',      text: 'Respuesta rápida ante emergencias y desastres que afectan a comunidades vulnerables.'         }
            ].map((card, i) => (
              <article
                key={i}
                className={`feature-card ${featuresInView ? 'feature-card--visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="card__icon">{card.icon}</div>
                <div>
                  <h3 className="card__title">{card.title}</h3>
                  <p className="card__text">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR SPACES ═════════════════════════════ */}
      <section className="spaces">
        <div className="spaces-container">

          {/* Header — título izq, link der */}
          <FadeIn direction="up" className="spaces-header">
            <div>
              <h2>Recaudación de Donaciones por Categoría</h2>
              <p>Tu contribucion puede ser de mucha ayuda en tiempos de emergencia.</p>
            </div>
            <Link to="/spaces" className="view-link">Elige una categoría   ›</Link>
          </FadeIn>

          {/* Carrusel mobile/tablet */}
          <div className="spaces-carousel">
            <div
              className="spaces-track"
              style={{ '--space-index': spaceIndex }}
            >
              {spaceCards.map((card, i) => (
                <div key={i} className="space-card">
                  <img src={card.img} alt={card.title} loading="lazy" />
                  <div className="card-info">
                    <h3>{card.title}</h3>
                    <p>{card.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="space-arrow space-arrow--prev" onClick={spacePrev} aria-label="Anterior">&#8592;</button>
            <button className="space-arrow space-arrow--next" onClick={spaceNext} aria-label="Siguiente">&#8594;</button>

            <div className="space-dots">
              {Array.from({ length: maxSpaceIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  className={`space-dot ${i === spaceIndex ? 'space-dot--active' : ''}`}
                  onClick={() => setSpaceIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════ */}
      <FadeIn direction="up">
        <section className="cta">
          <div className="cta-content">
            <h2>Transparencia</h2>
            <p>Un compromiso constante y uno de nuestros principales pilares y en el que trabajamos día a día. Nos aseguramos que cada donacion llegue a destino de manera eficientemente mejorando la calidad de vida de los chilenos.</p>
            <Link to="/login" className="cta-btn">Conoce como llegan a destino las donaciones</Link>
          </div>
        </section>
      </FadeIn>

      <Footer />
    </>
  );
}
