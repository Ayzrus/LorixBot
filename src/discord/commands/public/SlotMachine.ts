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
  description: "Choose an amount to bet",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "value",
      description: "Amount to bet",
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
      log.success(`Guild ${guildName} (${guildId}) added to the database.`);
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
      log.success(`User ${userName} (${userId}) added to the database.`);
      await userData.save();
    }
    if (value && userData.Money < value) {
      interaction.reply({
        content: "You dont have money to bet.",
        ephemeral: true,
      });
      return;
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
        { name: "\u200B", value: randomRow[i], inline: true },
        { name: "\u200B", value: randomRow[i + 1], inline: true },
        { name: "\u200B", value: randomRow[i + 2], inline: true },
      ];
      if (i === 3) {
        row[2].value += " :arrow_backward:";
      }
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

      // Atualizar o tempo do último comando de roubo
      guildData.lastSlotMachineCommandTime = now;
      await guildData.save();

      // Adicionar o dinheiro ao usuário
      userData.Money = (userData.Money ?? 0) + money;
      await userData.save();
      await interaction.deferReply();
      await interaction.deleteReply();
      interaction.channel?.send({
        content: `You bet and won ${ModuleFormat.en(money)} ${currency}`,
        embeds: [embed],
      });
    } else {
      const currency = guildData.EmojiMoney;

      // Crie um EmbedBuilder
      const embed1 = new EmbedBuilder({
        title: "Slot Machine Info",
        color: 0xff0000, // Cor vermelha
        description: `You bet but lost your money -${ModuleFormat.en(Number(value))} ${currency}`,
        footer: { text: "© All rights reserved to AyzrusDev ©" },
        thumbnail: {
          url: "https://i.imgur.com/o2VwCM3.png",
        },
      });
      await interaction.deferReply();
      await interaction.deleteReply();
      interaction.channel?.send({ embeds: [embed1] });

      // Adicionar o dinheiro ao usuário
      if (value) {
        userData.Money = (userData.Money ?? 0) - value;
      }
      await userData.save();
    }
  },
});
