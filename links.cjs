const fs = require('fs');
const app = fs.readFileSync('src/App.jsx', 'utf8');
const regex = /href=['"]([^'"]+)['"]/g;
const hrefs = [];
let match;
while ((match = regex.exec(app)) !== null) {
  hrefs.push(match[1]);
}
console.log([...new Set(hrefs)].join('\n'));
