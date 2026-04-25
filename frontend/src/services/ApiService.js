import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Método para crear un grupo con imagen de portada
  async createGroupWithCover(groupData, coverImageFile) {
    try {
      const formData = new FormData();
      formData.append('technique', groupData.technique);
      formData.append('category', groupData.category);
      formData.append('group_name', groupData.group_name);
      formData.append('cover_image', coverImageFile);

      const response = await this.client.post('/groups', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating group with cover:', error);
      throw error;
    }
  }

  // Método para subir una imagen
  async uploadImage(formData) {
    try {
      const response = await this.client.post('/upload/portfolio-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Método para obtener grupos con imágenes de portada
  async getGroupsWithCovers(technique, category) {
    try {
      console.log('🌐 ApiService.getGroupsWithCovers called with:', { technique, category });
      console.log('🔗 Making request to:', `${API_BASE_URL}/groups/cover-images?technique=${technique}&category=${category}`);

      const response = await this.client.get('/groups/cover-images', {
        params: {
          technique: technique,
          category: category
        }
      });

      console.log('📨 Response received:', response.data);
      return response.data.groups || [];
    } catch (error) {
      console.error('❌ ApiService.getGroupsWithCovers error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  // Método para obtener imágenes de un grupo específico
  async getImagesByGroup(technique, category, groupName) {
    try {
      console.log('🌐 ApiService.getImagesByGroup called with:', { technique, category, groupName });
      console.log('🔗 Making request to:', `${API_BASE_URL}/images?technique=${technique}&category=${category}&group_name=${groupName}`);

      const response = await this.client.get('/images', {
        params: {
          technique: technique,
          category: category,
          group_name: groupName
        }
      });

      console.log('📨 Response received:', response.data);
      console.log('📨 Images array:', response.data.images);
      // Devolver el array de imágenes directamente, no el objeto completo
      return response.data.images || [];
    } catch (error) {
      console.error('❌ ApiService.getImagesByGroup error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  // Método para obtener grupos de una técnica-categoría
  async getGroups(technique, category) {
    try {
      console.log('🌐 ApiService.getGroups called with:', { technique, category });
      const response = await this.client.get('/groups', {
        params: {
          technique: technique,
          category: category
        }
      });

      console.log('📨 Groups response:', response.data);
      return response.data.groups || [];
    } catch (error) {
      console.error('❌ ApiService.getGroups error:', error);
      throw error;
    }
  }

  // Método para obtener imágenes de un grupo (alias para compatibilidad)
  async getImages(technique, category, groupName) {
    return this.getImagesByGroup(technique, category, groupName);
  }

  // Método para eliminar una imagen específica
  async deleteImage(imageId, uploadKey) {
    try {
      console.log('🗑️ ApiService.deleteImage called with:', { imageId });
      const response = await this.client.delete(`/images/${imageId}`, {
        data: {}
      });

      console.log('✅ Image deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ApiService.deleteImage error:', error);
      throw error;
    }
  }

  // Método para eliminar un grupo completo
  async deleteGroup(technique, category, groupName, uploadKey) {
    try {
      console.log('🗑️ ApiService.deleteGroup called with:', { technique, category, groupName });
      const response = await this.client.delete('/groups', {
        data: {
          technique: technique,
          category: category,
          group_name: groupName,
        }
      });

      console.log('✅ Group deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ApiService.deleteGroup error:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
