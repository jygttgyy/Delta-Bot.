import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
	.setName('tempban')
	.setDescription('Bans a specified user for a given duration, in days.')
	.addUserOption(option => option
				   .setName('user')
				   .setDescription('The user to tempban.')
				   .setRequired(true)
				  )
	.addNumberOption(option => option
					 .setName('minutes')
					 .setDescription('Minutes of the duration.')
					 .setRequired(true)
					)
	.addNumberOption(option => option
					 .setName('hours')
					 .setDescription('Hours of the duration.')
					 .setRequired(true)
					)
	.addNumberOption(option => option
					 .setName('days')
					 .setDescription('Days of the duration.')
					 .setRequired(true)
					)
	.addStringOption(option => option
					 .setName('reason')
					 .setDescription('The reason to tempban the user.')
					 .setRequired(false)
					)
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function onExecution(interaction) {
	var user = interaction.options.getMember("user");
	var minutes = interaction.options.getNumber("minutes");
	var hours = interaction.options.getNumber("hours");
	var days = interaction.options.getNumber("days");
	var reason = interaction.options.getString("reason");
	if (user.permissions.has(PermissionFlagsBits.BanMembers) === false || user.permissions.has(PermissionFlagsBits.Administrator) === false) {
		user.createDM(true).then(dm => {
			dm.send("You have been banned from **" + interaction.guild.name + "** for a duration of **" + minutes + " minutes**, **" + hours + " hours**, **" + days + " days**!").then(() => {
				user.deleteDM().then(() => {
					user.ban({reason: reason ?? "No reason provided."});
				});
			});
		});
		await interaction.reply({ content: "You have successfully temp-banned **" + user.user + "** for a duration of **" + minutes + " minutes**, **" + hours + " hours**, **" + days + " days**!", ephemeral: true });
		console.log("User: " + user.user + "\nEvent: Temporary-banishment instored.\nDuration: " + minutes + " minutes, " + hours + " hours**, " + days + " days.")
		var total_time = (minutes * 60000) + (hours * 3600000) + (days * 86400000);
		function unban() {
			interaction.guild.bans.remove(user, "Temp-ban has now ended!");
			console.log("User: " + user.user + "\nEvent: Temporary-banishment expired.")
		}
		setTimeout(unban, total_time);
	} else if (user.permissions.has(PermissionFlagsBits.Administrator) === false && interaction.member.permissions.has(PermissionFlagsBits.Administrator) === true) {
		await user.ban({reason: reason ?? "No reason provided."});
		await interaction.reply({ content: "You have successfully temp-banned **" + user.displayName + "** for **" + duration + " days**!", ephemeral: true });
	} else {
		await interaction.reply({ content: "You cannot ban a user with ban permissions!", ephemeral: true })
	}
}