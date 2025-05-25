const { InteractionType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`${interaction.commandName} adlı komut bulunamadı.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'Komut çalıştırılırken bir hata oluştu!',
          ephemeral: true
        }).catch(console.error);
      }
    }
    else if (interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId);
      
      if (!button) return;
      
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'Buton işlenirken bir hata oluştu!',
          ephemeral: true
        }).catch(console.error);
      }
    }
    else if (interaction.isStringSelectMenu()) {
      const selectMenu = interaction.client.selectMenus.get(interaction.customId);
      
      if (!selectMenu) return;
      
      try {
        await selectMenu.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'Select menu işlenirken bir hata oluştu!',
          ephemeral: true
        }).catch(console.error);
      }
    }
    else if (interaction.type === InteractionType.ModalSubmit) {
      const modal = interaction.client.modals.get(interaction.customId);
      
      if (!modal) return;
      
      try {
        await modal.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'Form işlenirken bir hata oluştu!',
          ephemeral: true
        }).catch(console.error);
      }
    }
  },
};