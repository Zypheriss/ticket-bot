const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('croxydb');
const { embedRenk, embedFooter, embedThumbnail } = require('../config.json');

module.exports = {
  customId: 'ticket-reason-modal',
  async execute(interaction) {
    const reason = interaction.fields.getTextInputValue('ticket-reason');
    const userId = interaction.user.id;
    
    await interaction.deferReply({ ephemeral: true });
    const hasActiveTicket = interaction.guild.channels.cache
      .filter(channel => channel.name.startsWith('talep-'))
      .some(channel => {
        const ticketData = db.get(`ticket_${channel.id}`);
        return ticketData && ticketData.userId === userId;
      });
    
    if (hasActiveTicket) {
      return interaction.editReply({
        content: '<:xicon:1375806476785942648> Zaten aktif bir destek talebiniz bulunmakta! Lütfen önce mevcut talebinizi kapatın.',
        ephemeral: true
      });
    }
    const staffRoleId = db.get(`staffRole_${interaction.guild.id}`);
    if (!staffRoleId) {
      return interaction.editReply({
        content: '<:xicon:1375806476785942648> Yetkili rolü ayarlanmamış! Önce /setup komutunu kullanın.',
        ephemeral: true
      });
    }
    
    const logChannelId = db.get(`logChannel_${interaction.guild.id}`);
    if (!logChannelId) {
      return interaction.editReply({
        content: '<:xicon:1375806476785942648> Log kanalı ayarlanmamış! Önce /setup komutunu kullanın.',
        ephemeral: true
      });
    }
    let category = interaction.guild.channels.cache.find(
      c => c.name.toLowerCase().startsWith('talepler') && c.type === ChannelType.GuildCategory
    );
    
    let activeTickets = 0;
    if (category) {
      activeTickets = interaction.guild.channels.cache.filter(
        c => c.parentId === category.id && c.name.startsWith('talep-')
      ).size;
    }
    
    if (!category) {
      category = await interaction.guild.channels.create({
        name: 'talepler',
        type: ChannelType.GuildCategory,
      });
    }
    
    await category.setName(`talepler [${activeTickets + 1}]`);
    
    const ticketChannel = await interaction.guild.channels.create({
      name: `talep-${interaction.user.username.toLowerCase()}`,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: staffRoleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.AttachFiles
          ]
        },
        {
          id: userId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.AttachFiles
          ]
        }
      ]
    });
    
    db.set(`ticket_${ticketChannel.id}`, {
      userId: userId,
      channelId: ticketChannel.id,
      guildId: interaction.guild.id,
      reason: reason,
      createdAt: Date.now(),
      messageCount: 0
    });
    
    const buttonRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close-ticket')
          .setLabel('Talebi Kapat')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('<:xicon:1375806476785942648>'),
        new ButtonBuilder()
          .setCustomId('voice-support')
          .setLabel('Sesli Destek Aç')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('<:ses:1376129496880775198>'),
        new ButtonBuilder()
          .setCustomId('add-member')
          .setLabel('Üye Ekle')
          .setStyle(ButtonStyle.Success)
          .setEmoji('<:secret5:1373341177591631974>')
      );

    await ticketChannel.send({
      content: `<@${userId}> <@&${staffRoleId}>`,
      embeds: [
        new EmbedBuilder()
          .setColor(embedRenk)
          .setTitle('Yeni bir destek talebi')
          .setThumbnail(embedThumbnail)
          .addFields(
            { name: '<:secret5:1373341177591631974> Talep Açan:', value: `<@${userId}>`, inline: true },
            { name: '<:liste:1373688657008918649> Talep Açılış Tarihi:', value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true },
            { name: '<:__:1373698038853275709> Talep Açılış Nedeni:', value: reason, inline: false }
          )
          .setFooter({ text: embedFooter })
      ],
      components: [buttonRow]
    });
    
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    if (logChannel) {
      await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedRenk)
            .setTitle('Yeni Ticket Oluşturuldu')
            .setDescription(`<@${userId}> tarafından yeni bir ticket oluşturuldu.`)
            .addFields(
              { name: 'Ticket Kanalı', value: `${ticketChannel}`, inline: true },
              { name: 'Sebep', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: embedFooter })
        ]
      });
    }
    
    await interaction.editReply({
      content: `Ticket başarıyla oluşturuldu! Lütfen ${ticketChannel} kanalına gidin.`,
      ephemeral: true
    });
  }
};