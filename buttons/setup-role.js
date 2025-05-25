const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { embedRenk, embedFooter } = require('../config.json');

module.exports = {
  customId: 'setup-role',
  async execute(interaction) {
    const guild = interaction.guild;
    const roles = guild.roles.cache
      .filter(role => !role.managed && role.id !== guild.id)
      .sort((a, b) => b.position - a.position);
    const roleOptions = roles.first(25).map(role => {
      return {
        label: role.name,
        value: role.id,
        description: `${role.name} rolü`,
      };
    });
    
    if (roleOptions.length === 0) {
      return interaction.reply({
        content: 'Sunucuda hiç rol bulunamadı!',
        ephemeral: true
      });
    }
    
    const embed = new EmbedBuilder()
      .setColor(embedRenk)
      .setTitle('Yetkili Rolü Seçimi')
      .setDescription('Aşağıdaki menüden yetkili rolünü seçin.')
      .setFooter({ text: embedFooter });
    
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select-staff-role')
          .setPlaceholder('Yetkili rolünü seçin')
          .addOptions(roleOptions)
      );
    
    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};