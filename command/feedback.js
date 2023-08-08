import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {db,query,time} from "../link.js"

// feedback main START
export default{
    data:new SlashCommandBuilder()
        .setName("feedback")
        .setDescription("提供回饋意見")
        .addStringOption((option) =>
        option
            .setName("message")
            .setDescription("回饋的內容")
            .setRequired(true)
        ),
    async execute(event) {
        try{
            let message=event.options.getString("message")

            // 上傳至 MySQL 資料庫
            query(db,"INSERT INTO `feedback`(`botid`,`guildid`,`userid`,`message`,`ps`,`createtime`)VALUES(?,?,?,?,?,?)",["001",event.guildId,event.user.id,message,"",time()],function(error,result,field){
                if(error){
                    console.log(chalk.red("{"+time()+"} 上傳回饋意見時發生錯誤: "+error))
                } else {
                    console.log(chalk.green("{"+time()+"} 回饋意見已上傳至 MySQL 資料庫!"))
                }
            })

            await event.reply({ content:"感謝您寶貴的回饋意見!",ephemeral: true,})
        }catch(error){
            console.log(chalk.red("{"+time()+"} 執行 /feedback 指令時發生錯誤："+error))
            await event.reply({ content:"發生錯誤，無法上傳回饋意見。",ephemeral:true })
        }
    },
}
