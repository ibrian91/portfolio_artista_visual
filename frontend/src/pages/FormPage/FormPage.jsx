import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./FormPage.css";
import { useUploadForm } from "../../hooks/useUploadForm";
import { useDeleteFormV2 } from "../../hooks/useDeleteFormV2";
import UploadSection from "../../components/FormComponents/UploadSection";
import DeleteSection from "../../components/FormComponents/DeleteSection";
import PasswordPopup from "../../components/PasswordPopup/PasswordPopup";
import { validateAccessKey } from "../../utils/validation/formValidation.js";

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;
const FORM_PASSWORD = import.meta.env.VITE_FORM_PASSWORD;
// PARA ACCEDER A ESTE FORMULARIO LINK form_images/key/mb_Acceso2025-Form

const FormPage = () => {
  const { key } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Usar hooks personalizados
  const uploadHook = useUploadForm();
  const deleteHook = useDeleteFormV2();

  const handlePasswordSubmit = (password) => {
    if (password === FORM_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (!validateAccessKey(key, ACCESS_KEY)) {
    return (
      <section className="form-section">
        <h2 className="form-title">Acceso denegado</h2>
        <p style={{ color: "#fff" }}>
          No tienes permiso para ver este formulario.
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <PasswordPopup onSubmit={handlePasswordSubmit} />;
  }

  return (
    <div className="container-form">
      <UploadSection uploadHook={uploadHook} />
      <DeleteSection deleteHook={deleteHook} />
    </div>
  );
};

export default FormPage;
