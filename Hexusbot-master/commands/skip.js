exports.run = function(bot, msg) {
  if (bot.checkBlacklist(msg)) return msg.reply("You are blacklisted from the music commands!");
  const vc = msg.member.voiceChannel ? msg.member.voiceChannel : (msg.guild.voiceConnection ? msg.guild.voiceConnection.channel : null);
  if (!vc || (!msg.member.voiceChannel && msg.author.permLevel < 2))
    return bot.embed(msg, bot.hex, "Invalid command exception:", "Please be in a voice channel to start this command!");

  if (bot.playlists.has(msg.guild.id)) {
    const usersInVoice = Math.floor(msg.member.voiceChannel.members.filter(m => m.user.id !== bot.user.id).size * 2 / 3);
    if (usersInVoice <= 2 || msg.author.permLevel >= 2) 
      return skipCurrentSong();
    const voteFilter = m => m.content.toLowerCase().startsWith("#vote");
    bot.embed(msg, bot.hex, "Vote to skip current song has started!", `Please say: \`#vote\` in chat, to vote to skip the song! \n\`${usersInVoice}\` votes are required!`);
    msg.channel.awaitMessages(voteFilter, {errors: ["time"], max: usersInVoice, time: 10000}).then(function(votes) {
      if (votes.size >= usersInVoice) 
        return skipCurrentSong();
    }).catch(function(votes) {
      if (votes.size === 0) 
        return bot.embed(msg, bot.hex, "Invalid skip attempt!", "No users voted to skip!");
        return returnVotedUsers(votes);
    });
  } else return bot.embed(msg, bot.hex, "Invalid skip usage:", "No music in the queue.");

  function skipCurrentSong() {
    bot.embed(msg, bot.hex, "Successfully skipping song!");
    bot.playlists.get(msg.guild.id).dispatcher.end("skip");
  }

  function returnVotedUsers(collection) {
    bot.embed(msg, bot.hex, "Skip failed:", `Only ${collection.size} out of ${usersInVoice} voted!`);
  }

};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "skip",
  description: "Skips the song that is currently playing.",
  usage: "skip"
};