const { ChannelType, PermissionsBitField } = require('discord.js');
const db = require('croxydb');

module.exports = {
  customId: 'voice-support',
  async execute(interaction) {
    const ticketData = db.get(`ticket_${interaction.channel.id}`);
    
    if (!ticketData) {
      return interaction.reply({
        content: 'Bu kanal bir ticket kanalı değil!',
        ephemeral: true
      });
    }
    const existingVoiceChannel = db.get(`voiceChannel_${interaction.channel.id}`);
    if (existingVoiceChannel) {
      const channel = interaction.guild.channels.cache.get(existingVoiceChannel);
      if (channel) {
        await channel.delete();
        db.delete(`voiceChannel_${interaction.channel.id}`);
        await interaction.message.edit({
          components: interaction.message.components.map(row => {
            row.components = row.components.map(button => {
              if (button.customId === 'voice-support') {
                button.data.label = 'Sesli Destek Aç';
              }
              return button;
            });
            return row;
          })
        });
        
        return interaction.reply({
          content: 'Sesli destek kanalı kapatıldı!',
          ephemeral: true
        });
      }
    }
    const user = await interaction.client.users.fetch(ticketData.userId).catch(() => null);
    if (!user) {
      return interaction.reply({
        content: 'Talep sahibi bulunamadı!',
        ephemeral: true
      });
    }
    const staffRoleId = db.get(`staffRole_${interaction.guild.id}`);
    if (!staffRoleId) {
      return interaction.reply({
        content: 'Yetkili rolü ayarlanmamış!',
        ephemeral: true
      });
    }
    const voiceChannel = await interaction.guild.channels.create({
      name: `seslidestek-${user.username.toLowerCase()}`,
      type: ChannelType.GuildVoice,
      parent: interaction.channel.parent,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: staffRoleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.Speak
          ]
        },
        {
          id: ticketData.userId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.Speak
          ]
        }
      ]
    });
    db.set(`voiceChannel_${interaction.channel.id}`, voiceChannel.id);
    await interaction.message.edit({
      components: interaction.message.components.map(row => {
        row.components = row.components.map(button => {
          if (button.customId === 'voice-support') {
            button.data.label = 'Sesli Desteği Kapat';
          }
          return button;
        });
        return row;
      })
    });
    
    await interaction.reply({
      content: `Sesli destek kanalı oluşturuldu: ${voiceChannel}`,
      ephemeral: true
    });
  }
};