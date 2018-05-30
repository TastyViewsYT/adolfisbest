const ms = require("ms");
exports.run = function(bot, msg, args) {
  try {
    let time = args[0];
    if (!time) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a time for the mute!");
    if (ms(time) <= 0) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a realistic time.");
    if (ms(time) > bot.settings.weekOverflow) return bot.embed(msg, bot.hex, "Invalid Exception:", "Time overflow detected, please provide a time that's less than a week. \nThis will be improved with database storage in the future for longer times.");
    if (Math.floor(ms(time)) <= 0) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a realistic time.");
    if (!bot.hasNumber(time)) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a time that has a number.");
    let amountOfWinners = args[1];
    if (isNaN(amountOfWinners)) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a number for amount of winners.");
    if (amountOfWinners < 1) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify an amount of winners, that's larger than or equal to 1.");
    let prize = args.slice(2).join(" ");
    if (!prize) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a prize that the user will win from the giveaway.");
    returnReactionUsers(bot, msg, amountOfWinners, time, prize);
  } catch (error) {
    msg.reply("Please check for any spaces, and that your time specification is correct.");
  }
};

exports.conf = {
  activated: true,
  aliases: [],
  permLevel: 2
};
  
exports.help = {
  name: 'giveaway',
  description: 'Starts a giveaway with specific arguments.',
  usage: 'giveaway [time] [number of winners] [prize]'
};

function returnReactionUsers(bot, msg, amountOfWinners, amountOfTime, giveawayItem) {
  if (!amountOfWinners || amountOfWinners < 1) throw new Error("Invalid amount of winners.");
  msg.channel.send("React with the :tada: emoji to enter the giveaway:", {embed: {
    author: {name: bot.user.tag, icon_url: bot.user.avatarURL},
    color: 0xff0000,
    title: `Giving away: **${giveawayItem.toString()}**`,
    description: `• This giveaway is going on for ${ms(ms(amountOfTime), {long: true})} \n• There can be only ${amountOfWinners} winner(s)!`,
    timestamp: new Date()
  }}).then(function(message) {
    setTimeout(function() {
      if (message.reactions.filter(r => r.emoji.toString() == "🎉").size == 0) {
        return message.edit("", {embed: {
          author: {name: bot.user.tag, icon_url: bot.user.avatarURL},
          color: 0xff0000,
          title: `Giveaway ended for: **${giveawayItem.toString()}**`,
          description: `Nobody voted with the designated emoji!`,
          timestamp: new Date()
        }});
      }
      message.reactions.filter(reaction => reaction.emoji.toString() == "🎉").map(function(r) {
        var selectedUsers = r.users.random(parseInt(amountOfWinners));
        if (r.users.size < amountOfWinners) selectedUsers = r.users.random(r.users.size);
        message.edit("", {embed: {
          author: {name: bot.user.tag, icon_url: bot.user.avatarURL},
          color: 0xff0000,
          title: `Giveaway ended for: **${giveawayItem.toString()}**`,
          description: `Winners: ${selectedUsers}`,
          timestamp: new Date()
        }});
      });
    }, ms(amountOfTime));
  }).catch(error => console.error(error));
}
