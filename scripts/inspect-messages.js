const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const tokenMatch = envFile.match(/DISCORD_BOT_TOKEN="?([^"\r\n]+)"?/);
const token = tokenMatch ? tokenMatch[1] : '';

async function test() {
  const gRes = await fetch('https://discord.com/api/v10/guilds/1456936572057423884', {
    headers: {
      Authorization: `Bot ${token}`,
      'User-Agent': 'DiscordBot (https://sanam.dev, 1.0)',
    },
  });
  const g = await gRes.json();
  console.log('Guild keys:', Object.keys(g));
  console.log('voice_states:', g.voice_states);

  // Check all members in widget
  const wRes = await fetch('https://discord.com/api/guilds/1456936572057423884/widget.json');
  const w = await wRes.json();
  console.log('Widget total members count:', w.members?.length);
  const hunter = w.members?.filter(m => m.username.toLowerCase().includes('hunter') || m.username.toLowerCase().includes('sanam'));
  console.log('Hunter/Sanam in widget:', hunter);
}

test();
