const sql = require("sqlite");
sql.open("./muteDatabase.sqlite");
exports.run = function(bot, member) {
  sql.get(`SELECT * FROM muteDatabase WHERE userID = ${member.id}`).then(function(row) {
    let role = member.guild.roles.find("name", "Hexus-Mute");
    if (row) {
      member.addRole(role.id).catch(error => console.error(error.stack));
      member.send("Nice attempt to bypass the mute :)");
    } else return;
  }).catch(error => console.error(error));
};

