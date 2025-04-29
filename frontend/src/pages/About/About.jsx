import React, { useState, useEffect } from "react";
import "./About.css";
import biografia1 from "/assets/images/biografia/biografia1.jpeg";
import biografia2 from "/assets/images/biografia/biografia2.jpeg";

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
            >
              <img src={img} alt={`Slide ${index}`} />
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

      </div>
    </section>
  );
};

export default About;