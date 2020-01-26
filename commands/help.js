const Discord = require('discord.js');
const { prefix } = require('../bot_config/config.json');

module.exports = {
	name: 'help',
	description: '사용가능한 모든 명령어',
	aliases: ['commands'],
  usage: '[command name]',
  role: '관리자',
  cooldown: 5,
	execute(message, args) {
    const data = [];
    const { commands } = message.client;

    // help 명령어만 쳤을 경우
    if (!args.length) {
      const helpEmbed = new Discord.RichEmbed()
        .setColor('ORANGE')
        .setTitle('사용가능한 모든 명령어')
        .addField('.adds 스트리머ID', '실시간 감시당할 스트리머 지정')
        .addField('.dels 스트리머ID', '감시중인 스트리머 해제')
        .addField('.role-info 역할태그', '역할ID 확인')
        .addField('.channel-info 채널태그', '채널ID 확인');

      return message.channel.send(helpEmbed)
    }
	}
};