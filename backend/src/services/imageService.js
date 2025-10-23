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

export default { getImagesByGroup, getAllImages };
