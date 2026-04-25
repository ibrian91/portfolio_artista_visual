import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { technique, category, group_name } = req.body;
      if (!technique || !category || !group_name) {
        return cb(new Error('Faltan datos: technique, category, group_name'));
      }
      const uploadPath = path.join(__dirname, '../../uploads/portfolio', technique, category, group_name);
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

// Middleware para subida de archivos
const uploadMiddleware = upload.single('image');

const uploadController = {
  // Subir imagen(s)
  async uploadImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: 'No se proporcionaron archivos',
          message: 'Debe seleccionar al menos una imagen para subir'
        });
      }

      const uploadType = req.body.upload_type || 'portfolio';
      let processedCount = 0;
      const filesInfo = [];

      for (const file of req.files) {
        try {
          const optimizedFileName = `optimized-${file.filename}`;
          const optimizedPath = path.join(path.dirname(file.path), optimizedFileName);

          await sharp(file.path)
            .resize(2000, 2000, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({
              quality: 85,
              progressive: true
            })
            .toFile(optimizedPath);

    await fs.unlink(file.path);
    processedCount++;
    filesInfo.push({
      originalName: file.originalname,
      optimizedFileName,
      optimizedPath
    });
  } catch (err) {
    // Si falla el procesamiento de una imagen, eliminar el archivo original
    await fs.unlink(file.path).catch(() => {});
  }
}

      if (processedCount === 0) {
        return res.status(500).json({
          error: 'Error procesando archivos',
          message: 'No se pudo procesar ningún archivo'
        });
      }

      return res.status(201).json({
        message: `${processedCount} archivo(s) subido(s) exitosamente`,
        files: filesInfo,
        upload_type: uploadType
      });

    } catch (error) {
      console.error('Error en upload:', error);
      
      // Limpiar archivos en caso de error
      if (req.files) {
        await Promise.all(
          req.files.map(file => fs.unlink(file.path).catch(() => {}))
        );
      }

      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudieron subir los archivos'
      });
    }
  },

  // Subir imagen específica para portfolio
  async uploadPortfolioImage(req, res) {
    try {
      const {
        technique,
        category,
        group_name,
        image_name,
        description
      } = req.body;

      // Convertir correctamente los valores booleanos desde strings de FormData
      // FormData siempre envía strings, entonces "true" o "false"
      const is_mockup_image = String(req.body.is_mockup_image) === 'true';
      const is_rotating_image = String(req.body.is_rotating_image) === 'true';
      const is_small_image = String(req.body.is_small_image) === 'true';

      // Validar archivo
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó archivo' });
      }

      // Validar grupo existente en MySQL
      const [groups] = await pool.query(
        'SELECT * FROM groups_table WHERE technique = ? AND category = ? AND group_name = ?',
        [technique, category, group_name]
      );
      
      if (groups.length === 0) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(404).json({ error: 'El grupo no existe' });
      }

      // Procesar imagen (optimizar)
      const ext = path.extname(req.file.filename).toLowerCase();
      const allowed = ['.jpeg', '.jpg', '.png'];
      if (!allowed.includes(ext)) {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(400).json({ error: 'Solo se permiten archivos JPEG, JPG o PNG' });
      }
      const optimizedFileName = `optimized-${image_name || req.file.filename}${ext}`;
      const optimizedPath = path.join(path.dirname(req.file.path), optimizedFileName);
      await sharp(req.file.path)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .toFile(optimizedPath);
      await fs.unlink(req.file.path);

      // Si es MockUp, eliminar cualquier MockUp anterior del mismo grupo
      const [previousMockups] = await pool.query(
        'SELECT * FROM images WHERE technique = ? AND category = ? AND group_name = ? AND is_mockup_image = true',
        [technique, category, group_name]
      );

      if (is_mockup_image && previousMockups.length > 0) {
        // Eliminar archivos físicos de MockUps anteriores
        for (const oldMockup of previousMockups) {
          try {
            const oldFilePath = path.join(__dirname, '../..', oldMockup.file_url);
            await fs.unlink(oldFilePath).catch(() => {
              console.warn('No se pudo eliminar el archivo MockUp anterior:', oldFilePath);
            });
          } catch (err) {
            console.warn('Error eliminando MockUp anterior:', err);
          }
        }

        // Eliminar MockUps anteriores de MySQL
        await pool.query(
          'DELETE FROM images WHERE technique = ? AND category = ? AND group_name = ? AND is_mockup_image = true',
          [technique, category, group_name]
        );
      }

      // Si es Rotating Image, eliminar cualquier Rotating anterior del mismo grupo
      const [previousRotating] = await pool.query(
        'SELECT * FROM images WHERE technique = ? AND category = ? AND group_name = ? AND is_rotating_image = true',
        [technique, category, group_name]
      );

      if (is_rotating_image && previousRotating.length > 0) {
        // Eliminar archivos físicos de Rotating anteriores
        for (const oldRotating of previousRotating) {
          try {
            const oldFilePath = path.join(__dirname, '../..', oldRotating.file_url);
            await fs.unlink(oldFilePath).catch(() => {
              console.warn('No se pudo eliminar el archivo Rotating anterior:', oldFilePath);
            });
          } catch (err) {
            console.warn('Error eliminando Rotating anterior:', err);
          }
        }

        // Eliminar Rotating anteriores de MySQL
        await pool.query(
          'DELETE FROM images WHERE technique = ? AND category = ? AND group_name = ? AND is_rotating_image = true',
          [technique, category, group_name]
        );
      }

      // Guardar metadata en MySQL
      const imageId = Date.now();
      const fileUrl = `/uploads/portfolio/${technique}/${category}/${group_name}/${optimizedFileName}`;
      
      await pool.query(
        `INSERT INTO images (
          id, technique, category, group_name, image_name, description,
          is_mockup_image, is_rotating_image, is_small_image, file_url,
          file_size, mime_type, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          imageId,
          technique,
          category,
          group_name,
          image_name,
          description,
          is_mockup_image ? 1 : 0,
          is_rotating_image ? 1 : 0,
          is_small_image ? 1 : 0,
          fileUrl,
          req.file.size || null,
          req.file.mimetype || null
        ]
      );

      const imageData = {
        id: imageId,
        technique,
        category,
        group_name,
        image_name,
        description,
        is_mockup_image: is_mockup_image,
        is_rotating_image: is_rotating_image,
        is_small_image: is_small_image,
        file_url: fileUrl,
        created_at: new Date().toISOString()
      };

      // Respuesta
      res.status(201).json({
        message: 'Imagen subida y asociada al grupo correctamente.',
        image: imageData,
        mockup_replaced: is_mockup_image
      });
    } catch (error) {
      console.error('Error subiendo imagen de portfolio:', error);
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      res.status(500).json({ error: 'Error interno del servidor', message: 'No se pudo subir la imagen' });
    }
  },



  // Eliminar archivo
  async deleteFile(req, res) {
    try {
      const { id } = req.params;
      // Nota: no se requiere clave para eliminar archivos

      
      if (!file) {
        return res.status(404).json({
          error: 'Archivo no encontrado',
          message: `No se encontró el archivo con ID ${id}`
        });
      }

      // Eliminar archivo físico
      const fullPath = path.join(__dirname, '../..', file.file_path);
      await fs.unlink(fullPath).catch(() => {
        console.warn('No se pudo eliminar el archivo físico:', fullPath);
      });


      res.json({
        message: 'Archivo eliminado exitosamente',
        file: {
          id: file.id,
          original_name: file.original_name,
          file_path: file.file_path
        }
      });

    } catch (error) {
      console.error('Error eliminando archivo:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el archivo'
      });
    }
  },

};

// Middleware para manejo de errores de multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande',
        message: 'El archivo excede el tamaño máximo permitido'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Demasiados archivos',
        message: 'Se excedió el número máximo de archivos permitidos'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Campo de archivo inesperado',
        message: 'Se recibió un archivo en un campo no esperado'
      });
    }
  }
  
  if (err.message.includes('Solo se permiten archivos de imagen')) {
    return res.status(400).json({
      error: 'Tipo de archivo no permitido',
      message: err.message
    });
  }

  next(err);
};

export const testDb = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    res.json({ success: true, now: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Error de conexión', details: err.message });
  }
};

// Exportar middleware y controlador
export { uploadMiddleware };
export default uploadController;


