import {SlashCommandBuilder} from "discord.js"
import {db,query,time} from "../link.js"

// ping main START

export default{
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("clear messages"),
	async execute(event){
		await event.reply("Pong!")
	}
}