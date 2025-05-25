const db = require('croxydb');

module.exports = {
  customId: 'reset-log',
  async execute(interaction) {
    const logChannel = db.get(`logChannel_${interaction.guild.id}`);
    
    if (!logChannel) {
      return interaction.reply({
        content: 'Log kanalı zaten ayarlanmamış!',
        ephemeral: true
      });
    }
    
    db.delete(`logChannel_${interaction.guild.id}`);
    
    await interaction.reply({
      content: 'Log kanalı başarıyla sıfırlandı!',
      ephemeral: true
    });
  }
};