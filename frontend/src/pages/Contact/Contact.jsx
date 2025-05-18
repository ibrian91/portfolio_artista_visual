import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="section">
      <h2>¿Querés conectar con el arte?</h2>
      <p>
        Ya sea para adquirir una obra, colaborar en un proyecto, invitarme a una exposición o simplemente compartir una idea, estás en el lugar correcto.
        Estoy abierto a propuestas artísticas, charlas, encuentros culturales o cualquier intercambio que gire en torno al arte.
      </p>

      <div className="contact-info">
        <p>📧 <strong>Email:</strong> <a href="mailto:artista@email.com">artista@email.com</a></p>
        <p>📷 <strong>Instagram:</strong> <a href="https://instagram.com/usuario" target="_blank" rel="noopener noreferrer">@usuario</a></p>
        <p>📍 <strong>Ubicación:</strong> Ciudad Autónoma de Buenos Aires, Argentina</p>
      </div>

      <p>
        Si sos parte de una institución, un centro cultural o simplemente te interesa el arte desde un lugar sensible, podés escribirme directamente o seguir mis publicaciones en redes sociales.
      </p>

      <div className="map-container">
  <iframe
    title="Ubicación"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105073.33124859956!2d-58.515705997949574!3d-34.61575126950637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3d05457fbb%3A0xe160f4fce7f7c017!2sCdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1745027880764!5m2!1ses-419!2sar"
    width="500px"
    height="350px"
    style={{ border: 0, borderRadius: "12px" }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

      <p className="closing-message">
        El arte es, por encima de todo, un punto de encuentro. Gracias por visitar este espacio. Estoy disponible para dialogar, crear, conectar.
      </p>
    </section>
  );
};

export default Contact;