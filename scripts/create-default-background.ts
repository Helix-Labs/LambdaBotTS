import { createCanvas } from 'canvas';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function createDefaultBackground() {
  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add some decorative elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, width, height / 3);

  // Convert to buffer and save
  const buffer = canvas.toBuffer('image/png');
  const filePath = join(process.cwd(), 'database', 'background', 'default.png');

  await writeFile(filePath, buffer);
  console.log('Default welcome background created at:', filePath);
}

// Run if this file is executed directly
if (require.main === module) {
  createDefaultBackground().catch(console.error);
}