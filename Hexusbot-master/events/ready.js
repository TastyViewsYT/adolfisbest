exports.run = function(bot) {
  bot.user.setPresence({game: {name: "over Hexus.", type: "WATCHING"}});
  console.log("Visualize successfully activated!");
};