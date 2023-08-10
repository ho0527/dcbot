import {Client,Events,GatewayIntentBits,REST,Routes} from "discord.js"
import dotenv from "dotenv"
import chalk from "chalk"
import chrisplugin from "./plugin/js/chrisplugin.js"
import {db,query,time} from "./link.js"

dotenv.config()
const TOKEN=process.env.TOKEN
const CLIENTID=process.env.CLIENTID

let rest=new REST().setToken(TOKEN)
let client=new Client({ intents: [GatewayIntentBits.Guilds]})
client.command=[]

// main start

try{
    console.log(chalk.green("{"+time()+"} Started deleting application / commands."))

    client.once("ready",async function(){
        console.log(chalk.green("{"+time()+"} Ready! Logged in as "+client.user.tag))

        try{
            let guild=Array.from(client.guilds.cache.values())
            for (let i=0;i<guild.length;i=i+1){
                console.log(chalk.green("Deleting commands in guild "+guild[i].name+"("+guild[i].id+")..."))

                let command=Array.from((await guild[i].commands.fetch()).values()) // 將 Map 轉換為陣列
                for(let j=0;j<command.length;j=j+1){
                    await command[j].delete()
                    console.log(chalk.green("Command "+command[j].name+" deleted."))
                }
            }


            console.log(chalk.green("{"+time()+"} Successfully deleted commands in all guilds."))
            process.exit() // 終止程式
        }catch(error){
            console.error("Error deleting commands:",error)
        }
    })

    client.login(TOKEN)
}catch(error){
    console.log(chalk.red("{"+time()+"} "+error+" [delall.js: 47]"))
}