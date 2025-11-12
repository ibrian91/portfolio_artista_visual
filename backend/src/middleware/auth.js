import jwt from 'jsonwebtoken';

// Middleware para verificar autenticación con JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido',
      message: 'Debe proporcionar un token de autorización válido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido o ha expirado'
      });
    }

    req.user = decoded;
    next();
  });
};

// Middleware para verificar clave de acceso simple
const verifyAccessKey = (req, res, next) => {
  const access_key = req.body?.access_key || req.query?.access_key;
  
  if (!access_key || access_key !== process.env.ACCESS_KEY) {
    return res.status(401).json({
      error: 'Clave de acceso incorrecta',
      message: 'No tiene permisos para realizar esta acción'
    });
  }

  next();
};

// Middleware para verificar clave de subida
const verifyUploadKey = (req, res, next) => {
  const { upload_key } = req.body;
  
  if (!upload_key || upload_key !== process.env.UPLOAD_SECRET) {
    return res.status(401).json({
      error: 'Clave de subida incorrecta',
      message: 'No tiene permisos para subir archivos'
    });
  }

  next();
};

// Middleware opcional para autenticación (no falla si no hay token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded;
    }
    next();
  });
};


const validateUploadKey = (key) => {
  return key === process.env.UPLOAD_SECRET;
};

export {
  authenticateToken,
  verifyAccessKey,
  verifyUploadKey,
  optionalAuth,
  validateUploadKey
};
