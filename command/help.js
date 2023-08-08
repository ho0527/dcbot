import {CommandInteraction,EmbedBuilder,SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {db,query,time} from "../link.js"

// help main START

export default{
    data:new SlashCommandBuilder()
        .setName("help")
        .setDescription("顯示機器人的指令列表"),
    async execute(event){
        try{
            let commandlist=event.client.command
            let embed=new EmbedBuilder()
                .setTitle("bot:"+event.client.user.username+" help")
                .setDescription("列出所有指令的詳細資訊")
                .setColor("#F8AA2A")


            for (let i=0;i<commandlist.length;i=i+1){
                let command=commandlist[i]

                embed.addFields({
                    name:"**"+command.data.name+"**",
                    value:command.data.description,
                    inline:true,
                })
            }

            embed.setTimestamp()

            await event.reply({ embeds:[embed],ephemeral:true })
            await event.followUp({ content:"完整api請察看此網址: http://hiiamchris.ddns.net/dcbot/index.html",ephemeral:true })
        }catch(error){
            console.log(chalk.red("{"+time()+"} 執行 /help 指令時發生錯誤："+error))
            await event.reply({ content:"發生錯誤，無法顯示指令列表。",ephemeral:true })
        }
    },
}