var Discord = require('discord.js');

module.exports = {
	name: 'channel-info',
	description: 'Information about the arguments provided.',
	role: '관리자',
  args: true,
	execute(message, args) {
		var data = null;
		var channel = null;

		if (args[0].startsWith('<')) {
			const start = 2;
			const end = args[0].length - 1;

			data = args[0].slice(start, end);
			channel = message.guild.channels.get(data);
		}
		else {
			data = args[0]
			channel = message.guild.channels.find(Obj => Obj.name === data);
		}

		const channelEmbed = new Discord.RichEmbed()
			.setColor('BLACK')
			.setTitle('channel-info 조회결과')
			.addField('채널명', channel.name, true)
			.addField('채널 ID', channel.id, true)
			.setFooter(message.author.tag + "이 요청함");

		message.channel.send(channelEmbed);
		// console.log(message.author.username);
	},
};