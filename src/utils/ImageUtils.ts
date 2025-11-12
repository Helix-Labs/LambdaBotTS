import { createCanvas, loadImage, Canvas, Image } from 'canvas';
import { writeFile, readFile } from 'fs/promises';

export class ImageUtils {
  /**
   * Resize a canvas image to specified dimensions
   */
  public static resize(inputCanvas: Canvas, scaledWidth: number, scaledHeight: number): Canvas {
    const outputCanvas = createCanvas(scaledWidth, scaledHeight);
    const ctx = outputCanvas.getContext('2d');

    ctx.drawImage(inputCanvas as any, 0, 0, scaledWidth, scaledHeight);

    return outputCanvas;
  }

  /**
   * Convert a canvas to PNG buffer
   */
  public static async getBytes(canvas: Canvas): Promise<Buffer> {
    return canvas.toBuffer('image/png');
  }

  /**
   * Create a rounded corner version of the canvas
   */
  public static makeRoundedCorner(inputCanvas: Canvas, cornerRadius: number): Canvas {
    const w = inputCanvas.width;
    const h = inputCanvas.height;
    const outputCanvas = createCanvas(w, h);
    const ctx = outputCanvas.getContext('2d');

    // Create rounded rectangle clip path
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(w - cornerRadius, 0);
    ctx.quadraticCurveTo(w, 0, w, cornerRadius);
    ctx.lineTo(w, h - cornerRadius);
    ctx.quadraticCurveTo(w, h, w - cornerRadius, h);
    ctx.lineTo(cornerRadius, h);
    ctx.quadraticCurveTo(0, h, 0, h - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.clip();

    // Draw the original image within the rounded rectangle
    ctx.drawImage(inputCanvas as any, 0, 0, w, h);

    return outputCanvas;
  }

  /**
   * Load an image from a URL
   */
  public static async loadImageFromUrl(url: string): Promise<Image> {
    return loadImage(url);
  }

  /**
   * Load an image from a file path
   */
  public static async loadImageFromFile(filePath: string): Promise<Image> {
    const buffer = await readFile(filePath);
    return loadImage(buffer);
  }
}