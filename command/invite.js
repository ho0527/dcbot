import {ActionRowBuilder,ButtonBuilder,ButtonStyle,ChatInputCommandInteraction,EmbedBuilder,SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {setTimeout} from 'node:timers/promises'
import {db,query,time} from "../link.js"


export default{
    data:new SlashCommandBuilder()
        .setName("invite")
        .setDescription("傳送邀請連結"),
    async execute(event){
        try{
            let embed=new EmbedBuilder().setTitle("邀請我!")

            // return interaction with embed and button to invite the bot
            let actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel("連結")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.com/api/oauth2/authorize?client_id="+event.client.user.id+"&permissions=8&scope=bot%20applications.commands")
            )

            event.reply({ embeds:[embed],components:[actionRow] })
        }catch(error){
            console.log(chalk.red("{"+time()+"} 執行 /invite 指令時發生錯誤："+error))
            await event.reply({ content:"執行 /invite 時發生錯誤。",ephemeral:true })
        }
    }
}