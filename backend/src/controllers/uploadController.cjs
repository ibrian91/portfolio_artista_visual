const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');
const groupsFile = path.join(__dirname, '../data/groups.json');
const imagesFile = path.join(__dirname, '../data/images.json');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { technique, category, group_name } = req.body;
      if (!technique || !category || !group_name) {
        return cb(new Error('Faltan datos para asociar la imagen al grupo'));
      }
      const uploadPath = path.join(__dirname, '../../uploads/portfolio', technique, category, group_name);
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpeg', '.jpg', '.png'];
    if (!allowed.includes(ext)) {
      return cb(new Error('Solo se permiten archivos JPEG, JPG o PNG'));
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos JPEG, JPG o PNG'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    files: 1
  },
  fileFilter: fileFilter
});

async function uploadPortfolioImage(req, res) {
  try {
    console.log('\n🚨🚨🚨 UPLOAD INICIADO - VERSIÓN CON DEBUG 🚨🚨🚨\n');
    
    const {
      technique,
      category,
      group_name,
      image_name,
      description,
      upload_key
    } = req.body;

    // 🔍 DEBUG: Ver valores RAW que llegan desde FormData
    console.log('\n============================================');
    console.log('📦 VALORES RAW DE req.body:');
    console.log('  is_mockup_image:', req.body.is_mockup_image, '(tipo:', typeof req.body.is_mockup_image + ')');
    console.log('  is_rotating_image:', req.body.is_rotating_image, '(tipo:', typeof req.body.is_rotating_image + ')');
    console.log('  is_small_image:', req.body.is_small_image, '(tipo:', typeof req.body.is_small_image + ')');
    console.log('============================================\n');

    // Convertir correctamente los valores booleanos desde strings de FormData
    // FormData siempre envía strings, entonces "true" o "false"
    const is_mockup_image = String(req.body.is_mockup_image) === 'true';
    const is_rotating_image = String(req.body.is_rotating_image) === 'true';
    const is_small_image = String(req.body.is_small_image) === 'true';

    console.log('✅ VALORES CONVERTIDOS:');
    console.log('  is_mockup_image:', is_mockup_image);
    console.log('  is_rotating_image:', is_rotating_image);
    console.log('  is_small_image:', is_small_image);
    console.log('============================================\n');

    // Debug: loguear valores SIEMPRE
    console.log('🔑 upload_key recibido:', upload_key);
    console.log('🔑 UPLOAD_SECRET .env:', process.env.UPLOAD_SECRET);

    if (String(upload_key) !== String(process.env.UPLOAD_SECRET)) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(401).json({ error: 'Clave de acceso incorrecta', message: 'No tiene permisos para subir archivos' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    let groups = [];
    try {
      await fs.stat(groupsFile);
      groups = JSON.parse(await fs.readFile(groupsFile));
    } catch (e) {
      groups = [];
    }
    const groupExists = groups.find(g => g.technique === technique && g.category === category && g.group_name === group_name);
    if (!groupExists) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ error: 'El grupo no existe' });
    }

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

    const imageData = {
      id: Date.now().toString(),
      technique,
      category,
      group_name,
      image_name,
      description,
      is_mockup_image: Boolean(is_mockup_image),
      is_rotating_image: Boolean(is_rotating_image),
      is_small_image: Boolean(is_small_image),
      file_url: `/uploads/portfolio/${technique}/${category}/${group_name}/${optimizedFileName}`,
      created_at: new Date().toISOString()
    };

    // Guardar metadata en images.json
    let images = [];
    try {
      const data = await fs.readFile(imagesFile, 'utf8');
      images = JSON.parse(data);
    } catch (e) {
      images = [];
    }
    images.push(imageData);
    await fs.writeFile(imagesFile, JSON.stringify(images, null, 2));

    res.status(201).json({
      message: 'Imagen subida y asociada al grupo correctamente.',
      image: imageData
    });
  } catch (error) {
    console.error('Error subiendo imagen de portfolio:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: 'Error interno del servidor', message: 'No se pudo subir la imagen' });
  }
}

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Archivo demasiado grande' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Demasiados archivos' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Campo de archivo inesperado' });
    }
  }
  if (err.message && err.message.includes('Solo se permiten archivos')) {
    return res.status(400).json({ error: 'Tipo de archivo no permitido', message: err.message });
  }
  next(err);
}

const uploadController = {
  uploadMiddleware: upload.single('image'),
  uploadPortfolioImage
};

module.exports = {
  uploadController,
  handleMulterError
};
