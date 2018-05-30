exports.run = function(bot, msg, args) {
  const mentionedUser = msg.mentions.users.first();
  if (!mentionedUser) return bot.embed(msg, bot.hex, "Invalid user mention:", "User mention required.");
  const mentionedMember = msg.mentions.members.first();
  const specifiedReason = args.slice(1).join(" ");
  if (!specifiedReason) return bot.embed(msg, bot.hex, "No reason specified:", "Please specify a reason with your softban.");

  bot.fetchMember(msg, mentionedUser).then(member => {
    const commandUser = msg.member.highestRole.position;
    const targetUser = member.highestRole.position;
    const clientUser = bot.highestRole(msg);
    if (commandUser <= targetUser) return bot.embed(msg, 0xff0000, "Invalid Permissions:", "User has a higher role then you.");
    if (clientUser <= targetUser) return bot.embed(msg, 0xff0000, "Invalid Permissions:", "User has a higher role then me.");
    msg.channel.fetchMessages({limit: 100}).then(message => {
      let messageArray = message.array();
      let filteredArray = message.filter(m => m.author.id == mentionedUser.id);
      msg.channel.bulkDelete(filteredArray, true);
    });
    member.kick(`${specifiedReason} - Softbanned by user: ${msg.author.tag}`);
    bot.embed(msg, bot.hex, "Successfully softbanned user:", `Softbanned: ${member.user.tag}`);
  }).catch(error => console.error(error));
}

exports.conf = {
  activated: true,
  aliases: ['hardkick'],
  permLevel: 2
};
  
exports.help = {
  name: 'softban',
  description: 'Kicks and deletes messages from mentioned user.',
  usage: 'softban <mention> <reason>'
};
