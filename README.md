# Discord.js v14 Ticket Bot

Bu bot Discord.js v14 kullanılarak geliştirilmiş bir ticket (destek talebi) botudur. Slash komutlar kullanarak kurulum yapabilir ve talep sistemini yönetebilirsiniz.

## Özellikler

- `/setup` komutu ile log kanalı ve yetkili rolü belirleme
- `/ticket` komutu ile istediğiniz kanala talep oluşturma mesajı gönderme
- kanala üye ekleme
- sesli destek oluşturma
- transcipt ile html dönüşmüş gelişmiş loglama
- Kullanıcı dostu arayüz

## Kurulum

1. `config.json` dosyasını düzenleyin:
   - `token`: Discord bot token'ınızı ekleyin
   - `clientId`: Bot kullanıcı ID'nizi ekleyin

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. Slash komutları kaydedin:
   ```
   node deploy-commands.js
   ```

4. Botu başlatın:
   ```
   node index.js
   ```

## Kullanım

1. `/setup` komutunu kullanarak log kanalı ve yetkili rolünü ayarlayın
2. `/ticket` komutunu kullanarak ticket mesajının gönderileceği kanalı seçin
3. Kullanıcılar "Destek talebi oluştur" butonuna tıklayarak ticket oluşturabilirler

## Teknik Detaylar

- Discord.js v14 kullanılmıştır
- croxydb veritabanı kullanılmıştır
- discord-html-transcripts paketi ile talep dökümü oluşturulmaktadır


# Botun Örnek görselleri sadece 2 görseli bıraktım bir sürü şey vardır botta

![zypheris](./zyp/ticket.png) 


![zypheris](./zyp/ticket-log.png) 


## 📞 İletişim & Destek
[![Discord](https://img.shields.io/badge/ZYPHERİS-DİSCORD-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/773582512647569409)
### 🌍 **Bize Ulaşın**
Botla ilgili soru ve destek için:

[![Discord](https://img.shields.io/badge/DISCORD-SUNUCUMUZ-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/sxWz2fayFa)
[![Zypheris instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/ilwixi7)
