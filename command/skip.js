import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import music from "../utils/music.js"
import {db,query,time} from "../link.js"

export default{
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('跳過這首歌'),
	execute(interaction) {
		music.skip(interaction);
	},
};