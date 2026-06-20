import { useState, useEffect } from "react";
import techniques from "../../assets/techniques.json";
import { VALIDATION_CONSTANTS, getCategoriesForTechnique } from "../../utils/validation/formValidation.js";

const UploadSection = ({ uploadHook }) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (uploadHook.handleSubmit) {
      uploadHook.handleSubmit();
    }
  };

  return (
    <section className="form-section-upload">
      <h2 className="form-title">Cargar nueva imagen</h2>
      <form className="image-upload-form" onSubmit={handleSubmit}>
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

        {/* Mostrar mensaje si no hay grupos o pregunta si hay grupos */}
        {uploadHook.formData.selectedTechnique && uploadHook.formData.selectedCategory && (
          <>
            {uploadHook.availableGroups.length === 0 ? (
              <div style={{ 
                padding: "12px", 
                color: "#888", 
                fontStyle: "italic", 
                fontSize: "0.95em",
                backgroundColor: "rgba(136, 136, 136, 0.05)",
                borderRadius: "8px",
                marginBottom: "15px"
              }}>
                En esta técnica-categoría no hay grupos previamente creados
              </div>
            ) : (
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
            )}
          </>
        )}

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

            {/* Campos de nombre y descripción para grupo existente */}
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
              <label>Descripción: Caracteres {descriptionImageCount}</label>
              <textarea
                value={uploadHook.formData.descriptionImage}
                onChange={(e) => uploadHook.handleTextChange("descriptionImage", e.target.value, VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, setDescriptionImageCount)}
                placeholder="Descripción de la imagen"
              />
              {uploadHook.validationErrors.descriptionImage && (
                <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
                  {uploadHook.validationErrors.descriptionImage}
                </div>
              )}
            </div>

            <div className="form-group check-group">
              <label 
                className="custom-checkbox" 
                style={{ 
                  opacity: (uploadHook.formData.isRotatingImage || uploadHook.formData.isSmallImage) ? 0.5 : 1,
                  textDecoration: (uploadHook.formData.isRotatingImage || uploadHook.formData.isSmallImage) ? 'line-through' : 'none',
                  cursor: (uploadHook.formData.isRotatingImage || uploadHook.formData.isSmallImage) ? 'not-allowed' : 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isMockupImage}
                  disabled={uploadHook.formData.isRotatingImage || uploadHook.formData.isSmallImage}
                  onChange={() => {
                    if (!uploadHook.formData.isRotatingImage && !uploadHook.formData.isSmallImage) {
                      uploadHook.updateField("isMockupImage", !uploadHook.formData.isMockupImage);
                      // Limpiar archivos múltiples cuando se selecciona MockUp
                      if (!uploadHook.formData.isMockupImage) {
                        uploadHook.updateField("imageFiles", []);
                      }
                    }
                  }}
                />
                <span className="checkmark" />
                ¿Mock up?
              </label>
            </div>
            <div className="form-group check-group">
              <label 
                className="custom-checkbox"
                style={{ 
                  opacity: (uploadHook.formData.isMockupImage || uploadHook.formData.isSmallImage) ? 0.5 : 1,
                  textDecoration: (uploadHook.formData.isMockupImage || uploadHook.formData.isSmallImage) ? 'line-through' : 'none',
                  cursor: (uploadHook.formData.isMockupImage || uploadHook.formData.isSmallImage) ? 'not-allowed' : 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isRotatingImage}
                  disabled={uploadHook.formData.isMockupImage || uploadHook.formData.isSmallImage}
                  onChange={() => {
                    if (!uploadHook.formData.isMockupImage && !uploadHook.formData.isSmallImage) {
                      uploadHook.updateField("isRotatingImage", !uploadHook.formData.isRotatingImage);
                    }
                  }}
                />
                <span className="checkmark" />
                ¿Es giratoria?
              </label>
            </div>
            <div className="form-group check-group">
              <label 
                className="custom-checkbox"
                style={{ 
                  opacity: (uploadHook.formData.isMockupImage || uploadHook.formData.isRotatingImage) ? 0.5 : 1,
                  textDecoration: (uploadHook.formData.isMockupImage || uploadHook.formData.isRotatingImage) ? 'line-through' : 'none',
                  cursor: (uploadHook.formData.isMockupImage || uploadHook.formData.isRotatingImage) ? 'not-allowed' : 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={uploadHook.formData.isSmallImage}
                  disabled={uploadHook.formData.isMockupImage || uploadHook.formData.isRotatingImage}
                  onChange={() => {
                    if (!uploadHook.formData.isMockupImage && !uploadHook.formData.isRotatingImage) {
                      const newValue = !uploadHook.formData.isSmallImage;
                      uploadHook.updateField("isSmallImage", newValue);
                      // Limpiar archivos múltiples cuando se desmarca "imagen chiquita"
                      if (!newValue) {
                        uploadHook.updateField("imageFiles", []);
                      }
                    }
                  }}
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
              <label>Descripción: Caracteres {descriptionImageCount}</label>
              <textarea
                value={uploadHook.formData.descriptionImage}
                onChange={(e) => uploadHook.handleTextChange("descriptionImage", e.target.value, VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, setDescriptionImageCount)}
                placeholder="Descripción de la imagen"
              />
              {uploadHook.validationErrors.descriptionImage && (
                <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
                  {uploadHook.validationErrors.descriptionImage}
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

        <button
          type="submit"
          className="submit-button"
          disabled={uploadHook.isSubmitting}
        >
          {uploadHook.isSubmitting ? "Cargando..." : "Cargar Imagen"}
        </button>
      </form>
    </section>
  );
};

export default UploadSection;
