const Discord = require("discord.js");
const bot = new Discord.Client();
const db = new Discord.Client();
const fileSystem = require("fs");
const sql = require("sqlite");
sql.open("./muteDatabase.sqlite");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.playlists = new Discord.Collection();
bot.settings = require("./configuration/settings.js");
require("./modules/essentialFunctions.js")(bot);
require("./modules/essentialEmbeds.js")(bot);
bot.login(bot.settings.token);
db.login(bot.settings.token);

fileSystem.readdir("./commands/", function(error, commands) {
  if (error) return console.error(error.stack);
  console.log(`Going to load: ${commands.length} commands!`);
  commands.forEach(function(file) {
    if (!file.endsWith(".js")) return;
    let commandModule = require(`./commands/${file}`);
    bot.commands.set(commandModule.help.name, commandModule);
    console.log(`Command activated: ${commandModule.help.name}`);
    commandModule.conf.aliases.forEach(function(alias) {
        bot.aliases.set(alias, commandModule.help.name);
    });
  });
});

fileSystem.readdir("./events/", function(error, events) {
  if (error) return console.error(error.stack);
  events.forEach(function(file) {
    if (!file.endsWith(".js")) return;
    let eventModule = require(`./events/${file}`);
    console.log(eventModule);
    let eventName = file.toString().split(".")[0];
    console.log(`Loaded Event: ${eventName}`);
    bot.on(eventName, (...params) => eventModule.run(bot, ...params));
  });
});

db.on("ready", function() {
  var intervalCheck = setInterval(function() {
    const currentTime = new Date().getTime();
    const convertTime = new Date(currentTime).toString();
    sql.all("SELECT * FROM muteDatabase").then(function(row) {
      if (row.length == 0) return clearInterval(intervalCheck);
      console.log("Another check has been performed towards the database.");
        for (var i = 0; i < row.length; i++) {
          if (row[i].unmuteDate < currentTime) {
            sql.run(`DELETE FROM muteDatabase WHERE userID = ${row[i].userID}`);
            const role = db.guilds.get(row[i].guildID).roles.find("name", "Hexus-Mute");
            if (!role) return console.log("Cannot find mute role for that guild.");
            const channel = db.guilds.get(row[i].guildID).channels.find("name", "mute-logs") || db.guilds.get(row[i].guildID).channels.find("name", "logs");
            if (!channel) return console.log("Cannot find a log channel in specified users guild.");
            db.guilds.get(row[i].guildID).fetchMember(row[i].userID).then(m => m.removeRole(role.id));
            db.guilds.get(row[i].guildID).channels.get(channel.id).send("", {embed: {
              author: {name: db.user.tag, icon_url: db.user.avatarURL},
              color: 0xff0000,
              title: "Successfully unmuted user!",
              description: `Successfully unmuted: ${row[i].username} : [${row[i].userID}] \nStaff: ${row[i].staffMember} \nReason: ${row[i].reason} \nUnmute date: ${convertTime}`,
              timestamp: new Date(),
              footer: {text: "Command executed!"}
            }});
          }
        }
    }).catch(error => console.error(error));
  }, 5000);
});
