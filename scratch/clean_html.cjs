const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Find the massive line 8 (or whichever line has all the preloads)
// The simplest is to replace everything between <title>Mad Deals</title> and <style> html.main
const startStr = '<title>Mad Deals</title>';
const endStr = 'html.main {';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  // We want to keep the gtag script but remove the other messy SEO/social tags because Helmet will handle them.
  // Actually, let's just keep the essential styles and scripts.
  const toKeep = `
    <title>Mad Deals</title>
    <!-- Dynamic meta tags will be injected here by react-helmet-async -->
    <meta name="theme-color" content="#01075F" />
    <link data-precedence="next" href="assets/_external/cdn.cryptorefills.com/_next/static/chunks/356ko2v0ipkks.css" rel="stylesheet" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5VCSF9TEWQ"></script>
    <style>
      `;

  const newContent = content.substring(0, startIndex) + toKeep + content.substring(endIndex);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Successfully cleaned index.html');
} else {
  console.log('Could not find start or end index.');
}
