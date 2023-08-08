import { createAudioPlayer,NoSubscriberBehavior,entersState,VoiceConnectionStatus,VoiceConnectionDisconnectReason } from "@discordjs/voice"
import { promisify } from "node:util"
import { config } from "../utils/config"
import { i18n } from "../utils/i18n"
import { canModifyQueue } from "../utils/queue.js"

let wait=promisify(setTimeout)

function networkStateChangeHandler(oldNetworkState,newNetworkState) {
    let newUdp=Reflect.get(newNetworkState,"udp")
    clearInterval(newUdp==null||newUdp==void 0 ? void 0 : newUdp.keepAliveInterval)
}

export async function enqueue(queue, songs){
    let songs=[]
    for (let i=0;i < arguments.length;i++) {
        songs[i]=arguments[i]
    }
    if (query.waitTimeout !== null){
        clearTimeout(query.waitTimeout)
    }
    query.waitTimeout=null
    query.stopped=false
    query.songs=query.songs.concat(songs)
    query.processqueue()
}

export function stop(){
    if(!query.stopped){
        query.stopped=true
        query.loop=false
        query.songs=[]
        query.player.stop()
        !config_1.config.PRUNING && query.textChannel.send(i18n_1.i18n.__("play.queueEnded"))["catch"](console.error)
        if(query.waitTimeout==null){
            query.waitTimeout=setTimeout(function(){
                if (_query.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                    try {
                        _query.connection.destroy()
                    }
                    catch (_a) { }
                }
                index_1.event.queues["delete"](_query.interaction.guild.id)
                !config_1.config.PRUNING && _query.textChannel.send(i18n_1.i18n.__("play.leaveChannel"))
            },config_1.config.STAY_TIME * 1000)
        }
    }
}

export async function processqueue(queue){
    let _a
    return __awaiter(this,void 0,void 0,function () {
        let next,resource,error_1
        return __generator(this,function (_b) {
            switch (_b.label) {
                case 0:
                    if (query.queueLock || query.player.state.status !== voice_1.AudioPlayerStatus.Idle) {
                        return [2 /*return*/]
                    }
                    if (!query.songs.length) {
                        return [2 /*return*/,query.stop()]
                    }
                    query.queueLock=true
                    next=query.songs[0]
                    _b.label=1
                case 1:
                    _b.trys.push([1,3,4,5])
                    return [4 /*yield*/,next.makeResource()]
                case 2:
                    resource=_b.sent()
                    query.resource=resource
                    query.player.play(query.resource)
                    (_a=query.resource.volume) === null || _a === void 0 ? void 0 : _a.setVolumeLogarithmic(query.volume / 100)
                    return [3 /*break*/,5]
                case 3:
                    error_1=_b.sent()
                    console.error(error_1)
                    return [2 /*return*/,query.processqueue()]
                case 4:
                    query.queueLock=false
                    return [7 /*endfinally*/]
                case 5: return [2 /*return*/]
            }
        })
    })
}

