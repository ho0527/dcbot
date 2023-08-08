import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import music from "../utils/music.js"
import {db,query,time} from "../link.js"

export default{
	data:new SlashCommandBuilder()
		.setName("play")
		.setDescription("播放音樂")
		.addStringOption(function(event){
			return event.setName("url")
				.setDescription("提供 Youtube url 網址")
				.setRequired(true)
		}),
	async execute(event){
		await music.play(event)
	},
};