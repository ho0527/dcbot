import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import {setTimeout} from 'node:timers/promises'
import {db,query,time} from "../link.js"

// clear main START

export default{
    data:new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clear messages")
        .addIntegerOption(function(event){
            return event.setName("count")
                .setDescription("Number of messages to delete")
                .setRequired(true)
        }),
    async execute(event){
        let count=event.options.getInteger("count")

        try{
            await event.deferReply({ ephemeral: true })
            for(let i=0;i<count;i=i+1){
                let message=await event.channel.messages.fetch({ limit: 1 })
                if(message.size>0){
                    await message.first().delete()
                }else{ break }
                await setTimeout(50)
            }
            event.editReply({ content: `Successfully deleted ${count} messages.`, ephemeral: true })
        }catch(error){
            console.log(chalk.red("{"+time()+"} Error while deleting messages: "+error))
            event.reply("{"+time()+"} An error occurred while trying to delete messages.")
        }
    },
}