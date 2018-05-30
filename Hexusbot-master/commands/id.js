exports.run = function(bot, msg) {
  bot.embedDM(msg, msg.author.id, bot.hex, "Successfully fetched ID:", `${msg.author.tag} your id is: ${msg.author.id}`);
  bot.embed(msg, bot.hex, "Successfully sent ID:", "Sent your discord user ID to your DM's.");
}

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 0
};
  
exports.help = {
  name: 'id',
  description: 'Fetches ID of current user and sends it to them.',
  usage: 'id'
};