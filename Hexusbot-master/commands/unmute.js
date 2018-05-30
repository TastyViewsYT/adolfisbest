const ms = require("ms");
const sql = require("sqlite");
sql.open("./muteDatabase.sqlite");
exports.run = function(bot, msg) {
  const user = msg.mentions.users.first();
  if (!user) return bot.embed(msg, bot.hex, "Invalid user mention:", "Please mention a user to unmute them");
  const mute = msg.guild.roles.find("name", "Hexus-Mute");
  if (!mute) return bot.embed(msg, bot.hex, "Invalid Unmute:", "The `Hexus-Mute` role doesn't exist.");
  bot.fetchMember(msg, user).then(function(member) {
    sql.get(`SELECT * FROM muteDatabase WHERE userID = ${member.id}`).then(function(row) {
      if (!row && member.roles.has(mute.id)) {
          member.removeRole(mute.id);
          bot.embed(msg, bot.hex, "Successfully unmuted user.", "They weren't in the database, but had the mute role so I removed that.");
          return;
      }
      if (!row) return bot.embed(msg, bot.hex, "Invalid unmute:", "User is not in the database.");
      sql.run(`DELETE FROM muteDatabase WHERE userID = ${member.id}`).catch(function(error) {
        return bot.embed(msg, bot.hex, "SQL_DATABASE_ERROR:", `\`\`\`${error.stack}\`\`\``);
      });
      member.removeRole(mute.id).then(function(member) {
        const createdTime = ms(row.unmuteDate);
        const convertedTime = new Date(createdTime).toString();
        bot.embed(msg, bot.hex, "Successfully unmuted user:", `Unmuted: ${member.user.tag} \nStatic Unmute Date: ${convertedTime} \nStaff: ${row.staffMember} \nReason: ${row.reason}`);
      });
    });
  });
}

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
      
exports.help = {
  name: 'unmute',
  description: 'Unmutes mentioned user and removes them from the mute database.',
  usage: 'unmute [mention]'
};