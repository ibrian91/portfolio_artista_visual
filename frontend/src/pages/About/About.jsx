import React, { useState, useEffect } from "react";
import "./About.css";
import biografia1 from "/assets/images/biografia/biografia1.jpeg";
import biografia2 from "/assets/images/biografia/biografia2.jpeg";

const ImageWithLoader = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", minHeight: "320px", minWidth: "100%" }}>
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, background: "#eee",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1
        }}>
          <span style={{ color: "#888" }}>Cargando imagen...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s"
        }}
        onLoad={() => setLoaded(true)}
        loading="eager"
      />
    </div>
  );
};

const images = [biografia1, biografia2];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
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
    style={{ minHeight: "320px", minWidth: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <ImageWithLoader src={img} alt={`Slide ${index}`} />
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
    Nace en 1979 en Ciudad de Buenos Aires, Argentina. Estudia varios años en el
    Instituto Universitario Nacional de Arte (IUNA, actualmente UNA) la
    Licenciatura en Artes Visuales con orientación en Pintura. Luego, además de
    participar en talleres de literatura; cursa un año de Arquitectura en la
    Universidad de Palermo. Finalmente ingresa en la carrera de Licenciatura en
    Fotografía en la misma Universidad donde transita todo el grado académico.
  </p>

  <div className="statement-scrollbox">
    <strong>STATEMENT ARTÍSTICO.</strong>
    <p>
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
  );
};

export default About;