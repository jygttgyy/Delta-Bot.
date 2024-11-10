import {
    SlashCommandBuilder,
    ApplicationIntegrationType
} from "discord.js";

export const slashCommand = new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice")
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
    .addNumberOption(option => option
        .setName("faces")
        .setDescription("Amount of faces the dice has")
    )

export const onExecution = async (interaction) => {
    let faces = interaction.options.getNumber("faces")
    if (!faces) faces = 6
    interaction.reply(Math.ceil(Math.random() * faces).toString())
};
