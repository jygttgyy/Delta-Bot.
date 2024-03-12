import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
.setName("casino")
.setDescription("Casino feature")
.addSubcommand(subcommand => subcommand
               .setName("info")
               .setDescription("Tells you infos about the casino")
              )
.addSubcommand(subcommand => subcommand
               .setName("spin")
               .setDescription("Starts spinning the slot machine!")
               .addNumberOption(option => option
                                .setName("bid")
                                .setDescription("The amount you're willing to bid [MAX ¢20]")
                                .setRequired(true)
                               )
              );

export const onExecution = async (interaction) => {
    switch (interaction.options.getSubcommand()) {
        case "info":
            interaction.reply(
                "## Probabilities:"
				+ "\n### Jackpot: 1/100 --> 5x the bid"
				+ "\n### Win: 29/100 --> 2x the bid"
				+ "\n### Loose: 70/100 --> Nothing"
            );
            break
        case "spin":
            let bid = interaction.options.getNumber('bid');
            if (bid > 20) {
                interaction.reply("The bid cannot be bigger than **¢20**!");
                break
            }
            interaction.reply(`Spinning the slot machine with ¢${bid} inserted...`);
			await new Promise((resolve) => {setTimeout(resolve, 4000);});
			let rdm = Math.floor(Math.random() * 100);
            if (rdm == 0) {
                interaction.editReply(`You've hit the jackpot and 10xed your bid, you're now at ¢${bid * 10}.`);
            } else if (rdm >= 49) {
                interaction.editReply(`You've won and 2xed your bid, you're now at ¢${bid * 2}.`)
            } else {
                interaction.editReply(`You've lost **everything**, better luck next time!`)
            }
            break 
        default:
            interaction.editReply("Unhandled subcommand!");
            break
    }
}