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
  name: "rob",
  description: "Choose a player to rob",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Choose a user",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run(interaction) {
    const user = interaction.options.getUser("user");
    const userId = user?.id;
    const userName = user?.globalName;
    const guildId = interaction.guild.id;
    const guildName = interaction.guild.name;
    const executorUserId = interaction.member.user.id;

    // Verificar se o executor não está a tentar a roubar a sí mesmo
    if (userId === executorUserId) {
      interaction.reply({
        content: "You cannot rob yourself!",
        ephemeral: true,
      });
      return;
    }

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

    const now = new Date();

    // Verificar se está em cooldown se sim alertar
    if (guildData.lastRobCommandTime) {
      const lastExecution = new Date(guildData.lastRobCommandTime);
      const cooldownTime = parseInt(guildData.RobCooldown ?? "300");
      const elapsedTime = (now.getTime() - lastExecution.getTime()) / 1000;

      if (elapsedTime < cooldownTime) {
        interaction.reply({
          content: `You can use the as command again ${time(
            Math.floor(now.setSeconds(now.getSeconds() + cooldownTime) / 1000), "R"
          )}.`,
          ephemeral: true,
        });

        return;
      }
    }

    let executorData = await db.members.findOne({ userId: executorUserId });
    let targetUserData = await db.members.findOne({ userId: userId });

    // Criar na base de dados o executor
    if (!executorData) {
      executorData = new db.members({
        userId: executorUserId,
        userName: interaction.member.user.username,
        guildId: guildId,
        guildName: guildName,
        Money: 0,
        Bank: 0,
        Total: 0,
      });
      log.success(
        `Utilizador ${interaction.member.user.username} adicionado ao banco de dados.`
      );
      await executorData.save();
    }

    // Criar na base de dados o alvo
    if (!targetUserData) {
      targetUserData = new db.members({
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
      await targetUserData.save();
    }

    // Se o alvo não tiver dinheiro alertar o user executor
    if ((targetUserData.Money ?? 0) <= 0) {
      interaction.reply({
        content: "The target user has no money to rob.",
        ephemeral: true,
      });
      return;
    }

    const chanceToRob = (guildData.ChanceToRob ?? 50) / 100;
    const percentageOfTheft = (guildData.PercentageOfTheft ?? 50) / 100;

    const isSuccessful = Math.random() < chanceToRob;

    // Se não der sucesso avisar o user
    if (!isSuccessful) {
      const embed = new EmbedBuilder({
        title: "Cops Alert",
        description: "Robbery failed someone called the police",
        color: 0xFF0000,
        footer: { text: "© All rights reserved to AyzrusDev ©" },
        thumbnail: {
          url: "https://i.imgur.com/o2VwCM3.png",
        },
      });
      await interaction.deferReply();
      await interaction.deleteReply();
      interaction.channel?.send({ embeds: [embed] });
      guildData.lastRobCommandTime = now;
      await guildData.save();
      return;
    }

    const amountToSteal = Math.floor(
      (targetUserData.Money ?? 0) * percentageOfTheft
    );

    if (targetUserData && targetUserData.Money !== undefined) {
      targetUserData.Money = (targetUserData.Money ?? 0) - amountToSteal;
      await targetUserData.save();
    }

    // Adicionar o dinheiro roubado ao saldo do executor
    if (executorData && executorData.Money !== undefined) {
      executorData.Money = (executorData.Money ?? 0) + amountToSteal;
      await executorData.save();
    }

    // Atualizar o tempo do último comando de roubo
    guildData.lastRobCommandTime = now;
    await guildData.save();

    // Responder com uma mensagem indicando o sucesso do roubo e a quantidade roubada
    await interaction.deferReply();
    await interaction.deleteReply();
    const embed = new EmbedBuilder({
      title: "Success Alert",
      description: `You successfully robbed ${userName} and stole ${ModuleFormat.en(
        amountToSteal,
        2
      )} ${guildData.EmojiMoney}!`,
      color: 0x00FF00,
      footer: { text: "© All rights reserved to AyzrusDev ©" },
      thumbnail: {
        url: "https://i.imgur.com/o2VwCM3.png",
      },
    });
    interaction.channel?.send({ embeds: [embed] });
  },
});
