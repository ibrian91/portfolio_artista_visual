import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener todas las imágenes de un grupo específico
const getImagesByGroup = async (technique, category, group_name) => {
  try {
    const [images] = await pool.query(
      'SELECT * FROM images WHERE technique = ? AND category = ? AND group_name = ? ORDER BY created_at DESC',
      [technique, category, group_name]
    );
    return images;
  } catch (error) {
    console.error('Error en getImagesByGroup (MySQL):', error);
    throw error;
  }
};

// Obtener todas las imágenes
const getAllImages = async () => {
  try {
    const [images] = await pool.query('SELECT * FROM images ORDER BY created_at DESC');
    return images;
  } catch (error) {
    console.error('Error en getAllImages (MySQL):', error);
    throw error;
  }
};

// Eliminar una imagen por ID
const deleteImageById = async (imageId) => {
  console.log('🔍 deleteImageById called with ID:', imageId, 'Type:', typeof imageId);
  
  try {
    // Buscar la imagen en MySQL
    const [images] = await pool.query('SELECT * FROM images WHERE id = ?', [imageId]);
    
    console.log('� Images found in MySQL:', images.length);

    if (images.length === 0) {
      console.error('❌ Image not found. Searched for ID:', imageId);
      throw new Error('Imagen no encontrada');
    }

    const imageToDelete = images[0];
    console.log('🗑️ Image to delete:', imageToDelete);

    // Extraer el nombre del archivo desde file_url
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

    // Eliminar de MySQL
    await pool.query('DELETE FROM images WHERE id = ?', [imageId]);

    console.log(`✅ Imagen eliminada de MySQL: ID ${imageId}`);
    return imageToDelete;
  } catch (error) {
    console.error('Error en deleteImageById (MySQL):', error);
    throw error;
  }
};

export default { getImagesByGroup, getAllImages, deleteImageById };
