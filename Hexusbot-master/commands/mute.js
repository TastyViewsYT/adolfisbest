const sql = require("sqlite");
sql.open("./muteDatabase.sqlite");
const ms = require("ms");
const moment = require("moment");
require("moment-duration-format");
exports.run = function(bot, msg, args) {
  const time = args[1];
  const muteChannel = msg.guild.channels.find("name", bot.settings.muteChannelName).id;
  const user = msg.mentions.users.first() || bot.users.get(args[0]);
  if (!user) return bot.embed(msg, bot.hex, "Invalid user mention:", "Couldn't find mention or ID is invalid.");
  const mute = msg.guild.roles.find("name", bot.settings.muteRole);
  if (!mute) return bot.embed(msg, bot.hex, "Invalid Exception:", "Mute role: `Hexus-Mute` doesn't exist.");
  if (!time) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a time for the mute!");
  if (ms(time) <= 0) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a realistic time.");
  if (ms(time) > bot.settings.overflow) return bot.embed(msg, bot.hex, "Invalid Exception:", "Time overflow detected, please provide a realistic time.");
  if (Math.floor(ms(time)) <= 0) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a realistic time.");
  if (!bot.hasNumber(time)) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a time that has a number.");
  const reason = args.slice(2).join(" ");
  if (!reason) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a reason for this mute!");
  const createdTime = new Date().getTime() + ms(time);
  const convertedTime = new Date(createdTime).toString(); 
  const forTime = ms(ms(time), {long: true});

  bot.fetchMember(msg, user).then(function(member) {
    if (!member.roles.has(mute.id)) {
      sql.get(`SELECT * FROM muteDatabase WHERE userID = ${member.id}`).then(function(row) {
        if (!row) {
          sql.run("INSERT INTO muteDatabase (username, userID, guildID, unmuteDate, staffMember, reason) VALUES (?, ?, ?, ?, ?, ?)", 
          [member.user.tag, member.id, msg.guild.id, createdTime, msg.author.tag, reason]); 
          member.addRole(mute.id).then(function(member) {
            bot.embed(msg, bot.hex, "Successfully muted member:", 
            `Muted: ${member.user.tag} : [${member.id}] \nMute Time: ${forTime} \nUnmute Time: ${convertedTime} \nReason: ${reason}`);
            bot.embedID(msg, muteChannel, bot.hex, "Successfully muted member:", 
            `Muted: ${member.user.tag} : [${member.id}] \nMute Time: ${forTime} \nUnmute Time: ${convertedTime} \nReason: ${reason}`);
          });
        } else return bot.embed(msg, bot.hex, "Invalid mute attempt:", "User is in the database but somebody has removed their role, wait for their mute to expire so you can perform another mute");
      }).catch(function(error) {
        bot.embed(msg, bot.hex, "Use command again, had to create table for the database.", `\`\`\`${error.stack}\`\`\``);
        sql.run("CREATE TABLE IF NOT EXISTS muteDatabase (username TEXT, userID TEXT, guildID TEXT, unmuteDate TEXT, staffMember TEXT, reason TEXT)").then(function() {
          sql.run("INSERT INTO muteDatabase (username, userID, guildID, unmuteDate, staffMember, reason) VALUES (?, ?, ?, ?, ?, ?)", 
          [member.user.tag, member.id, msg.guild.id, createdTime, msg.author.tag, reason]);
        });
      });
    } else return bot.embed(msg, bot.hex, "Invalid Exception:", "Mentioned user is already muted.");
  }).catch(error => bot.embed(msg, bot.hex, "Error occured:", "Invalid mute specification, check your arguments for spaces."));

    var intervalCheck = setInterval(function() {
      bot.fetchMember(msg, user).then(function(member) {
        sql.get(`SELECT * FROM muteDatabase WHERE userID = ${member.id}`).then(function(row) {
          if (!row) return clearInterval(intervalCheck);
          const currentTimeInMS = new Date().getTime();
          if (row.unmuteDate < currentTimeInMS) {
            bot.embed(msg, bot.hex, "Successfully unmuted user:", 
            `Unmuted: ${row.username} : [${row.userID}]\nMute Time: ${forTime}\nReason: ${row.reason}`);
            sql.run(`DELETE FROM muteDatabase WHERE userID = ${member.id}`).catch(function(error) {
              bot.embed(msg, bot.hex, "SQL_DATABASE_ERROR:", `\`\`\`${error.stack}\`\`\``);
            });
            clearInterval(intervalCheck);
            member.removeRole(mute.id);
          }
        }).catch(error => console.error(error.stack));
      });
    }, 5000);
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
    
exports.help = {
  name: 'mute',
  description: 'Bans mentioned user with specified reason.',
  usage: 'mute [mention/id] [time] [reason]'
};