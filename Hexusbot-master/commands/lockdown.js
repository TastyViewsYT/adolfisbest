const ms = require("ms");
const moment = require("moment");
require("moment-duration-format");
exports.run = function(bot, msg, args) {
  if (!bot.lockdown) bot.lockdown = [];
  const specifiedArgs = args.join(" ");
  if (!specifiedArgs) return bot.embed(msg, bot.hex, "Invalid specification:", "Please provide a time to lockdown for.");
  if (Math.floor(ms(specifiedArgs)) <= 0) return bot.embed(msg, bot.hex, "Invalid Exception:", "Please specify a realistic time.");
  if (args[0] == "off") {
    msg.channel.overwritePermissions(msg.guild.id, {
        SEND_MESSAGES: null
    }).then(function() {
        bot.embed(msg, bot.hex, "Lockdown Deactivated.", "Lockdown period has been terminated.");
        clearTimeout(bot.lockdown[msg.channel.id]);
        delete bot.lockdown[msg.channel.id];
    }).catch(error => bot.embed(msg, bot.hex, "Error occured:", `\`\`\`${error.stack}\`\`\``));
  } else {
    msg.channel.overwritePermissions(msg.guild.id, {
      SEND_MESSAGES: false
    }).then(function() {
        const createdTime = new Date().getTime() + ms(specifiedArgs);
        const untilTime = new Date(createdTime).toString(); 
        const forTime = ms(ms(specifiedArgs), {long: true});
        bot.embed(msg, bot.hex, "Channel successfully locked.", `Locked for: ${forTime} \nUnlocked at: ${untilTime}`);
        bot.lockdown[msg.channel.id] = setTimeout(function() {
          msg.channel.overwritePermissions(msg.guild.id, {
              SEND_MESSAGES: null
          }).then(function() {
            bot.embed(msg, bot.hex, "Lockdown Deactivated.", "Lockdown period has been terminated.");
            delete bot.lockdown[msg.channel.id];
          }).catch(error => bot.embed(msg, bot.hex, "Error occured:", `\`\`\`${error.stack}\`\`\``));
        }, ms(specifiedArgs));
    }).catch(error => bot.embed(msg, bot.hex, "Invalid Argument:", "You need to either provide a time or the keyword `off`."));
  }
};

exports.conf = {
  activated: true,
  aliases: ["ld"],
  permLevel: 2
};
    
exports.help = {
  name: 'lockdown',
  description: 'Locks down channel for specified time.',
  usage: 'lockdown [time/off]'
};