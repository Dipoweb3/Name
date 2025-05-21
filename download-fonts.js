const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  {
    name: 'Inter-Regular.ttf',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.woff2'
  },
  {
    name: 'Inter-Bold.ttf',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.woff2'
  }
];

fonts.forEach(font => {
  const file = fs.createWriteStream(path.join('assets', font.name));
  https.get(font.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${font.name}`);
    });
  }).on('error', err => {
    fs.unlink(path.join('assets', font.name));
    console.error(`Error downloading ${font.name}:`, err.message);
  });
}); 