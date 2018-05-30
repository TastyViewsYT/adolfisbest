exports.run = async function(bot, msg, args) {
  const user = msg.mentions.users.first() || bot.users.get(args[0]);
  if (!user) return bot.embed(msg, bot.hex, "Invalid user mention:", "Couldn't find mention or ID is invalid.");
  var reason = args.slice(1).join(" ");
  if (!reason) reason = "No reason was provided!";
  
  bot.fetchMember(msg, user).then(function(member) {
    const commandUser = msg.member.highestRole.position;
    const targetUser = member.highestRole.position;
    const clientUser = bot.highestRole(msg);
    if (commandUser <= targetUser) return bot.embed(msg, bot.hex, "Invalid Permissions:", "User has a higher role then you.");
    if (clientUser <= targetUser) return bot.embed(msg, bot.hex, "Invalid Permissions:", "User has a higher role then me.");
    member.ban({days: 1, reason: `${reason} = Ban performed by: ${msg.author.tag}`});
    bot.embed(msg, bot.hex, "Successfully banned user:", `User: ${user.tag} \nReason: ${reason}`);
  }).catch(error => bot.embed(msg, bot.hex, "Encountered an error", `\`\`\`${error.stack}\`\`\``));
}

exports.conf = {
  activated: true,
  aliases: ["deport"],
  permLevel: 2
};
  
exports.help = {
  name: 'ban',
  description: 'Bans mentioned user with specified reason.',
  usage: 'ban [mention/id] [reason]'
};