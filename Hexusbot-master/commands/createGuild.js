const creator = require("../modules/Create.js");
exports.run = function(bot, msg) {
  creator.beginProcess(msg.guild, "438940253903126540");
}

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 10
};
  
exports.help = {
  name: 'createguild',
  description: 'Creates guild from JSON data.',
  usage: 'createguild'
};