import fs from 'fs';
import https from 'https';

let content = fs.readFileSync('src/data/vietnamProducts.js', 'utf8');

// We split by object blocks.
const productBlocks = content.split('  {');

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 302) {
        const targetUrl = res.headers.location || url;
        const req2 = https.get(targetUrl, { timeout: 10000 }, (imageRes) => {
          const file = fs.createWriteStream(dest);
          imageRes.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject).on('timeout', () => { req2.destroy(); reject(new Error('Timeout')); });
      } else {
        reject(new Error(`Status Code: ${res.statusCode}`));
      }
    }).on('error', reject).on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
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
    const imageMatch = block.match(/imageUrl:\s*"([^"]+)"/);
    
    if (!idMatch || !nameMatch || !imageMatch) continue;
    
    const id = idMatch[1];
    const name = nameMatch[1];
    const currentImageUrl = imageMatch[1];
    
    const newImageUrl = `assets/vietnam/products/${id}.png`;
    
    if (currentImageUrl === newImageUrl && fs.existsSync(`public/${newImageUrl}`)) {
      continue; // already updated
    }

    const dest = `public/${newImageUrl}`;
    const prompt = encodeURIComponent(`A professional, high-quality product photography shot of ${name}, clean background, e-commerce style, photorealistic`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=500&height=500&nologo=true`;

    console.log(`Downloading: ${name}`);
    try {
      await downloadImage(url, dest);
      
      // Update the block in memory
      productBlocks[i] = block.replace(/imageUrl:\s*"([^"]+)"/, `imageUrl: "${newImageUrl}"`);
      
      // Write to file immediately so changes are visible!
      fs.writeFileSync('src/data/vietnamProducts.js', productBlocks.join('  {'));
    } catch (e) {
      console.log(`Failed to download ${name}: ${e.message}`);
    }
  }

  console.log('Finished updating vietnamProducts.js!');
}

run();
