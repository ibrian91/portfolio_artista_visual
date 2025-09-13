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
      formData.append('upload_key', groupData.upload_key);
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
      return response.data;
    } catch (error) {
      console.error('❌ ApiService.getImagesByGroup error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
