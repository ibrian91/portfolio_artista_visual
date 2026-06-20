import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Main from "./pages/Main/Main";
import Techniques from "./pages/Techniques/Techniques";
import Header from "./components/Header/Header";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import FormPage from "./pages/FormPage/FormPage";
import BlackoutActivatePage from "./pages/SystemControl/BlackoutActivatePage";
import BlackoutDeactivatePage from "./pages/SystemControl/BlackoutDeactivatePage";


const App = () => {
  const location = useLocation();
  const [isBlackoutActive, setIsBlackoutActive] = useState(
    localStorage.getItem("siteBlackout") === "1"
  );

  useEffect(() => {
    const syncBlackoutState = () => {
      setIsBlackoutActive(localStorage.getItem("siteBlackout") === "1");
    };

    window.addEventListener("storage", syncBlackoutState);
    window.addEventListener("site-blackout-changed", syncBlackoutState);

    return () => {
      window.removeEventListener("storage", syncBlackoutState);
      window.removeEventListener("site-blackout-changed", syncBlackoutState);
    };
  }, []);

  const canShowHeader =
    location.pathname !== "/" &&
    location.pathname !== "/portfolio/queesestapagina" &&
    location.pathname !== "/portfolio/queesestapagina2";

  const shouldShowBlackoutOverlay =
    isBlackoutActive && location.pathname !== "/portfolio/queesestapagina2";

  return (
    <div>
      {canShowHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="portfolio" element={<Main />} />
        <Route path="portfolio/queesestapagina" element={<BlackoutActivatePage />} />
        <Route path="portfolio/queesestapagina2" element={<BlackoutDeactivatePage />} />
        <Route path="biografia" element={<About />} />
        <Route path="techniques" element={<Techniques />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="/form_images/key/:key" element={<FormPage />} />
      </Routes>

      {shouldShowBlackoutOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#000",
            zIndex: 99999,
          }}
        />
      )}
    </div>
  );
}

export default App;