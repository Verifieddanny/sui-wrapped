import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prismaClientPath = path.resolve(__dirname, '../node_modules/.prisma/client/index.js');
const prismaClientEsmPath = path.resolve(__dirname, '../node_modules/.prisma/client/index.mjs');

function fixFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`🔧 Patching ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const fixedContent = content.replace(
      /["']decimal\.js-light\/decimal["']/g, 
      '"decimal.js-light"'
    );

    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`✅ Fixed decimal import in ${path.basename(filePath)}`);
  } else {
    console.warn(`⚠️ Could not find ${filePath} to patch.`);
  }
}

fixFile(prismaClientPath);