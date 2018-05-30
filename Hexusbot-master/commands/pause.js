exports.run = function(bot, msg, args) {
  if (bot.checkBlacklist(msg)) return msg.reply("You are blacklisted from the music commands!");
  const voiceChannel = msg.member.voiceChannel ? msg.member.voiceChannel : (msg.guild.voiceConnection ? msg.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!msg.member.voiceChannel && msg.author.permLevel < 2)) {
      return bot.embed(msg, bot.hex, "Invalid command exception:", "You need to be in a voice channel to pause the stream.");
  }
  if (bot.playlists.get(msg.guild.id).dispatcher.paused) return bot.embed(msg, bot.hex, "Invalid command exception:", "Music stream is already paused for this guild.");
  bot.embed(msg, bot.hex, "Pausing music stream playback:", "Successfully paused music playback.");
  bot.playlists.get(msg.guild.id).dispatcher.pause();
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
  
exports.help = {
  name: 'pause',
  description: 'Pauses the stream within current guild.',
  usage: 'pause'
};