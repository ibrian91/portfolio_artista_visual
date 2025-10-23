import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ImageProcessorService {
  
  // Optimizar imagen para web
  static async optimizeForWeb(inputPath, outputPath, options = {}) {
    const {
      width = 2000,
      height = 2000,
      quality = 85,
      format = 'jpeg'
    } = options;

    try {
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality,
          progressive: true
        })
        .toFile(outputPath);

      return {
        success: true,
        outputPath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generar thumbnail
  static async generateThumbnail(inputPath, outputPath, size = 300) {
    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: 80
        })
        .toFile(outputPath);

      return {
        success: true,
        outputPath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Aplicar marca de agua
  static async addWatermark(inputPath, outputPath, watermarkPath) {
    try {
      const watermark = await sharp(watermarkPath)
        .resize(200, 50)
        .toBuffer();

      await sharp(inputPath)
        .composite([{
          input: watermark,
          gravity: 'southeast'
        }])
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      return {
        success: true,
        outputPath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generar múltiples tamaños
  static async generateMultipleSizes(inputPath, baseName, outputDir) {
    const sizes = [
      { suffix: '_thumb', width: 300, height: 300 },
      { suffix: '_medium', width: 800, height: 800 },
      { suffix: '_large', width: 1200, height: 1200 },
      { suffix: '_xl', width: 2000, height: 2000 }
    ];

    const results = [];

    for (const size of sizes) {
      try {
        const outputPath = path.join(outputDir, `${baseName}${size.suffix}.jpg`);
        
        await sharp(inputPath)
          .resize(size.width, size.height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 85 })
          .toFile(outputPath);

        results.push({
          size: size.suffix,
          path: outputPath,
          success: true
        });
      } catch (error) {
        results.push({
          size: size.suffix,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  // Obtener metadatos de imagen
  static async getImageMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      
      return {
        success: true,
        metadata: {
          format: metadata.format,
          width: metadata.width,
          height: metadata.height,
          channels: metadata.channels,
          density: metadata.density,
          hasAlpha: metadata.hasAlpha,
          size: metadata.size
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convertir formato
  static async convertFormat(inputPath, outputPath, format = 'jpeg', options = {}) {
    try {
      const sharpInstance = sharp(inputPath);

      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          await sharpInstance.jpeg({
            quality: options.quality || 85,
            progressive: true
          }).toFile(outputPath);
          break;
        
        case 'png':
          await sharpInstance.png({
            quality: options.quality || 90,
            progressive: true
          }).toFile(outputPath);
          break;
        
        case 'webp':
          await sharpInstance.webp({
            quality: options.quality || 80
          }).toFile(outputPath);
          break;
        
        default:
          throw new Error(`Formato no soportado: ${format}`);
      }

      return {
        success: true,
        outputPath,
        format
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Aplicar filtros artísticos
  static async applyArtisticFilter(inputPath, outputPath, filterType = 'sepia') {
    try {
      let sharpInstance = sharp(inputPath);

      switch (filterType) {
        case 'sepia':
          sharpInstance = sharpInstance.modulate({
            saturation: 0.3,
            brightness: 1.1
          }).tint({ r: 255, g: 240, b: 196 });
          break;

        case 'grayscale':
          sharpInstance = sharpInstance.grayscale();
          break;

        case 'vintage':
          sharpInstance = sharpInstance
            .modulate({
              saturation: 0.7,
              brightness: 0.9
            })
            .tint({ r: 255, g: 250, b: 200 });
          break;

        case 'cool':
          sharpInstance = sharpInstance.tint({ r: 200, g: 230, b: 255 });
          break;

        case 'warm':
          sharpInstance = sharpInstance.tint({ r: 255, g: 230, b: 200 });
          break;

        default:
          // Sin filtro
          break;
      }

      await sharpInstance.jpeg({ quality: 90 }).toFile(outputPath);

      return {
        success: true,
        outputPath,
        filter: filterType
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
