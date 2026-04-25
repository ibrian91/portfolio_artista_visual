import techniques from "../../assets/techniques.json";
import { getCategoriesForTechnique } from "../../utils/validation/formValidation.js";

const DeleteSection = ({ deleteHook }) => {
  // Derivados
  const categories = getCategoriesForTechnique(deleteHook.formData.selectedTechnique, techniques);
  
  // Debug
  console.log('🔍 DeleteSection - selectedTechnique:', deleteHook.formData.selectedTechnique);
  console.log('🔍 DeleteSection - selectedCategory:', deleteHook.formData.selectedCategory);
  console.log('🔍 DeleteSection - categories:', categories);

  return (
    <section className="form-section-upload">
      <h2 className="form-title">Eliminar imagen o grupo</h2>
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
            onChange={(e) => {
              console.log('🔍 Category onChange fired:', e.target.value);
              deleteHook.handleCategoryChange(e.target.value);
            }}
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

        {/* Mostrar pregunta solo cuando hay técnica y categoría */}
        {deleteHook.formData.selectedTechnique && deleteHook.formData.selectedCategory && (
          <>
            {deleteHook.availableGroups.length === 0 && !deleteHook.isLoadingGroups ? (
              <div style={{
                padding: "12px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "8px",
                marginBottom: "15px",
                color: "#856404"
              }}>
                ⚠️ No hay grupos en esta técnica-categoría
              </div>
            ) : (
              <>
                <div>
                  <span className="container-switch">¿Eliminar grupo completo?</span>
                  <div className="switch-group">
                    <button
                      type="button"
                      className={deleteHook.formData.deleteEntireGroup === true ? "selected" : ""}
                      onClick={() => deleteHook.updateField("deleteEntireGroup", true)}
                    >
                      SI
                    </button>
                    <button
                      type="button"
                      className={deleteHook.formData.deleteEntireGroup === false ? "selected" : ""}
                      onClick={() => deleteHook.updateField("deleteEntireGroup", false)}
                    >
                      NO
                    </button>
                  </div>
                </div>

                {/* Selector de grupo */}
                {deleteHook.formData.deleteEntireGroup !== null && (
                  <div className="form-group">
                    <label>Seleccionar grupo:</label>
                    {deleteHook.isLoadingGroups ? (
                      <div style={{ padding: "8px", color: "#666" }}>Cargando grupos...</div>
                    ) : deleteHook.groupsError ? (
                      <div style={{ padding: "8px", color: "#FF416C" }}>{deleteHook.groupsError}</div>
                    ) : (
                      <select
                        value={deleteHook.formData.selectedGroup}
                        onChange={(e) => deleteHook.updateField("selectedGroup", e.target.value)}
                      >
                        <option value="">Seleccionar grupo</option>
                        {deleteHook.availableGroups.map((group, idx) => (
                          <option key={idx} value={group.group_name}>
                            {group.group_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Selector de imagen específica - solo si NO se va a eliminar grupo completo */}
                {deleteHook.formData.deleteEntireGroup === false && deleteHook.formData.selectedGroup && (
                  <div className="form-group">
                    <label>Seleccionar imagen:</label>
                    {deleteHook.isLoadingImages ? (
                      <div style={{ padding: "8px", color: "#666" }}>Cargando imágenes...</div>
                    ) : deleteHook.imagesError ? (
                      <div style={{ padding: "8px", color: "#FF416C" }}>{deleteHook.imagesError}</div>
                    ) : !Array.isArray(deleteHook.availableImages) || deleteHook.availableImages.length === 0 ? (
                      <div style={{ padding: "8px", color: "#666", fontStyle: "italic" }}>
                        No hay imágenes en este grupo
                      </div>
                    ) : (
                      <select
                        value={deleteHook.formData.selectedImageId}
                        onChange={(e) => deleteHook.updateField("selectedImageId", e.target.value)}
                      >
                        <option value="">Seleccionar imagen</option>
                        {deleteHook.availableImages.map((image) => (
                          <option key={image.id} value={image.id}>
                            {image.image_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        <button
          type="button"
          onClick={deleteHook.handleSubmit}
          className="submit-button"
          disabled={deleteHook.isSubmitting}
        >
          {deleteHook.isSubmitting ? "Eliminando..." : "Confirmar Eliminación"}
        </button>
      </form>
    </section>
  );
};

export default DeleteSection;
