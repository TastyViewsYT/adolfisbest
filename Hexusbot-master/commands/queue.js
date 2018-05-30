const Discord = require("discord.js");
const embedCheck = require("../functions/embedPerms.js");
exports.run = (bot, msg, args) => {
  if (bot.checkBlacklist(msg)) return msg.reply("You are blacklisted from the music commands!");
  if (!bot.playlists.has(msg.guild.id)) return bot.embed(msg, bot.hex, "Invalid queue request:", "Queue is empty.");

  let playlist = bot.playlists.get(msg.guild.id);
  playlist = playlist.queue.slice(playlist.position);

  const current = playlist.shift();
  const singular = playlist.length === 1;
  const embed = new Discord.RichEmbed();

  embed.setTitle(`Currently playing **${current.songTitle.substring(0, 50)}** (${current.playTime})`)
    .setColor(bot.hex)
    .setFooter(`Requested by ${current.requester}`, current.requesterIcon)
    .setDescription(`There ${singular ? "is" : "are"} currently ${playlist.length} song${singular ? "" : "s"} in the queue.\n`)
    .setThumbnail(`https://i.ytimg.com/vi/${current.id}/mqdefault.jpg`)
    .setTimestamp()
    .setURL(current.url);

  if (embedCheck(msg)) {
    for (let i = 0; i < playlist.length && i < 5; i++) {
      embed.addField(`🎧 ${playlist[i].songTitle.substring(0, 50)} (${playlist[i].playTime})`, `🤘 Requested by **${playlist[i].requester}**`);
    }
    msg.channel.send({embed});
  } else {
    msg.channel.send(`Currently playing **${current.songTitle.substring(0, 50)}** (${current.playTime})\n\nThere ${singular ? "is" : "are"} currently ${playlist.length} song${singular ? "" : "s"} in the queue.\n${playlist.map.size === 0 ? "" : "🎧" + playlist.map(i => "_" + i.songTitle+"_ (" + i.playTime + ") requested by **" + i.requester + "**\n🔗 <https://www.youtube.com/watch?v="+i.id+">\n").join("\n🎧 ")}`);
  }
};

exports.conf = {
  activated: true,
  aliases: ["playlist"],
  permLevel: 0
};

exports.help = {
  name: "queue",
  description: "Displays all songs in the queue.",
  usage: "queue"
};