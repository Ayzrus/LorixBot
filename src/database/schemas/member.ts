import { Schema } from "mongoose";

export const memberSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    guildId: {
      type: String,
      required: false,
    },
    guildName: {
      type: String,
      required: false,
    },
    Money: {
      default: 0,
      type: Number,
      required: true,
    },
    Bank: {
      default: 0,
      type: Number,
      required: true,
    },
    Total: {
      default: 0,
      type: Number,
      required: true,
    },
  },
  {
    statics: {
      async get(member: { id: string; guild: { id: string } }) {
        const query = { id: member.id, guildId: member.guild.id };
        return (await this.findOne(query)) ?? this.create(query);
      },
    },
  }
);
