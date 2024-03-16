import { Command } from "#base";
import { db } from "#database";
import { log } from "#settings";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";

new Command({
  name: "workcurrency",
  description: "[Admin] Choose a Min and Max for Work",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: "min",
      description: "Choose a Min currency",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "max",
      description: "Choose a Max currency",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run(interaction) {
    const min = interaction.options.getString("min");
    const max = interaction.options.getString("max");
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

    guildData.WorkMinMoney = parseInt(min?.toString() ?? "300");
    guildData.WorkMaxMoney = parseInt(max?.toString() ?? "3000");

    guildData.save();

    const embed = new EmbedBuilder({
      title: "Info System",
      description: "Min and Max has been set successfully.",
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
