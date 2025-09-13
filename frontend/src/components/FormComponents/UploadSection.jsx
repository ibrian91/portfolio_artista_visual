import { useState } from "react";
import techniques from "../../assets/techniques.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { VALIDATION_CONSTANTS, getCategoriesForTechnique } from "../../utils/validation/formValidation.js";

const UploadSection = ({ uploadHook }) => {
  const [showUploadKey, setShowUploadKey] = useState(false);

  // Derivados
  const categories = getCategoriesForTechnique(uploadHook.formData.selectedTechnique, techniques);
  const grupos = ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3", "Ejemplo 4"]; // TODO: Obtener de API

  return (
    <section className="form-section-upload">
      <h2 className="form-title">Cargar nueva imagen</h2>
      <form className="image-upload-form">
        <div className="form-group">
          <label>Técnica:</label>
          <select
            value={uploadHook.formData.selectedTechnique}
            onChange={(e) => uploadHook.handleTechniqueChange(e.target.value)}
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
            value={uploadHook.formData.selectedCategory}
            onChange={(e) => uploadHook.updateField("selectedCategory", e.target.value)}
            disabled={!uploadHook.formData.selectedTechnique}
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
          <label>Nombre de la imagen: Caracteres {uploadHook.nameImageCount}</label>
          <input
            type="text"
            value={uploadHook.formData.imageName}
            onChange={(e) => uploadHook.handleTextChange("imageName", e.target.value, VALIDATION_CONSTANTS.MAX_NAME_LENGTH, (count) => {/* count handled in hook */})}
            placeholder="Ej: Paisaje azul"
          />
        </div>

        <div className="form-group">
          <label>Descripcion: Caracteres {uploadHook.descriptionImageCount}</label>
          <textarea
            type="text"
            value={uploadHook.formData.descriptionImage}
            onChange={(e) => uploadHook.handleTextChange("descriptionImage", e.target.value, VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, (count) => {/* count handled in hook */})}
            placeholder="Descripcion de la imagen"
          />
        </div>

        <div>
          <span className="container-switch">¿Grupo ya existente?</span>
          <div className="switch-group">
            <button
              type="button"
              className={uploadHook.formData.grupoExistente === true ? "selected" : ""}
              onClick={uploadHook.handleExistingGroup}
            >
              SI
            </button>
            <button
              type="button"
              className={uploadHook.formData.grupoExistente === false ? "selected" : ""}
              onClick={uploadHook.handleNewGroup}
            >
              NO
            </button>
          </div>
        </div>

        {/* Campos según selección de grupo */}
        {uploadHook.formData.grupoExistente === true && (
          <>
            <div className="form-group">
              <label>Seleccionar grupo existente:</label>
              <select
                value={uploadHook.formData.grupoSeleccionado}
                onChange={(e) => uploadHook.updateField("grupoSeleccionado", e.target.value)}
              >
                <option value="">Seleccionar grupo</option>
                {grupos.map((g, idx) => (
                  <option key={idx} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group check-group">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isMockupImage}
                  onChange={() => uploadHook.updateField("isMockupImage", !uploadHook.formData.isMockupImage)}
                />
                <span className="checkmark" />
                ¿Mock up?
              </label>
            </div>
            <div className="form-group check-group">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isRotatingImage}
                  onChange={() => uploadHook.updateField("isRotatingImage", !uploadHook.formData.isRotatingImage)}
                />
                <span className="checkmark" />
                ¿Es giratoria?
              </label>
            </div>
            <div className="form-group check-group">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isSmallImage}
                  onChange={() => uploadHook.updateField("isSmallImage", !uploadHook.formData.isSmallImage)}
                />
                <span className="checkmark" />
                ¿Es imagen chiquita?
              </label>
            </div>
          </>
        )}

        {uploadHook.formData.grupoExistente === false && (
          <>
            <div className="form-group">
              <label>¿Cómo vas a llamar al grupo?</label>
              <input
                type="text"
                value={uploadHook.formData.nombreNuevoGrupo}
                onChange={(e) => uploadHook.updateField("nombreNuevoGrupo", e.target.value)}
                placeholder="Nombre del nuevo grupo"
              />
            </div>
            <div className="form-group check-group">
              <label className="custom-checkbox" style={{ textDecoration: "line-through", color: "#aaa" }}>
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                />
                <span className="checkmark" />
                ¿Mock up? (no disponible)
              </label>
            </div>
            <div className="form-group check-group">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isSmallImage}
                  onChange={() => uploadHook.updateField("isSmallImage", !uploadHook.formData.isSmallImage)}
                />
                <span className="checkmark" />
                ¿Es imagen chiquita? (tildada por defecto)
              </label>
            </div>
            <div className="form-group check-group">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isRotatingImage}
                  onChange={() => uploadHook.updateField("isRotatingImage", !uploadHook.formData.isRotatingImage)}
                />
                <span className="checkmark" />
                ¿Es giratoria?
              </label>
            </div>
          </>
        )}

        <div className="form-group password-group">
          <label>Clave de subida:</label>
          <div className="input-eye-wrapper">
            <input
              type={showUploadKey ? "text" : "password"}
              value={uploadHook.formData.uploadKey}
              onChange={(e) => uploadHook.updateField("uploadKey", e.target.value)}
              placeholder="Clave secreta"
              autoComplete="off"
            />
            <span
              className="eye-icon"
              onClick={() => setShowUploadKey((prev) => !prev)}
              tabIndex={0}
              style={{ cursor: "pointer" }}
              aria-label={showUploadKey ? "Ocultar clave" : "Mostrar clave"}
            >
              {showUploadKey ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {uploadHook.uploadKeyError && (
            <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
              {uploadHook.uploadKeyError}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Archivo de imagen:</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files[0];
              uploadHook.handleFileChange(file);
              if (file) {
                const ext = file.name.split('.').pop().toLowerCase();
                if (!VALIDATION_CONSTANTS.ALLOWED_FILE_TYPES.includes(ext)) {
                  e.target.value = null;
                }
              }
            }}
          />
        </div>

        <button type="button" className="submit-btn"
          disabled={!uploadHook.isFormValid || uploadHook.isSubmitting}
          onClick={uploadHook.uploadImage}
        >
          {uploadHook.isSubmitting ? "Subiendo..." : "Subir imagen"}
        </button>
      </form>
    </section>
  );
};

export default UploadSection;
