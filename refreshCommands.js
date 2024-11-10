import {
    ApplicationIntegrationType,
    InteractionContextType,
	REST,
	Routes
} from "discord.js";
import fs from "fs";
import path from "path";
import 'dotenv/config';

let commands = []
{
    const commandsPath = path.join(process.cwd(), 'GuildCommands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (let file of commandFiles) {
        let filePath = path.join(commandsPath, file);
        let command = await import(filePath);
        if (!'slashCommand' in command || !'onExecution' in command)
            console.warn(`The command at ${filePath} is missing a required property.`)
        else {
            command.slashCommand.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
            command.slashCommand.setContexts([InteractionContextType.Guild])
            commands.push(command.slashCommand.toJSON())
        }
    }
}
{
    const allChannels = [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]
    const commandsPath = path.join(process.cwd(), 'UserCommands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (let file of commandFiles) {
        let filePath = path.join(commandsPath, file);
        let command = await import(filePath);
        if (!'slashCommand' in command || !'onExecution' in command)
            console.warn(`The command at ${filePath} is missing a required property.`)
        else {
            command.slashCommand.setIntegrationTypes(ApplicationIntegrationType.UserInstall)
            command.slashCommand.setContexts(allChannels)
            commands.push(command.slashCommand.toJSON())
        }
    }
}
console.log(commands)
const rest = new REST().setToken(process.env.discordToken);
//*
try {
    await rest.put(
        Routes.applicationCommands(
            process.env.clientID
        ),
        { body: commands },
    );
} catch (error) {
    console.error(error);
}
//*/
/*
rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
rest.put(Routes.applicationCommands(process.env.clientID), { body: [] })
	.then(() => console.log('Successfully deleted all commands.'))
	.catch(console.error);
//*/
/*
rest.delete(Routes.applicationGuildCommand(process.env.clientID, process.env.guildID, "commandID"))
    .then(() => console.log('Successfully deleted application command.'))
    .catch(console.error);
rest.delete(Routes.applicationCommand(process.env.clientID, "commandID"))
    .then(() => console.log('Successfully deleted application command.'))
    .catch(console.error);
//*/
