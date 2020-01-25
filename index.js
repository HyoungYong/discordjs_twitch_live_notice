const fs = require('fs');
const Discord = require('discord.js');
const config = require('./bot_config/config.json');
const Twitch = require('twitch.tv-api');
const twitch = new Twitch({
  id: '',
  secret: ''
});
const streamers = require('./bot_config/streamers.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Load Command Lists
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

function liveCheck() {
  const keys = Object.keys(streamers);

  for(const name of keys) {
    twitch.getUser(name)
      .then(data => {
        if(data.stream === null) { // 방송 중이 아닐 경우
          streamers[name].live = null;
        }
        else { // 방송 중
          if(streamers[name].live === null) { // 이미 방송공지를 한 경우
            streamers[name].live = 'live';
            const channel = data.stream.channel;
            const streamerEmbed = new Discord.RichEmbed()
              .setTitle(channel.status)
              .setURL(channel.url)
              .setAuthor(channel.display_name, channel.logo, channel.url)
              .setThumbnail(channel.logo)
              .setImage(data.stream.preview.large)
              .addField('Game', channel.game, true)
              .addField('Follwers', channel.followers, true)
              .setTimestamp();
  
              client.channels.get("670285623868915716").send(streamerEmbed);
          }
        }
      });
  }
}

// Listener event: Runs when the bot is online.
client.on('ready', async () => {
  console.log('Ready!');
  client.user.setActivity('.help', {type: 'PLAYING'});
  
  setInterval(liveCheck, 15*1000);
});

client.on('message', message => {
  const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  }

  if (command.role) { // 명령어 권한 확인
    role = message.guild.roles.find(Obj => Obj.name === command.role);
    if (!message.member.roles.has(role.id)) {
      return message.channel.send(`명령어 권한 없음, <${command.role}> 역할 필요`);
    }
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(config.token);
