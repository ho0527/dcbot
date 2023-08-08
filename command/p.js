import {SlashCommandBuilder} from "discord.js"
import {createAudioPlayer,createAudioResource,StreamType,joinVoiceChannel} from "@discordjs/voice"
import chalk from "chalk"
import { setTimeout } from "node:timers/promises"
import {db,query,time} from "../link.js"
import ytdl from "ytdl-core"

let urllist=[]; // 存放音樂網址的陣列

// p main START

async function playMusic(guild){
    // 如果音樂佇列為空，不需要隨機選取，直接返回
    if(urllist.length==0){
        return;
    }

    let url=urllist.shift(); // 取出佇列中的下一首歌曲
    let stream=ytdl(url,{ filter:"audioonly" }) // 使用 ytdl 套件取得音樂串流

    // 加入音樂串流到音樂播放器
    guild.audioPlayer=createAudioPlayer()
    let resource=createAudioResource(stream,{ inputType: StreamType.Arbitrary })
    guild.audioPlayer.play(resource)

    // 監聽音樂播放結束事件，當歌曲播放結束時繼續撥放下一首
    guild.audioPlayer.on("stateChange",async function(oldState,newState){
        if(newState.status=="idle"){
            await playMusic(guild)
        }
    });
}

export default{
    data:new SlashCommandBuilder()
        .setName("p")
        .setDescription("play music")
        .addStringOption(function(event){
            return event.setName("url")
                .setDescription("pls gave url in here")
                .setRequired(true)
        }),
    async execute(event){
        let voicechannel=event.member.voice.channel
        let url=event.options.getString("url")
        let connection
        let stream=ytdl(url,{ filter:"audioonly" })
        let resource=createAudioResource(stream,{ inputType: StreamType.Arbitrary })
        let player=createAudioPlayer()


        if(voicechannel){
            if(url&&ytdl.validateURL(url)){
                try{
                    connection=joinVoiceChannel({
                        channelId:voicechannel.id,
                        guildId:voicechannel.guild.id,
                        adapterCreator:voicechannel.guild.voiceAdapterCreator
                    })

                    player.play(resource)
                    connection.subscribe(player)

                    // 加入音樂網址到音樂佇列
                    urllist.push(url);

                    // 如果播放器不存在或已停止，則開始撥放音樂
                    if(!event.guild.audioPlayer||event.guild.audioPlayer.state.status=="idle") {
                        await playMusic(event.guild);
                    }

                    event.reply("新增成功")
                }catch(error){
                    console.log(chalk.red("{"+time()+"} 執行 /p 指令時發生錯誤："+error))
                    console.error(error);
                    event.reply("An error occurred while playing music.")
                }
            }else{
                event.reply("Please provide a valid YouTube URL!")
            }
        }else{
            event.reply("你必須先在語音頻道內才可以使用此交互!")
        }
    },
}
