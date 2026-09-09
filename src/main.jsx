import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import './styles.css';

import logo from './assets/logo.jpg';
import road from './assets/road.jpg';
import tank from './assets/tank.jpg';
import city from './assets/city.jpg';
import sunset from './assets/sunset.jpg';
import ride from './assets/ride.jpg';
import gillette from './assets/gillette-subi.jpg';
import explodedVideo from './assets/gillette-frames/gillette-subi-exploded.webm';

const gallery = [
  { src: sunset, title: 'Rodar juntos', text: 'Atardeceres, carretera y kilómetros compartidos.' },
  { src: road, title: 'Sin destino fijo', text: 'La ruta es parte de la historia.' },
  { src: city, title: 'Street life', text: 'La familia también vive la ciudad.' },
  { src: ride, title: 'La máquina', text: 'Custom, carácter y personalidad.' },
  { src: tank, title: 'Detalles', text: 'Cada pieza cuenta una historia.' },
];

const motoSpecs = [
  { id: 'engine', x: '49%', y: '63%', title: 'Motor V-Twin', desc: '400cc / 52° V-Twin refrigerado por líquido con tapas cromadas pulidas.' },
  { id: 'tank', x: '49%', y: '44%', title: 'Tanque Custom Bi-tono', desc: 'Azul cobalto metalizado con gota marfil e insignia Steed clásica.' },
  { id: 'exhaust', x: '55%', y: '48%', title: 'Escapes Straight Pipes', desc: 'Línea de escapes altos custom con sonido grave e inconfundible.' },
  { id: 'bags', x: '79%', y: '60%', title: 'Alforjas de Cuero', desc: 'Cuero negro repujado con remaches cromados y flecos custom tradicionales.' },
  { id: 'front', x: '33%', y: '38%', title: 'Front End Chopper', desc: 'Horquilla lanzada, manillar elevado y óptica doble auxiliar.' },
  { id: 'wheel', x: '18%', y: '68%', title: 'Rueda Delantera', desc: 'Llanta de radios negros con neumático Metzeler Tourance.' }
];

