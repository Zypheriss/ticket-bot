const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');
const { embedRenk, embedFooter } = require('../config.json');

module.exports = {
  customId: 'add-member',
  async execute(interaction) {
    const ticketData = db.get(`ticket_${interaction.channel.id}`);
    
    if (!ticketData) {
      return interaction.reply({
        content: 'Bu kanal bir ticket kanalı değil!',
        ephemeral: true
      });
    }
    const staffRoleId = db.get(`staffRole_${interaction.guild.id}`);
    if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({
        content: 'Talebe üye ekleme yetkiniz yok!',
        ephemeral: true
      });
    }
    const members = await interaction.guild.members.fetch({ limit: 100 });
    const filteredMembers = members
      .filter(member => !member.user.bot && member.id !== ticketData.userId)
      .first(25);
    
    if (filteredMembers.length === 0) {
      return interaction.reply({
        content: 'Eklenecek üye bulunamadı!',
        ephemeral: true
      });
    }
    
    const memberOptions = filteredMembers.map(member => {
      return {
        label: member.user.username,
        value: member.id,
        description: `${member.user.tag}`,
      };
    });
    
    const embed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Talebe Üye Ekle')
      .setDescription('Aşağıdaki menüden talebe eklemek istediğiniz üyeyi seçin.')
      .setFooter({ text: embedFooter });
    
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select-member-to-add')
          .setPlaceholder('Eklenecek üyeyi seçin')
          .addOptions(memberOptions)
      );
    
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};