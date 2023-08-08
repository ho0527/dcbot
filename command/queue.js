import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import music from "../utils/music.js"
import {db,query,time} from "../link.js"

export default{
	data:new SlashCommandBuilder()
		.setName("queue")
		.setDescription("查看目前歌曲隊列"),
	execute(event){
		music.nowQueue(event)
	},
}