import { Command } from "#base";
import ModuleFormat from "#class";
import { db } from "#database";
import { log } from "#settings";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  time,
} from "discord.js";

new Command({
  name: "slotmachine",
  description: "",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "value",
      description: "Choose an amount to bet",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  async run(interaction) {
    const value = interaction.options.getNumber("value");
    const icons = [":coin:", ":moneybag:"];
    const userId = interaction?.member.id;
    const userName = interaction?.member.user.username;
    const guildId = interaction.guild.id;
    const guildName = interaction.guild.name;

    let guildData = await db.guilds.findOne({ guildId });

    // Verifica se existe os dados do servidor se não cria
    if (!guildData) {
      guildData = new db.guilds({
        guildId: guildId,
        guildName: guildName,
      });
      log.success(`Guilda ${guildName} adicionada ao banco de dados.`);
      await guildData.save();
    }

    let userData = await db.members.findOne({ userId: userId });
    // Criar na base de dados o user
    if (!userData) {
      userData = new db.members({
        userId: userId,
        userName: userName,
        guildId: guildId,
        guildName: guildName,
        Money: 0,
        Bank: 0,
        Total: 0,
      });
      log.success(
        `Utilizador ${interaction.member.user.username} adicionado ao banco de dados.`
      );
      await userData.save();
    }

    const now = new Date();

    // Verificar se está em cooldown se sim alertar
    if (guildData.lastSlotMachineCommandTime) {
      const lastExecution = new Date(guildData.lastSlotMachineCommandTime);
      const cooldownTime = parseInt(guildData.SlotMachineCooldown ?? "10");
      const elapsedTime = (now.getTime() - lastExecution.getTime()) / 1000;

      if (elapsedTime < cooldownTime) {
        interaction.reply({
          content: `You can use the as command again ${time(
            Math.floor(now.setSeconds(now.getSeconds() + cooldownTime) / 1000),
            "R"
          )}.`,
          ephemeral: true,
        });

        return;
      }
    }

    // Gere uma fila aleatória de 9 ícones
    const randomRow = Array.from(
      { length: 9 },
      () => icons[Math.floor(Math.random() * icons.length)]
    );

    // Crie um EmbedBuilder
    const embed = new EmbedBuilder({
      title: "Slot Machine",
      color: 0xffd700, // Cor dourada
      footer: { text: "© All rights reserved to AyzrusDev ©" },
      thumbnail: {
        url: "https://i.imgur.com/o2VwCM3.png",
      },
    });

    // Adicione ícones ao embed em filas de 3
    for (let i = 0; i < 9; i += 3) {
      const row = [
        { name: "Slot 1", value: randomRow[i], inline: true },
        { name: "Slot 2", value: randomRow[i + 1], inline: true },
        { name: "Slot 3", value: randomRow[i + 2], inline: true },
      ];
      embed.addFields(row);
    }

    // Verifique se todos os ícones na fila do meio são iguais
    const middleRowIcons = randomRow.slice(3, 6);
    const isWin = middleRowIcons.every((icon) => icon === middleRowIcons[0]);

    // Responda com o embed e uma mensagem de vitória se necessário
    if (isWin) {
      const min = guildData.SlutMinMoney ?? 300;
      const max = guildData.SlutMaxMoney ?? 3000;
      const currency = guildData.EmojiMoney;
  
      const money = (Math.random() * (max - min) + min) * 2;
      const moneyEarned = money.toFixed(2);
    } else {
    }
  },
});
