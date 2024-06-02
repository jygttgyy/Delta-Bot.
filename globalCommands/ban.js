import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const slashCommand = new SlashCommandBuilder().setName('ban').setDescription('Bans a specified user for a certain reason.')
.addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
.addStringOption(option => option.setName('reason').setDescription('The reason to ban the user').setRequired(false))
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function onExecution(interaction) {
    let user = interaction.options.getMember("user");
	let reason = interaction.options.getString("reason");
    if (user.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply("Cannot ban a user with administrator permissions!");
    } else if (user.permissions.has(PermissionFlagsBits.BanMembers) && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
		await user.ban({reason: reason ?? "No reason provided."});
        await interaction.reply(`Successfully banned **"${user.displayName}"**!`);
    } else {
		await user.ban({reason: reason ?? "No reason provided."});
        await interaction.reply(`Successfully banned **${user.displayName}"**!`);
    }
}