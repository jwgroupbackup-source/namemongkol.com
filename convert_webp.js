const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'public/images/convert';

const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));
console.log('Found:', files.length, 'PNG files\n');

Promise.all(
  files.map(f => {
    const input = path.join(dir, f);
    const outName = f.replace(/\.png$/i, '.webp');
    const output = path.join(dir, outName);
    return sharp(input)
      .webp({ quality: 85 })
      .toFile(output)
      .then(info => {
        const kb = Math.round(info.size / 1024);
        console.log('✅', f, '->', outName, '(' + kb + ' KB)');
      });
  })
)
.then(() => console.log('\nDone! All files converted.'))
.catch(e => console.error('❌ Error:', e));
