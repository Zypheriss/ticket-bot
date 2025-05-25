const { EmbedBuilder } = require('discord.js');
const db = require('croxydb');
const { embedRenk, embedFooter } = require('../config.json');

module.exports = {
  customId: 'select-staff-role',
  async execute(interaction) {
    const roleId = interaction.values[0];
    const role = interaction.guild.roles.cache.get(roleId);
    
    if (!role) {
      return interaction.update({
        content: 'Seçilen rol bulunamadı!',
        components: [],
        ephemeral: true
      });
    }
    db.set(`staffRole_${interaction.guild.id}`, roleId);
    
    const embed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Yetkili Rolü Ayarlandı')
      .setDescription(`<:zypheriss:1375821982414672013> Yetkili rolü başarıyla ${role} olarak ayarlandı.`)
      .setFooter({ text: embedFooter });
    
    await interaction.update({
      embeds: [embed],
      components: [],
      ephemeral: true
    });
  }
};