import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groupsFile = path.join(__dirname, '../data/groups.json');
const techniquesFile = path.join(__dirname, '../data/techniques_categories.json');

// Validar técnica y categoría
const isValidTechniqueCategory = (technique, category) => {
  const data = JSON.parse(fs.readFileSync(techniquesFile));
  const found = data.find(t => t.title === technique);
  return found && found.categorias.includes(category);
};

// Crear grupo único por técnica/categoría
const createGroup = async (technique, category, group_name) => {
  let groups = [];
  if (fs.existsSync(groupsFile)) {
    groups = JSON.parse(fs.readFileSync(groupsFile));
  }
  // Buscar si ya existe el grupo en esa técnica/categoría
  const exists = groups.find(g => g.technique === technique && g.category === category && g.group_name === group_name);
  if (exists) {
    return { error: 'El grupo ya existe en esta técnica/categoría.' };
  }
  // Crear y guardar
  const newGroup = { technique, category, group_name };
  groups.push(newGroup);
  fs.writeFileSync(groupsFile, JSON.stringify(groups, null, 2));
  return { group: newGroup };
};

// Obtener todos los grupos
const getAllGroups = async () => {
  if (!fs.existsSync(groupsFile)) return [];
  const groups = JSON.parse(fs.readFileSync(groupsFile));
  return groups;
};

// Eliminar un grupo y todas sus imágenes
const deleteGroup = async (technique, category, group_name) => {
  const imagesFile = path.join(__dirname, '../data/images.json');
  
  // Leer grupos
  if (!fs.existsSync(groupsFile)) {
    throw new Error('Archivo de grupos no encontrado');
  }
  
  let groups = JSON.parse(fs.readFileSync(groupsFile));
  const groupIndex = groups.findIndex(g => 
    g.technique === technique && 
    g.category === category && 
    g.group_name === group_name
  );

  if (groupIndex === -1) {
    throw new Error('Grupo no encontrado');
  }

  const groupToDelete = groups[groupIndex];

  // Eliminar todas las imágenes del grupo
  if (fs.existsSync(imagesFile)) {
    let images = JSON.parse(fs.readFileSync(imagesFile));
    const imagesToDelete = images.filter(img => 
      img.technique === technique && 
      img.category === category && 
      img.group_name === group_name
    );

    // Eliminar archivos físicos de imágenes
    for (const image of imagesToDelete) {
      // Extraer el nombre del archivo desde file_url si filename no existe
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

    // Actualizar JSON de imágenes
    images = images.filter(img => !(
      img.technique === technique && 
      img.category === category && 
      img.group_name === group_name
    ));
    fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2));
  }

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

  // Eliminar grupo del JSON
  groups.splice(groupIndex, 1);
  fs.writeFileSync(groupsFile, JSON.stringify(groups, null, 2));

  console.log(`✅ Grupo eliminado: ${group_name}`);
  return groupToDelete;
};

export default { isValidTechniqueCategory, createGroup, getAllGroups, deleteGroup };