export async function sendplayingmessage(queue,newState){
    return __awaiter(this,void 0,void 0,function () {
        let song,playingMessage,error_2,filter,collector
        let _this=this
        return __generator(this,function (_a) {
            switch (_a.label) {
                case 0:
                    song=newState.resource.metadata
                    _a.label=1
                case 1:
                    _a.trys.push([1,11,,12])
                    return [4 /*yield*/,query.textChannel.send(newState.resource.metadata.startMessage())]
                case 2:
                    playingMessage=_a.sent()
                    return [4 /*yield*/,playingMessage.react("⏭")]
                case 3:
                    _a.sent()
                    return [4 /*yield*/,playingMessage.react("⏯")]
                case 4:
                    _a.sent()
                    return [4 /*yield*/,playingMessage.react("🔇")]
                case 5:
                    _a.sent()
                    return [4 /*yield*/,playingMessage.react("🔉")]
                case 6:
                    _a.sent()
                    return [4 /*yield*/,playingMessage.react("🔊")]
                case 7:
                    _a.sent()
                    return [4 /*yield*/,playingMessage.react("🔁")]
                case 8:
                    _a.sent()
                    return [4 /*yield*/,playingMessage.react("🔀")]
                case 9:
                    _a.sent()
                    return [4 /*yield*/,playingMessage.react("⏹")]
                case 10:
                    _a.sent()
                    return [3 /*break*/,12]
                case 11:
                    error_2=_a.sent()
                    console.error(error_2)
                    query.textChannel.send(error_2.message)
                    return [2 /*return*/]
                case 12:
                    filter=function (reaction,user) { return user.id !== _query.textChannel.client.user.id }
                    collector=playingMessage.createReactionCollector({
                        filter: filter,
                        time: song.duration > 0 ? song.duration * 1000 : 600000
                    })
                    collector.on("collect",function (reaction,user) {
                        return __awaiter(_this,void 0,void 0,function () {
                            let member,_a
                            let _b,_c,_d,_e
                            return __generator(this,function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (!query.songs)
                                            return [2 /*return*/]
                                        return [4 /*yield*/,playingMessage.guild.members.fetch(user)]
                                    case 1:
                                        member=_f.sent()
                                        Object.defineProperty(query.interaction,'user',{
                                            value: user
                                        })
                                        _a=reaction.emoji.name
                                        switch (_a) {
                                            case "⏭": return [3 /*break*/,2]
                                            case "⏯": return [3 /*break*/,4]
                                            case "🔇": return [3 /*break*/,9]
                                            case "🔉": return [3 /*break*/,10]
                                            case "🔊": return [3 /*break*/,11]
                                            case "🔁": return [3 /*break*/,12]
                                            case "🔀": return [3 /*break*/,14]
                                            case "⏹": return [3 /*break*/,16]
                                        }
                                        return [3 /*break*/,18]
                                    case 2:
                                        reaction.users.remove(user)["catch"](console.error)
                                        return [4 /*yield*/,query.event.slashCommandsMap.get("skip").execute(query.interaction)]
                                    case 3:
                                        _f.sent()
                                        return [3 /*break*/,19]
                                    case 4:
                                        reaction.users.remove(user)["catch"](console.error)
                                        if (!(query.player.state.status == voice_1.AudioPlayerStatus.Playing)) return [3 /*break*/,6]
                                        return [4 /*yield*/,query.event.slashCommandsMap.get("pause").execute(query.interaction)]
                                    case 5:
                                        _f.sent()
                                        return [3 /*break*/,8]
                                    case 6: return [4 /*yield*/,query.event.slashCommandsMap.get("resume").execute(query.interaction)]
                                    case 7:
                                        _f.sent()
                                        _f.label=8
                                    case 8: return [3 /*break*/,19]
                                    case 9:
                                        reaction.users.remove(user)["catch"](console.error)
                                        if (!(0,queue_1.canModifyQueue)(member))
                                            return [2 /*return*/,i18n_1.i18n.__("common.errorNotChannel")]
                                        query.muted=!query.muted
                                        if (query.muted) {
                                            (_b=query.resource.volume) === null || _b === void 0 ? void 0 : _b.setVolumeLogarithmic(0)
                                            query.textChannel.send(i18n_1.i18n.__mf("play.mutedSong",{ author: user }))["catch"](console.error)
                                        }
                                        else {
                                            (_c=query.resource.volume) === null || _c === void 0 ? void 0 : _c.setVolumeLogarithmic(query.volume / 100)
                                            query.textChannel.send(i18n_1.i18n.__mf("play.unmutedSong",{ author: user }))["catch"](console.error)
                                        }
                                        return [3 /*break*/,19]
                                    case 10:
                                        reaction.users.remove(user)["catch"](console.error)
                                        if (query.volume == 0)
                                            return [2 /*return*/]
                                        if (!(0,queue_1.canModifyQueue)(member))
                                            return [2 /*return*/,i18n_1.i18n.__("common.errorNotChannel")]
                                        query.volume=Math.max(query.volume - 10,0)
                                        (_d=query.resource.volume) === null || _d === void 0 ? void 0 : _d.setVolumeLogarithmic(query.volume / 100)
                                        query.textChannel
                                            .send(i18n_1.i18n.__mf("play.decreasedVolume",{ author: user,volume: query.volume }))["catch"](console.error)
                                        return [3 /*break*/,19]
                                    case 11:
                                        reaction.users.remove(user)["catch"](console.error)
                                        if (query.volume == 100)
                                            return [2 /*return*/]
                                        if (!(0,queue_1.canModifyQueue)(member))
                                            return [2 /*return*/,i18n_1.i18n.__("common.errorNotChannel")]
                                        query.volume=Math.min(query.volume + 10,100)
                                        (_e=query.resource.volume) === null || _e === void 0 ? void 0 : _e.setVolumeLogarithmic(query.volume / 100)
                                        query.textChannel
                                            .send(i18n_1.i18n.__mf("play.increasedVolume",{ author: user,volume: query.volume }))["catch"](console.error)
                                        return [3 /*break*/,19]
                                    case 12:
                                        reaction.users.remove(user)["catch"](console.error)
                                        return [4 /*yield*/,query.event.slashCommandsMap.get("loop").execute(query.interaction)]
                                    case 13:
                                        _f.sent()
                                        return [3 /*break*/,19]
                                    case 14:
                                        reaction.users.remove(user)["catch"](console.error)
                                        return [4 /*yield*/,query.event.slashCommandsMap.get("shuffle").execute(query.interaction)]
                                    case 15:
                                        _f.sent()
                                        return [3 /*break*/,19]
                                    case 16:
                                        reaction.users.remove(user)["catch"](console.error)
                                        return [4 /*yield*/,query.event.slashCommandsMap.get("stop").execute(query.interaction)]
                                    case 17:
                                        _f.sent()
                                        collector.stop()
                                        return [3 /*break*/,19]
                                    case 18:
                                        reaction.users.remove(user)["catch"](console.error)
                                        return [3 /*break*/,19]
                                    case 19: return [2 /*return*/]
                                }
                            })
                        })
                    })
                    collector.on("end",function () {
                        playingMessage.reactions.removeAll()["catch"](console.error)
                        if (config_1.config.PRUNING) {
                            setTimeout(function () {
                                playingMessage["delete"]()["catch"]()
                            },3000)
                        }
                    })
                    return [2 /*return*/]
            }
        })
    })
}

