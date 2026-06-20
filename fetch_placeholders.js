import fs from 'fs';
import https from 'https';

let content = fs.readFileSync('src/data/vietnamProducts.js', 'utf8');
const productBlocks = content.split('  {');

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200 || res.statusCode === 302) {
        const targetUrl = res.headers.location || url;
        https.get(targetUrl, (imageRes) => {
          const file = fs.createWriteStream(dest);
          imageRes.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        reject(new Error(`Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function run() {
  if (!fs.existsSync('public/assets/vietnam/products')) {
    fs.mkdirSync('public/assets/vietnam/products', { recursive: true });
  }

  for (let i = 1; i < productBlocks.length; i++) {
    let block = productBlocks[i];
    
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    
    if (!idMatch || !nameMatch) continue;
    
    const id = idMatch[1];
    const name = nameMatch[1];
    
    const newImageUrl = `assets/vietnam/products/${id}.png`;
    const dest = `public/${newImageUrl}`;
    
    // Create a 500x500 image with the product name written on it
    const text = encodeURIComponent(name.split(' ').slice(0, 4).join(' ') + '\n' + name.split(' ').slice(4).join(' '));
    const url = `https://placehold.co/500x500/1e40af/ffffff/png?text=${text}`;

    console.log(`Downloading placeholder for: ${name}`);
    try {
      await downloadImage(url, dest);
      
      productBlocks[i] = block.replace(/imageUrl:\s*"([^"]+)"/, `imageUrl: "${newImageUrl}"`);
    } catch (e) {
      console.log(`Failed ${name}: ${e.message}`);
    }
  }

  fs.writeFileSync('src/data/vietnamProducts.js', productBlocks.join('  {'));
  console.log('Finished updating vietnamProducts.js with placeholders!');
}

run();
