const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedRenk, embedFooter, embedThumbnail } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sıfırla')
    .setDescription('Ticket sistemi ayarlarını sıfırla')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Ticket Sistemi Sıfırlama')
      .setDescription('Aşağıdaki butonlardan sıfırlamak istediğiniz ayarı seçin.')
      .setThumbnail(embedThumbnail)
      .setFooter({ text: embedFooter });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reset-log')
          .setLabel('Log Kanalını Sıfırla')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('<:liste:1373688657008918649>'),
        new ButtonBuilder()
          .setCustomId('reset-role')
          .setLabel('Yetkili Rolünü Sıfırla')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('<:secret5:1373341177591631974>')
      );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};