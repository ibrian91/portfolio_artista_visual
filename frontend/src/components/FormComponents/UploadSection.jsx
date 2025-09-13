import { useState, useEffect } from "react";
import techniques from "../../assets/techniques.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { VALIDATION_CONSTANTS, getCategoriesForTechnique } from "../../utils/validation/formValidation.js";
import ApiService from "../../services/ApiService.js";

const UploadSection = ({ uploadHook }) => {
  const [showUploadKey, setShowUploadKey] = useState(false);

  // Usar los contadores del hook
  const [nameImageCount, setNameImageCount] = useState(VALIDATION_CONSTANTS.MAX_NAME_LENGTH);
  const [descriptionImageCount, setDescriptionImageCount] = useState(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH);

  // Sincronizar contadores con el hook
  useEffect(() => {
    if (uploadHook.resetCounters) {
      uploadHook.resetCounters();
    }
  }, [uploadHook.resetCounters]);

  // Verificación de seguridad: si el hook no está listo, mostrar loading
  if (!uploadHook || !uploadHook.formData) {
    return (
      <section className="form-section-upload">
        <h2 className="form-title">Cargar nueva imagen</h2>
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          Cargando formulario...
        </div>
      </section>
    );
  }

  // Derivados
  const categories = getCategoriesForTechnique(uploadHook.formData.selectedTechnique, techniques);

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
          {uploadHook.validationErrors.selectedTechnique && (
            <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
              {uploadHook.validationErrors.selectedTechnique}
            </div>
          )}
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
          {uploadHook.validationErrors.selectedCategory && (
            <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
              {uploadHook.validationErrors.selectedCategory}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Nombre de la imagen: Caracteres {nameImageCount}</label>
          <input
            type="text"
            value={uploadHook.formData.imageName}
            onChange={(e) => uploadHook.handleTextChange("imageName", e.target.value, VALIDATION_CONSTANTS.MAX_NAME_LENGTH, setNameImageCount)}
            placeholder="Ej: Paisaje azul"
          />
          {uploadHook.validationErrors.imageName && (
            <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
              {uploadHook.validationErrors.imageName}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Descripcion: Caracteres {descriptionImageCount}</label>
          <textarea
            value={uploadHook.formData.descriptionImage}
            onChange={(e) => uploadHook.handleTextChange("descriptionImage", e.target.value, VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, setDescriptionImageCount)}
            placeholder="Descripcion de la imagen"
          />
          {uploadHook.validationErrors.descriptionImage && (
            <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
              {uploadHook.validationErrors.descriptionImage}
            </div>
          )}
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
              {uploadHook.isLoadingGroups ? (
                <div style={{ padding: "8px", color: "#666" }}>Cargando grupos...</div>
              ) : uploadHook.groupsError ? (
                <div style={{ padding: "8px", color: "#FF416C" }}>{uploadHook.groupsError}</div>
              ) : (
                <select
                  value={uploadHook.formData.grupoSeleccionado}
                  onChange={(e) => uploadHook.updateField("grupoSeleccionado", e.target.value)}
                >
                  <option value="">Seleccionar grupo</option>
                  {uploadHook.availableGroups.map((group, idx) => (
                    <option key={idx} value={group.group_name}>{group.group_name}</option>
                  ))}
                </select>
              )}
              {uploadHook.validationErrors.grupoSeleccionado && (
                <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
                  {uploadHook.validationErrors.grupoSeleccionado}
                </div>
              )}
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
              {uploadHook.validationErrors.nombreNuevoGrupo && (
                <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
                  {uploadHook.validationErrors.nombreNuevoGrupo}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Imagen de portada del grupo:</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  uploadHook.handleCoverFileChange(file);
                  if (file) {
                    const ext = file.name.split('.').pop().toLowerCase();
                    if (!VALIDATION_CONSTANTS.ALLOWED_FILE_TYPES.includes(ext)) {
                      e.target.value = null;
                    }
                  }
                }}
              />
              {uploadHook.validationErrors.coverImageFile && (
                <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
                  {uploadHook.validationErrors.coverImageFile}
                </div>
              )}
              <div style={{ fontSize: "0.9em", color: "#666", marginTop: "4px" }}>
                Si no seleccionas una imagen de portada, se usará la imagen principal como portada.
              </div>
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
          {uploadHook.validationErrors.imageFile && (
            <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
              {uploadHook.validationErrors.imageFile}
            </div>
          )}
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
