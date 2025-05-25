const db = require('croxydb');

module.exports = {
  customId: 'reset-role',
  async execute(interaction) {
    const staffRole = db.get(`staffRole_${interaction.guild.id}`);
    
    if (!staffRole) {
      return interaction.reply({
        content: 'Yetkili rolü zaten ayarlanmamış!',
        ephemeral: true
      });
    }
    
    db.delete(`staffRole_${interaction.guild.id}`);
    
    await interaction.reply({
      content: 'Yetkili rolü başarıyla sıfırlandı!',
      ephemeral: true
    });
  }
};