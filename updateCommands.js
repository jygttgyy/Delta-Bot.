const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(process.cwd(), 'globalCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('slashCommand' in command && 'onExecution' in command) {
		commands.push(command.slashCommand.toJSON());
	} else {
		console.warn('[WARNING] The command at + ' + filePath + ' is missing a required "slashCommand" or "onExecution" property.');
	}
}
const rest = new REST().setToken(process.env.discordToken);
(async () => {
	try {
		console.log('Started refreshing ' + commands.length + ' application (/) commands.');
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.clientID, process.env.guildID),
			{ body: commands },
		);
		console.log('Successfully reloaded ' + data.length + ' application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
/*
rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
rest.put(Routes.applicationCommands(process.env.clientID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
rest.delete(Routes.applicationGuildCommand(process.env.clientID, process.env.guildID, "commandID"))
    .then(() => console.log('Successfully deleted application command.'))
    .catch(console.error);
rest.delete(Routes.applicationCommand(process.env.clientID, "commandID"))
    .then(() => console.log('Successfully deleted application command.'))
    .catch(console.error);
*/