const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { embedRenk, embedFooter, embedThumbnail, ticketImage } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket oluşturma sistemini ayarla')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
      option.setName('kanal')
        .setDescription('Ticket mesajının gönderileceği kanal')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)),
    
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    const ticketEmbed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Destek Talebi Oluştur')
      .setDescription('Aşağıdaki "Destek Talebini Oluştur" butonuna basarak talebini oluşturabilirsin.')
      .setImage(ticketImage)
      .setFooter({ text: embedFooter });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create-ticket')
          .setLabel('Destek talebi oluştur!')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('<:ticket_zyp:1376129270618783886>')
      );

    await channel.send({
      embeds: [ticketEmbed],
      components: [row]
    });

    await interaction.reply({
      content: `Ticket oluşturma mesajı ${channel} kanalına gönderildi!`,
      ephemeral: true
    });
  },
};