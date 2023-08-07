import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import music from "../utils/music.js"
import {db,query,time} from "../link.js"

export default{
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('恢復播放'),
	execute(interaction) {
		music.resume(interaction);
	},
};