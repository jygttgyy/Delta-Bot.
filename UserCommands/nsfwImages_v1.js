import {
    ChannelType,
    SlashCommandBuilder,
    ApplicationIntegrationType
} from "discord.js";

export const slashCommand = new SlashCommandBuilder()
    .setName("imagensfw")
    .setDescription("Get an NSFW image")
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
    .addStringOption(option => option
        .setName("type")
        .setDescription("Type of image you want to get")
        .setRequired(true)
        .addChoices(
            { name: 'Ass', value: 'ass' },
            { name: 'Hentai', value: 'hentai' },
            { name: 'Milf', value: 'milf' },
            { name: 'Oral', value: 'oral' },
            { name: 'Paizuri', value: 'paizuri' },
            { name: 'Ecchi', value: 'ecchi' },
            { name: 'Ero', value: 'ero' },
		)
    )

export const onExecution = async (interaction) => {
    if (interaction.channel?.type==ChannelType.GuildText)
    if (!interaction.channel.nsfw) return 
    let finalType = interaction.options.getString("type")
    if (!finalType) return
    const response = await fetch("https://api.waifu.im/search?included_tags=" + finalType)
    if (!response.ok) return
    const json = await response.json();
    console.log(json)
    if (!json) return
    interaction.reply(json.images[0].url)
};
