const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[UYARI] ${filePath} komut dosyasında "data" özelliği eksik.`);
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`${commands.length} adet slash komutu yükleniyor...`);

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log(`${data.length} adet slash komutu başarıyla yüklendi.`);
  } catch (error) {
    console.error(error);
  }
})();