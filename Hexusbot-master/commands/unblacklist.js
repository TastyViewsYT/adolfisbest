const fileSystem = require("fs");
let blacklist = JSON.parse(fileSystem.readFileSync("./blacklist.json", "utf8")); 
exports.run = function(bot, msg, args) {
  const user = msg.mentions.users.first() || bot.users.get(args[0]);
  if (user) msg.guild.fetchMember(user).then(function(member) {
    if (!blacklist[member.id]) blacklist[member.id] = {blacklist: 0};
    else blacklist[member.id] = {blacklist: 0}
    bot.embed(msg, bot.hex, "Successfully unblacklisted user:", `• Unblacklisted: ${member.user.tag} \nThey will no longer be able to use the music commands.`);
    fileSystem.writeFile("./blacklist.json", JSON.stringify(blacklist), (error) => console.error(error));
  }).catch(error => console.error(error));
  else return bot.embed(msg, bot.hex, "Invalid user mention:", "Please mention a user or specify an ID!");
}

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
  
exports.help = {
  name: 'unblacklist',
  description: 'Unblacklists the mentioned user from music commands.',
  usage: 'unblacklist'
};