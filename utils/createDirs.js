const fs = require('node:fs');
const path = require('node:path');
const directories = [
  'commands',
  'events',
  'buttons',
  'selectMenus',
  'modals',
  'utils'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log(`${dir} klasörü oluşturuldu.`);
  }
});

console.log('Tüm klasörler kontrol edildi ve gerekirse oluşturuldu.');