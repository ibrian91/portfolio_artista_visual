import React from "react";
import "./Contact.css"; // Reutilizamos los estilos

const Contact = () => {
  return (
    <section className="section">
      <h2>Contacto</h2>
      <p>
        Si deseas ponerte en contacto, envía un correo a 
        <strong> artista@email.com </strong> o sígueme en redes sociales.
      </p>
    </section>
  );
};

export default Contact;