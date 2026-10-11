import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generate() {
  const svgPath = path.resolve('public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Generated public/apple-touch-icon.png');

  // 2. pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Generated public/pwa-192x192.png');

  // 3. pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Generated public/pwa-512x512.png');

  // 4. pwa-maskable-512x512.png (padded for Android/iOS maskable circle/squircle)
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#070c09'
    })
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Generated public/pwa-maskable-512x512.png');

  // 5. favicon.ico / 32x32 png
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile('public/favicon.png');
  console.log('Generated public/favicon.png');

  // 6. iOS App Store Icon (1024x1024)
  const iosIconDir = path.resolve('ios/App/App/Assets.xcassets/AppIcon.appiconset');
  if (fs.existsSync(iosIconDir)) {
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(iosIconDir, 'AppIcon-512@2x.png'));
    console.log('Generated ios AppIcon-512@2x.png (1024x1024)');
  }
}

generate().catch(console.error);
