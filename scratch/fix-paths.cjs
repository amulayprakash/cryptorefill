const fs = require('fs');
const path = 'c:/Users/ASUS/Desktop/QUAGNITIA/offer-website/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/"assets\//g, '"/assets/');
content = content.replace(/, assets\//g, ', /assets/');
content = content.replace(/ 32w, assets\//g, ' 32w, /assets/');
fs.writeFileSync(path, content);
