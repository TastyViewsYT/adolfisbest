const request = require("request");
exports.run = function(bot, msg) {
  if (msg.author.permLevel > 0)
    return msg.reply("some reason, this works.");
  msg.reply("apparently not high perms same.");
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 0
};
  
exports.help = {
  name: 'test',
  description: 'test',
  usage: 'test'
};