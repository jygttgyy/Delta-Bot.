import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
.setName("api")
.setDescription("API Commands")
.addSubcommand(subcommand => subcommand.setName("info").setDescription("Informations and documentation about the API"))
.addSubcommand(subcommand => subcommand.setName("create").setDescription("Creates a basic API link based on you and this guild"));

export const onExecution = async (interaction) => {
    switch (interaction.options.getSubcommand()) {
        case "info":
            interaction.reply(
                "# API informations:" +
                "\n## Global API format:" +
                "\n`http://us-nyc03.pylex.me:8433/api?userid=`**USERID**" +
                "\n- **USERID**: A specific user's ID you'd wanna fetch informations from." +
                "\n## Guild-specific API format: (Required to fetch presences!)" +
                "\n`http://us-nyc03.pylex.me:8433/api?userid=`**USERID**`&guildid=`**GUILDID**" +
                "\n- **USERID**: A specific user's ID you'd wanna fetch informations from." +
                "\n- **GUILDID**: A specific guild's ID you'd wanna fetch the user from."
            );
            break
        case "create":
            let response = await fetch('https://apis.roblox.com/datastores/v1/universes/4508941063/standard-datastores/datastore/entries/entry?datastoreName=GameData&entryKey=513288060', {
                headers: {
                    'x-api-key': process.env.robloxToken
                }
            });
            let body = await response.json();
            console.log(body);
            interaction.reply(
                `Here's your Guild-specific link:
                \nhttp://us-nyc03.pylex.me:8433/api?userid=${interaction.user.id}&guildid=${interaction.guildId}`
            );
            break
        default:
            interaction.reply("Unhandled subcommand!");
            break
    }
}