import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';


export const slashCommand = new SlashCommandBuilder()
  .setName('userdata')
  .setDescription('Replies with jygttgyy\' current profile informations.');

export async function onExecution(interaction, client) {
    let user = await client.users.fetch('701017644010176515');
    console.log(user);
    let str = JSON.stringify(user, null, '\t')
    /*var regex = new RegExp(',', 'g');
    str = str.replace(regex, ',\n');*/
    interaction.reply(str
                     );
}