import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

async function createZip() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPathPublic = path.join(publicDir, 'la-unica-rt-ios-appstore.zip');
  const outPathRoot = path.resolve('la-unica-rt-ios-appstore.zip');

  const output = fs.createWriteStream(outPathPublic);
  const archive = new archiver.ZipArchive({
    zlib: { level: 9 }
  });

  output.on('close', function () {
    console.log(`Zip successfully created: ${outPathPublic} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
    fs.copyFileSync(outPathPublic, outPathRoot);
    console.log(`Copied to: ${outPathRoot}`);
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  // Add the entire Xcode iOS project
  if (fs.existsSync('ios')) {
    archive.directory('ios/', 'ios');
  }

  // Add compiled web dist
  if (fs.existsSync('dist')) {
    archive.directory('dist/', 'dist');
  }

  // Add root configs and docs
  if (fs.existsSync('capacitor.config.ts')) {
    archive.file('capacitor.config.ts', { name: 'capacitor.config.ts' });
  }
  if (fs.existsSync('package.json')) {
    archive.file('package.json', { name: 'package.json' });
  }
  if (fs.existsSync('APP_STORE_SUBMISSION_GUIDE.md')) {
    archive.file('APP_STORE_SUBMISSION_GUIDE.md', { name: 'APP_STORE_SUBMISSION_GUIDE.md' });
  }
  if (fs.existsSync('IOS_MOBILE_GUIDE.md')) {
    archive.file('IOS_MOBILE_GUIDE.md', { name: 'IOS_MOBILE_GUIDE.md' });
  }

  await archive.finalize();
}

createZip().catch(console.error);