function App() {
  const [menu, setMenu] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [disassembled, setDisassembled] = useState(false);
  const [motoProgress, setMotoProgress] = useState(1);
  const [motoTime, setMotoTime] = useState(10);
  const [activeSpot, setActiveSpot] = useState(null);
  const motoAnimationRef = useRef(null);
  const motoVideoRef = useRef(null);
  const EXPLODED_TIME = 5.2;
  const END_TIME = 10;
  const heroRef = useRef(null);
  const motoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker', { y: 25, opacity: 0, duration: .8, delay: .15 });
      gsap.from('.hero-title span', { y: 80, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out' });
      gsap.from('.hero-copy', { y: 20, opacity: 0, duration: .8, delay: .7 });
      gsap.from('.hero-actions', { y: 20, opacity: 0, duration: .8, delay: .85 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current) heroRef.current.style.setProperty('--parallax', `${y * 0.16}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => () => cancelAnimationFrame(motoAnimationRef.current), []);

  const animateMotoTo = (target) => {
    const video = motoVideoRef.current;
    if (!video) return;
    cancelAnimationFrame(motoAnimationRef.current);
    const from = video.currentTime;
    const to = Math.max(0, Math.min(END_TIME, target));
    const start = performance.now();
    const duration = Math.max(700, Math.abs(to - from) * 420);

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const time = from + (to - from) * eased;
      video.currentTime = time;
      setMotoTime(time);
      setMotoProgress(Math.min(1, Math.abs(time) / EXPLODED_TIME));
      if (p < 1) {
        motoAnimationRef.current = requestAnimationFrame(tick);
      } else {
        video.currentTime = to;
        setMotoTime(to);
        setMotoProgress(to <= EXPLODED_TIME ? to / EXPLODED_TIME : 1);
        setDisassembled(to >= EXPLODED_TIME - .08 && to < 7.5);
      }
    };
    motoAnimationRef.current = requestAnimationFrame(tick);
  };

  const setMotoState = (isDisassembled) => {
    setDisassembled(isDisassembled);
    animateMotoTo(isDisassembled ? EXPLODED_TIME : END_TIME);
  };

  const scrubMoto = (value) => {
    const next = Number(value);
    cancelAnimationFrame(motoAnimationRef.current);
    const video = motoVideoRef.current;
    if (!video) return;
    video.currentTime = next;
    setMotoTime(next);
    setMotoProgress(next <= EXPLODED_TIME ? next / EXPLODED_TIME : 1);
    setDisassembled(next >= EXPLODED_TIME - .08 && next < 7.5);
  };

  const scrollTo = (id) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const changeGallery = (dir) => {
    setGalleryIndex((i) => (i + dir + gallery.length) % gallery.length);
  };

  return (
    <div className="site">
      <header className="nav">
        <button className="brand" onClick={() => scrollTo('inicio')} aria-label="Ir al inicio">
          <span className="brand-mark">SF</span><span>STREET FAMILY</span>
        </button>
        <nav className={menu ? 'nav-links open' : 'nav-links'}>
          <button onClick={() => scrollTo('club')}>CLUB</button>
          <button onClick={() => scrollTo('gillette')}>HONDA STEED · GILLETTE SUBI</button>
          <button onClick={() => scrollTo('galeria')}>GALERÍA</button>
          <button onClick={() => scrollTo('contacto')}>CONTACTO</button>
        </nav>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Abrir menú">☰</button>
      </header>

      <main>
        <section id="inicio" className="hero" ref={heroRef}>
          <div className="hero-image" style={{ backgroundImage: `url(${road})` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-kicker"><span /> MOTO GROUP · ARICA <span /></div>
            <h1 className="hero-title"><span>STREET</span><span>FAMILY</span></h1>
            <p className="hero-copy">CUSTOM · BROTHERHOOD · ROAD</p>
            <div className="hero-actions">
              <button className="btn primary" onClick={() => scrollTo('gillette')}>VER LA HONDA STEED <b>↓</b></button>
              <button className="btn ghost" onClick={() => scrollTo('club')}>CONOCER EL CLUB</button>
            </div>
          </div>
          <div className="hero-scroll">SCROLL <span>↓</span></div>
        </section>

        <section id="club" className="intro section-pad">
          <div className="section-label">01 / EL CLUB</div>
          <div className="intro-grid">
            <div className="logo-wrap"><img src={logo} alt="Logo Street Family Moto Group" /><span className="logo-ring" /></div>
            <div className="intro-copy">
              <p className="eyebrow">UNA FAMILIA SOBRE DOS RUEDAS</p>
              <h2>No se trata solo<br /><em>de motos.</em></h2>
              <p>Street Family nace de la pasión por las motocicletas, la personalización y la carretera. Un grupo donde cada máquina tiene personalidad y cada salida suma una historia.</p>
              <div className="stats"><div><strong>01</strong><span>FAMILIA</span></div><div><strong>∞</strong><span>KILÓMETROS</span></div><div><strong>24/7</strong><span>PASIÓN</span></div></div>
            </div>
          </div>
        </section>

        <section id="gillette" className="moto-section section-pad">
          <div className="section-label">02 / CUSTOM BUILD</div>
          <div className="moto-heading">
            <div><p className="eyebrow">LA PROTAGONISTA</p><h2>HONDA <em>STEED</em></h2></div>
            <p>Una custom con identidad propia. Mira cómo pasa de máquina terminada a una vista explotada y vuelve a armarse.</p>
          </div>
          <div className="moto-stage moto-stage-video">
            <div className="moto-glow" />
            <div className="moto-grid" />
            <div className="moto-image-wrap" ref={motoRef}>
              <div className="moto-canvas">
                <img
                  src={gillette}
                  alt="Honda Steed Gillette Subi"
                  className={`moto-photo ${disassembled ? 'is-hidden' : 'is-visible'}`}
                />
                <video
                  ref={motoVideoRef}
                  className={`moto-video moto-frame ${disassembled ? 'is-visible' : 'is-hidden'}`}
                  src={explodedVideo}
                  poster={gillette}
                  muted
                  playsInline
                  preload="auto"
                  aria-label={disassembled ? 'Honda Steed Gillette Subi en vista explotada' : 'Honda Steed Gillette Subi'}
                  onLoadedMetadata={(e) => {
                    if (disassembled) {
                      e.currentTarget.currentTime = EXPLODED_TIME;
                      setMotoTime(EXPLODED_TIME);
                    }
                  }}
                  onTimeUpdate={(e) => setMotoTime(e.currentTarget.currentTime)}
                />
                {!disassembled && (
                  <div className="moto-hotspots">
                    {motoSpecs.map((spot) => (
                      <button
                        key={spot.id}
                        type="button"
                        className={`hotspot-node ${activeSpot?.id === spot.id ? 'active' : ''}`}
                        style={{ left: spot.x, top: spot.y }}
                        onMouseEnter={() => setActiveSpot(spot)}
                        onMouseLeave={() => setActiveSpot(null)}
                        onClick={() => setActiveSpot(activeSpot?.id === spot.id ? null : spot)}
                        aria-label={`Detalle: ${spot.title}`}
                      >
                        <span className="hotspot-pulse" />
                        <span className="hotspot-dot" />
                        <div className="hotspot-tooltip">
                          <strong>{spot.title}</strong>
                          <p>{spot.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="scanline" />
              </div>
            </div>
            <div className="moto-status"><span className={disassembled ? 'dot hot' : 'dot'} />{disassembled ? 'VISTA EXPLOTADA' : 'MÁQUINA LISTA'}</div>
            <div className="moto-badge">HONDA STEED · GILLETTE SUBI <b>01</b></div>
          </div>

          <div className="moto-specs-bar">
            <div className="spec-item">
              <span className="spec-label">MODELO</span>
              <strong className="spec-val">HONDA STEED 400 / 600 VLX</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">CONFIGURACIÓN</span>
              <strong className="spec-val">V-TWIN CUSTOM CHOPPER</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">PINTURA</span>
              <strong className="spec-val">AZUL COBALTO & MARFIL</strong>
            </div>
            <div className="spec-item">
              <span className="spec-label">LINAJE</span>
              <strong className="spec-val">STREET FAMILY MOTO GROUP</strong>
            </div>
          </div>
          <div className="moto-controls">
            <button className={!disassembled ? 'control active' : 'control'} onClick={() => setMotoState(false)}><span>01</span> ARMAR MOTO</button>
            <div className="control-line" />
            <button className={disassembled ? 'control active' : 'control'} onClick={() => setMotoState(true)}><span>02</span> DESARMAR MOTO</button>
          </div>
          <div className="moto-scrubber">
            <div className="scrub-labels"><span>ARMADA</span><span>DESARME</span></div>
            <input aria-label="Controlar desarme de la Gillette Subi" type="range" min="0" max={END_TIME} step="0.05" value={motoTime} onChange={(e) => scrubMoto(e.target.value)} />
          </div>
          <p className="moto-note">La animación está basada directamente en tu video de referencia: la Honda Steed se desarma hasta la vista explotada y vuelve a ensamblarse en la misma secuencia.</p>
        </section>

        <section className="quote">
          <div className="quote-bg" style={{ backgroundImage: `url(${sunset})` }} />
          <div className="quote-overlay" />
          <div className="quote-content"><span>“</span><h2>NO SE TRATA<br />DEL DESTINO.<br /><em>SE TRATA DEL CAMINO.</em></h2><small>— STREET FAMILY</small></div>
        </section>

        <section id="galeria" className="gallery section-pad">
          <div className="section-label">03 / GALERÍA</div>
          <div className="gallery-head"><div><p className="eyebrow">MEMORIAS DE LA RUTA</p><h2>EN LA <em>CALLE</em></h2></div><div className="gallery-controls"><button onClick={() => changeGallery(-1)}>←</button><span>{String(galleryIndex + 1).padStart(2,'0')} / {String(gallery.length).padStart(2,'0')}</span><button onClick={() => changeGallery(1)}>→</button></div></div>
          <div className="gallery-feature">
            <img key={galleryIndex} src={gallery[galleryIndex].src} alt={gallery[galleryIndex].title} />
            <div className="gallery-caption"><span>STREET FAMILY / {String(galleryIndex + 1).padStart(2,'0')}</span><h3>{gallery[galleryIndex].title}</h3><p>{gallery[galleryIndex].text}</p></div>
          </div>
          <div className="thumbs">{gallery.map((item, i) => <button key={item.src} className={i === galleryIndex ? 'thumb active' : 'thumb'} onClick={() => setGalleryIndex(i)}><img src={item.src} alt="" /></button>)}</div>
        </section>

        <section id="contacto" className="contact section-pad">
          <div className="contact-inner"><p className="eyebrow">¿NOS VEMOS EN LA RUTA?</p><h2>STREET<br /><em>FAMILY.</em></h2><p>La carretera es más grande cuando se comparte.</p><button className="btn primary" onClick={() => window.location.href = 'mailto:streetfamily@example.com'}>CONTACTAR AL CLUB ↗</button></div>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} STREET FAMILY MOTO GROUP</span><span>CUSTOM · ROAD · BROTHERHOOD</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
