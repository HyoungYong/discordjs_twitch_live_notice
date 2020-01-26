var fs = require('fs');


module.exports = {
  name: 'dels',
	description: '실시간 조회할 스트리머 삭제',
	role: '관리자',
  args: true,
	execute(message, args) {
		var data = require('../bot_config/streamers.json');
		var streamers = data.streamers;

		const keys = streamers.keys();
		for (const key of keys) {
			if (streamers[key].id === args[0]) {
				streamers.splice(key, 1);
			}
		}

		fs.writeFileSync('./bot_config/streamers.json', JSON.stringify(data));
	},
};