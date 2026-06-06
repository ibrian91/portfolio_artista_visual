// This file is the entry point for the React application.
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from 'react-router-dom'
import logoData from "./assets/logos.json";

const faviconImages = logoData
  .map((logo) => logo.image)
  .filter(Boolean);

const faviconLink = document.querySelector('link[rel="icon"]') || (() => {
  const link = document.createElement("link");
  link.rel = "icon";
  document.head.appendChild(link);
  return link;
})();

const setFavicon = (href) => {
  faviconLink.type = "image/jpeg";
  faviconLink.href = href;
};

if (faviconImages.length > 0) {
  let faviconIndex = 0;

  setFavicon(faviconImages[faviconIndex]);

  if (faviconImages.length > 1) {
    window.setInterval(() => {
      faviconIndex = (faviconIndex + 1) % faviconImages.length;
      setFavicon(faviconImages[faviconIndex]);
    }, 3000);
  }
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);