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

export default { isValidTechniqueCategory, createGroup, getAllGroups };
