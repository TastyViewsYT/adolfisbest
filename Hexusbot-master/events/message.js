exports.run = function(bot, msg) {
  if (msg.author.bot) return;
  if (msg.channel.type != "text") return;
  if (!msg.content.startsWith(bot.settings.prefix)) return;
  const command = msg.content.toLowerCase().split(" ")[0].slice(bot.settings.prefix.length);
  const args = msg.content.split(" ").slice(1);
  const permission = bot.permission(msg);
  msg.author.permLevel = permission;

  let role = msg.guild.roles.find("name", "HexusController");
  if (msg.channel.id != "451138595638738945") {
    if (msg.author.permLevel < 2 && (!msg.member.roles.has(role.id))) return;
  }

  let convertedCommand;
  if (bot.commands.has(command)) {
      convertedCommand = bot.commands.get(command);
  } else if (bot.aliases.has(command)) {
      convertedCommand = bot.commands.get(bot.aliases.get(command));
  }

  if (convertedCommand && convertedCommand.conf.activated != true)
    return msg.reply("I apologise but this command has been disabled by the bot creator");

  if (convertedCommand) {
    if (permission < convertedCommand.conf.permLevel) return;
    convertedCommand.run(bot, msg, args, permission);
  }
};
