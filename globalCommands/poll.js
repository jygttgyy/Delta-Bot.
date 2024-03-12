import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType }  from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
.setName('poll')
.setDescription('Creates a public poll.')

export async function onExecution(interaction) {
    const select = new StringSelectMenuBuilder()
    .setCustomId('starter')
    .setPlaceholder('Make a selection!')
    .addOptions(
        new StringSelectMenuOptionBuilder()
        .setLabel('Bear+')
        //.setDescription('')
        .setValue('0'),
        new StringSelectMenuOptionBuilder()
        .setLabel('Bear-')
        .setDescription('E')
        .setValue('1'),
    );
    const row = new ActionRowBuilder()
    .addComponents(select);
    const response = await interaction.reply({
        content: '# Bear+ Poll\n## Bear+ Votes: 0\n## Bear- Votes: 0',
        components: [row],
    });
    const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect }); //, time: 3_600_000
    var votes = [0, 1]
    collector.on('collect', async i => {
        const selection = i.values[0];
        votes[selection] += 1;
        await interaction.editReply('# Bear+ Poll\n## Bear+ Votes: ' + votes[0] + '\n## Bear- Votes: ' + votes[1]);
        //await i.reply(`${i.user} has selected ${selection}!`);
    });
}