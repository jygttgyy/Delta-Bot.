import { SlashCommandBuilder, PermissionFlagsBits, REST, Routes, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';

export const slashCommand = new SlashCommandBuilder()
.setName("commands")
.setDescription("Commands REST Interactions")
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.addSubcommand(subcommand => 
               subcommand
               .setName("refresh")
               .setDescription("Refreshes the guild's commands")
              )
.addSubcommand(subcommand =>
               subcommand
               .setName("reload")
               .setDescription("Reloads the commands stored in the cache")
              );

export const onExecution = async (inter) => {
    const interaction = inter;
    switch (interaction.options.getSubcommand()) {
        case "refresh":
            let commands = [];
            let commandsPath = path.join(process.cwd(), 'globalCommands');
            let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (let file of commandFiles) {
                let filePath = path.join(commandsPath, file);
                let command = require(filePath);
                if ('slashCommand' in command && 'onExecution' in command) {
                    commands.push(command.slashCommand.toJSON());
                } else {
                    console.warn('[WARNING] The command at + ' + filePath + ' is missing a required "slashCommand" or "onExecution" property.');
                }
            }
            let rest = new REST().setToken(process.env.discordToken);
            try {
                await interaction.deferReply();
                let data = await rest.put(
                    Routes.applicationGuildCommands(process.env.clientID, process.env.guildID),
                    { body: commands },
                );
                await interaction.followUp('Successfully refreshed ' + data.length + ' application (/) commands.');
            } catch (error) {
                console.error(error);
            }
            break
        case "reload":
            //interaction.client.commands = new Collection();
            for (let file of commandFiles) {
                let filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];
                let command = require(filePath);
                if ('slashCommand' in command && 'onExecution' in command) {
                    interaction.client.commands.delete(command.slashCommand.name);
                    interaction.client.commands.set(command.slashCommand.name, command);
                } else {
                    console.warn(`The command at ${filePath} is missing a required "slashCommand" or "onExecution" property.`);
                }
            }
            break
        default:
            interaction.reply("Unhandled subcommand!");
            break
    }
}