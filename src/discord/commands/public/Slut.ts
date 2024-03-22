import { Command } from "#base";
import ModuleFormat from "#class";
import { db } from "#database";
import { log } from "#settings";
import { ApplicationCommandType, EmbedBuilder, time } from "discord.js";

type PhraseType = { [key: number]: string };

new Command({
  name: "slut",
  description: "Slut to earn some money",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
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

    const now = new Date();

    // Verificar se está em cooldown se sim alertar
    if (guildData.lastSlutCommandTime) {
      const lastExecution = new Date(guildData.lastSlutCommandTime);
      const cooldownTime = parseInt(guildData.SlutCooldown ?? "520");
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
        1: "In the haze of celebration, fate led me to a wild encounter at the bar. to earn {money}{emoji}.",
      },
      {
        2: "She was like a tempest in human form, sweeping me away in a whirlwind of excitement. to earn {money}{emoji}.",
      },
      {
        3: "As dawn broke, I found myself in a stranger's room, the remnants of the night's revelry scattered around us. to earn {money}{emoji}.",
      },
      {
        4: "Waking up to a scene of mystery, I couldn't help but wonder what adventures had unfolded. to earn {money}{emoji}.",
      },
      {
        5: "In the dim morning light, I caught a glimpse of something unexpected nestled in her bra. to earn {money}{emoji}.",
      },
      {
        6: "The thrill of the night faded as I discovered the shocking sight before me. to earn {money}{emoji}.",
      },
      {
        7: "With a mix of curiosity and apprehension, I reached for the unexpected bounty concealed within her lingerie. to earn {money}{emoji}.",
      },
      {
        8: "Fate had dealt me a hand I never expected, leaving me to ponder the implications of my discovery. to earn {money}{emoji}.",
      },
      {
        9: "In that fleeting moment, I wrestled with the moral dilemma of what to do with the unexpected windfall. to earn {money}{emoji}.",
      },
      {
        10: "The allure of the money clashed with my sense of right and wrong, leaving me torn between temptation and conscience. to earn {money}{emoji}.",
      },
      {
        11: "As I weighed my options, I couldn't shake the feeling that this encounter was about more than just chance. to earn {money}{emoji}.",
      },
      {
        12: "In the end, I made a choice that would forever alter the course of that fateful morning. to earn {money}{emoji}.",
      },
      {
        13: "With a mixture of guilt and resolve, I pocketed the money and prepared to leave, uncertain of what lay ahead. to earn {money}{emoji}.",
      },
      {
        14: "As I slipped out of her room, I couldn't help but wonder about the girl whose life intersected with mine so unexpectedly. to earn {money}{emoji}.",
      },
      {
        15: "The echoes of our night together lingered in my mind as I navigated the streets, haunted by the events that had transpired. to earn {money}{emoji}.",
      },
      {
        16: "In the cold light of day, the memory of our encounter felt like a dream, both surreal and unforgettable. to earn {money}{emoji}.",
      },
      {
        17: "As I counted the bills in my possession, I couldn't shake the feeling that I had stumbled into a story straight out of a novel. to earn {money}{emoji}.",
      },
      {
        18: "The events of that night served as a reminder of the unpredictable nature of life and the choices we make. to earn {money}{emoji}.",
      },
      {
        19: "With each step away from her room, I carried with me the weight of my decisions, uncertain of what the future held. to earn {money}{emoji}.",
      },
      {
        20: "In the end, I realized that sometimes the most profound lessons come from the most unexpected experiences. to earn {money}{emoji}.",
      },
    ];

    const min = guildData.SlutMinMoney ?? 300;
    const max = guildData.SlutMaxMoney ?? 3000;
    const currency = guildData.EmojiMoney;

    const money = Math.random() * (max - min) + min;

    const randomIndex = Math.floor(Math.random() * Phrases.length);
    const randomPhrase = Phrases[randomIndex][randomIndex + 1];

    const moneyEarned = money.toFixed(2);
    const phraseWithValues = randomPhrase
      .replace("{money}", ModuleFormat.en(parseInt(moneyEarned), 2))
      .replace("{emoji}", currency ?? ":coin:");

    userData.Money += Number(moneyEarned);
    await userData.save();
    guildData.lastSlutCommandTime = now;
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
