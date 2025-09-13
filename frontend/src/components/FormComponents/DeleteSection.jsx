import { useState } from "react";
import techniques from "../../assets/techniques.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getCategoriesForTechnique } from "../../utils/validation/formValidation.js";

const DeleteSection = ({ deleteHook }) => {
  const [showUploadKeyDelete, setShowUploadKeyDelete] = useState(false);

  // Derivados
  const categories = getCategoriesForTechnique(deleteHook.formData.selectedTechnique, techniques);

  return (
    <section className="form-section-upload">
      <h2 className="form-title">Eliminar imagen</h2>
      <form className="image-upload-form">
        <div className="form-group">
          <label>Técnica:</label>
          <select
            value={deleteHook.formData.selectedTechnique}
            onChange={(e) => deleteHook.handleTechniqueChange(e.target.value)}
          >
            <option value="">Seleccionar técnica</option>
            {techniques.map((t, idx) => (
              <option key={idx} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select
            value={deleteHook.formData.selectedCategory}
            onChange={(e) => deleteHook.updateField("selectedCategory", e.target.value)}
            disabled={!deleteHook.formData.selectedTechnique}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nombre de la imagen:</label>
          <input
            type="text"
            value={deleteHook.formData.imageName}
            onChange={(e) => deleteHook.updateField("imageName", e.target.value)}
            placeholder="Ej: Paisaje azul"
          />
        </div>

        <div className="form-group password-group">
          <label>Clave de eliminacion:</label>
          <div className="input-eye-wrapper">
            <input
              type={showUploadKeyDelete ? "text" : "password"}
              value={deleteHook.formData.uploadKey}
              onChange={(e) => deleteHook.updateField("uploadKey", e.target.value)}
              placeholder="Clave secreta"
              autoComplete="off"
            />
            <span
              className="eye-icon"
              onClick={() => setShowUploadKeyDelete((prev) => !prev)}
              tabIndex={0}
              style={{ cursor: "pointer" }}
              aria-label={showUploadKeyDelete ? "Ocultar clave" : "Mostrar clave"}
            >
              {showUploadKeyDelete ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="button" className="submit-btn"
          disabled={!deleteHook.isFormValid || deleteHook.isSubmitting}
          onClick={deleteHook.deleteImage}
        >
          {deleteHook.isSubmitting ? "Eliminando..." : "Eliminar imagen"}
        </button>
      </form>
    </section>
  );
};

export default DeleteSection;
