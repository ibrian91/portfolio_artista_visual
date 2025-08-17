import { useState } from "react";
import { useParams } from "react-router-dom";
import techniques from "../../assets/techniques.json";
import "./FormPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;
// PARA ACCEDER A ESTE FORMULARIO LINK form_images/key/mb_Acceso2025-Form

const FormPage = () => {
    
    const { key } = useParams();

    // count name imagen and count description image
    const [nameImageCount, setNameImageCount] = useState(20);
    const [descriptionImageCount, setDescriptionImageCount] = useState(100);

    // input for add images
    const [selectedTechnique, setSelectedTechnique] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imageName, setImageName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isMockupImage, setIsMockupImage] = useState(false);
    const [isRotatingImage, setIsRotatingImage] = useState(false);
    const [uploadKey, setUploadKey] = useState("");
    const [showUploadKey, setShowUploadKey] = useState(false);
    const [descriptionImage, setDescriptionImage] = useState("");

    const [grupoExistente, setGrupoExistente] = useState(false);

    // input for delete images
    const [selectedTechniqueDelete, setSelectedTechniqueDelete] = useState("");
    const [selectedCategoryDelete, setSelectedCategoryDelete] = useState("");
    const [imageNameDelete, setImageNameDelete] = useState("");
    const [uploadKeyDelete, setUploadKeyDelete] = useState("");
    const [showUploadKeyDelete, setShowUploadKeyDelete] = useState(false);
    
    // Validar clave de acceso
    const [uploadKeyError, setUploadKeyError] = useState("");

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
    
    const isFormValid =  selectedTechnique &&
      selectedCategory &&
      imageName &&
      imageFile &&
      uploadKey &&
      descriptionImage;



      // Aquí va la función handleUpload
    const handleUpload = async () => {
    setUploadKeyError(""); // Limpia error previo

    const formData = new FormData();
    formData.append("technique_name", selectedTechnique);
    formData.append("category_name", selectedCategory);
    formData.append("image_name", imageName);
    formData.append("description", descriptionImage);
    formData.append("is_mockup_image", isMockupImage);
    formData.append("is_rotating_image", isRotatingImage);
    formData.append("upload_key", uploadKey);
    formData.append("images", imageFile);

    try {
      const response = await fetch("http://localhost:5000/api/upload/portfolio-image", {
        method: "POST",
        body: formData,
        headers: {
          "x-upload-key": uploadKey
        }
      });

      if (response.status === 401) {
        setUploadKeyError("Clave no válida");
        return;
      }

      // Si la respuesta es 201 (creado), es éxito
      if (response.status === 201) {
        setUploadKeyError("");
        alert("Imagen subida correctamente");
        // Limpiar campos del formulario
        setSelectedTechnique("");
        setSelectedCategory("");
        setImageName("");
        setImageFile(null);
        setIsMockupImage(false);
        setIsRotatingImage(false);
        setDescriptionImage("");
        return;
      }

      // Si no es éxito ni 401, mostrar error
      setUploadKeyError("Error al subir la imagen");
    } catch {
      setUploadKeyError("Error de red o servidor");
    }
  };
    
  return (
    <div className="container-form">
      {/* Formulario de carga de imagen */}
      
      <section className="form-section-upload">
        <h2 className="form-title">Cargar nueva imagen</h2>
        <form className="image-upload-form">
          <div className="form-group">
            <label>Técnica:</label>
            <select
              value={selectedTechnique}
              onChange={(e) => {
                setSelectedTechnique(e.target.value);
                setSelectedCategory("");
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

          <div className="form-group">
            <label>Nombre de la imagen: Caracteres {nameImageCount}</label>
            <input
              type="text"
              value={imageName}
              onChange={(e) => {
                let value = e.target.value;
                if (value.length > 20) value = value.slice(0, 20);
                setImageName(value);
                setNameImageCount(20 - value.length);
              }}
              placeholder="Ej: Paisaje azul"
            />
          </div>

          <div className="form-group">
            <label>Descripcion: Caracteres {descriptionImageCount}</label>
            <textarea
              type="text"
              value={descriptionImage}
              onChange={(e) => {
                let value = e.target.value;
                if (value.length > 100) value = value.slice(0, 100);
                setDescriptionImage(value);
                setDescriptionImageCount(100 - value.length);
              }}  
              placeholder="Descripcion de la imagen"
            />
          </div>

          <div>
             <span className="container-switch">¿Agregas la imagen a un grupo existente?</span>
              <div className="switch-group">
                <div>
                  <button
                    type="button"
                    className={grupoExistente === true ? "selected" : ""}
                    onClick={() => setGrupoExistente(true)}
                  >
                    SI
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className={grupoExistente === false ? "selected" : ""}
                    onClick={() => setGrupoExistente(false)}
                  >
                    NO
                  </button>
                </div>
              </div>  
          </div>


          
<div>
  <p>Lo seleccionado es: {grupoExistente ? "Sí" : "No"}</p>
</div>

       
          <div className="form-group message-group-image">

            <p style={{ color: "#fff", fontSize: "0.95em" }}>
              <strong>Nota: </strong> 
              Si corresponde, solo puede tildarse una opcion.
            </p>

            <div>
                <div className="form-group check-group">
                    <label className="custom-checkbox">
                        <input
                        type="checkbox"
                        checked={isMockupImage}
                        onChange={() => {
                            
                            if (!isRotatingImage) {
                              setIsMockupImage((prev) => !prev);
                            }
                          }}
                        
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
                          onChange={() => {
                            
                            if (!isMockupImage) {
                              setIsRotatingImage((prev) => !prev);
                            }
                          }}
                          disabled={isMockupImage}
                        />
                        <span className="checkmark" />
                        ¿Es imagen giratoria?
                    </label>
                </div>
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
            {uploadKeyError && (
              <div style={{ color: "#FF416C", fontSize: "0.95em", marginTop: "4px" }}>
                {uploadKeyError}
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
                if (file) {
                  const ext = file.name.split('.').pop().toLowerCase();
                  if (["jpg", "jpeg", "png"].includes(ext)) {
                    setImageFile(file);
                  } else {
                    setImageFile(null);
                    alert("Solo se permiten archivos .jpg, .jpeg o .png");
                    e.target.value = null;
                  }
                } else {
                  setImageFile(null);
                }
              }}
            />
          </div>

          <button type="button" className="submit-btn" 
          disabled={!isFormValid}
          onClick={handleUpload}
          
          >
            Subir imagen
          </button>
        </form>
      </section>

      <section className="form-section-upload">
        <h2 className="form-title">Eliminar imagen</h2>
        <form className="image-upload-form">
          <div className="form-group">
            <label>Técnica:</label>
            <select
              value={selectedTechniqueDelete}
              onChange={(e) => {
                setSelectedTechniqueDelete(e.target.value);
                setSelectedCategoryDelete("");
                
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
              value={selectedCategoryDelete}
              onChange={(e) => {
                setSelectedCategoryDelete(e.target.value);
                
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

          <div className="form-group">
            <label>Nombre de la imagen:</label>
            <input
              type="text"
              value={imageNameDelete}
              onChange={(e) => setImageNameDelete(e.target.value)}
              placeholder="Ej: Paisaje azul"
            />
          </div>

          <div className="form-group password-group">
              <label>Clave de eliminacion:</label>
              <div className="input-eye-wrapper">
                  <input
                  type={showUploadKeyDelete ? "text" : "password"}
                  value={uploadKeyDelete}
                  onChange={(e) => setUploadKeyDelete(e.target.value)}
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
          disabled
          
          >
            Eliminar imagen (Proximamente)
          </button>
        </form>
      </section>
    </div>
  );
};

export default FormPage;