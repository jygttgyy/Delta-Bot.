import { Events, ActivityType, Status } from 'discord.js';
let time = Date.now();
const activity = [
	{
		name: 'Delta Dev.',
		type: ActivityType.Watching
	},
	{
		name: 'Server 69',
		type: ActivityType.Listening
	}
]
const changeStatus = (client) => {
	client.user.setActivity(activity[Math.floor(Math.random() * (activity.length - 1))]);
	setTimeout(changeStatus, 60000, client);
}
export const event = Events.ClientReady;
export const frequency = "once";
export const onExecution = (client) => {
	//client.user.setAvatar('DeltaBotPfP.gif');
	console.log(`Logged in as ${client.user.tag}!\nTime to start: ${Math.round((Date.now() - time)/1000)}s`);
	changeStatus(client);
}