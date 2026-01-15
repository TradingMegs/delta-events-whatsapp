const fs = require('fs');
const path = require('path');

// Read the source map
const sourceMap = JSON.parse(fs.readFileSync('index-bundle.js.map', 'utf8'));

console.log('Found', sourceMap.sources.length, 'source files');
console.log('\nFirst 50 sources:');
sourceMap.sources.slice(0, 50).forEach((src, i) => {
  console.log(`${i + 1}. ${src}`);
});

// Extract source content if available
if (sourceMap.sourcesContent) {
  console.log('\n\nExtracting source files...');
  
  sourceMap.sources.forEach((sourcePath, index) => {
    const content = sourceMap.sourcesContent[index];
    if (!content) return;
    
    // Clean up the path
    const cleanPath = sourcePath
      .replace(/^\.\.\//, '')
      .replace(/^\//, '')
      .replace(/\?.*$/, '');
    
    // Only extract src/ files
    if (cleanPath.startsWith('src/')) {
      const fullPath = path.join(__dirname, cleanPath);
      const dir = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write the file
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Extracted:', cleanPath);
    }
  });
  
  console.log('\n✅ Source extraction complete!');
} else {
  console.log('\n❌ No source content found in map');
}
