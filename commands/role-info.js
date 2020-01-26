var Discord = require('discord.js');

module.exports = {
	name: 'role-info',
	description: 'Information about the arguments provided.',
	role: '관리자',
  args: true,
	execute(message, args) {
		var data = null;
		var role = null;

		if (args[0].startsWith('<')) {
			const start = 3;
			const end = args[0].length - 1;

			data = args[0].slice(start, end);
			role = message.guild.roles.get(data);
		}
		else {
			data = args[0]
			role = message.guild.roles.find(Obj => Obj.name === data);
		}

		const channelEmbed = new Discord.RichEmbed()
			.setColor('BLACK')
      .setTitle('role-info 조회결과')
      .addField('역할명', role.name, true)
			.addField('역할 ID', role.id, true)
			.setFooter(message.author.tag + "이 요청함");

		message.channel.send(channelEmbed);
		// console.log(message.author.username);
	},
};