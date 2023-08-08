import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {setTimeout} from "node:timers/promises"
import {db,query,time} from "../link.js"

// lorem main START

export default{
    data:new SlashCommandBuilder()
        .setName("lorem")
        .setDescription("生成 Lorem Ipsum 文本")
        .addStringOption(function(event){
            return event.setName("type")
                .setDescription("要生成的類型word、letter、sentence")
                .setRequired(true)
                .addChoices(
                    { name:"單字",value:"word" },
                    { name:"字母",value:"letter" },
                    { name:"句子",value:"sentence" },
                )
        })
        .addIntegerOption(function(event){
            return event
                .setName("repeat")
                .setDescription("重複次數(1-100)")
                .setRequired(true)
        }),
    async execute(event){
        try{
            let type=event.options.getString("type")
            let repeat=event.options.getInteger("repeat")
            let lorem=["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua"]

            if(1<repeat&&repeat<100){
                await event.reply({ content:"lorem start",ephemeral:true })
                await setTimeout(50)

                for(let i=0;i<repeat;i=i+1){
                    let response

                    if(type=="word"){
                        response=lorem[Math.floor(Math.random()*lorem.length)]
                    }else if(type=="letter"){
                        response=String.fromCharCode(97+Math.floor(Math.random()*26))
                    }else if(type=="sentence"){
                        response=lorem.slice(0,5+Math.floor(Math.random()*6)).join(" ")
                    }
                    await event.followUp(response)
                    await setTimeout(50)
                }

                await event.followUp({ content:"完成生成Lorem文本!!",ephemeral:true })
            }else{
                await event.reply({ content:"重複次數必須在1~100之間",ephemeral:true })
            }
        }catch(error){
            console.log(chalk.red("{"+time()+"} 執行 /lorem 指令時發生錯誤："+error))
            await event.reply({ content:"發生錯誤，無法生成Lorem文本。",ephemeral:true })
        }
    },
}