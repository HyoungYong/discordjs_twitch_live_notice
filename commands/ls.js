var fs = require('fs');


module.exports = {
	name: 'ls',
	description: '실시간 조회할 스트리머 목록',
	role: '관리자',
	execute(message, args) {
		var data = require('../bot_config/streamers.json');
		var streamers = data.streamers;

		var output = [];
		output.push(`ID\tname\tlive`);
		for (streamer of streamers) {
			output.push(`${streamer.id}\t${streamer.nickname}\t${streamer.live}`);
		}
		console.log(output.join(`\n`));

		// for (streamer in streamers) {
    //   message.channel.send(steamer);
    // }
	},
};