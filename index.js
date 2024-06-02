// Basic imports
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
// Discord Bot
import { Client, Collection, GatewayIntentBits } from 'discord.js';
/*import IsUserIDOnCooldown from './modules/userCooldown.js';
import detectSwears from './modules/detectSwears.js';*/
const client = new Client({
	intents: Object.keys(GatewayIntentBits).map((a) => {
		return GatewayIntentBits[a]
	}),
});
// Commands initialization:
client.commands = new Collection();
let commandsPath = path.join(process.cwd(), 'globalCommands');
let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (let file of commandFiles) {
	let filePath = path.join(commandsPath, file);
	let command = await import(filePath);
	if ('slashCommand' in command && 'onExecution' in command) {
		client.commands.set(command.slashCommand.name, command);
	} else {
		console.warn(`The command at ${filePath} is missing a required "slashCommand" or "onExecution" property.`);
	}
}
let eventsPath = path.join(process.cwd(), 'clientEvents');
let eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (let file of eventFiles) {
	let filePath = path.join(eventsPath, file);
	let event = await import(filePath);
	if ('event' in event && 'frequency' in event && 'onExecution' in event) {
		client[event.frequency](event.event, /*(...args) =>*/ event.onExecution/*(...args)*/);
	} else {
		console.warn(`The command at ${filePath} is missing a required "event" or "frequency" or "onExecution" property.`);
	}
}
// ClientLogin
client.login(process.env.discordToken);
// Web Server
export default client;
import CreateHTTP from "./http.js";
CreateHTTP();