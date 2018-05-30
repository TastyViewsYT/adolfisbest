exports.run = function(bot, msg) {
  if (bot.checkBlacklist(msg)) return msg.reply("You are blacklisted from the music commands!");
  const voiceChannel = msg.member.voiceChannel ? msg.member.voiceChannel : (msg.guild.voiceConnection ? msg.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!msg.member.voiceChannel && msg.author.permLevel < 2)) {
      return bot.embed(msg, bot.hex, "Invalid command exception:", "You need to be in a voice channel to resume the music");
  }
  if (!bot.playlists.get(msg.guild.id).dispatcher.paused) return bot.embed(msg, bot.hex, "Invalid command exception:", "Music stream is not paused for this guild.");
  bot.embed(msg, bot.hex, "Resuming music stream playback:", "Successfully resumed music playback.");
  bot.playlists.get(msg.guild.id).dispatcher.resume();
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
  
exports.help = {
  name: 'resume',
  description: 'Resumes audio playback for the guild.',
  usage: 'resume'
};