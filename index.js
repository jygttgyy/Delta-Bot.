// Discord Bot
import { Client, Collection, GatewayIntentBits, Events, ActivityType, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, GuildMemberManager, Status } from 'discord.js';
import { IsUserIDOnCooldown } from './modules/userCooldown.js';
const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => {
        return GatewayIntentBits[a]
    }),
});
// Commands initialization:
import fs from 'fs';
import path from 'path';
client.commands = new Collection();
var commandsPath = path.join(process.cwd(), 'globalCommands');
var commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (var file of commandFiles) {
	var filePath = path.join(commandsPath, file);
	var command = require(filePath);
	if ('slashCommand' in command && 'onExecution' in command) {
		client.commands.set(command.slashCommand.name, command);
	} else {
		console.warn(`The command at ${filePath} is missing a required "slashCommand" or "onExecution" property.`);
	}
}
var eventsPath = path.join(process.cwd() /*__dirname*/, 'clientEvents');
var eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (var file of eventFiles) {
	var filePath = path.join(eventsPath, file);
	var event = require(filePath);
	if ('event' in event && 'frequency' in event && 'onExecution' in event) {
		client[event.frequency](event.event, /*(...args) =>*/ event.onExecution/*(...args)*/)
	} else {
		console.warn(`The command at ${filePath} is missing a required "event" or "frequency" or "onExecution" property.`);
	}
}
// Swears detector
import detectSwears from './modules/detectSwears.js'
// Web Server
import { createServer } from 'http';
createServer(async function HandleRequest(request, response) {
    let url = new URL(request.url, "http://us-nyc03.pylex.me:8433");
    switch (url.pathname) {
        case "/api":
            if (url.searchParams.has("userid") === false) {
                await response.writeHead(510, { "Content-Type": "text/plain" });
            	await response.write("No UserID specified");
                break;
            }
    		if (url.searchParams.has("guildid") === false) {
                let user = null;
                try {
                    user = await client.users.fetch(url.searchParams.get("userid"));
                } catch (error) {
                    user = false;
                }
                if (user) {
                    let str = JSON.stringify(user, null, '\t');
                    await response.writeHead(200, { "Content-Type": "application/json" });
                    await response.write(str);
                } else {
                    await response.writeHead(510, { "Content-Type": "text/plain" });
                    await response.write("Wrong UserID specified");
                }
            } else {
                let guild = null;
                try {
                    guild = await client.guilds.fetch(url.searchParams.get("guildid"));
                } catch {
                    guild = false;
                }
                if (guild) {
                    let user = null;
                    try {
                        user = await guild.members.fetch({ user: url.searchParams.get("userid"), withPresences: true });
                    } catch {
                        user = false;
                    }
                    if (user != null) {
                        let finaluser = JSON.parse(JSON.stringify(user));
                        if (user.presence == null) {
                            finaluser.presence = {
                                "status": "offline",
                                "activities": [],
                                "clientStatus": {
                                    "web": "offline"
                                }
                            };
                        } else {
                            finaluser.presence = user.presence;
                            delete finaluser.presence.userId;
                            delete finaluser.presence.guild;
                        }
                        let str = JSON.stringify(finaluser, null, '\t');
                        await response.writeHead(200, { "Content-Type": "application/json" });
                        await response.write(str);
                    } else {
                        await response.writeHead(510, { "Content-Type": "text/plain" });
                        await response.write("Wrong UserID specified");
                    }
                } else {
                    await response.writeHead(510, { "Content-Type": "text/plain" });
                    await response.write("Wrong GuildID specified");
                }
            }
            break
        default:
            await response.writeHead(404, { "Content-Type": "text/plain" });
            await response.write("Error 404\nPage Not Found");
            break
    }
    await response.end();
}).listen(8433);
client.login(process.env.discordToken);