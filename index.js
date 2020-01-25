const fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");
const Discord = require('discord.js');
const config = require('./bot_config/config.json');
const Twitch = require('twitch.tv-api');
const twitch = new Twitch({
  id: '',
  secret: ''
});
const streamers = require('./bot_config/streamers.json');
const wroteUpdates = require('./r6updates.json');

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
          if(!streamers[name].live) { // 이미 방송공지를 한 경우
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

const getHtml = async () => {
  try {
    html = await axios.get("https://www.ubisoft.com/ko-kr/game/rainbow-six/siege/news-updates");

    const urlList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.updatesFeed__items").children("a.updatesFeed__item");

    $bodyList.each(function(i, e) {
      urlList[i] = {
        "title": $(this).find('h2.updatesFeed__item__wrapper__content__title').text(),
        "subtitle": $(this).find('p.updatesFeed__item__wrapper__content__abstract').text(),
        "imgURL": $(this).find('div.updatesFeed__item__wrapper__media img').attr('src'),
        "URL": 'https://www.ubisoft.com' + $(this).attr('href'),
        "year": $(this).find('span.date__year').text(),
        "month": $(this).find('span.date__month').text(),
        "day": $(this).find('span.date__day').text()
      };
    });

    const newestUpdate = urlList[0]
    if (newestUpdate.title !== wroteUpdates.title) {
      fs.writeFile('./r6updates.json', JSON.stringify(newestUpdate), function(err) {
        const streamerEmbed = new Discord.RichEmbed()
          .setTitle(newestUpdate.title)
          .setURL(newestUpdate.URL)
          .setDescription(newestUpdate.subtitle)
          .setImage(newestUpdate.imgURL)
          .setFooter(newestUpdate.year + '년 ' + newestUpdate.month + '월 ' + newestUpdate.day + '일');

        console.log('new update posted')
        client.channels.get("670285623868915716").send(streamerEmbed);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// Listener event: Runs when the bot is online.
client.on('ready', async () => {
  console.log('Ready!');
  client.user.setActivity('.help', {type: 'PLAYING'});
  
  getHtml();
  
  // setInterval(getHtml, 10*1000);

  // setInterval(liveCheck, 60*1000);
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
