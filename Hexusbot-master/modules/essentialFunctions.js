module.exports = (bot) => {
    bot.reload = command => {
      return new Promise((resolve, reject) => {
        try {
          delete require.cache[require.resolve(`../commands/${command}`)];
          let cmd = require(`../commands/${command}`);
          bot.commands.delete(command);
          bot.aliases.forEach((cmd, alias) => {
            if (cmd === command) bot.aliases.delete(alias);
          });
          bot.commands.set(command, cmd);
          cmd.conf.aliases.forEach(alias => {
            bot.aliases.set(alias, cmd.help.name);
          });
          resolve();
        } catch (e){
          reject(e);
        }
      });
    };
    
    bot.checkRole = function(msg, role) {
      if (msg.member.roles.has(role.id)) return true;
      else return false;
    }
    
    bot.permission = function(msg) {
      let permissionLevel = 0;
      let moderatorRoleName = bot.settings.modRole;
      let skipRoleName = bot.settings.skipRole;
      if (skipRoleName && bot.checkRole(msg, skipRoleName)) permissionLevel = 1;
      let moderatorRole = msg.guild.roles.find("name", moderatorRoleName);
      if (msg.member == null || msg.member == undefined) permissionLevel = 0;
      if (moderatorRole && bot.checkRole(msg, moderatorRole)) permissionLevel = 2;
      if (bot.settings.owners.includes(msg.author.id)) permissionLevel = 10;
      return permissionLevel;
    }

    bot.fetchMember = function(msg, userResolveable) {
      return new Promise(function(resolve, reject) {
        if (!userResolveable) reject("No user resolveable was provided.");
        const fetchedMember = msg.guild.fetchMember(userResolveable);
        if (fetchedMember) resolve(fetchedMember);
        else reject("That user was unable to be fetched from the guild.");
      });
    }

    bot.highestRole = function(msg) {
      var position = msg.guild.members.get(bot.user.id).highestRole.position;
      return position;
    }

    bot.hasNumber = function(input) {
      return /\d/.test(input);
    }

    bot.checkBlacklist = function(msg, userID) {
      const fs = require("fs");
      let blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf8"));
      if (blacklist[msg.author.id].blacklist == 0) return false;
      if (blacklist[msg.author.id].blacklist == 1) return true;
    }
};
