import { Event } from "#base";
import { db } from "#database";

new Event({
  name: "Create guild on database",
  event: "guildCreate",
  async run(guild) {
    const guildId = guild.id;
    const guildName = guild.name;
    let existingGuild = await db.guilds.findOne({ guildId });

    if (!existingGuild) {
      existingGuild = new db.guilds({
        guildId: guildId,
        guildName: guildName,
      });
      console.log(`Guilda ${guild.name} adicionada ao banco de dados.`);
      await existingGuild.save();
    }
  },
});
