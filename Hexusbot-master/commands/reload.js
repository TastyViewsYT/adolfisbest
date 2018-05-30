exports.run = async function(bot, msg, args) {
  try {
      let hex = bot.hex;
      let command;
      if (bot.commands.has(args[0])) { 
          command = args[0]; 
        } else if (bot.aliases.has(args[0])) {
          command = bot.aliases.get(args[0]);
      }

      if (!args[0]) return bot.embed(msg, hex, "Invalid argument:", "Specify a command to reload with the command.");
      if (!command) {
          return bot.embed(msg, hex, "Invalid reload request:", `Couldn't find command by name of: ${args[0]}`);
      } else {
        msg.channel.send("Preparing to reload specified command: :file_folder:").then(m => {
            bot.reload(command).then(() => {
                m.edit(`:open_file_folder: Successfully reloaded \`${command}\``);
              }).catch(e => {
                m.edit(`:no_entry_sign: Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
              });
        });
      }
  } catch (error) {
      msg.channel.send(`\`\`\`${error}\`\`\``);
  }
};

exports.conf = {
  activated: true,
  aliases: ['r'],
  permLevel: 4
};
  
exports.help = {
  name: 'reload',
  description: 'Reload a command file from the command collection.',
  usage: 'reload <commandname>'
};