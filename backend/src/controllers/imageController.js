import imageService from '../services/imageService.js';

const getImages = async (req, res) => {
  const { technique, category, group_name } = req.query;
  
  if (!technique || !category || !group_name) {
    return res.status(400).json({ error: 'Faltan parámetros: technique, category, group_name' });
  }

  try {
    const images = await imageService.getImagesByGroup(technique, category, group_name);
    if (images.length === 0) {
      return res.json({ 
        message: 'eh papa pone imagen',
        images: []
      });
    }
    return res.json({ images });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener las imágenes.' });
  }
};

const deleteImage = async (req, res) => {
  const { id } = req.params;
  const { upload_key } = req.body;

  // Validar clave de subida
  if (!upload_key || upload_key !== process.env.UPLOAD_SECRET) {
    return res.status(401).json({ error: 'Clave de eliminación incorrecta' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID de la imagen' });
  }

  try {
    const result = await imageService.deleteImageById(id);
    return res.json({ 
      message: 'Imagen eliminada correctamente',
      deletedImage: result 
    });
  } catch (err) {
    console.error('Error en deleteImage controller:', err);
    if (err.message === 'Imagen no encontrada') {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
    return res.status(500).json({ error: 'Error al eliminar la imagen: ' + err.message });
  }
};

export default { getImages, deleteImage };
