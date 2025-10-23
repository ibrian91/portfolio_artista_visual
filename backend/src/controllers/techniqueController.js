import { TechniqueModel, CategoryModel, CollectionModel } from '../models/TechniqueModel.js';

export const techniqueController = {
  // Obtener todas las técnicas con estructura completa (como el JSON del frontend)
  async getAllStructured(req, res) {
    try {
      const rawData = await TechniqueModel.getAllWithDetails();
      
      // Transformar los datos al formato del frontend
      const structuredData = transformToFrontendFormat(rawData);
      
      res.json(structuredData);
    } catch (error) {
      console.error('Error obteniendo técnicas estructuradas:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las técnicas'
      });
    }
  },

  // Obtener técnicas básicas (solo tabla techniques)
  async getAll(req, res) {
    try {
      const techniques = await TechniqueModel.getAll();
      res.json(techniques);
    } catch (error) {
      console.error('Error obteniendo técnicas:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las técnicas'
      });
    }
  },

  // Obtener una técnica específica con todos sus detalles
  async getById(req, res) {
    try {
      const { id } = req.params;
      const rawData = await TechniqueModel.getByIdWithDetails(id);
      
      if (rawData.length === 0) {
        return res.status(404).json({ 
          error: 'Técnica no encontrada',
          message: `No se encontró la técnica con ID ${id}`
        });
      }
      
      const structuredData = transformToFrontendFormat(rawData);
      res.json(structuredData[0]); // Devolver solo la primera técnica
    } catch (error) {
      console.error('Error obteniendo técnica por ID:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo obtener la técnica'
      });
    }
  },

  // Crear nueva técnica
  async create(req, res) {
    try {
      const { title, description, main_image } = req.body;
      
      if (!title) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'El título de la técnica es obligatorio'
        });
      }

      const result = await TechniqueModel.create({ title, description, main_image });
      
      res.status(201).json({
        message: 'Técnica creada exitosamente',
        id: result.insertId,
        technique: { id: result.insertId, title, description, main_image }
      });
    } catch (error) {
      console.error('Error creando técnica:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'Técnica duplicada',
          message: 'Ya existe una técnica con ese título'
        });
      }
      
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo crear la técnica'
      });
    }
  },

  // Actualizar técnica
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, main_image } = req.body;

      if (!title) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'El título de la técnica es obligatorio'
        });
      }

      const result = await TechniqueModel.update(id, { title, description, main_image });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Técnica no encontrada',
          message: `No se encontró la técnica con ID ${id}`
        });
      }

      res.json({
        message: 'Técnica actualizada exitosamente',
        technique: { id, title, description, main_image }
      });
    } catch (error) {
      console.error('Error actualizando técnica:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'Técnica duplicada',
          message: 'Ya existe una técnica con ese título'
        });
      }
      
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la técnica'
      });
    }
  },

  // Eliminar técnica
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await TechniqueModel.delete(id);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Técnica no encontrada',
          message: `No se encontró la técnica con ID ${id}`
        });
      }

      res.json({ 
        message: 'Técnica eliminada exitosamente',
        id: parseInt(id)
      });
    } catch (error) {
      console.error('Error eliminando técnica:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar la técnica'
      });
    }
  }
};

