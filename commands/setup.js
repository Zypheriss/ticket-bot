const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedRenk, embedFooter, embedThumbnail } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Ticket sistemini ayarla')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
  async execute(interaction) {
    const setupEmbed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Ticket Sistemi Ayarları')
      .setDescription('Aşağıdaki butonlardan ticket sistemini ayarlayabilirsiniz.')
      .addFields(
        { name: 'Log Kanalı', value: 'Ticket işlemlerinin loglanacağı kanalı seçin.', inline: true },
        { name: 'Yetkili Rolü', value: 'Ticket\'lara erişebilecek yetkili rolünü seçin.', inline: true }
      )
      .setThumbnail(embedThumbnail)
      .setFooter({ text: embedFooter });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('setup-log')
          .setLabel('Log Kanalı Seç')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('<:liste:1373688657008918649>'),
        new ButtonBuilder()
          .setCustomId('setup-role')
          .setLabel('Yetkili Rolü Seç')
          .setStyle(ButtonStyle.Success)
          .setEmoji('<:secret5:1373341177591631974>')
      );

    await interaction.reply({
      embeds: [setupEmbed],
      components: [row]
    });
  },
};