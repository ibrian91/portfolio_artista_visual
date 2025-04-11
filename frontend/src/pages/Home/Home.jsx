// Home.jsx
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
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

const Home = () => {
  return (
    <FullScreenBox>
      <BackgroundImage
        style={{ backgroundImage: `url(${HomePrincipal})` }}
      />

      <ContentWrapper>
        <StyledCard>
          <Title>MATIAS</Title>
          <Title>BORSOLINO</Title>
          <StyledButton as={Link} to="/portfolio">
            INGRESAR
          </StyledButton>
        </StyledCard>
      </ContentWrapper>
    </FullScreenBox>
  );
};

export default Home;
