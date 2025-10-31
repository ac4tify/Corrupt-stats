const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

// Creează clientul
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// TOKEN-ul botului
const TOKEN = process.env.TOKEN; // adaugă în Railway la Variables
const DEFAULT_USER_ID = '12345678'; // înlocuiește cu ID-ul tău Injuries dacă e fix

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content === '!stats') {
    try {
      // Preia datele de la API
      const response = await fetch(`https://api.injuries.lu/v1/public/user?userId=${DEFAULT_USER_ID}`);
      const data = await response.json();

      // Extrage statistici (fallback dacă lipsesc)
      const stats = data.user?.stats || {};
      const username = data.user?.username || message.author.username;

      const hits = stats.hits ?? 0;
      const visits = stats.visits ?? 0;
      const clicks = stats.clicks ?? 0;
      const summaryBig = data.user?.biggestHitsSummary ?? 108;
      const rapBig = data.user?.biggestHitsRap ?? 0;
      const robuxBig = data.user?.biggestHitsRobux ?? 1;
      const summaryTotal = data.user?.totalHitSummary ?? 0;
      const rapTotal = data.user?.totalHitRap ?? 0;
      const robuxTotal = data.user?.totalHitRobux ?? 0;

      // Emojiurile
      const emojiStatic = '<:customemoji:1433659663160971414>';
      const emojiAnimated = '<a:coolanimation:1433659816466714624>';

      // Embed-ul frumos
      const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setAuthor({
          name: `─── NORMAL INFO ───`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `${emojiStatic} **User:** ${username}\n\n` +
          `${emojiStatic} **TOTAL STATS:**\n` +
          `Hits:     ${hits}\n` +
          `Visits:   ${visits}\n` +
          `Clicks:   ${clicks}\n\n` +
          `${emojiStatic} **BIGGEST HITS:**\n` +
          `Summary:  ${summaryBig}\n` +
          `RAP:      ${rapBig}\n` +
          `Robux:    ${robuxBig}\n\n` +
          `${emojiStatic} **TOTAL HIT STATS:**\n` +
          `Summary:  ${summaryTotal}\n` +
          `RAP:      ${rapTotal}\n` +
          `Robux:    ${robuxTotal}\n\n` +
          `${emojiAnimated} **Injuries.lu API Data**`
        )
        .setImage('https://i.pinimg.com/originals/0e/b0/51/0eb051ba6b5cfe9cbfdc3ca92f20c87c.gif')
        .setFooter({ text: 'Injuries.lu • Stats Command' });

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply('❌ Error fetching stats from API.');
    }
  }
});

client.login(TOKEN);
