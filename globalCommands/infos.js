import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const startingTime = Date.now();

export const slashCommand = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Replies with bot informations.')

export async function onExecution(interaction) {
    var time = Date.now();
	await interaction.reply("The bot has been running for **" + Math.round(-(startingTime - time)/3600000) + "** hours");
}