import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a specified user for a certain reason.')
    .addUserOption(option => option
                   .setName('user')
                   .setDescription('The user to ban')
                   .setRequired(true)
                  )
    .addStringOption(option => option
                     .setName('reason')
                     .setDescription('The reason to ban the user')
                     .setRequired(false)
                    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
    
export async function onExecution(interaction) {
    var user = interaction.options.getMember("user");
	var reason = interaction.options.getString("reason");
	if (user.permissions.has(PermissionFlagsBits.BanMembers) === false || user.permissions.has(PermissionFlagsBits.Administrator) === false) {
		await user.ban({reason: reason ?? "No reason provided."});
		await interaction.reply("You have successfully banned **" + user.displayName + "!**");
	} else if (user.permissions.has(PermissionFlagsBits.Administrator) === false && interaction.member.permissions.has(PermissionFlagsBits.Administrator) === true) {
		await user.ban({reason: reason ?? "No reason provided."});
		await interaction.reply("You have successfully banned **" + user.displayName + "!**");
	} else {
		await interaction.reply("You cannot ban a user with ban permissions!");
	}
}