import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
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

const preloadBiografiaImages = () => {
  [
    "/assets/images/biografia/biografia1.webp",
    "/assets/images/biografia/biografia2.webp"
  ].forEach(src => {
    const img = new window.Image();
    img.src = src;
  });
};

const Home = () => {
  const navigate = useNavigate();

  const handleEntrar = (e) => {
    preloadBiografiaImages();
    // Navega después de precargar
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