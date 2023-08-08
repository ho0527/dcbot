import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import music from "../utils/music.js"
import {db,query,time} from "../link.js"

export default{
	data:new SlashCommandBuilder()
		.setName("leave")
		.setDescription("讓機器人離開語音頻道（會清空歌曲隊列）"),
	execute(event){
		music.leave(event)
	},
}