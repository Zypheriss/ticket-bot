const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const db = require('croxydb');
const { embedRenk, embedFooter, embedThumbnail } = require('../config.json');

module.exports = {
  customId: 'close-ticket',
  async execute(interaction) {
    const ticketData = db.get(`ticket_${interaction.channel.id}`);
    
    if (!ticketData) {
      return interaction.reply({
        content: 'Bu kanal bir ticket kanalı değil!',
        ephemeral: true
      });
    }
    const staffRoleId = db.get(`staffRole_${interaction.guild.id}`);
    const hasStaffRole = interaction.member.roles.cache.has(staffRoleId);
    const isTicketOwner = ticketData.userId === interaction.user.id;
    
    if (!hasStaffRole && !isTicketOwner) {
      return interaction.reply({
        content: 'Bu talebi kapatma yetkiniz yok!',
        ephemeral: true
      });
    }
    
    await interaction.deferReply({ ephemeral: true });
    const logChannelId = db.get(`logChannel_${interaction.guild.id}`);
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    
    if (logChannel) {
      const transcript = await createTranscript(interaction.channel, {
        limit: -1,
        fileName: `${interaction.channel.name}-transcript.html`,
        poweredBy: false
      });
      
      const user = await interaction.client.users.fetch(ticketData.userId).catch(() => null);
      const closedBy = interaction.user;
      
      const logEmbed = new EmbedBuilder()
        .setColor(embedRenk)
        .setTitle('Talep Kapatıldı')
        .setThumbnail(embedThumbnail)
        .addFields(
          { name: 'Talep Bilgileri:', value: ' ', inline: false },
          { name: '<:secret5:1373341177591631974> Talep Açan:', value: `<@${ticketData.userId}> (${user ? user.tag : 'Bilinmiyor'})`, inline: true },
          { name: '<:liste:1373688657008918649> Talep Açılış Tarihi:', value: `<t:${Math.floor(ticketData.createdAt / 1000)}:f>`, inline: true },
          { name: '<:__:1373698038853275709> Talep Açılış Nedeni:', value: ticketData.reason || 'Belirtilmemiş', inline: false },
          { name: '<:zypheris_mesaj:1376128854028062790> Talebe Yazılan Mesaj Sayısı:', value: ticketData.messageCount ? ticketData.messageCount.toString() : 'Hiç mesaj yazılmamış', inline: true },
          { name: '<:zypheriss:1375821982414672013> Talebin Açık Kalma Süresi:', value: `${Math.floor((Date.now() - ticketData.createdAt) / 60000)} dakika ${Math.floor(((Date.now() - ticketData.createdAt) % 60000) / 1000)} saniye`, inline: true }
        )
        .setFooter({ text: `Kapatan: ${closedBy.tag} • ${embedFooter}`, iconURL: closedBy.displayAvatarURL() });
      
      await logChannel.send({
        embeds: [logEmbed],
        files: [transcript]
      });
    }
    const categoryId = interaction.channel.parentId;
    const category = interaction.guild.channels.cache.get(categoryId);
    
    if (category && category.name.includes('[')) {
      const tickets = interaction.guild.channels.cache.filter(
        c => c.parentId === categoryId && c.name.startsWith('talep-')
      );
      const activeTicketCount = tickets.size - 1;
      
      if (activeTicketCount > 0) {
        await category.setName(`talepler [${activeTicketCount}]`);
      } else {
        await category.setName('talepler');
      }
    }
    db.delete(`ticket_${interaction.channel.id}`);
    
    // Kapatılıyor mesajı
    await interaction.editReply({
      content: 'Talep kapatılıyor...',
      ephemeral: true
    });
    setTimeout(() => {
      interaction.channel.delete().catch(console.error);
    }, 2000);  // burada kanalı silmeyi geçiktiriyor 2 saniye olarka ayarladım sile basınca 2 saniye sonra algılayıp siliyor işte
  }
};