export const categoryController = {
  // Obtener categorías por técnica
  async getByTechnique(req, res) {
    try {
      const { techniqueId } = req.params;
      const categories = await CategoryModel.getByTechnique(techniqueId);
      res.json(categories);
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las categorías'
      });
    }
  },

  // Crear nueva categoría
  async create(req, res) {
    try {
      const { technique_id, name, image } = req.body;
      
      if (!technique_id || !name) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'El ID de técnica y nombre son obligatorios'
        });
      }

      const result = await CategoryModel.create({ technique_id, name, image });
      
      res.status(201).json({
        message: 'Categoría creada exitosamente',
        id: result.insertId,
        category: { id: result.insertId, technique_id, name, image }
      });
    } catch (error) {
      console.error('Error creando categoría:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'Categoría duplicada',
          message: 'Ya existe una categoría con ese nombre en esta técnica'
        });
      }
      
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo crear la categoría'
      });
    }
  },

  // Actualizar categoría
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, image } = req.body;

      if (!name) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'El nombre de la categoría es obligatorio'
        });
      }

      const result = await CategoryModel.update(id, { name, image });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Categoría no encontrada',
          message: `No se encontró la categoría con ID ${id}`
        });
      }

      res.json({
        message: 'Categoría actualizada exitosamente',
        category: { id, name, image }
      });
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la categoría'
      });
    }
  },

  // Eliminar categoría
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await CategoryModel.delete(id);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Categoría no encontrada',
          message: `No se encontró la categoría con ID ${id}`
        });
      }

      res.json({ 
        message: 'Categoría eliminada exitosamente',
        id: parseInt(id)
      });
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar la categoría'
      });
    }
  }
};

export const collectionController = {
  // Obtener colecciones por categoría
  async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const collections = await CollectionModel.getByCategory(categoryId);
      res.json(collections);
    } catch (error) {
      console.error('Error obteniendo colecciones:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las colecciones'
      });
    }
  },

  // Crear nueva colección
  async create(req, res) {
    try {
      const { category_id, name, description } = req.body;
      
      if (!category_id || !name) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'El ID de categoría y nombre son obligatorios'
        });
      }

      const result = await CollectionModel.create({ category_id, name, description });
      
      res.status(201).json({
        message: 'Colección creada exitosamente',
        id: result.insertId,
        collection: { id: result.insertId, category_id, name, description }
      });
    } catch (error) {
      console.error('Error creando colección:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'Colección duplicada',
          message: 'Ya existe una colección con ese nombre en esta categoría'
        });
      }
      
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo crear la colección'
      });
    }
  },

  // Actualizar colección
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ 
          error: 'Datos incompletos',
          message: 'El nombre de la colección es obligatorio'
        });
      }

      const result = await CollectionModel.update(id, { name, description });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Colección no encontrada',
          message: `No se encontró la colección con ID ${id}`
        });
      }

      res.json({
        message: 'Colección actualizada exitosamente',
        collection: { id, name, description }
      });
    } catch (error) {
      console.error('Error actualizando colección:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la colección'
      });
    }
  },

  // Eliminar colección
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await CollectionModel.delete(id);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Colección no encontrada',
          message: `No se encontró la colección con ID ${id}`
        });
      }

      res.json({ 
        message: 'Colección eliminada exitosamente',
        id: parseInt(id)
      });
    } catch (error) {
      console.error('Error eliminando colección:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar la colección'
      });
    }
  }
};

// Función auxiliar para transformar datos de BD al formato del frontend
function transformToFrontendFormat(rawData) {
  const techniquesMap = new Map();

  rawData.forEach(row => {
    const {
      technique_id,
      technique_title,
      technique_description,
      technique_image,
      category_id,
      category_name,
      category_image,
      collection_id,
      collection_name,
      collection_description
    } = row;

    // Crear técnica si no existe
    if (!techniquesMap.has(technique_id)) {
      techniquesMap.set(technique_id, {
        title: technique_title,
        description: technique_description,
        image: technique_image,
        categoria: []
      });
    }

    const technique = techniquesMap.get(technique_id);

    // Agregar categoría si existe y no está ya agregada
    if (category_id) {
      let category = technique.categoria.find(cat => cat.name === category_name);
      
      if (!category) {
        category = {
          name: category_name,
          image: category_image,
          collections: []
        };
        technique.categoria.push(category);
      }

      // Agregar colección si existe y no está ya agregada
      if (collection_id && !category.collections.find(col => col.name === collection_name)) {
        category.collections.push({
          name: collection_name,
          description: collection_description
        });
      }
    }
  });

  return Array.from(techniquesMap.values());
}
