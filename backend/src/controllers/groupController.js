import groupService from '../services/groupService.js';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/groups - Crear grupo con imagen de portada obligatoria
const createGroup = async (req, res) => {
  const { technique, category, group_name } = req.body;
  const coverImage = req.file;

  // Validar técnica y categoría
  const isValid = groupService.isValidTechniqueCategory(technique, category);
  if (!isValid) {
    if (coverImage) fs.unlinkSync(coverImage.path);
    return res.status(400).json({ error: 'Técnica o categoría inválida' });
  }

  // Validar imagen de portada
  if (!coverImage) {
    return res.status(400).json({ error: 'Se requiere imagen de portada para crear el grupo.' });
  }

  // Crear grupo si no existe
  const result = await groupService.createGroup(technique, category, group_name);
  if (result.error) {
    fs.unlinkSync(coverImage.path);
    return res.status(409).json({ error: result.error });
  }

  // Guardar imagen de portada optimizada
  const ext = path.extname(coverImage.originalname).toLowerCase();
  const allowed = ['.jpeg', '.jpg', '.png'];
  if (!allowed.includes(ext)) {
    fs.unlinkSync(coverImage.path);
    return res.status(400).json({ error: 'Solo se permiten archivos JPEG, JPG o PNG' });
  }
  const destDir = path.join(__dirname, '../../uploads/portfolio', technique, category, group_name);
  fs.mkdirSync(destDir, { recursive: true });
  const coverFileName = `cover${ext}`;
  const coverFilePath = path.join(destDir, coverFileName);
  await sharp(coverImage.path)
    .resize(400, 400, { fit: 'cover', withoutEnlargement: true })
    .toFile(coverFilePath);
  fs.unlinkSync(coverImage.path);

  // Respuesta
  return res.status(201).json({
    group: {
      technique,
      category,
      group_name,
      cover_image_url: `/uploads/portfolio/${technique}/${category}/${group_name}/${coverFileName}`
    }
  });
};

// GET /api/groups/cover-images?technique=Dibujo&category=Fibra
const getGroupsCoverImages = async (req, res) => {
  const { technique, category } = req.query;
  try {
    const groups = await groupService.getAllGroups();
    const filtered = groups.filter(g => g.technique === technique && g.category === category);
    const result = filtered.map(g => {
      // Buscar el archivo de portada real en el directorio
      const groupDir = path.join(__dirname, '../../uploads/portfolio', technique, category, g.group_name);

      let coverFileName = null;
      if (fs.existsSync(groupDir)) {
        const files = fs.readdirSync(groupDir);
        // Buscar archivos de imagen (jpg, jpeg, png)
        const imageExtensions = ['.jpg', '.jpeg', '.png'];
        const imageFile = files.find(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        });
        if (imageFile) {
          coverFileName = imageFile;
        }
      }

      const coverPath = coverFileName
        ? `/uploads/portfolio/${technique}/${category}/${g.group_name}/${coverFileName}`
        : null;

      return {
        group_name: g.group_name,
        cover_image_url: coverPath
      };
    });

    // Filtrar solo los grupos que tienen imagen de portada
    const groupsWithCovers = result.filter(g => g.cover_image_url !== null);

    return res.json({ groups: groupsWithCovers });
  } catch (err) {
    console.error('Error en getGroupsCoverImages:', err);
    return res.status(500).json({ error: 'Error al obtener los grupos.' });
  }
};

// GET /api/groups - Devuelve la lista de grupos por técnica/categoría
const getGroups = async (req, res) => {
  const { technique, category } = req.query;
  
  try {
    const allGroups = await groupService.getAllGroups();
    
    // Filtrar por técnica y categoría si se proporcionan
    let filteredGroups = allGroups;
    
    if (technique && category) {
      filteredGroups = allGroups.filter(g => 
        g.technique === technique && g.category === category
      );
    }
    
    return res.json({ groups: filteredGroups });
  } catch (err) {
    console.error('Error en getGroups:', err);
    return res.status(500).json({ error: 'Error al obtener los grupos.' });
  }
};

// DELETE /api/groups - Eliminar grupo completo con sus imágenes
const deleteGroup = async (req, res) => {
  const { technique, category, group_name } = req.body;

  if (!technique || !category || !group_name) {
    return res.status(400).json({ error: 'Faltan parámetros: technique, category, group_name' });
  }

  try {
    const result = await groupService.deleteGroup(technique, category, group_name);
    return res.json({ 
      message: 'Grupo eliminado correctamente',
      deletedGroup: result 
    });
  } catch (err) {
    console.error('Error en deleteGroup controller:', err);
    if (err.message === 'Grupo no encontrado') {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    return res.status(500).json({ error: 'Error al eliminar el grupo: ' + err.message });
  }
};

export default { createGroup, getGroupsCoverImages, getGroups, deleteGroup };
