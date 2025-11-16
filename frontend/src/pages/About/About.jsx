import React, { useState, useEffect } from "react";
import "./About.css";
import biografia1 from "/assets/images/biografia/biografia1.webp";
import biografia2 from "/assets/images/biografia/biografia2.webp";

const images = [biografia1, biografia2];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedIndexes, setLoadedIndexes] = useState([false, false]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleImageLoad = (idx) => {
    setLoadedIndexes((prev) => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
  };

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const nextFullscreen = () => {
    setFullscreenIndex((prev) => (prev + 1) % images.length);
  };

  const prevFullscreen = () => {
    setFullscreenIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      
      if (e.key === 'Escape') {
        closeFullscreen();
      } else if (e.key === 'ArrowRight') {
        nextFullscreen();
      } else if (e.key === 'ArrowLeft') {
        prevFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      {/* Modal de pantalla completa */}
      {isFullscreen && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <button className="fullscreen-close" onClick={closeFullscreen}>✕</button>
          
          <button className="fullscreen-prev" onClick={(e) => { e.stopPropagation(); prevFullscreen(); }}>
            ‹
          </button>
          
          <img 
            src={images[fullscreenIndex]} 
            alt={`Biografía ${fullscreenIndex + 1}`}
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button className="fullscreen-next" onClick={(e) => { e.stopPropagation(); nextFullscreen(); }}>
            ›
          </button>

          <div className="fullscreen-counter">
            {fullscreenIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <section className="slideshow-section">
      <div className="slideshow-tittle">
        <h1>
          <span className="first-name">Matias</span> <span className="last-name">Borsalino</span>
        </h1>
      </div>
      <div className="slideshow-container">
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
            style={{
              minHeight: "320px",
              minWidth: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src={img}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "auto",
                filter: loadedIndexes[index] ? "none" : "blur(8px)",
                transition: "filter 0.5s",
                cursor: "pointer"
              }}
              loading="eager"
              onLoad={() => handleImageLoad(index)}
              onClick={() => openFullscreen(index)}
            />
          </div>
        ))}
        <div className="slideshow-controls">
          <button onClick={prevSlide} className="control-btn">‹</button>
          <button onClick={nextSlide} className="control-btn">›</button>
        </div>
        <div className="slideshow-indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active-dot" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      <div className="slideshow-text">
        <p>
          Matías Nicolás Borsalino nace en 1979 en Ciudad de Buenos Aires, Argentina. Estudia varios años en el
          Instituto Universitario Nacional de Arte (IUNA, actualmente UNA) la
          Licenciatura en Artes Visuales con orientación en Pintura. Luego, además de
          participar en talleres de literatura; cursa un año de Arquitectura en la
          Universidad de Palermo. Finalmente ingresa en la carrera de Licenciatura en
          Fotografía en la misma Universidad donde transita todo el grado académico.
        </p>

        <div className="statement-scrollbox">
          <strong className="javanese-text">STATEMENT ARTÍSTICO.</strong>
          <p className="javanese-text">
            "Mi obra contiene aspectos muy diversos en cuanto a temáticas y técnicas. El
            dibujo es el método más utilizado en mis trabajos; ya sea como previos bocetos
            de posteriores pinturas o como resultado final. Uno de los aspectos particulares
            es el contenido lúdico en lo referente a la temática en gran cantidad de
            creaciones.<br /><br />
            Respecto a los procesos y técnicas la intervención digital es un componente
            importante en el acabado final de las imágenes; jugando un papel, a veces, tan
            relevante como la técnica tradicional utilizada. El color juega un papel crucial en
            la mayoría de mis trabajos.<br /><br />
            El objetivo es que la persona que observa, cuando sea necesario, pueda
            analizar y crear su propia realidad e interpretación de la obra.<br /><br />
            Guillermo Kuitca, Egon Schiele, el Fauvismo, el Cubismo y el Arts & Crafts son
            sólo algunas de mis influencias visuales."
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default About;