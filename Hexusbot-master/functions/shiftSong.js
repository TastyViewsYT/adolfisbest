const embedPermissions = require("./embedPerms.js");
const embed = require("../modules/practicalEmbeds.js");
const ytdl = require("ytdl-core");

const shiftSong = function(msg) {
  const currentPlaylist = msg.client.playlists.get(msg.guild.id);
  const nextSong = currentPlaylist.queue[++currentPlaylist.position];
  const dispatcher = msg.guild.voiceConnection.playStream(ytdl(nextSong.url, {quality:"lowest", filter:"audioonly"}), {passes: 3, volume: msg.guild.voiceConnection.volume || 0.2});

  msg.guild.voiceConnection.dispatcher.setBitrate(96);
  currentPlaylist.dispatcher = dispatcher;

  if (embedPermissions(msg)) {
    embed.embedWithImage(msg, e.hex, `Now playing **${nextSong.songTitle}** (${nextSong.playTime})`, `Requested by ${nextSong.requester}`, `https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`);
  } else {
    msg.channel.send(`Now playing **${nextSong.songTitle}** (${nextSong.playTime})`, null, `https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`);
  }

  dispatcher.on("end", function() {
    if (currentPlaylist.position + 1 < currentPlaylist.queue.length) {
      shiftSong(msg);
    } else {
      msg.channel.send("Queue is empty, play again soon!");
      msg.guild.voiceConnection.disconnect();
      msg.client.playlists.delete(msg.guild.id);
    }
  });
}

module.exports = shiftSong;
