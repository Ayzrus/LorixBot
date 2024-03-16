import { Event } from "#base";
import { db } from "#database";

new Event({
  name: "Change the bot description",
  event: "ready",
  async run(client) {
    client.user.setAvatar("https://i.imgur.com/uL4CChi.gif")
    .then(user => console.log("New avatar set!"))
    .catch(console.error);
    const guilds = new Map();
    for (const guild of client.guilds.cache) {
      const guildId = guild[1].id;
      const guildName = guild[1].name;
      guilds.set(guildId, guildName);

      let existingGuild = await db.guilds.findOne({ guildId });
      if (!existingGuild) {
        existingGuild = new db.guilds({
          guildId: guildId,
          guildName: guildName,
        });
        console.log(`Guilda ${guildName} adicionada ao banco de dados.`);
        await existingGuild.save();
      }
    }
  },
});
