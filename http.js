import client from "./index.js";
import { createServer } from "http";
async function HandleRequest(request, response) {
	let url = new URL(request.url, "http://us-nyc03.pylex.me:8433");
	switch (url.pathname) {
		case "/api":
			if (url.searchParams.has("userid") === false) {
				await response.writeHead(510, {
					"Content-Type": "text/plain",
				});
				await response.write("No UserID specified");
				break;
			}
			if (url.searchParams.has("guildid") === false) {
				let user = null;
				try {
					user = await client.users.fetch(
						url.searchParams.get("userid"),
					);
				} catch (error) {
					user = false;
				}
				if (user) {
					let str = JSON.stringify(user, null, "\t");
					await response.writeHead(200, {
						"Content-Type": "application/json",
					});
					await response.write(str);
				} else {
						await response.writeHead(510, {
							"Content-Type": "text/plain",
						});
						await response.write("Wrong UserID specified");
					}
				} else {
				let guild = null;
				try {
					guild = await client.guilds.fetch(
						url.searchParams.get("guildid"),
					);
				} catch {
					guild = false;
				}
				if (guild) {
					let user = null;
					try {
						user = await guild.members.fetch({
							user: url.searchParams.get("userid"),
							withPresences: true,
						});
					} catch {
						user = false;
					}
					if (user != null) {
						let finaluser = JSON.parse(JSON.stringify(user));
						if (user.presence == null) {
							finaluser.presence = {
								status: "offline",
								activities: [],
								clientStatus: {
									web: "offline",
								},
							};
						} else {
							finaluser.presence = user.presence;
							delete finaluser.presence.userId;
							delete finaluser.presence.guild;
						}
						let str = JSON.stringify(finaluser, null, "\t");
						await response.writeHead(200, {
							"Content-Type": "application/json",
						});
						await response.write(str);
					} else {
						await response.writeHead(510, {
							"Content-Type": "text/plain",
						});
						await response.write("Wrong UserID specified");
					}
				} else {
					await response.writeHead(510, {
						"Content-Type": "text/plain",
					});
					await response.write("Wrong GuildID specified");
				}
			}
			break;
		default:
			await response.writeHead(404, { "Content-Type": "text/plain" });
			await response.write("Error 404\nPage Not Found");
			break;
	}
	await response.end();
}
export default function CreateHTTP() {
	createServer(HandleRequest).listen(8667);
}
