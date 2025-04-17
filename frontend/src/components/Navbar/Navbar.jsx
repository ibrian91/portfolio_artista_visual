import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importamos Link
import { Menu, X } from "lucide-react";
import "./Navbar.css"; // Importamos el CSS
import Logo from "../Other/Logo";
import logoData from "../../assets/logos.json";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const randomIndex = Math.floor(Math.random() * logoData.length);
  const randomLogo = logoData[randomIndex];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <nav className="navbar">
           <div className="logo-circle">
      <img src={randomLogo.image} alt={randomLogo.title} className="logo-image" />
    </div>

      {/* Menú en escritorio */}
      {!isMobile && (
        <div className="nav-links">
          <Link to="/portfolio">PORTFOLIO</Link>
          <Link to="/biografia">BIOGRAFÍA</Link>
          <Link to="/contacto">CONTACTO</Link>
        </div>
      )}

      {/* Icono del menú hamburguesa en móviles */}
      {isMobile && (
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={50} /> : <Menu size={50} />}
        </div>
      )}

      {/* Menú hamburguesa en móviles */}
      {isMobile && (
        <div className={`menu ${isOpen ? "open" : ""}`}>
          <Link to="/portfolio" onClick={() => setIsOpen(false)}>PORTFOLIO</Link>
          <Link to="/biografia" onClick={() => setIsOpen(false)}>BIOGRAFÍA</Link>
          <Link to="/contacto" onClick={() => setIsOpen(false)}>CONTACTO</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;