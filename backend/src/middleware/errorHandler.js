// Middleware global para manejo de errores
function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // Log del error para debugging
  console.error('Error Stack:', err.stack);

  // Error de conexión a la base de datos
  if (err.code === 'ECONNREFUSED') {
    const message = 'Error de conexión a la base de datos';
    error = { message, statusCode: 500 };
  }

  // Error de duplicado en MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    const message = 'Recurso duplicado';
    error = { message, statusCode: 409 };
  }

  // Error de clave foránea en MySQL
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    const message = 'Referencia inválida - el recurso padre no existe';
    error = { message, statusCode: 400 };
  }

  // Error de sintaxis SQL
  if (err.code === 'ER_PARSE_ERROR') {
    const message = 'Error de sintaxis en consulta';
    error = { message, statusCode: 500 };
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Error de Cast (ID inválido)
  if (err.name === 'CastError') {
    const message = 'ID de recurso inválido';
    error = { message, statusCode: 400 };
  }

  // Error de JSON malformado
  if (err.type === 'entity.parse.failed') {
    const message = 'JSON malformado en el cuerpo de la petición';
    error = { message, statusCode: 400 };
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token de autorización inválido';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token de autorización expirado';
    error = { message, statusCode: 401 };
  }

  // Respuesta de error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
}

export { errorHandler };
