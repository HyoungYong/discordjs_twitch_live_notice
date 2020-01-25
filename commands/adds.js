var fs = require('fs');
var streamers = require('../bot_config/streamers.json');

module.exports = {
	name: 'adds',
	description: '실시간 조회할 스트리머 추가',
	role: '개인',
	args: true,
	execute(message, args) {
		streamers[args[0]] = {
			'live': true
		}
		
		fs.writeFile('./bot_config/streamers.json', JSON.stringify(streamers), function(err) {
			if (err) throw err;
			console.log('[Streamer] ' + args[0] + ' added');
			message.channel.send('[Streamer] ' + args[0] + ' added');
		});
	},
};