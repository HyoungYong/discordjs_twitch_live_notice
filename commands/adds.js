var fs = require('fs');

module.exports = {
	name: 'adds',
	description: '실시간 조회할 스트리머 추가',
	role: '관리자',
	args: true,
	execute(message, args) {
		var data = require('../bot_config/streamers.json');
		var streamers = data.streamers;

		var streamerInfo = new Object();
		streamerInfo.id = args[0];
		streamerInfo.live = false;
		streamerInfo.nickname = null;
		streamers.push(streamerInfo);

		fs.writeFileSync('./bot_config/streamers.json', JSON.stringify(data));
		console.log('[Streamers] add ' + streamerInfo.id);
		message.channel.send('[Streamers] add ' + streamerInfo.id);
	},
};