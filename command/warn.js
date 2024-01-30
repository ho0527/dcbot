import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {setTimeout} from 'node:timers/promises'
import {db,query,time} from "../link.js"

// warn main START
export default{
    data:new SlashCommandBuilder()
        .setName("warn")
        .setDescription("warn user")
        .addUserOption(function(event){
            return event.setName("user")
                .setDescription("user need to warn")
                .setRequired(true)
        })
        .addStringOption(function(event){
            return event.setName("reason")
                .setDescription("reason that warn")
                .setRequired(true)
        })
        .addIntegerOption(function(event){
            return event.setName("time")
                .setDescription("time need to warn")
                .setRequired(false)
        }),
    async execute(event){
        let userid=event.options.getUser("user").id
        let reason=event.options.getString("reason")
        let warntime=event.options.getInteger("time")

        if(!warntime){ warntime=1 }

        query(db,"SELECT*FROM `warn` WHERE `botid`='001'AND`guildid`=?AND`userid`=?",[event.guildId,userid],function(error,result,field){
            let count=warntime

            if(error){
                console.log(chalk.red("{"+time()+"} 上傳回饋意見時發生錯誤: "+error))
            }else{
                console.log(chalk.green("{"+time()+"} 查詢成功!"))
                if(result){
                    for(let i=0;i<result.length;i=i+1){
                        count=count+parseInt(result[i].time)
                    }
                }

                try{
                    event.reply({
                        content: `恭喜 ${event.options.getUser("user")} ，因為${reason} 喜提警告**${warntime}**次，目前總警告: ${count}次.`,
                    })
                }catch(error){
                    console.log(chalk.red("{"+time()+"} Error while warning user: "+error))
                    event.reply({ content:"error while warning user.",ephemeral:true })
                }
            }
        })

        query(db,"INSERT INTO `warn`(`botid`,`guildid`,`userid`,`time`,`reason`,`createtime`,`updatetime`)VALUES(?,?,?,?,?,?,?)",["001",event.guildId,userid,warntime,reason,time(),time()],function(error,result,field){
            if(error){
                console.log(chalk.red("{"+time()+"} 上傳警告數時發生錯誤: "+error))
            }else{
                console.log(chalk.green("{"+time()+"} 警告數已上傳至MySQL資料庫!"))
            }
        })

        query(db,"SELECT*FROM `user` WHERE `userid`=?",[userid],function(error,result,field){
            if(result.length==0){
                query(db,"INSERT INTO `user`(`userid`,`name`,`username`,`password`,`ps`,`createtime`,`updatetime`)VALUES(?,?,?,?,?,?,?)",[userid,event.options.getUser("user").username,"","","",time(),time()],function(error,result,field){
                    if(error){
                        console.log(chalk.red("{"+time()+"} 上傳使用者時發生錯誤: "+error))
                    }else{
                        console.log(chalk.green("{"+time()+"} 使用者已上傳至MySQL資料庫!"))
                    }
                })
            }else{
                query(db,"UPDATE `user` SET `name`=?,`updatetime`=? WHERE `userid`=?",[event.options.getUser("user").username,time(),userid],function(error,result,field){
                    if(error){
                        console.log(chalk.red("{"+time()+"} 上傳使用者時發生錯誤: "+error))
                    }else{
                        console.log(chalk.green("{"+time()+"} 使用者已上傳至MySQL資料庫!"))
                    }
                })
            }
        })
    },
}