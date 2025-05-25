const { EmbedBuilder } = require('discord.js');
const db = require('croxydb');
const { embedRenk, embedFooter } = require('../config.json');

module.exports = {
  customId: 'select-log-channel',
  async execute(interaction) {
    const channelId = interaction.values[0];
    const channel = interaction.guild.channels.cache.get(channelId);
    
    if (!channel) {
      return interaction.update({
        content: 'Seçilen kanal bulunamadı!',
        components: [],
        ephemeral: true
      });
    }
    db.set(`logChannel_${interaction.guild.id}`, channelId);
    
    const embed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Log Kanalı Ayarlandı')
      .setDescription(`<:zypheriss:1375821982414672013> Log kanalı başarıyla ${channel} olarak ayarlandı.`)
      .setFooter({ text: embedFooter });
    
    await interaction.update({
      embeds: [embed],
      components: [],
      ephemeral: true
    });
  }
};