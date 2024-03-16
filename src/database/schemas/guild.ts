import { Schema } from "mongoose";
export const guildSchema = new Schema(
  {
    guildId: {
      type: String,
      required: false,
    },
    guildName: {
      type: String,
      required: false,
    },
    EmojiMoney: {
      default: ":coin:",
      type: String,
      required: false,
    },
    //Region Rob
    RobCooldown: {
      default: "300",
      type: String,
      required: false,
    },
    lastRobCommandTime: {
      type: Date,
      required: false,
    },
    ChanceToRob: {
      default: 50,
      type: Number,
      required: false,
    },
    PercentageOfTheft: {
      default: 50,
      type: Number,
      required: false,
    },
    //End Region Rob
    //Region Work
    lastWorkCommandTime: {
      type: Date,
      required: false,
    },
    WorkCooldown: {
      default: "120",
      type: String,
      required: false,
    },
    WorkMinMoney: {
      default: 300,
      type: Number,
      required: false,
    },
    WorkMaxMoney: {
      default: 3000,
      type: Number,
      required: false,
    },
    //End Region Work
  },
  {
    statics: {
      async get(id: string) {
        return (
          (await this.findOne({ guildId: id })) ?? this.create({ guildId: id })
        );
      },
    },
  }
);
