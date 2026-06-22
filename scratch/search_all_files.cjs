const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('.');
console.log(`Searching through ${files.length} files...`);

for (const file of files) {
  if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('scrollbar') || content.includes('webkit-scrollbar')) {
        console.log(`Found in: ${file}`);
        // Find matching lines
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('scrollbar') || line.includes('webkit-scrollbar')) {
            console.log(`  Line ${idx + 1}: ${line.trim().substring(0, 150)}`);
          }
        });
      }
    } catch (e) {
      // Ignore binary files or read errors
    }
  }
}
