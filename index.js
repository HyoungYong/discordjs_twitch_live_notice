const fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");
const Discord = require('discord.js');
const config = require('./bot_config/config.json');
const Twitch = require('twitch.tv-api');
const twitch = new Twitch({
  id: config.twitch_id,
  secret: config.twitch_secret
});

let wroteUpdates = require('./r6updates.json');

let client = new Discord.Client();
client.commands = new Discord.Collection();

// Load Command Lists
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const log = console.log
async function liveCheck() {
  var data = require('./bot_config/streamers.json');
  var streamers = data.streamers;

  const keys = streamers.keys();
  for (var key of keys) {
    // 스트리머 방송 확인
    const twitchData = await twitch.getUser(streamers[key].id);
    if (twitchData.stream) {
      // log('O')
      if (streamers[key].live) {
        // log('방송 O 공지 O ' + streamers[key].id);
        // 이미 방송공지를 한 경우 do nothing
      }
      else {
        // log('방송 O 공지 X ' + streamers[key].id);
        // 방송 공지를 안 한 경우
        var streamerinfo = twitchData.stream.channel;
        streamers[key].live = true;
        streamers[key].nickname = streamerinfo.display_name;
        
        var streamerEmbed = new Discord.RichEmbed()
          .setTitle(streamerinfo.status)
          .setURL(streamerinfo.url)
          .setAuthor(streamerinfo.display_name, streamerinfo.logo, streamerinfo.url)
          .setThumbnail(streamerinfo.logo)
          .setImage(twitchData.stream.preview.large)
          .addField('Game', streamerinfo.game, true)
          .addField('Follwers', streamerinfo.followers, true)
          .setTimestamp();
          
        await client.channels.get("653941859391111189").send(streamerEmbed);
        await fs.writeFileSync('./bot_config/streamers.json', JSON.stringify(data));
      }
    }
    else {
      // log('방송 X ' + streamers[key].id);
      // log('X')
      streamers[key].live = false;
      await fs.writeFileSync('./bot_config/streamers.json', JSON.stringify(data));
    }
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
        title: $(this).find('h2.updatesFeed__item__wrapper__content__title').text(),
        subtitle: $(this).find('p.updatesFeed__item__wrapper__content__abstract').text(),
        imgURL: $(this).find('div.updatesFeed__item__wrapper__media img').attr('src'),
        URL: 'https://www.ubisoft.com' + $(this).attr('href'),
        year: $(this).find('span.date__year').text(),
        month: $(this).find('span.date__month').text(),
        day: $(this).find('span.date__day').text()
      };
    });
  
    const newestUpdate = urlList[0]
    if (newestUpdate.title !== wroteUpdates.title) {
      fs.writeFileSync('./r6updates.json', JSON.stringify(newestUpdate));
        const streamerEmbed = new Discord.RichEmbed()
          .setTitle(newestUpdate.title)
          .setURL(newestUpdate.URL)
          .setDescription(newestUpdate.subtitle)
          .setImage(newestUpdate.imgURL)
          .setFooter(newestUpdate.year + '년 ' + newestUpdate.month + '월 ' + newestUpdate.day + '일');

      console.log('new update posted')
      client.channels.get("670285623868915716").send(streamerEmbed);
    }
  } catch (error) {
    console.error(error);
  }
};

// Listener event: Runs when the bot is online.
client.on('ready', async () => {
  console.log('Ready!');
  client.user.setActivity('.help', {type: 'PLAYING'});
  
  // getHtml();
  // liveCheck();
  
  await setInterval(getHtml, 300*1000);
  await setInterval(liveCheck, 60*1000);
});

client.on('message', async (message) => {
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
    const res = await command.execute(message, args);
    // console.log(res)
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(config.token);