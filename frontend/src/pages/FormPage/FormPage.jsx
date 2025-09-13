import { useParams } from "react-router-dom";
import "./FormPage.css";
import { useUploadForm } from "../../hooks/useUploadForm";
import { useDeleteForm } from "../../hooks/useDeleteForm";
import UploadSection from "../../components/FormComponents/UploadSection";
import DeleteSection from "../../components/FormComponents/DeleteSection";
import { validateAccessKey } from "../../utils/validation/formValidation.js";

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;
// PARA ACCEDER A ESTE FORMULARIO LINK form_images/key/mb_Acceso2025-Form

const FormPage = () => {
  const { key } = useParams();

  // Usar hooks personalizados
  const uploadHook = useUploadForm();
  const deleteHook = useDeleteForm();

  if (!validateAccessKey(key, ACCESS_KEY)) {
    return (
      <section className="form-section">
        <h2 className="form-title">Acceso denegado</h2>
        <p style={{ color: "#fff" }}>No tienes permiso para ver este formulario.</p>
      </section>
    );
  }
  return (
    <div className="container-form">
      <UploadSection uploadHook={uploadHook} />
      <DeleteSection deleteHook={deleteHook} />
    </div>
  );
};

export default FormPage;