import fs from 'fs';
import https from 'https';

const prompt = encodeURIComponent('A professional, high-quality product photography shot of Some By Mi Yuja Niacin Anti-Blemish Serum, clean background, e-commerce style, photorealistic');
const url = `https://image.pollinations.ai/prompt/${prompt}?width=500&height=500&nologo=true`;

https.get(url, (res) => {
  if (res.statusCode === 200 || res.statusCode === 302) {
    const targetUrl = res.headers.location || url;
    https.get(targetUrl, (imageRes) => {
      const file = fs.createWriteStream('public/assets/global/products/test.png');
      imageRes.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download completed');
      });
    });
  } else {
    console.log('Error: ', res.statusCode);
  }
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
