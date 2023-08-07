import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import music from "../utils/music.js"
import {db,query,time} from "../link.js"

export default{
	data: new SlashCommandBuilder()
		.setName('deleteplaylist')
		.setDescription('刪除播放清單中的所有歌曲')
		.addStringOption(option => option.setName('id').setDescription('提供播放清單的 ID 識別碼').setRequired(true)),
	execute(interaction) {
		music.deletePlayList(interaction);
	},
};