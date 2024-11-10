import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ApplicationIntegrationType
} from "discord.js";

export const slashCommand = new SlashCommandBuilder()
    .setName("casino")
    .setDescription("Casino feature")
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
    .addSubcommand((subcommand) =>
        subcommand
        .setName("info")
        .setDescription("Tells you infos about the casino"),
    )
    .addSubcommand((subcommand) =>
        subcommand
        .setName("spin")
        .setDescription("Starts spinning the slot machine!")
        .addNumberOption((option) =>
            option
            .setName("bid")
            .setDescription(
                "The amount you're willing to bid [MAX ¢20]",
            )
            .setRequired(true),
        ),
    );
let button1 = new ButtonBuilder()
    .setCustomId("againCasino")
    .setLabel("Try Again?")
    .setStyle(ButtonStyle.Success);
let button2 = new ButtonBuilder()
    .setCustomId("endCasino")
    .setLabel("Give Up")
    .setStyle(ButtonStyle.Danger);
let button3 = new ButtonBuilder()
    .setCustomId("againCasino")
    .setLabel("Double Or Nothing?")
    .setStyle(ButtonStyle.Success);

const tryAgain = new ActionRowBuilder().addComponents(button1, button2);
const doubleOrNothing = new ActionRowBuilder().addComponents(button3, button2);
const spin = async (bid, interaction) => {
    const collectorFilter = i => i.user.id === interaction.user.id;
    loop: while (true) {
        await interaction.editReply(
            `Spinning the slot machine with ¢${bid} inserted...`,
        );
        await new Promise((res) => {
            setTimeout(res, 4000);
        });
        let rdm = Math.floor(Math.random() * 100);
        let response;
        if (rdm == 0) {
            bid *= 5;
            response = await interaction.editReply({
                content: `You've hit the jackpot and 5xed your bid, you're now at ¢${bid}.`,
                components: [doubleOrNothing],
            });
        } else if (rdm <= 30) {
            bid *= 2;
            response = await interaction.editReply({
                content: `You've won and 2xed your bid, you're now at ¢${bid}.`,
                components: [doubleOrNothing],
            });
        } else {
            response = await interaction.editReply({
                content:
                "You've lost **everything**!\nWould you like to try again with the same bid or give up?",
                components: [tryAgain],
            });
        }
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 30_000,
            });
            if (confirmation.customId === "againCasino") {
                await confirmation.update({
                    content: `Going for another round at ${bid}`,
                    components: [],
                });
            } else if (confirmation.customId === "endCasino") {
                await confirmation.update({
                    content: "Thanks for gambling with us,\nsee you next time!",
                    components: [],
                });
                break loop;
            }
        } catch (e) {
            break loop;
        }
    }
};

export const onExecution = async (interaction) => {
    switch (interaction.options.getSubcommand()) {
        case "info":
            interaction.reply(
                "## Probabilities:" +
                "\n### Jackpot: 1/100 --> 5x the bid" +
                "\n### Win: 30/100 --> 2x the bid" +
                "\n### Loose: 69/100 --> Nothing",
            );
            break;
        case "spin":
            let bid = interaction.options.getNumber("bid");
            if (bid > 20) {
                await interaction.reply(
                    "The bid cannot be bigger than **¢20**!",
                );
                break;
            }
            await interaction.reply("===== Bear+ Casino =====");
            spin(bid, interaction);
            break;
        default:
            interaction.editReply("Unhandled subcommand!");
            break;
    }
};
