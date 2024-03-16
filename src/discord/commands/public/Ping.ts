import { Command, Store } from "#base";
import { ApplicationCommandType, EmbedBuilder, time } from "discord.js";

new Command({
  name: "ping",
  description: "🏓 replies with bot's response time.",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  store: {
    cooldowns: new Store<Date>({ clearTime: 10000 }),
  },
  async run(interaction, { cooldowns }) {
    const now = new Date();
    const cooldown = cooldowns.get(interaction.member.id) ?? now;
    const startTime = Date.now();
    const botPing = Date.now() - startTime;
    const apiPing = interaction.client.ws.ping;

    if (cooldown > now) {
      interaction.reply({
        ephemeral,
        content: `You can use this command again ${time(cooldown, "R")}`,
      });
      return;
    }

    const embed = new EmbedBuilder({
      title: "Ping",
      fields: [
        {
          name: "**Bot Ping**",
          value: `\`${botPing}ms\``,
          inline: true,
        },
        {
          name: "**API Ping**",
          value: `\`${apiPing}ms\``,
          inline: true,
        },
      ],
      color: 0x2f3136,
      footer: { text: "© All rights reserved to AyzrusDev ©" },
      thumbnail: {
        url: "https://i.imgur.com/o2VwCM3.png",
      },
    });

    await interaction.reply({
      ephemeral,
      embeds: [embed],
    });

    now.setSeconds(now.getSeconds() + 10);

    cooldowns.set(interaction.member.id, now);
  },
});
