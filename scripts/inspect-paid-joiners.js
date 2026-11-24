const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const tokenMatch = envFile.match(/DISCORD_BOT_TOKEN="?([^"\r\n]+)"?/);
const token = tokenMatch ? tokenMatch[1] : '';

async function test() {
  const gRes = await fetch('https://discord.com/api/v10/guilds/1456936572057423884/channels', {
    headers: {
      Authorization: `Bot ${token}`,
      'User-Agent': 'DiscordBot (https://sanam.dev, 1.0)',
    },
  });
  const channels = await gRes.json();
  const paid = channels.find(c => c.name.includes('paid-joiners'));
  console.log('Paid joiners channel:', paid?.id, paid?.name);

  if (paid) {
    const rawRes = await fetch(`https://discord.com/api/v10/channels/${paid.id}/messages?limit=5`, {
      headers: {
        Authorization: `Bot ${token}`,
        'User-Agent': 'DiscordBot (https://sanam.dev, 1.0)',
      },
    });
    const raw = await rawRes.json();
    console.log('Raw message from Discord API:');
    console.log(JSON.stringify(raw[0], null, 2));

    const apiRes = await fetch(`http://localhost:3005/api/discord/messages?channelId=${paid.id}`);
    const apiData = await apiRes.json();
    console.log('API processed message:');
    console.log(JSON.stringify(apiData.messages[0], null, 2));
  }
}

test();
