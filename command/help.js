import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {db,query,time} from "../link.js"

// help main START

export default{
    data:new SlashCommandBuilder()
        .setName("help")
        .setDescription("顯示機器人的指令列表"),
    async execute(event){
        try{
            let command=event.client.command;
            let response=command.map(function(event){ return "/"+event.data.name+" - "+event.data.description }).join("\n")
            response=response+"\n\n完整api可察看此網址: http://hiiamchris.ddns.net/dcbot/index.html"
            await event.reply({ content:response,ephemeral:true })
        }catch(error){
            console.log(chalk.red("{"+time()+"} 執行 /help 指令時發生錯誤："+error))
            await event.reply({ content:"發生錯誤，無法顯示指令列表。",ephemeral:true })
        }
    },
}