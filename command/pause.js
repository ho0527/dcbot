import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import music from "../utils/music.js"
import {db,query,time} from "../link.js"

export default{
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('暫停音樂'),
	execute(interaction) {
		music.pause(interaction);
	},
};