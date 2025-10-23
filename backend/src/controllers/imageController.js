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

export default { getImages };
