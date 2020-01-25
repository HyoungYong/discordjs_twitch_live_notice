var fs = require('fs');
var streamers = require('../bot_config/streamers.json');

module.exports = {
  name: 'dels',
  role: '관리자',
	description: '실시간 조회할 스트리머 삭제',
	execute(message, args) {
    delete streamers[args[0]];
    
		fs.writeFile('./bot_config/streamers.json', JSON.stringify(streamers), function(err) {
			if (err) throw err;
			console.log('[Streamer] ' + args[0] + ' deleted');
		});
	},
};