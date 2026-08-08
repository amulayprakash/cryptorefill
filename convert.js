const fs = require('fs');
const path = 'c:/Users/ASUS/Desktop/QUAGNITIA/offer-website/src/data/products.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/"₹(\d+)"/g, (match, p1) => {
    return '"$' + Math.round(parseInt(p1) / 83) + '"';
});
content = content.replace(/detailedPriceOptions: \[6320\]/g, 'detailedPriceOptions: [76]');
content = content.replace(/detailedPriceOptions: \[3680\]/g, 'detailedPriceOptions: [44]');
content = content.replace(/detailedPriceOptions: \[2400\]/g, 'detailedPriceOptions: [29]');
content = content.replace(/detailedPriceOptions: \[3760\]/g, 'detailedPriceOptions: [45]');
content = content.replace(/detailedPriceOptions: \[4000\]/g, 'detailedPriceOptions: [48]');
content = content.replace(/detailedPriceOptions: \[3080\]/g, 'detailedPriceOptions: [37]');
content = content.replace(/detailedPriceOptions: \[3840\]/g, 'detailedPriceOptions: [46]');
content = content.replace(/detailedPriceOptions: \[2040\]/g, 'detailedPriceOptions: [25]');
content = content.replace(/detailedPriceOptions: \[4080\]/g, 'detailedPriceOptions: [49]');
content = content.replace(/detailedPriceOptions: \[2480\]/g, 'detailedPriceOptions: [30]');

fs.writeFileSync(path, content, 'utf8');
console.log('Conversion complete!');
