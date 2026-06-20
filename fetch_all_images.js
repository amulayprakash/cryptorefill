import fs from 'fs';
import https from 'https';

// Regex to extract all product IDs and names
const content = fs.readFileSync('src/data/vietnamProducts.js', 'utf8');

const idRegex = /id:\s*"([^"]+)"/g;
const nameRegex = /name:\s*"([^"]+)"/g;

let ids = [];
let names = [];

let match;
while ((match = idRegex.exec(content)) !== null) {
  ids.push(match[1]);
}
while ((match = nameRegex.exec(content)) !== null) {
  names.push(match[1]);
}

let updatedContent = content;

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

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const name = names[i];
    
    // Skip if we already modified the first one manually
    if (id === 'some-by-mi-aha-bha-pha-30-days-miracle-serum' && fs.existsSync(`public/assets/vietnam/products/${id}.png`)) {
      continue;
    }

    const dest = `public/assets/vietnam/products/${id}.png`;
    const prompt = encodeURIComponent(`A professional, high-quality product photography shot of ${name}, clean background, e-commerce style, photorealistic`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=500&height=500&nologo=true`;

    console.log(`Downloading ${i+1}/${ids.length}: ${name}`);
    try {
      await downloadImage(url, dest);
      
      // Update content
      const searchRegex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
      updatedContent = updatedContent.replace(searchRegex, `$1assets/vietnam/products/${id}.png$2`);
    } catch (e) {
      console.log(`Failed to download ${name}: ${e.message}`);
    }
  }

  fs.writeFileSync('src/data/vietnamProducts.js', updatedContent);
  console.log('Finished downloading all images and updating vietnamProducts.js!');
}

run();
