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
    </section>
  );
};

export default About;