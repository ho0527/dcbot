import {Client,Events,GatewayIntentBits,REST,Routes} from "discord.js"
import dotenv from "dotenv"
import fs from "fs"
import chalk from "chalk"
import chrisplugin from "./plugin/js/chrisplugin.js"
import {db,query,time} from "./link.js"

dotenv.config()
const TOKEN=process.env.TOKEN
const CLIENTID=process.env.CLIENTID

let rest=new REST().setToken(TOKEN)
let client=new Client({ intents:[GatewayIntentBits.Guilds] })
client.command=[]

// main start
try{
    let data
    let promise=[]
    let file=fs.readdirSync("./command").filter(function(event){ return event.endsWith(".js")/*||event.endsWith(".ts")*/ })
    let configdata=JSON.parse(fs.readFileSync("data.json"))

    console.log(chalk.green("{"+time()+"} Started refreshing application / commands."))

    // register slash command
    for(let i=0;i<file.length;i=i+1){
        let command=(await import(`./command/${file[i]}`)).default
        client.command.push(command)
    }

    client.once("ready",function(){
        let guild=Array.from(client.guilds.cache)
        for(let i=0;i<guild.length;i=i+1){
            let guildid=guild[i][0]
            if(guildid){
                promise.push(
                    data=rest.put(Routes.applicationGuildCommands(CLIENTID,guildid),{ body: client.command.map(function(event2){ return event2.data.toJSON() }) })
                )
            }
            console.log(chalk.green("{"+time()+"} using guild ID: "+guildid))
        }
        configdata.guild=guild
        configdata.command=client.command
        fs.writeFileSync("data.json",JSON.stringify(configdata,null,2))
    })

    // use slash command
    client.on(Events.InteractionCreate,async function(event){
        if(event.isCommand()){
            let commandname=event.commandName
            let command=client.command.find(function(event2){ return event2.data.name==commandname })

            if(command){
                await command.execute(event);
                console.log(chalk.green("{"+time()+"} target command "+commandname+" success"))
            }else{
                console.log(chalk.yellow("{"+time()+"} no this command "+commandname))
            }
        }else{
            console.log(chalk.yellow("{"+time()+"} no this command "+commandname))
        }
    })

    await Promise.all(promise)

    console.log(chalk.green("{"+time()+"} Successfully reloaded "+file.length+" application (/) commands."))
}catch(error){
    console.log(chalk.red("{"+time()+"} "))
    console.log(error)
}

// 成功回應
client.once(Events.ClientReady,function(event){
    console.log(chalk.green("{"+time()+"} Ready! Logged in as " + event.user.tag))
})

client.login(TOKEN)

export default client