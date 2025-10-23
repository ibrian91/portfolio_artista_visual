import { PortfolioItemModel, ItemVariantModel } from '../models/PortfolioModel.js';

export const portfolioController = {
  // Obtener todos los items con estructura completa
  async getAllStructured(req, res) {
    try {
      const rawData = await PortfolioItemModel.getAllWithVariants();
      const structuredData = transformPortfolioData(rawData);
      
      res.json(structuredData);
    } catch (error) {
      console.error('Error obteniendo portfolio estructurado:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo obtener el portfolio'
      });
    }
  },

  // Obtener items por colección
  async getByCollection(req, res) {
    try {
      const { collectionId } = req.params;
      const rawData = await PortfolioItemModel.getByCollection(collectionId);
      const structuredData = transformPortfolioData(rawData);
      
      res.json(structuredData);
    } catch (error) {
      console.error('Error obteniendo items por colección:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los items de la colección'
      });
    }
  },

  // Obtener items por técnica
  async getByTechnique(req, res) {
    try {
      const { techniqueId } = req.params;
      const rawData = await PortfolioItemModel.getByTechnique(techniqueId);
      const structuredData = transformPortfolioData(rawData);
      
      res.json(structuredData);
    } catch (error) {
      console.error('Error obteniendo items por técnica:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los items de la técnica'
      });
    }
  },

  // Obtener item específico con sus variantes
  async getById(req, res) {
    try {
      const { id } = req.params;
      const rawData = await PortfolioItemModel.getByIdWithVariants(id);
      
      if (rawData.length === 0) {
        return res.status(404).json({ 
          error: 'Item no encontrado',
          message: `No se encontró el item con ID ${id}`
        });
      }
      
      const structuredData = transformPortfolioData(rawData);
      res.json(structuredData[0]);
    } catch (error) {
      console.error('Error obteniendo item por ID:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo obtener el item'
      });
    }
  },

  // Crear nuevo item
  async create(req, res) {
    try {
      const { 
        collection_id, 
        name, 
        description, 
        main_image, 
        is_small_image = false, 
        is_mockup_image = false, 
        is_rotating_image = false 
      } = req.body;
      
      if (!collection_id || !name || !main_image) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'Collection ID, nombre e imagen principal son obligatorios'
        });
      }

      const result = await PortfolioItemModel.create({
        collection_id, 
        name, 
        description, 
        main_image, 
        is_small_image, 
        is_mockup_image, 
        is_rotating_image
      });
      
      res.status(201).json({
        message: 'Item creado exitosamente',
        id: result.insertId,
        item: { 
          id: result.insertId, 
          collection_id, 
          name, 
          description, 
          main_image, 
          is_small_image, 
          is_mockup_image, 
          is_rotating_image 
        }
      });
    } catch (error) {
      console.error('Error creando item:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo crear el item'
      });
    }
  },

  // Actualizar item
  async update(req, res) {
    try {
      const { id } = req.params;
      const { 
        name, 
        description, 
        main_image, 
        is_small_image, 
        is_mockup_image, 
        is_rotating_image 
      } = req.body;

      if (!name || !main_image) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'Nombre e imagen principal son obligatorios'
        });
      }

      const result = await PortfolioItemModel.update(id, {
        name, 
        description, 
        main_image, 
        is_small_image, 
        is_mockup_image, 
        is_rotating_image
      });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Item no encontrado',
          message: `No se encontró el item con ID ${id}`
        });
      }

      res.json({
        message: 'Item actualizado exitosamente',
        item: { 
          id, 
          name, 
          description, 
          main_image, 
          is_small_image, 
          is_mockup_image, 
          is_rotating_image 
        }
      });
    } catch (error) {
      console.error('Error actualizando item:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar el item'
      });
    }
  },

  // Eliminar item
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await PortfolioItemModel.delete(id);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Item no encontrado',
          message: `No se encontró el item con ID ${id}`
        });
      }

      res.json({ 
        message: 'Item eliminado exitosamente',
        id: parseInt(id)
      });
    } catch (error) {
      console.error('Error eliminando item:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el item'
      });
    }
  },

  // Buscar items
  async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length < 2) {
        return res.status(400).json({ 
          error: 'Parámetro de búsqueda inválido',
          message: 'El término de búsqueda debe tener al menos 2 caracteres'
        });
      }

      const results = await PortfolioItemModel.search(q.trim());
      res.json(results);
    } catch (error) {
      console.error('Error buscando items:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo realizar la búsqueda'
      });
    }
  }
};

export const variantController = {
  // Obtener variantes por item
  async getByItem(req, res) {
    try {
      const { itemId } = req.params;
      const variants = await ItemVariantModel.getByItem(itemId);
      res.json(variants);
    } catch (error) {
      console.error('Error obteniendo variantes:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las variantes'
      });
    }
  },

  // Crear nueva variante
  async create(req, res) {
    try {
      const { portfolio_item_id, name, image, description } = req.body;
      
      if (!portfolio_item_id || !name || !image) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'Item ID, nombre e imagen son obligatorios'
        });
      }

      const result = await ItemVariantModel.create({
        portfolio_item_id, 
        name, 
        image, 
        description
      });
      
      res.status(201).json({
        message: 'Variante creada exitosamente',
        id: result.insertId,
        variant: { 
          id: result.insertId, 
          portfolio_item_id, 
          name, 
          image, 
          description 
        }
      });
    } catch (error) {
      console.error('Error creando variante:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo crear la variante'
      });
    }
  },

  // Actualizar variante
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, image, description } = req.body;

      if (!name || !image) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'Nombre e imagen son obligatorios'
        });
      }

      const result = await ItemVariantModel.update(id, { name, image, description });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Variante no encontrada',
          message: `No se encontró la variante con ID ${id}`
        });
      }

      res.json({
        message: 'Variante actualizada exitosamente',
        variant: { id, name, image, description }
      });
    } catch (error) {
      console.error('Error actualizando variante:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la variante'
      });
    }
  },

  // Eliminar variante
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ItemVariantModel.delete(id);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Variante no encontrada',
          message: `No se encontró la variante con ID ${id}`
        });
      }

      res.json({ 
        message: 'Variante eliminada exitosamente',
        id: parseInt(id)
      });
    } catch (error) {
      console.error('Error eliminando variante:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar la variante'
      });
    }
  }
};

// Función auxiliar para transformar datos de BD al formato esperado
function transformPortfolioData(rawData) {
  const itemsMap = new Map();

  rawData.forEach(row => {
    const {
      item_id,
      collection_id,
      item_name,
      item_description,
      main_image,
      is_small_image,
      is_mockup_image,
      is_rotating_image,
      item_created_at,
      variant_id,
      variant_name,
      variant_image,
      variant_description,
      collection_name,
      category_name,
      technique_title
    } = row;

    // Crear item si no existe
    if (!itemsMap.has(item_id)) {
      itemsMap.set(item_id, {
        id: item_id,
        collection_id,
        name: item_name,
        description: item_description,
        image: main_image,
        is_small_image: Boolean(is_small_image),
        is_mockup_image: Boolean(is_mockup_image),
        is_rotating_image: Boolean(is_rotating_image),
        created_at: item_created_at,
        collection_name,
        category_name,
        technique_title,
        variants: []
      });
    }

    const item = itemsMap.get(item_id);

    // Agregar variante si existe
    if (variant_id && !item.variants.find(v => v.id === variant_id)) {
      item.variants.push({
        id: variant_id,
        name: variant_name,
        image: variant_image,
        description: variant_description
      });
    }
  });

  return Array.from(itemsMap.values());
}
