import { useState } from "react";
import { useParams } from "react-router-dom";
import techniques from "../../assets/techniques.json";
import "./FormPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;

const FormPage = () => {
    const { key } = useParams();

    const [selectedTechnique, setSelectedTechnique] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCollection, setSelectedCollection] = useState("");
    const [imageName, setImageName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isSmallImage, setIsSmallImage] = useState(false);
    const [isMockupImage, setIsMockupImage] = useState(false);
    const [isRotatingImage, setIsRotatingImage] = useState(false);
    const [uploadKey, setUploadKey] = useState("");
    const [showUploadKey, setShowUploadKey] = useState(false);
    const [descriptionImage, setDescriptionImage] = useState("");

    if (key !== ACCESS_KEY) {
      return (
        <section className="form-section">
          <h2 className="form-title">Acceso denegado</h2>
          <p style={{ color: "#fff" }}>No tienes permiso para ver este formulario.</p>
        </section>
      );
    }
  

  
    const categories =
      techniques.find((t) => t.title === selectedTechnique)?.categoria || [];
    const collections =
      categories.find((c) => c.name === selectedCategory)?.collections || [];

  return (
    <section className="form-section">
      <h2 className="form-title">Cargar nueva imagen</h2>
      <form className="image-upload-form">
        <div className="form-group">
          <label>Técnica:</label>
          <select
            value={selectedTechnique}
            onChange={(e) => {
              setSelectedTechnique(e.target.value);
              setSelectedCategory("");
              setSelectedCollection("");
            }}
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
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedCollection("");
            }}
            disabled={!selectedTechnique}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {collections.length > 0 && (
          <div className="form-group">
            <label>Colección:</label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <option value="">Seleccionar colección</option>
              {collections.map((col, idx) => (
                <option key={idx} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Nombre de la imagen:</label>
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="Ej: Paisaje azul"
          />
        </div>

        <div className="form-group">
          <label>Descripcion:</label>
          <input
            type="text"
            value={descriptionImage}
            onChange={(e) => setDescriptionImage(e.target.value)}
            placeholder="Descripcion de la imagen"
          />
        </div>

        <div>
            <div className="form-group check-group">
                <label className="custom-checkbox">
                    <input
                    type="checkbox"
                    checked={isSmallImage}
                    onChange={() => setIsSmallImage((prev) => !prev)}
                    />
                    <span className="checkmark" />
                    ¿Es imagen chiquita?
                </label>
            </div>
        </div>

        <div>
            <div className="form-group check-group">
                <label className="custom-checkbox">
                    <input
                    type="checkbox"
                    checked={isMockupImage}
                    onChange={() => setIsMockupImage((prev) => !prev)}
                    />
                    <span className="checkmark" />
                    ¿Es imagen MOCK UP?
                </label>
            </div>
        </div>

        <div>
            <div className="form-group check-group">
                <label className="custom-checkbox">
                    <input
                    type="checkbox"
                    checked={isRotatingImage}
                    onChange={() => setIsRotatingImage((prev) => !prev)}
                    />
                    <span className="checkmark" />
                    ¿Es imagen giratoria?
                </label>
            </div>
        </div>

        <div className="form-group password-group">
            <label>Clave de subida:</label>
            <div className="input-eye-wrapper">
                <input
                type={showUploadKey ? "text" : "password"}
                value={uploadKey}
                onChange={(e) => setUploadKey(e.target.value)}
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
        </div>

        <div className="form-group">
          <label>Archivo de imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button type="button" className="submit-btn" disabled>
          Subir imagen (próximamente)
        </button>
      </form>
    </section>
  );
};

export default FormPage;