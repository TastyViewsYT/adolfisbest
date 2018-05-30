const fileSystem = require("fs");
let blacklist = JSON.parse(fileSystem.readFileSync("./blacklist.json", "utf8")); 
exports.run = function(bot, msg, args) {
msg.guild.fetchMember(msg.author).then(function(member) {
    if (!blacklist[msg.author.id])
      return bot.embed(msg, bot.hex, "Successfully fetched blacklist status:", "You do not exist in the database.");
    let conversion = {0: "Not blacklisted", 1: "Blacklisted"};
    return bot.embed(msg, bot.hex, "Successfully fetched blacklist status:", `You are currently: ${conversion[blacklist[msg.author.id].blacklist]}`);
  }).catch(error => console.error(error));
}

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 0
};
  
exports.help = {
  name: 'viewblstatus',
  description: 'Checks if you\'re currently blacklisted',
  usage: 'viewblstatus'
};