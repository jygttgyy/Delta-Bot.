import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";

export const slashCommand = new SlashCommandBuilder()
	.setName("api")
	.setDescription("API Commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("info")
			.setDescription("Informations and documentation about the API"),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("create")
			.setDescription(
				"Creates a basic API link based on you and this guild",
			),
	)
	.addSubcommandGroup((subcommandGroup) =>
		subcommandGroup
			.setName("data")
			.setDescription("Interacts with the Roblox database")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("datastores")
				.setDescription("Lists the datastores"),
		)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("list")
					.setDescription("Lists the datastore's keys"),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("get")
					.setDescription("Gets a user's saved data")
					.addStringOption((option) =>
						option
							.setName("key")
							.setDescription("The entry's key")
							.setMaxLength(20)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("version")
							.setDescription("The entry's version")
							.setMaxLength(50),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("set")
					.setDescription("Sets a user's data")
					.addStringOption((option) =>
						option
							.setName("key")
							.setDescription("The entry's key")
							.setMaxLength(20)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("value")
							.setDescription("The entry's value")
							.setMaxLength(100)
							.setRequired(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("versions")
					.setDescription("Lists the latest version of a user's data")
					.addStringOption((option) =>
						option
							.setName("key")
							.setDescription("The entry's key")
							.setMaxLength(20)
							.setRequired(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("delete")
					.setDescription("Deletes a user's data")
					.addStringOption((option) =>
						option
							.setName("key")
							.setDescription("The entry's key")
							.setMaxLength(20)
							.setRequired(true),
					),
			),
	);
var links = {}
links.base = `https://apis.roblox.com/datastores/v1/universes`;
links.game = `${links.base}/${process.env.robloxID}/standard-datastores`;
links.entries = `${links.game}/datastore/entries`;
links.entry = `${links.entries}/entry`;
links.increment = `${links.entry}/increment`;
links.versions = `${links.entry}/versions`;
links.version = `${links.versions}/version`;

const methods = {
	gameGet: async () => {
		let response = await fetch(links.game, {
			method: "GET",
			headers: {
				"x-api-key": process.env.robloxToken,
			},
		});
		if (!response.ok) {
			throw new Error("Failed to get datastores!\n" + response.status);
		}
		let content = await response.json();
		let datastores = []
		content.datastores.forEach((data) => {
			datastores.push(data.name);
		});
		return datastores;
	},
	entries: async (datastoreName) => {
		let response = await fetch(
			`${links.entries}?datastoreName=${datastoreName}`,
			{
				method: "GET",
				headers: {
					"x-api-key": process.env.robloxToken,
				},
			},
		);
		if (!response.ok) {
			throw new Error("Failed to get entries!\n" + response.status);
		}
		let content = await response.json();
		let entries = []
		content.keys.forEach((data) => {
			entries.push(data.key);
		});
		return entries;
	},
	entryGet: async (datastoreName, entryKey) => {
		let response = await fetch(
			`${links.entry}?datastoreName=${datastoreName}&entryKey=${entryKey}`,
			{
				method: "GET",
				headers: {
					"x-api-key": process.env.robloxToken,
				},
			},
		);
		if (!response.ok) {
			throw new Error("Failed to get entry!\n" + response.status);
		}
		return await response.json();
	},
	entrySet: async (datastoreName, entryKey, value = "") => {
		let response = await fetch(
			`${links.entry}?datastoreName=${datastoreName}&entryKey=${entryKey}`,
			{
				body: value,
				method: "POST",
				headers: {
					"x-api-key": process.env.robloxToken,
				},
			},
		);
		if (!response.ok) {
			throw new Error("Failed to set entry!\n" + response.status);
		}
		return await response.json();
	},
	entryDelete: async (datastoreName, entryKey) => {
		let response = await fetch(
			`${links.entry}?datastoreName=${datastoreName}&entryKey=${entryKey}`,
			{
				method: "DELETE",
				headers: {
					"x-api-key": process.env.robloxToken,
				},
			},
		);
		if (!response.ok) {
			throw new Error("Failed to delete entry!\n" + response.status);
		}
		return false;
	},
	entryIncrement: async (datastoreName, entryKey, incrementValue = 0) => {
		let response = await fetch(
			`${links.entry}?datastoreName=${datastoreName}&entryKey=${entryKey}&incrementBy=${incrementValue}`,
			{
				method: "POST",
				headers: {
					"x-api-key": process.env.robloxToken,
				},
			},
		);
		if (!response.ok) {
			throw new Error("Failed to set entry!\n" + response.status);
		}
		if (response.status === 204) {
			return false;
		}
		return await response.json();
	},
	entryVersionGet: async (datastoreName, entryKey, versionId) => {
		let response = await fetch(
			`${links.version}?datastoreName=${datastoreName}&entryKey=${entryKey}&versionId=${versionId}`,
			{
				method: "GET",
				headers: {
					"x-api-key": process.env.robloxToken,
				},
			},
		);
		if (!response.ok) {
			throw new Error("Failed to set entry!\n" + response.status);
		}
		return await response.json();
	},
	entryVersionsGet: async (datastoreName, entryKey) => {
		let response = await fetch(
			`${links.versions}?datastoreName=${datastoreName}&entryKey=${entryKey}`,
			{
				method: "GET",
				headers: {
					"x-api-key": process.env.robloxToken,
				},
			},
		);
		if (!response.ok) {
			throw new Error("Failed to set entry!\n" + response.status);
		}
		return await response.json();
	},
};

let button = new ButtonBuilder()
	.setCustomId("nextCursor")
	.setLabel("Next Cursor")
	.setStyle(ButtonStyle.Secondary);

const nextCursor = new ActionRowBuilder().addComponents(button);

export const onExecution = async (interaction) => {
	switch (interaction.options.getSubcommandGroup()) {
		case "data":
			let response, key, body, version;
			await interaction.deferReply();
			switch (interaction.options.getSubcommand()) {
				case "datastores":
					try {
						body = await methods.gameGet();
					} catch (error) {
						console.log(error);
						await interaction.followUp(error);
						break;
					} finally {
						await interaction.followUp(
							"```json\n" +
								JSON.stringify(body, null, "\t") +
								"\n```",
						);
					}
					break;
				case "list":
					try {
						body = methods.entries("GameData");
					} catch (error) {
						await interaction.followUp(error);
						break;
					} finally {
						await interaction.followUp(
							"```json\n" +
								JSON.stringify(body, null, "\t") +
								"\n```",
						);
					}
					break;
				case "get":
					key = interaction.options.getString("key");
					version = interaction.options.getString("version");
					try {
						if (version) {
							body = methods.entryVersionGet("GameData", key, version);
						} else {
							body = methods.entryGet("GameData", key);
						}
					} catch (error) {
						await interaction.followUp(error);
						break;
					} finally {
						await interaction.followUp(
							"```json\n" +
								JSON.stringify(body, null, "\t") +
								"\n```",
						);
					}
					break;
				case "set":
					key = interaction.options.getString("key");
					body = methods.entryGet("GameData", key);
					body.Coins = interaction.options.getString("value");
					try {
						body = methods.entrySet("GameData", key, body);
					} catch (error) {
						await interaction.followUp(error);
						break;
					} finally {
						await interaction.followUp(
							"```json\n" +
								JSON.stringify(body, null, "\t") +
								"\n```",
						);
					}
					break;
				case "delete":
					key = interaction.options.getString("key");
					try {
						methods.entryDelete("GameData", key);
					} catch (error) {
						await interaction.followUp(error);
						break;
					} finally {
						await interaction.followUp("Entry successfully deleted!");
					}
					break;
				case "versions":
					key = interaction.options.getString("key");
					try {
						body = methods.entryVersionsGet("GameData", key);
					} catch (error) {
						await interaction.followUp(error);
						break;
					} finally {
						await interaction.followUp(
							"```json\n" +
								JSON.stringify(body, null, "\t") +
								"\n```",
						);
					}
					break;
				default:
					await interaction.followUp("Unhandled subcommand!");
					break;
			}
			break;
		default:
			switch (interaction.options.getSubcommand()) {
				case "info":
					await interaction.reply(
						"# API informations:\n" +
							"## Global API format:\n" +
							"`http://us.pylex.me:8667/api?userid=`**USERID**\n" +
							"- **USERID**: A specific user's ID you'd wanna fetch informations from.\n" +
							"## Guild-specific API format: (Required to fetch presences!)\n" +
							"`http://us.pylex.me:8667/api?userid=`**USERID**`&guildid=`**GUILDID**\n" +
							"- **USERID**: A specific user's ID you'd wanna fetch informations from.\n" +
							"- **GUILDID**: A specific guild's ID you'd wanna fetch the user from.",
					);
					break;
				case "create":
					await interaction.reply(
						`Here's your Guild-specific link:\nhttp://us.pylex.me:8667/api?userid=${interaction.user.id}&guildid=${interaction.guildId}`,
					);
					break;
				default:
					await interaction.reply("Unhandled subcommand!");
					break;
			}
			break;
	}
};
