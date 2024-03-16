import { Command } from "#base";
import ModuleFormat from "#class";
import { db } from "#database";
import { log } from "#settings";
import { ApplicationCommandType, EmbedBuilder, time } from "discord.js";

type PhraseType = { [key: number]: string };

new Command({
  name: "work",
  description: "Work to earn some money",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const userId = interaction?.member.id;
    const userName = interaction?.member.nickname;
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

    const now = new Date();

    // Verificar se está em cooldown se sim alertar
    if (guildData.lastWorkCommandTime) {
      const lastExecution = new Date(guildData.lastWorkCommandTime);
      const cooldownTime = parseInt(guildData.WorkCooldown ?? "120");
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

    //Array das frases do work
    const Phrases: PhraseType[] = [
      {
        1: "I worked as a software developer in a startup and earned {money}{emoji}.",
      },
      {
        2: "I worked as a barista in a busy café and managed to earn {money}{emoji}.",
      },
      {
        3: "I worked as an administrative assistant in a medium-sized company and received {money}{emoji}.",
      },
      { 4: "I worked as a private math tutor and earned {money}{emoji}." },
      {
        5: "I worked as a waiter in a popular restaurant and earned {money}{emoji}.",
      },
      {
        6: "I worked as a freelance translator and managed to earn {money}{emoji}.",
      },
      { 7: "I worked as a ride-sharing driver and made {money}{emoji}." },
      {
        8: "I worked as a sales consultant in an electronics store and received {money}{emoji}.",
      },
      { 9: "I worked as a web content writer and earned {money}{emoji}." },
      {
        10: "I worked as a fitness instructor at a local gym and earned {money}{emoji}.",
      },
      { 11: "I worked as a nurse in a hospital and earned {money}{emoji}." },
      {
        12: "I worked as a freelance graphic designer and managed to earn {money}{emoji}.",
      },
      {
        13: "I worked as a receptionist in a luxury hotel and received {money}{emoji}.",
      },
      {
        14: "I worked as an IT technician in a tech company and earned {money}{emoji}.",
      },
      {
        15: "I worked as a salesperson in a clothing store and earned {money}{emoji}.",
      },
      {
        16: "I worked as a cook in a renowned restaurant and earned {money}{emoji}.",
      },
      {
        17: "I worked as a freelance digital marketer and earned {money}{emoji}.",
      },
      {
        18: "I worked as a manicurist in a beauty salon and received {money}{emoji}.",
      },
      {
        19: "I worked as a telemarketing operator in a telecommunications company and earned {money}{emoji}.",
      },
      {
        20: "I worked as a sales assistant in a car dealership and earned {money}{emoji}.",
      },
    ];

    const min = guildData.WorkMinMoney ?? 300;
    const max = guildData.WorkMaxMoney ?? 3000;
    const currency = guildData.EmojiMoney;

    const money = Math.random() * (max - min) + min;

    const randomIndex = Math.floor(Math.random() * Phrases.length);
    const randomPhrase = Phrases[randomIndex][randomIndex + 1];

    const moneyEarned = money.toFixed(2);
    const phraseWithValues = randomPhrase
      .replace("{money}", ModuleFormat.en(parseInt(moneyEarned), 2))
      .replace("{emoji}", currency ?? ":coin:");

    guildData.lastWorkCommandTime = now;
    await guildData.save();

    // Responder com uma mensagem indicando o sucesso do work
    await interaction.deferReply();
    await interaction.deleteReply();
    const embed = new EmbedBuilder({
      title: "Success Alert",
      description: phraseWithValues,
      color: 0x00ff00,
      footer: { text: "© All rights reserved to AyzrusDev ©" },
      thumbnail: {
        url: "https://i.imgur.com/o2VwCM3.png",
      },
    });
    interaction.channel?.send({ embeds: [embed] });
  },
});
