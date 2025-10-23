import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import imageController from '../controllers/imageController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Servir imágenes estáticas
router.use('/images', express.static(path.join(__dirname, '../../uploads/images')));

// Ruta para obtener imagen específica con información
router.get('/image/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  const imagePath = path.join(__dirname, '../../uploads/images', type, filename);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({
        error: 'Imagen no encontrada',
        message: `No se encontró la imagen ${filename} en ${type}`
      });
    }
  });
});

// Ruta para verificar si una imagen existe
router.head('/image/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  const imagePath = path.join(__dirname, '../../uploads/images', type, filename);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

// GET /api/images?technique={}&category={}&group_name={}
router.get('/', imageController.getImages);

export default router;
