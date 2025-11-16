import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const techniquesFile = path.join(__dirname, '../data/techniques_categories.json');

// Validar técnica y categoría
const isValidTechniqueCategory = (technique, category) => {
  if (!technique || !category) return false;
  const data = JSON.parse(fs.readFileSync(techniquesFile));
  const found = data.find(t => t.title === technique);
  return found ? found.categorias.includes(category) : false;
};

// Crear grupo único por técnica/categoría
const createGroup = async (technique, category, group_name) => {
  try {
    // Verificar si el grupo ya existe
    const [existing] = await pool.query(
      'SELECT * FROM groups_table WHERE technique = ? AND category = ? AND group_name = ?',
      [technique, category, group_name]
    );

    if (existing.length > 0) {
      return { error: 'El grupo ya existe en esta técnica/categoría.' };
    }

    // Crear el nuevo grupo
    const [result] = await pool.query(
      'INSERT INTO groups_table (technique, category, group_name) VALUES (?, ?, ?)',
      [technique, category, group_name]
    );

    const newGroup = {
      id: result.insertId,
      technique,
      category,
      group_name,
      created_at: new Date()
    };

    return { group: newGroup };
  } catch (error) {
    console.error('Error en createGroup (MySQL):', error);
    throw error;
  }
};

// Obtener todos los grupos
const getAllGroups = async () => {
  try {
    const [groups] = await pool.query('SELECT * FROM groups_table ORDER BY created_at DESC');
    return groups;
  } catch (error) {
    console.error('Error en getAllGroups (MySQL):', error);
    throw error;
  }
};

// Eliminar un grupo y todas sus imágenes
const deleteGroup = async (technique, category, group_name) => {
  try {
    // Verificar que el grupo existe en MySQL
    const [groups] = await pool.query(
      'SELECT * FROM groups_table WHERE technique = ? AND category = ? AND group_name = ?',
      [technique, category, group_name]
    );

    if (groups.length === 0) {
      throw new Error('Grupo no encontrado');
    }

    const groupToDelete = groups[0];

    // Obtener todas las imágenes del grupo
    const [images] = await pool.query(
      'SELECT * FROM images WHERE technique = ? AND category = ? AND group_name = ?',
      [technique, category, group_name]
    );

    // Eliminar archivos físicos de las imágenes
    for (const image of images) {
      const filename = image.filename || path.basename(image.file_url);
      const imagePath = path.join(__dirname, '../../uploads/portfolio', 
        image.technique, 
        image.category, 
        image.group_name, 
        filename
      );
      
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`🗑️ Imagen eliminada: ${imagePath}`);
        } else {
          console.warn(`⚠️ Imagen no encontrada: ${imagePath}`);
        }
      } catch (err) {
        console.error('❌ Error al eliminar imagen:', err);
      }
    }

    // Eliminar registros de imágenes de MySQL (CASCADE lo hará automáticamente)
    await pool.query(
      'DELETE FROM images WHERE technique = ? AND category = ? AND group_name = ?',
      [technique, category, group_name]
    );

    // Eliminar directorio del grupo
    const groupDir = path.join(__dirname, '../../uploads/portfolio', technique, category, group_name);
    try {
      if (fs.existsSync(groupDir)) {
        fs.rmSync(groupDir, { recursive: true, force: true });
        console.log(`🗑️ Directorio eliminado: ${groupDir}`);
      }
    } catch (err) {
      console.error('Error al eliminar directorio:', err);
    }

    // Eliminar grupo de MySQL
    await pool.query(
      'DELETE FROM groups_table WHERE technique = ? AND category = ? AND group_name = ?',
      [technique, category, group_name]
    );

    console.log(`✅ Grupo eliminado: ${group_name}`);
    return groupToDelete;
  } catch (error) {
    console.error('Error en deleteGroup (MySQL):', error);
    throw error;
  }
};

export default { isValidTechniqueCategory, createGroup, getAllGroups, deleteGroup };
