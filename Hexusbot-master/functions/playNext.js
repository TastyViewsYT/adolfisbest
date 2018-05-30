const Discord = require("discord.js");
const embedCheck = require("./embedPerms.js");
const yt = require("ytdl-core");
const e = require("../modules/practicalEmbeds.js");
const playNext = (msg) => {
  const thisPlaylist = msg.client.playlists.get(msg.guild.id);
  const nextSong = thisPlaylist.queue[++thisPlaylist.position];
  const dispatcher = msg.guild.voiceConnection.playStream(yt(nextSong.url, {quality:"lowest", filter:"audioonly"}), {passes: 3, volume: msg.guild.voiceConnection.volume || 0.2});
  msg.guild.voiceConnection.dispatcher.setBitrate(96);
  thisPlaylist.dispatcher = dispatcher;
  if (embedCheck(msg)) {
    e.embedWithImage(msg, e.hex, `Now playing **${nextSong.songTitle}** (${nextSong.playTime})`, `Requested by ${nextSong.requester}`, `https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`);
  } else {
    e.embed(msg, e.hex, `Now playing **${nextSong.songTitle}** (${nextSong.playTime})`, null, `https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`);
  }

  dispatcher.on("end", () => {
    if (thisPlaylist.position + 1 < thisPlaylist.queue.length) {
      playNext(msg);
    } else {
      e.embed(msg, e.hex, "Queue is finished:", "Please play more songs :D");
      msg.guild.voiceConnection.disconnect();
      msg.client.playlists.delete(msg.guild.id);
    }
  });

};
module.exports = playNext;