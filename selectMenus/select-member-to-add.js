const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('croxydb');
const { embedRenk, embedFooter } = require('../config.json');

module.exports = {
  customId: 'select-member-to-add',
  async execute(interaction) {
    const memberId = interaction.values[0];
    const member = await interaction.guild.members.fetch(memberId).catch(() => null);
    
    if (!member) {
      return interaction.update({
        content: 'Seçilen üye bulunamadı!',
        components: [],
        ephemeral: true
      });
    }
    const ticketData = db.get(`ticket_${interaction.channel.id}`);
    if (!ticketData) {
      return interaction.update({
        content: '<:xicon:1375806476785942648> Bu kanal bir ticket kanalı değil!',
        components: [],
        ephemeral: true
      });
    }
    const hasAccess = interaction.channel.permissionsFor(member).has(PermissionsBitField.Flags.ViewChannel);
    if (hasAccess) {
      return interaction.update({
        content: `${member.user.tag} zaten bu talebe erişimi var!`,
        components: [],
        ephemeral: true
      });
    }
    await interaction.channel.permissionOverwrites.create(member, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true
    });
    const embed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Üye Eklendi')
      .setDescription(`${member} başarıyla talebe eklendi.`)
      .setFooter({ text: embedFooter });
    
    await interaction.update({
      embeds: [embed],
      components: [],
      ephemeral: true
    });
    await interaction.channel.send({
      content: `${member} talebe eklendi by ${interaction.user}`,
    });
  }
};