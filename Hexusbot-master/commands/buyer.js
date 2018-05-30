exports.run = function(bot, msg) {
  let specifiedRole = msg.guild.roles.find("name", "VIP");
  if (!specifiedRole) return bot.embed(msg, bot.hex, "Invalid Exception:", "Role `VIP` doesn't exist.");
  if (msg.mentions.users.array().length == 0) return bot.embed(msg, bot.hex, "Invalid mentions:", "You didn't mention any users.");
  const userCollection = msg.mentions.users;
  userCollection.map(function(user) {
    msg.guild.fetchMember(user.id).then(function(member) {
      if (!member.roles.has(specifiedRole.id)) member.addRole(specifiedRole.id);
    });
  });
  bot.embed(msg, bot.hex, "Successfully given VIP roles:", `${userCollection.map(u => u.tag).join(", ")}`);
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
    
exports.help = {
  name: 'buyer',
  description: 'Gives VIP role to all mentioned users.',
  usage: 'buyer [user mention(s)]'
};