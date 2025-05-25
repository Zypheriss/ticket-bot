const { ChannelType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { embedRenk, embedFooter } = require('../config.json');

module.exports = {
  customId: 'setup-log',
  async execute(interaction) {
    const guild = interaction.guild;
    const textChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
    const channelOptions = textChannels.first(25).map(channel => {
      return {
        label: channel.name,
        value: channel.id,
        description: `#${channel.name}`,
      };
    });
    
    if (channelOptions.length === 0) {
      return interaction.reply({
        content: 'Sunucuda hiç metin kanalı bulunamadı!',
        ephemeral: true
      });
    }
    
    const embed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Log Kanalı Seçimi')
      .setDescription('Aşağıdaki menüden log kanalını seçin.')
      .setFooter({ text: embedFooter });
    
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select-log-channel')
          .setPlaceholder('Log kanalını seçin')
          .addOptions(channelOptions)
      );
    
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};