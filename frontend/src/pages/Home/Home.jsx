import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomePrincipal from "../../data/images/Home/HomePrincipal.jpeg";
import {
  FullScreenBox,
  BackgroundImage,
  ContentWrapper,
  StyledCard,
  Title,
  Subtitle,
  StyledButton,
} from "./Home.styles";

// Agrega aquí todas las rutas de imágenes que quieras precargar
const allImages = [
  // Biografía
  "/assets/images/biografia/biografia1.webp",
  "/assets/images/biografia/biografia2.webp",
  // Logos
  "/assets/images/logos/logo1.jpeg",
  "/assets/images/logos/logo2.jpeg",
  // Home principal
  "/src/data/images/Home/HomePrincipal.jpeg",
  // Técnicas principales (agrega todas las que uses)
  "/assets/images/tecnicas_principales/dibujo/digital.jpeg",
  "/assets/images/tecnicas_principales/dibujo/fibra.jpeg",
  "/assets/images/tecnicas_principales/dibujo/lapiz.jpeg",
  "/assets/images/tecnicas_principales/dibujo/tecnica_mixta.jpeg",
  "/assets/images/tecnicas_principales/dibujo/tinta_birome.jpeg",
  "/assets/images/tecnicas_principales/dibujo/tinta_china.jpeg",
  "/assets/images/tecnicas_principales/pintura/acrilico.jpeg",
  "/assets/images/tecnicas_principales/pintura/acuarela.jpeg",
  "/assets/images/tecnicas_principales/pintura/pastel.jpeg",
  "/assets/images/tecnicas_principales/pintura/serigrafia.jpeg",
  "/assets/images/tecnicas_principales/fotografia/urbana.jpeg",
  "/assets/images/tecnicas_principales/fotografia/arquitectura.jpeg",
  "/assets/images/tecnicas_principales/fotografia/paisaje.jpeg",
  "/assets/images/tecnicas_principales/fotografia/documental.jpeg",
  "/assets/images/tecnicas_principales/fotografia/moda.jpeg",
  "/assets/images/tecnicas_principales/fotografia/retrato.jpeg",
  "/assets/images/tecnicas_principales/fotografia/abstraccion.jpeg",
  // Llamaradas
  "/assets/images/llamaradas/llamarada-gris.jpeg",
  "/assets/images/llamaradas/llamarada-naranja.jpeg",
  "/assets/images/llamaradas/llamarada-roja.jpeg",
  "/assets/images/llamaradas/llamarada-marron.jpeg",
  // Agrega aquí más rutas según tus carpetas y necesidades...
];

// Precarga todas las imágenes del array
const preloadAllImages = () => {
  allImages.forEach(src => {
    const img = new window.Image();
    img.src = src;
  });
};

const Home = () => {
  const navigate = useNavigate();

  const handleEntrar = () => {
    preloadAllImages();
    navigate("/portfolio");
  };

  return (
    <FullScreenBox>
      <BackgroundImage
        style={{ backgroundImage: `url(${HomePrincipal})` }}
      />

      <ContentWrapper>
        <StyledCard>
          <Title>PORT-</Title>
          <Title>FOLIO</Title>
          <StyledButton onClick={handleEntrar}>
            ENTRAR
          </StyledButton>
        </StyledCard>
      </ContentWrapper>
    </FullScreenBox>
  );
};

export default Home;