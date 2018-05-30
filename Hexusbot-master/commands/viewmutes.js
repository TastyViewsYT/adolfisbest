const ms = require("ms");
const sql = require("sqlite");
sql.open("./muteDatabase.sqlite");
exports.run = function(bot, msg) {
  sql.all("SELECT * FROM muteDatabase").then(function(row) {
    if (!row) return bot.embed(msg, bot.hex, "Invailid Database Request:", "Nobody is currently muted in the database.");
    var data = [];
    for (var user = 0; user < row.length; user++) {
        const userTime = ms(row[user].unmuteDate);
        const convertedTime = new Date(userTime).toString(); 
        data.push(`Username: ${row[user].username}#${row[user].userID} \nUnmute Date: ${convertedTime} \nReason: ${row[user].reason} \nStaff: ${row[user].staffMember}\n\n`);
    }
    const newData = data.toString().replace(",", "");
    bot.embed(msg, bot.hex, "Successfully fetched muted users:", newData || "No users in the database!");
  });
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
      
exports.help = {
  name: 'viewmutes',
  description: 'Shows all mutes within the database.',
  usage: 'viewmutes'
};