exports.run = function(bot, msg, args) {
  let mentionedMember = msg.mentions.members.first();
  if (!mentionedMember) return bot.embed(msg, bot.hex, "Incorrect member mention:", "Please mention a member to change their nickname.");
  var userObject = msg.mentions.users.first();
  let specifiedNickname = args.slice(1).join(" ");
  if (!specifiedNickname) {
    bot.fetchMember(msg, userObject).then(m => m.setNickname(""));
    return bot.embed(msg, bot.hex, "Invalid nickname specification:", "Since you provided no argument, I simply reset their name back to default.");
  } else {
    if (specifiedNickname > 32) return bot.embed(msg, bot.hex, "Invalid nickname specification:", "Nickname length is greater than 32.");
    bot.fetchMember(msg, userObject).then(m => m.setNickname(specifiedNickname));
    bot.embed(msg, bot.hex, null, "Successfully set users nickname!");
  }
};

exports.conf = {
  activated: true,
  aliases: ['nick', 'n'],
  permLevel: 2
};
  
exports.help = {
  name: 'nickname',
  description: 'Nicknames the mentioned user.',
  usage: 'nickname <mention> <argument>'
};