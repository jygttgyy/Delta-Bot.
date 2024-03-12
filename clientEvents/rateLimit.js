import { Events } from 'discord.js';

export const event = Events.RateLimit;
export const frequency = "on";
export const onExecution = (info) => {
    console.log("Rate-limited")
	//console.log(info);
}