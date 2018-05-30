const serializer = require("../modules/Serial.js");
exports.run = function(bot, msg) {
  serializer.beginProcess(msg.guild);
  bot.embed(msg, bot.hex, "Successfully saved guild.", "You can now use the guild create function.");
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 10
};
  
exports.help = {
  name: 'copyguild',
  description: 'Saves current guild as JSON data.',
  usage: 'copyguild'
};