import React, { useEffect, useRef } from "react";
import "./About.css";
import biografia1 from "/assets/images/biografia/biografia1.jpeg";
import biografia2 from "/assets/images/biografia/biografia2.jpeg";

const About = () => {
  const sliderRef = useRef(null);
  const dividerRef = useRef(null);
  const handleRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const handle = handleRef.current;
    const divider = dividerRef.current;
    const resize = resizeRef.current;
  
    let isDragging = false;
  
    const getX = (e) => {
      if (e.touches) return e.touches[0].clientX;
      return e.clientX;
    };
  
    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault();
    };
  
    const stopDrag = () => {
      isDragging = false;
    };
  
    const onDrag = (e) => {
      if (!isDragging) return;
  
      const rect = slider.getBoundingClientRect();
      let x = getX(e) - rect.left;
  
      x = Math.max(0, Math.min(x, rect.width));
  
      resize.style.width = `${x}px`;
      divider.style.left = `${x}px`;
      handle.style.left = `${x}px`;
    };
  
    // 👉 Animación inicial para mobile
    if (window.innerWidth <= 768) {
      handle.classList.add("animate");
      setTimeout(() => {
        handle.classList.remove("animate");
      }, 1600);
    }
  
    // 👉 Eventos
    handle.addEventListener("mousedown", startDrag);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", onDrag);
  
    handle.addEventListener("touchstart", startDrag, { passive: false });
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("touchmove", onDrag, { passive: false });
  
    return () => {
      handle.removeEventListener("mousedown", startDrag);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("mousemove", onDrag);
  
      handle.removeEventListener("touchstart", startDrag);
      window.removeEventListener("touchend", stopDrag);
      window.removeEventListener("touchmove", onDrag);
    };
  }, []);

  

  return (
    <section className="section">
      <div className="comparison-slider-wrapper">
        <div className="comparison-slider" ref={sliderRef}>
          <img
            src={biografia1}
            alt="Después"
            className="after"
          />
          <div className="resize" ref={resizeRef}>
            <img
              src={biografia2}
              alt="Antes"
              className="before"
            />
          </div>
          <div className="divider" ref={dividerRef}></div>
          <div className="handle" ref={handleRef}></div>
        </div>
      </div>
    </section>
  );
};

export default About;