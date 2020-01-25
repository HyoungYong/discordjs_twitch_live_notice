var Discord = require('discord.js');

module.exports = {
	name: 'channel-info',
	description: 'Information about the arguments provided.',
	role: '개인',
  args: true,
	execute(message, args) {
		channel = message.guild.channels.find(Obj => Obj.name === args[0]);

		const channelEmbed = new Discord.RichEmbed()
			.setColor('BLACK')
			.setTitle(args[0] + '정보')
			.addField('채널 ID', channel.id)
			.setTimestamp();

		message.channel.send(channelEmbed);
	},
};