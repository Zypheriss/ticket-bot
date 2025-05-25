const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot başarıyla giriş yaptı: ${client.user.tag}`);
    
    client.user.setPresence({
      activities: [{ name: 'zypheris', type: ActivityType.Watching }],
      status: 'dnd',
    });
  },
};