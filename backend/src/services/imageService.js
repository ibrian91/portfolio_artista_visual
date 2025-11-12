import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesFile = path.join(__dirname, '../data/images.json');

// Obtener todas las imágenes de un grupo específico
const getImagesByGroup = async (technique, category, group_name) => {
  if (!fs.existsSync(imagesFile)) return [];
  const images = JSON.parse(fs.readFileSync(imagesFile));
  return images.filter(img => 
    img.technique === technique && 
    img.category === category && 
    img.group_name === group_name
  );
};

// Obtener todas las imágenes
const getAllImages = async () => {
  if (!fs.existsSync(imagesFile)) return [];
  return JSON.parse(fs.readFileSync(imagesFile));
};

// Eliminar una imagen por ID
const deleteImageById = async (imageId) => {
  console.log('🔍 deleteImageById called with ID:', imageId, 'Type:', typeof imageId);
  
  if (!fs.existsSync(imagesFile)) {
    throw new Error('Archivo de imágenes no encontrado');
  }

  const images = JSON.parse(fs.readFileSync(imagesFile));
  console.log('📊 Total images in JSON:', images.length);
  console.log('📊 First 3 image IDs:', images.slice(0, 3).map(img => ({ id: img.id, type: typeof img.id })));
  
  // Buscar por ID (comparando como string Y como número)
  const imageIndex = images.findIndex(img => 
    img.id === imageId || 
    img.id === String(imageId) || 
    String(img.id) === String(imageId) ||
    parseInt(img.id) === parseInt(imageId)
  );
  
  console.log('🔍 Image index found:', imageIndex);

  if (imageIndex === -1) {
    console.error('❌ Image not found. Searched for ID:', imageId);
    throw new Error('Imagen no encontrada');
  }

  const imageToDelete = images[imageIndex];
  console.log('🗑️ Image to delete:', imageToDelete);

  // Extraer el nombre del archivo desde file_url
  // file_url tiene formato: "/uploads/portfolio/Dibujo/Digital/grupo/optimized-nombre.jpg"
  const filename = imageToDelete.filename || path.basename(imageToDelete.file_url);
  console.log('📁 Filename extracted:', filename);

  // Eliminar archivo físico
  const imagePath = path.join(__dirname, '../../uploads/portfolio', 
    imageToDelete.technique, 
    imageToDelete.category, 
    imageToDelete.group_name, 
    filename
  );
  
  console.log('🔍 Full image path:', imagePath);

  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`🗑️ Archivo eliminado: ${imagePath}`);
    } else {
      console.warn('⚠️ Archivo físico no encontrado:', imagePath);
    }
  } catch (err) {
    console.error('❌ Error al eliminar archivo físico:', err);
  }

  // Eliminar del JSON
  images.splice(imageIndex, 1);
  fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2));

  console.log(`✅ Imagen eliminada del JSON: ID ${imageId}`);
  return imageToDelete;
};

export default { getImagesByGroup, getAllImages, deleteImageById };
