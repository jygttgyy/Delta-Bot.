// Basic imports
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
// Discord Bot
import { Client, Collection, GatewayIntentBits } from 'discord.js'
/*import IsUserIDOnCooldown from './modules/userCooldown.js';
import detectSwears from './modules/detectSwears.js';*/
const client = new Client({
	intents: Object.keys(GatewayIntentBits).map(a => {
		return GatewayIntentBits[a]
	}),
});
// Commands initialization:
client.commands = new Collection();
{
    const commandsPath = path.join(process.cwd(), 'GuildCommands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (let file of commandFiles) {
        let filePath = path.join(commandsPath, file);
        let command = await import(filePath);
        if (!'slashCommand' in command || !'onExecution' in command)
            console.warn(`The command at ${filePath} is missing a required property.`)
        else client.commands.set(command.slashCommand.name, command)
    }
}
{
    const commandsPath = path.join(process.cwd(), 'UserCommands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (let file of commandFiles) {
        let filePath = path.join(commandsPath, file);
        let command = await import(filePath);
        if (!'slashCommand' in command || !'onExecution' in command)
            console.warn(`The command at ${filePath} is missing a required property.`)
        else client.commands.set(command.slashCommand.name, command)
    }
}
let eventsPath = path.join(process.cwd(), 'ClientEvents');
let eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))
for (let file of eventFiles) {
	let filePath = path.join(eventsPath, file);
	let event = await import(filePath);
	if (!'event' in event || !'frequency' in event || !'onExecution' in event)
        console.warn(`The command at ${filePath} is missing a required property.`)
	else client[event.frequency](event.event, event.onExecution);
}
// ClientLogin
client.login(process.env.discordToken);
// Web Server
export default client;
//import CreateHTTP from "./http.js";
//CreateHTTP();
