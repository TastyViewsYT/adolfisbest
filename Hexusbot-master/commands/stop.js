exports.run = function(bot, msg) {
  if (bot.checkBlacklist(msg)) return msg.reply("You are blacklisted from the music commands!");
  const voiceChannel = msg.member.voiceChannel ? msg.member.voiceChannel : (msg.guild.voiceConnection ? msg.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!msg.member.voiceChannel && msg.author.permLevel < 2)) {
      return bot.embed(msg, bot.hex, "Invalid command exception:", "You need to be in a voice channel to stop the music");
  }
  if (bot.playlists.has(msg.guild.id)) {
      let queue = bot.playlists.get(msg.guild.id);
      queue.queue = [];
      queue.dispatcher.end();
      bot.embed(msg, bot.hex, "Successfully stopped music:", "Stopped the music and cleared the queue");
  } else return bot.embed(msg, bot.hex, "Invalid command exception:", "No music is being played currently");

};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
  
exports.help = {
  name: 'stop',
  description: 'Stops audio playback immediately.',
  usage: 'stop'
};