export function music(options){
    let queue={
        event: options.event,
        songs: [],
        volume: config.DEFAULT_VOLUME || 100,
        loop: false,
        muted: false,
        queueLock: false,
        readyLock: false,
        stopped: false,
        player: createAudioPlayer(),
        connection: options.connection,
    }

    queue.connection.subscribe(queue.player)

    query.connection.on("stateChange",function (oldState,newState) {
        return __awaiter(_this,void 0,void 0,function () {
            let _a
            let _b,_c
            return __generator(this,function (_d) {
                switch (_d.label) {
                    case 0:
                        (_b=Reflect.get(oldState,"networking")) === null || _b === void 0 ? void 0 : _b.off("stateChange",networkStateChangeHandler)
                        (_c=Reflect.get(newState,"networking")) === null || _c === void 0 ? void 0 : _c.on("stateChange",networkStateChangeHandler)
                        if (!(newState.status === voice_1.VoiceConnectionStatus.Disconnected)) return [3 /*break*/,5]
                        if (!(newState.reason === voice_1.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014)) return [3 /*break*/,1]
                        try {
                            stop()
                        }
                        catch (e) {
                            console.log(e)
                            stop()
                        }
                        return [3 /*break*/,4]
                    case 1:
                        if (!(connection.rejoinAttempts < 5)) return [3 /*break*/,3]
                        return [4 /*yield*/,wait((query.connection.rejoinAttempts + 1) * 5000)]
                    case 2:
                        _d.sent()
                        query.connection.rejoin()
                        return [3 /*break*/,4]
                    case 3:
                        query.connection.destroy()
                        _d.label=4
                    case 4: return [3 /*break*/,10]
                    case 5:
                        if (!(!query.readyLock &&
                            (newState.status === voice_1.VoiceConnectionStatus.Connecting || newState.status === voice_1.VoiceConnectionStatus.Signalling))) return [3 /*break*/,10]
                        query.readyLock=true
                        _d.label=6
                    case 6:
                        _d.trys.push([6,8,9,10])
                        return [4 /*yield*/,(0,voice_1.entersState)(query.connection,voice_1.VoiceConnectionStatus.Ready,20000)]
                    case 7:
                        _d.sent()
                        return [3 /*break*/,10]
                    case 8:
                        _a=_d.sent()
                        if (query.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                            try {
                                query.connection.destroy()
                            }
                            catch (_e) { }
                        }
                        return [3 /*break*/,10]
                    case 9:
                        query.readyLock=false
                        return [7 /*endfinally*/]
                    case 10: return [2 /*return*/]
                }
            })
        })
    })
    query.player.on("stateChange",function (oldState,newState) {
        return __awaiter(_this,void 0,void 0,function () {
            return __generator(this,function (_a) {
                if (oldState.status !== voice_1.AudioPlayerStatus.Idle && newState.status === voice_1.AudioPlayerStatus.Idle) {
                    if (query.loop && query.songs.length) {
                        query.songs.push(query.songs.shift())
                    }
                    else {
                        query.songs.shift()
                        if (!query.songs.length)
                            return [2 /*return*/,query.stop()]
                    }
                    if (query.songs.length || query.resource.audioPlayer)
                        query.processqueue()
                }
                else if (oldState.status === voice_1.AudioPlayerStatus.Buffering && newState.status === voice_1.AudioPlayerStatus.Playing) {
                    query.sendplayingmessage(newState)
                }
                return [2 /*return*/]
            })
        })
    })
    query.player.on("error",function (error) {
        console.error(error)
        if (_query.loop && _query.songs.length) {
            _query.songs.push(_query.songs.shift())
        }
        else {
            _query.songs.shift()
        }
        _query.processqueue()
    })

    return queue
}