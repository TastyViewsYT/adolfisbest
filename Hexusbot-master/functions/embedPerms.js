module.exports = (msg) => {
    if (!msg.guild) return true;
    return msg.channel.permissionsFor(msg.client.user).has("EMBED_LINKS");
}