import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Main from "./pages/Main/Main";
import Techniques from "./pages/Techniques/Techniques";
import Header from "./components/Header/Header";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";


const App = () => {
  const location = useLocation();

  

  return (
    <div>
      
      {location.pathname !== "/" && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="portfolio" element={<Main />} />
        <Route path="biografia" element={<About />} />
        <Route path="techniques" element={<Techniques />} />
        <Route path="contacto" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;