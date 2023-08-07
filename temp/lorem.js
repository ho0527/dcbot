import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {db,query,time} from "../link.js"

// lorem main START

export default {
    data: new SlashCommandBuilder()
        .setName("lorem")
        .setDescription("生成 Lorem Ipsum 文本")
        .addStringOption(function(event){
            return event.setName("type")
                .setDescription("要生成的類型word、letter、sentence")
                .setRequired(true)
                .addChoice("單字","word")
                .addChoice("字母","letter")
                .addChoice("句子","sentence")
        })
        .addIntegerOption(function(event){
            return event
                .setName("repeat")
                .setDescription("重複次數(1-20)")
                .setRequired(true)
        }),
    async execute(event) {
        try{
            let type=event.options.getString("type")
            let repeat=event.options.getInteger("repeat")

            let lorem=["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua"]

            let response="{"+time()+"} 完成生成Lorem文本!!"
            for(let i=0;i<repeat;i=i+1){
                setTimeout(function(){
                    if(type=="word"){
                        event.reply(lorem[Math.floor(Math.random()*lorem.length)])
                    }else if(type=="letter"){
                        event.reply(String.fromCharCode(97+Math.floor(Math.random()*26)))
                    }else if(type=="sentence"){
                        event.reply(lorem.slice(0,5+Math.floor(Math.random()*6)).join(" "))
                    }else{
                        response="{"+time()+"} [ERROR] 生成類型錯誤，無法生成Lorem文本。"
                    }
                },500)
            }
            await event.reply({ content:response,ephemeral:true });
        }catch(error){
            console.log(chalk.red("{"+time()+"} 執行 /lorem 指令時發生錯誤："+error))
            await event.reply({ content:"發生錯誤，無法生成Lorem文本。",ephemeral:true })
        }
    },
}