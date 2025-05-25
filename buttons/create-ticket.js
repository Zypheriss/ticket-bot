const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: 'create-ticket',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('ticket-reason-modal')
      .setTitle('Destek Talebi Oluştur');
    const reasonInput = new TextInputBuilder()
      .setCustomId('ticket-reason')
      .setLabel('Sebebini Gir')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Talep açma sebebin')
      .setRequired(true)
      .setMaxLength(1000);

    const actionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }
};