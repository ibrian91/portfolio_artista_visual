import express from 'express';
import multer from 'multer';
import uploadController, { uploadMiddleware, handleMulterError } from '../controllers/uploadController.js';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuración de multer para la ruta general /upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadPath = path.join(__dirname, '../../uploads/portfolio');
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error('Solo se permiten archivos de imagen'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// Ruta principal para subir imágenes (usada por el frontend)
router.post('/', upload.single('image'), handleMulterError, async (req, res) => {
  try {
    const {
      technique_name,
      category_name,
      group_name,
      image_name,
      description,
      is_mockup_image = false,
      is_rotating_image = false,
      is_small_image = false
    } = req.body;

    // Nota: ya no se requiere clave de acceso para subir

    // Validar archivo
    if (!req.file) {
      return res.status(400).json({
        error: 'No se proporcionó archivo',
        message: 'Debe seleccionar una imagen para subir'
      });
    }

    // Validar grupo existente
    const groupsFile = path.join(__dirname, '../data/groups.json');

    let groups = [];
    try {
      const data = await fs.readFile(groupsFile, 'utf8');
      groups = JSON.parse(data);
    } catch (e) {
      console.log('No se pudo leer groups.json, creando archivo vacío');
      groups = [];
    }

    const groupExists = groups.find(g =>
      g.technique === technique_name &&
      g.category === category_name &&
      g.group_name === group_name
    );

    if (!groupExists) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(409).json({
        error: 'Grupo no encontrado',
        message: `El grupo "${group_name}" no existe en la categoría "${category_name}" de la técnica "${technique_name}". Verifique que el grupo existe o créelo primero.`
      });
    }

    // Crear directorio del grupo si no existe
    const groupDir = path.join(__dirname, '../../uploads/portfolio', technique_name, category_name, group_name);
    await fs.mkdir(groupDir, { recursive: true });

    // Procesar imagen (optimizar)
    const ext = path.extname(req.file.filename).toLowerCase();
    const allowed = ['.jpeg', '.jpg', '.png'];
    if (!allowed.includes(ext)) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        error: 'Tipo de archivo no permitido',
        message: 'Solo se permiten archivos JPEG, JPG o PNG'
      });
    }

    const optimizedFileName = `optimized-${image_name || req.file.filename}${ext}`;
    const optimizedPath = path.join(groupDir, optimizedFileName);

    await sharp(req.file.path)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(optimizedPath);

    await fs.unlink(req.file.path);

    // Respuesta exitosa
    res.status(201).json({
      message: 'Imagen subida correctamente',
      image: {
        technique: technique_name,
        category: category_name,
        group_name: group_name,
        image_name: image_name,
        description: description,
        is_mockup_image: Boolean(is_mockup_image),
        is_rotating_image: Boolean(is_rotating_image),
        is_small_image: Boolean(is_small_image),
        file_url: `/uploads/portfolio/${technique_name}/${category_name}/${group_name}/${optimizedFileName}`
      }
    });

  } catch (error) {
    console.error('Error en upload:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo subir la imagen'
    });
  }
});

// Ruta específica para subir imagen desde el formulario del frontend
router.post(
  '/portfolio-image',
  uploadMiddleware,
  handleMulterError,
  uploadController.uploadPortfolioImage
);

export default router;
