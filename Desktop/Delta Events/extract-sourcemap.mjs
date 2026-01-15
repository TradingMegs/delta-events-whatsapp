import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the source map
const sourceMap = JSON.parse(fs.readFileSync('index-bundle.js.map', 'utf8'));

console.log('Found', sourceMap.sources.length, 'source files');

// Extract source content if available
if (sourceMap.sourcesContent) {
  console.log('\nExtracting source files...\n');
  
  let extracted = 0;
  sourceMap.sources.forEach((sourcePath, index) => {
    const content = sourceMap.sourcesContent[index];
    if (!content) return;
    
    // Clean up the path
    const cleanPath = sourcePath
      .replace(/^\.\.\//, '')
      .replace(/^\//, '')
      .replace(/\?.*$/, '');
    
    // Only extract src/ and convex/ files
    if (cleanPath.startsWith('src/') || cleanPath.startsWith('convex/')) {
      const fullPath = path.join(__dirname, cleanPath);
      const dir = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write the file
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('✅', cleanPath);
      extracted++;
    }
  });
  
  console.log(`\n🎉 Extracted ${extracted} source files!`);
} else {
  console.log('\n❌ No source content found in map');
}
