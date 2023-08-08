import {DiscordGatewayAdapterCreator,joinVoiceChannel} from "@discordjs/voice"
import {ChatInputCommandInteraction,Permissions,SlashCommandBuilder,TextChannel} from "discord.js"
import {music} from "../structs/MusicQueue.js"
import {Song} from "../structs/Song.js"
import {playlistPattern} from "../utils/patterns.js"

export default{
    data:new SlashCommandBuilder()
        .setName("play")
        .setDescription("播放 YouTube 或 Soundcloud 的音樂")
        .addStringOption(function(option){
            return option.setName("url")
                .setDescription("The song you want to play")
                .setRequired(true)
        }),
    cooldown:3,
    permissions:[
        Permissions.FLAGS.CONNECT,
        Permissions.FLAGS.SPEAK,
        Permissions.FLAGS.ADD_REACTIONS,
        Permissions.FLAGS.MANAGE_MESSAGES
    ],
    async execute(event,input){
        try{
            let url=event.options.getString("url")
            let guildMember=event.guild.members.cache.get(event.user.id)
            let channel=guildMember.voice
            let queue=event.queues.get(event.guild.id)
            let song

            if(!url){ url=input }
            if(channel){
                if(queue||channel.id==queue.connection.joinConfig.channelId){
                    if(!url){
                        if(event.replied){
                            await event.editReply("⏳ Loading...")
                        }else{
                            await event.reply("⏳ Loading...")
                        }

                        if(!playlistPattern.test(url)){
                            try{
                                song=await Song.from(url,url)
                                if(!queue){
                                    let queue=new MusicQueue({
                                        event,textChannel:event.channel,
                                        connection:joinVoiceChannel({
                                            channelId:channel.id,
                                            guildId:channel.guild.id,
                                            adapterCreator:channel.guild.voiceAdapterCreator
                                        })
                                    })

                                    event.queues.set(event.guild.id,queue)

                                    queue.enqueue(song)
                                    event.deleteReply()
                                }else{
                                    queue.enqueue(song)
                                    event.channel.send({ content:"✅ **"+song.title+"** 已經被 "+event.user.id+" 加入音樂隊列" })
                                }
                            }catch(error){
                                if(error.name=="NoResults"){
                                    event.reply({ content:"查無此歌曲 url: "+url,ephemeral:true })
                                }else if(error.name=="InvalidURL"){
                                    event.reply({ content:"歌曲錯誤 url: "+url,ephemeral:true })
                                }else{
                                    if(event.replied){
                                        await event.editReply({ content:"執行指令時發生錯誤" })
                                    }else{
                                        event.reply({ content:"執行指令時發生錯誤",ephemeral:true })
                                    }
                                }
                            }
                        }else{
                            await event.editReply("🔗 Link is playlist")
                            event.slashCommandsMap.get("playlist").execute(event)
                        }
                    }else{
                        event.reply({ content:"Usage: "+event.prefix+"play <YouTube 網址 | 影片名稱 | Soundcloud 網址>",ephemeral:true })
                    }
                }else{
                    event.reply({ content:"你必須跟"+event.client.user.username+"在同一個頻道裡",ephemeral:true })
                }
            }else{
                return event.reply({ content:"你必須先加入語音頻道!",ephemeral:true })
            }
        }catch(error){
            console.log(chalk.red("{"+time()+"} 執行 /p 指令時發生錯誤："+error))
            console.error(error);
            event.reply("播放音樂時發生錯誤")
        }
    }
}
