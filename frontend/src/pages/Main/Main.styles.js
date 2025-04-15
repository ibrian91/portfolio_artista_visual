

export const outerBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  p: 2,
};

export const mainCardStyle = {
  width: "2000px",
  minHeight: "550px",
  padding: 0,
  bgcolor: "transparent",
  color: "white",
  borderRadius: "20px",
  boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const innerBoxStyle = {
  display: "flex",
  width: "1700px",
  height: "550px",
  gap: "20px",
  overflow: "hidden",
};

export const motionCardStyle = {
  flex: 1,
  bgcolor: "#3C2E2B",
  borderRadius: "12px",
  padding: 0,
  height: "100%",
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0px 10px 20px rgba(0,0,0,0.4)",
  },
  "&:hover .titleBox": {
    opacity: 1,
  },
};

export const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "filter 0.5s ease",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 0,
};

export const hoverOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.4)",
  opacity: 0,
  transition: "opacity 0.4s ease",
  zIndex: 1,
  "&:hover": {
    opacity: 1,
  },
};

export const titleBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  color: "white",
  opacity: 0,
  transition: "opacity 0.5s ease",
  zIndex: 1,
  display: "flex",
  gap: "0.2rem",
  pointerEvents: "none",
};

export const charStyle = {
  fontSize: "2.5rem",
  fontFamily: "'Playfair Display', serif",
  textTransform: "uppercase",
  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
  color: "white",
  display: "inline-block",
};