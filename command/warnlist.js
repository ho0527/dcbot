import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {setTimeout} from 'node:timers/promises'
import {db,query,time} from "../link.js"

// warn main START
export default{
    data:new SlashCommandBuilder()
        .setName("getwarnlist")
        .setDescription("user warnlist"),
    async execute(event){
        event.reply({
            content: `請點選此網址查看! https://hiiamchris.ddns.net/dcbot/warnlist?guildid=${event.guildId}.`,
        })
    },
}