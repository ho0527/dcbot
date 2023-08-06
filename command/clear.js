import {SlashCommandBuilder} from "discord.js"
import chalk from "chalk"
import { setTimeout } from 'node:timers/promises'
import {db,query,time} from "../link.js"

// clear main START

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clear messages")
        .addIntegerOption(function(event){
            return event.setName("count")
                .setDescription("Number of messages to delete(!!!You can only bulk delete messages that are under 14 days old.!!!)")
                .setRequired(true)
        }),
    async execute(event){
        let count=event.options.getInteger("count")

        try{
            event.reply({ content: `Successfully deleted ${count} messages.`, ephemeral: true })

            for(let i=0;i<count;i=i+1){
                await (await event.channel.messages.fetch({ limit: 1 })).first().delete()
                await setTimeout(50)
            }
        }catch(error){
            console.log(chalk.red("{"+time()+"} Error while deleting messages: "+error))
            event.reply("{"+time()+"} An error occurred while trying to delete messages.")
        }
    },
}