import { useEffect, useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import techniquesData from "../../assets/techniques.json";
import "@fontsource/playfair-display";
import { motion } from "framer-motion";
import {
  outerBoxStyle,
  mainCardStyle,
  innerBoxStyle,
  motionCardStyle,
  imageStyle,
  hoverOverlayStyle,
  titleBoxStyle,
  charStyle,
} from "./Main.styles";

const MotionCard = motion.create(Card);

const Main = () => {
  const [techniques, setTechniques] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTechniques(techniquesData);
  }, []);

  const handleTechniqueClick = (categories) => {
    navigate("/techniques", { state: { categories } });
  };

  return (
    <Box sx={outerBoxStyle}>
      <Card sx={mainCardStyle}>
        <Box sx={innerBoxStyle}>
          {techniques.map((technique, index) => (
            <MotionCard
              key={index}
              onClick={() => handleTechniqueClick(technique)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              sx={motionCardStyle}
            >
              <CardContent sx={{ p: 0, height: "100%", width: "100%" }}>
                <Box
                  component="img"
                  src={technique.image}
                  alt={technique.title}
                  sx={imageStyle}
                />
                <Box className="hoverOverlay" sx={hoverOverlayStyle} />
                <Box className="titleBox" sx={titleBoxStyle}>
                  {technique.title.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 30, opacity: 0, rotate: -10 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      transition={{
                        delay: i * 0.05,
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                      style={charStyle}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

export default Main;