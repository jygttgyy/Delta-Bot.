import { Events } from 'discord.js';
import { IsUserIDOnCooldown } from './../modules/userCooldown.js';

export const event = Events.MessageCreate;
export const frequency = "on";
export const onExecution = (message) => {
    if (message.author.bot) return;
    if (IsUserIDOnCooldown(message.author.id)) return;
	if (message.mentions.has(message.client.user.id) && message.inGuild()) {
        //message.channel.send(`Hello **${message.member.user.globalName}**!\nWhat do you need help with?`);
        message.client.commands.get('refresh').onExecution(message);
    }
}