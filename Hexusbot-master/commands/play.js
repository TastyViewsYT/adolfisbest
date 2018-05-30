const Discord = require("discord.js");
const embed = new Discord.RichEmbed();
const embedCheck = require("../functions/embedPerms.js");
const playNext = require("../functions/playNext.js");
const ytapi = require("simple-youtube-api");
const { parse } = require("url");
const youtube = new ytapi(require("../configuration/settings.js").youtubeAPIKey);
exports.run = async (bot, msg, args) => {
  if (bot.checkBlacklist(msg)) return msg.reply("You are blacklisted from the music commands!");
  const voiceChannel = msg.member.voiceChannel ? msg.member.voiceChannel : (msg.guild.voiceConnection ? msg.guild.voiceConnection.channel : null);
  if (!voiceChannel || (!msg.member.voiceChannel && msg.author.permLevel < 2)) {
    return bot.embed(msg, bot.hex, "Invalid command exception:", "You need to be in a voice channel to play a song.");
  }

  if (msg.member.voiceChannel.name != "Music") return; 
  const song = args.join(" ");
  if (!song.length) return bot.embed(msg, bot.hex, "Invalid song argument:", "You need to supply a youtube URL or a search term to play a song.");
  const playlist = "&list="
  if (song.includes(playlist.toLowerCase())) return bot.embed(msg, bot.hex, "Invalid song request:", "Playlist support will soon be added.");

  if (!bot.playlists.has(msg.guild.id)) {
    var firstSong = true;
    bot.playlists.set(msg.guild.id, {
      dispatcher: null,
      queue: [],
      connection: null,
      position: -1
    });
    await voiceChannel.join();
  }

  let id = (() => {
    const parsed = parse(song, true);
    if (/^(www\.)?youtube\.com/.test(parsed.hostname)) {
      return parsed.query.v;
    } else if (/^(www\.)?youtu\.be/.test(parsed.hostname)) {
      return parsed.pathname.slice(1);
    }
  })();

  if (!id) {
    const results = await youtube.searchVideos(song, 4);
    id = results[0].id;
  }

  let info;
  try {
    info = await youtube.getVideoByID(id);
  } catch (e) {
    return msg.channel.send(`\`An error occurred: ${e}\``);
  }

  if (msg.author.permLevel < 2 && parseInt(info.durationSeconds) > 900) return msg.reply("Songs can be no longer than 15 minutes.").catch(console.error);
  const time = parseInt(info.durationSeconds, 10);
  const minutes = Math.floor(time / 60);

  let seconds = time % 60;

  if (seconds < 10) seconds = "0" + seconds;
  bot.playlists.get(msg.guild.id).queue.push({
    url: `https://www.youtube.com/watch?v=${info.id}`,
    id: info.id,
    channName: info.channel.title,
    songTitle: info.title,
    playTime: `${minutes}:${seconds}`,
    playTimeSeconds: info.durationSeconds,
    requester: msg.guild.member(msg.author).displayName,
    requesterIcon: msg.author.avatarURL
  });

  if (firstSong) {
    playNext(msg);
  } else {
    embed
      .setTitle(`**${info.title}** (${minutes}:${seconds}) has been added to the queue.`)
      .setColor(bot.hex)
      .setFooter(`Requested by ${msg.guild.member(msg.author).displayName}`, msg.author.avatarURL)
      .setImage(`https://i.ytimg.com/vi/${info.id}/mqdefault.jpg`)
      .setTimestamp()
      .setURL(`https://www.youtube.com/watch?v=${info.id}`);
    if (embedCheck(msg)) {
      msg.channel.send({embed}).catch(console.error);
    } else {
      msg.channel.send(`**${info.title}** (${minutes}:${seconds}) has been added to the queue.`);
    }
  }
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "play",
  description: "Plays a specified youtube URL or search term.",
  usage: "play [YouTube Video URL] or [Search Term]"
};