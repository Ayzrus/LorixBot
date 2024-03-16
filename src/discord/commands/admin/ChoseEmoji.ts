import { Command } from "#base";
import { db } from "#database";
import { log } from "#settings";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";

new Command({
  name: "chooseemoji",
  description: "[Admin] Choose a Emoji for Currency Economy",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: "emoji",
      description: "Choose a Emoji",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run(interaction) {
    const emoji = interaction.options.getString("emoji");
    const guildId = interaction.guild.id;
    const guildName = interaction.guild.name;
    let guildData = await db.guilds.findOne({ guildId });
    if (!guildData) {
      guildData = new db.guilds({
        guildId: guildId,
        guildName: guildName,
      });
      log.success(`Guilda ${guildName} adicionada ao banco de dados.`);
      await guildData.save();
    }

    guildData.EmojiMoney = emoji?.toString();

    guildData.save();

    const embed = new EmbedBuilder({
      title: "Info System",
      description: "Emoji has been set successfully.",
      color: 0x006400,
      footer: { text: "© All rights reserved to AyzrusDev ©" },
      thumbnail: {
        url: "https://i.imgur.com/o2VwCM3.png",
      },
    });

    await interaction?.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
});
