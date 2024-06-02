import { Events } from 'discord.js';
import IsUserIDOnCooldown from './../modules/userCooldown.js';
import fs from 'fs';

export const event = Events.InteractionCreate;
export const frequency = "on";
export const onExecution = (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	if (IsUserIDOnCooldown(interaction.user.id)) return;
	let command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.warn(`No command matching ${interaction.commandName} was found.`);
		interaction.reply({ content: `No command named "${interaction.commandName}" was found!`, ephemeral: true })
		return;
	}
	//console.log(interaction);
	try {
		command.onExecution(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}