import {
    SlashCommandBuilder,
    ApplicationIntegrationType
} from "discord.js";

export const slashCommand = new SlashCommandBuilder()
    .setName("image")
    .setDescription("Get an image")
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
    .addStringOption(option => option
        .setName("type")
        .setDescription("Type of image you want to get")
        .setRequired(true)
        .addChoices(
            { name: 'Maid', value: 'maid' },
            { name: 'Waifu', value: 'waifu' },
            { name: 'Marin Kitagawa', value: 'marin-kitagawa' },
            { name: 'Mori Calliope', value: 'mori-calliope' },
            { name: 'Raiden Shogun', value: 'raiden-shogun' },
            { name: 'Oppai (Not NSFW)', value: 'oppai' },
            { name: 'Taking a Selfie', value: 'selfies' },
            { name: 'Kamisato Ayaka', value: 'kamisato-ayaka' },
            { name: 'In Uniform', value: 'uniform' },
		)
    )

export const onExecution = async (interaction) => {
    let finalType = interaction.options.getString("type")
    if (!finalType) return
    const response = await fetch("https://api.waifu.im/search?included_tags=" + finalType)
    if (!response.ok) return
    const json = await response.json();
    console.log(json)
    if (!json) return
    interaction.reply(json.images[0].url)
};
