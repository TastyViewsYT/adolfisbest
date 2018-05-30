exports.run = function(bot, msg, args) {
  if (!args[0]) {
    const commandNames = Array.from(bot.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    msg.channel.send(`> ${bot.user.username} Commands <\n\n[Use ${bot.settings.prefix}help <command> for information!]\n\n${bot.commands.map(c => `${bot.settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n')}`, {code: 'asciidoc'});
  } else {
    let command = args[0];
    if (bot.commands.has(command)) {
      command = bot.commands.get(command);
      bot.embed(msg, bot.hex, "Command help:", `Command Name: \`${command.help.name}\` \nDescription: \`${command.help.description}\` \nUsage: \`${bot.settings.prefix}${command.help.usage}\` \nAliases: \`${command.conf.aliases.join(" | ") || "No aliases found."}\` \nPermission Level: \`${command.conf.permLevel}\``);
    } else {
      bot.embed(msg, bot.hex, "Invalid command:", `I was unable to find a command by the name of: \`${args[0]}\``);
    }
  }
};

exports.conf = {
  activated: true,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays available commands.',
  usage: 'help <command>'
};
