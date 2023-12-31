import { createAudioPlayer, NoSubscriberBehavior, entersState, VoiceConnectionStatus, VoiceConnectionDisconnectReason } from "@discordjs/voice";
import { promisify } from "node:util";
import { bot } from "../index";
import { config } from "../utils/config";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

const wait = promisify(setTimeout);

class MusicQueue {
    constructor(options) {
        this.bot = bot;
        this.songs = [];
        this.volume = config.DEFAULT_VOLUME || 100;
        this.loop = false;
        this.muted = false;
        this.queueLock = false;
        this.readyLock = false;
        this.stopped = false;

        Object.assign(this, options);

        this.player = (0, voice_1.createAudioPlayer)({ behaviors: { noSubscriber: voice_1.NoSubscriberBehavior.Play } });
        this.connection.subscribe(this.player);
        var networkStateChangeHandler = function (oldNetworkState, newNetworkState) {
            var newUdp = Reflect.get(newNetworkState, "udp");
            clearInterval(newUdp === null || newUdp === void 0 ? void 0 : newUdp.keepAliveInterval);
        };
        this.connection.on("stateChange", function (oldState, newState) {
            return __awaiter(_this, void 0, void 0, function () {
                var _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            (_b = Reflect.get(oldState, "networking")) === null || _b === void 0 ? void 0 : _b.off("stateChange", networkStateChangeHandler);
                            (_c = Reflect.get(newState, "networking")) === null || _c === void 0 ? void 0 : _c.on("stateChange", networkStateChangeHandler);
                            if (!(newState.status === voice_1.VoiceConnectionStatus.Disconnected)) return [3 /*break*/, 5];
                            if (!(newState.reason === voice_1.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014)) return [3 /*break*/, 1];
                            try {
                                this.stop();
                            }
                            catch (e) {
                                console.log(e);
                                this.stop();
                            }
                            return [3 /*break*/, 4];
                        case 1:
                            if (!(this.connection.rejoinAttempts < 5)) return [3 /*break*/, 3];
                            return [4 /*yield*/, wait((this.connection.rejoinAttempts + 1) * 5000)];
                        case 2:
                            _d.sent();
                            this.connection.rejoin();
                            return [3 /*break*/, 4];
                        case 3:
                            this.connection.destroy();
                            _d.label = 4;
                        case 4: return [3 /*break*/, 10];
                        case 5:
                            if (!(!this.readyLock &&
                                (newState.status === voice_1.VoiceConnectionStatus.Connecting || newState.status === voice_1.VoiceConnectionStatus.Signalling))) return [3 /*break*/, 10];
                            this.readyLock = true;
                            _d.label = 6;
                        case 6:
                            _d.trys.push([6, 8, 9, 10]);
                            return [4 /*yield*/, (0, voice_1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Ready, 20000)];
                        case 7:
                            _d.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            _a = _d.sent();
                            if (this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                                try {
                                    this.connection.destroy();
                                }
                                catch (_e) { }
                            }
                            return [3 /*break*/, 10];
                        case 9:
                            this.readyLock = false;
                            return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        });
        this.player.on("stateChange", function (oldState, newState) {
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (oldState.status !== voice_1.AudioPlayerStatus.Idle && newState.status === voice_1.AudioPlayerStatus.Idle) {
                        if (this.loop && this.songs.length) {
                            this.songs.push(this.songs.shift());
                        }
                        else {
                            this.songs.shift();
                            if (!this.songs.length)
                                return [2 /*return*/, this.stop()];
                        }
                        if (this.songs.length || this.resource.audioPlayer)
                            this.processQueue();
                    }
                    else if (oldState.status === voice_1.AudioPlayerStatus.Buffering && newState.status === voice_1.AudioPlayerStatus.Playing) {
                        this.sendPlayingMessage(newState);
                    }
                    return [2 /*return*/];
                });
            });
        });
        this.player.on("error", function (error) {
            console.error(error);
            if (_this.loop && _this.songs.length) {
                _this.songs.push(_this.songs.shift());
            }
            else {
                _this.songs.shift();
            }
            _this.processQueue();
        });
    }

    enqueue(){
        var songs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            songs[_i] = arguments[_i];
        }
        if (this.waitTimeout !== null)
            clearTimeout(this.waitTimeout);
        this.waitTimeout = null;
        this.stopped = false;
        this.songs = this.songs.concat(songs);
        this.processQueue();
    }

    stop() {
        var _this = this;
        if (this.stopped)
            return;
        this.stopped = true;
        this.loop = false;
        this.songs = [];
        this.player.stop();
        !config_1.config.PRUNING && this.textChannel.send(i18n_1.i18n.__("play.queueEnded"))["catch"](console.error);
        if (this.waitTimeout !== null)
            return;
        this.waitTimeout = setTimeout(function () {
            if (_this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                try {
                    _this.connection.destroy();
                }
                catch (_a) { }
            }
            index_1.bot.queues["delete"](_this.interaction.guild.id);
            !config_1.config.PRUNING && _this.textChannel.send(i18n_1.i18n.__("play.leaveChannel"));
        }, config_1.config.STAY_TIME * 1000);
    }

    processQueue() {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var next, resource, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.queueLock || this.player.state.status !== voice_1.AudioPlayerStatus.Idle) {
                            return [2 /*return*/];
                        }
                        if (!this.songs.length) {
                            return [2 /*return*/, this.stop()];
                        }
                        this.queueLock = true;
                        next = this.songs[0];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, next.makeResource()];
                    case 2:
                        resource = _b.sent();
                        this.resource = resource;
                        this.player.play(this.resource);
                        (_a = this.resource.volume) === null || _a === void 0 ? void 0 : _a.setVolumeLogarithmic(this.volume / 100);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [2 /*return*/, this.processQueue()];
                    case 4:
                        this.queueLock = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }

    async sendPlayingMessage(newState) {
        return __awaiter(this, void 0, void 0, function () {
            var song, playingMessage, error_2, filter, collector;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        song = newState.resource.metadata;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, , 12]);
                        return [4 /*yield*/, this.textChannel.send(newState.resource.metadata.startMessage())];
                    case 2:
                        playingMessage = _a.sent();
                        return [4 /*yield*/, playingMessage.react("⏭")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, playingMessage.react("⏯")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, playingMessage.react("🔇")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, playingMessage.react("🔉")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, playingMessage.react("🔊")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, playingMessage.react("🔁")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, playingMessage.react("🔀")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, playingMessage.react("⏹")];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        error_2 = _a.sent();
                        console.error(error_2);
                        this.textChannel.send(error_2.message);
                        return [2 /*return*/];
                    case 12:
                        filter = function (reaction, user) { return user.id !== _this.textChannel.client.user.id; };
                        collector = playingMessage.createReactionCollector({
                            filter: filter,
                            time: song.duration > 0 ? song.duration * 1000 : 600000
                        });
                        collector.on("collect", function (reaction, user) {
                            return __awaiter(_this, void 0, void 0, function () {
                                var member, _a;
                                var _b, _c, _d, _e;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            if (!this.songs)
                                                return [2 /*return*/];
                                            return [4 /*yield*/, playingMessage.guild.members.fetch(user)];
                                        case 1:
                                            member = _f.sent();
                                            Object.defineProperty(this.interaction, 'user', {
                                                value: user
                                            });
                                            _a = reaction.emoji.name;
                                            switch (_a) {
                                                case "⏭": return [3 /*break*/, 2];
                                                case "⏯": return [3 /*break*/, 4];
                                                case "🔇": return [3 /*break*/, 9];
                                                case "🔉": return [3 /*break*/, 10];
                                                case "🔊": return [3 /*break*/, 11];
                                                case "🔁": return [3 /*break*/, 12];
                                                case "🔀": return [3 /*break*/, 14];
                                                case "⏹": return [3 /*break*/, 16];
                                            }
                                            return [3 /*break*/, 18];
                                        case 2:
                                            reaction.users.remove(user)["catch"](console.error);
                                            return [4 /*yield*/, this.bot.slashCommandsMap.get("skip").execute(this.interaction)];
                                        case 3:
                                            _f.sent();
                                            return [3 /*break*/, 19];
                                        case 4:
                                            reaction.users.remove(user)["catch"](console.error);
                                            if (!(this.player.state.status == voice_1.AudioPlayerStatus.Playing)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.bot.slashCommandsMap.get("pause").execute(this.interaction)];
                                        case 5:
                                            _f.sent();
                                            return [3 /*break*/, 8];
                                        case 6: return [4 /*yield*/, this.bot.slashCommandsMap.get("resume").execute(this.interaction)];
                                        case 7:
                                            _f.sent();
                                            _f.label = 8;
                                        case 8: return [3 /*break*/, 19];
                                        case 9:
                                            reaction.users.remove(user)["catch"](console.error);
                                            if (!(0, queue_1.canModifyQueue)(member))
                                                return [2 /*return*/, i18n_1.i18n.__("common.errorNotChannel")];
                                            this.muted = !this.muted;
                                            if (this.muted) {
                                                (_b = this.resource.volume) === null || _b === void 0 ? void 0 : _b.setVolumeLogarithmic(0);
                                                this.textChannel.send(i18n_1.i18n.__mf("play.mutedSong", { author: user }))["catch"](console.error);
                                            }
                                            else {
                                                (_c = this.resource.volume) === null || _c === void 0 ? void 0 : _c.setVolumeLogarithmic(this.volume / 100);
                                                this.textChannel.send(i18n_1.i18n.__mf("play.unmutedSong", { author: user }))["catch"](console.error);
                                            }
                                            return [3 /*break*/, 19];
                                        case 10:
                                            reaction.users.remove(user)["catch"](console.error);
                                            if (this.volume == 0)
                                                return [2 /*return*/];
                                            if (!(0, queue_1.canModifyQueue)(member))
                                                return [2 /*return*/, i18n_1.i18n.__("common.errorNotChannel")];
                                            this.volume = Math.max(this.volume - 10, 0);
                                            (_d = this.resource.volume) === null || _d === void 0 ? void 0 : _d.setVolumeLogarithmic(this.volume / 100);
                                            this.textChannel
                                                .send(i18n_1.i18n.__mf("play.decreasedVolume", { author: user, volume: this.volume }))["catch"](console.error);
                                            return [3 /*break*/, 19];
                                        case 11:
                                            reaction.users.remove(user)["catch"](console.error);
                                            if (this.volume == 100)
                                                return [2 /*return*/];
                                            if (!(0, queue_1.canModifyQueue)(member))
                                                return [2 /*return*/, i18n_1.i18n.__("common.errorNotChannel")];
                                            this.volume = Math.min(this.volume + 10, 100);
                                            (_e = this.resource.volume) === null || _e === void 0 ? void 0 : _e.setVolumeLogarithmic(this.volume / 100);
                                            this.textChannel
                                                .send(i18n_1.i18n.__mf("play.increasedVolume", { author: user, volume: this.volume }))["catch"](console.error);
                                            return [3 /*break*/, 19];
                                        case 12:
                                            reaction.users.remove(user)["catch"](console.error);
                                            return [4 /*yield*/, this.bot.slashCommandsMap.get("loop").execute(this.interaction)];
                                        case 13:
                                            _f.sent();
                                            return [3 /*break*/, 19];
                                        case 14:
                                            reaction.users.remove(user)["catch"](console.error);
                                            return [4 /*yield*/, this.bot.slashCommandsMap.get("shuffle").execute(this.interaction)];
                                        case 15:
                                            _f.sent();
                                            return [3 /*break*/, 19];
                                        case 16:
                                            reaction.users.remove(user)["catch"](console.error);
                                            return [4 /*yield*/, this.bot.slashCommandsMap.get("stop").execute(this.interaction)];
                                        case 17:
                                            _f.sent();
                                            collector.stop();
                                            return [3 /*break*/, 19];
                                        case 18:
                                            reaction.users.remove(user)["catch"](console.error);
                                            return [3 /*break*/, 19];
                                        case 19: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        collector.on("end", function () {
                            playingMessage.reactions.removeAll()["catch"](console.error);
                            if (config_1.config.PRUNING) {
                                setTimeout(function () {
                                    playingMessage["delete"]()["catch"]();
                                }, 3000);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
}

export default new MusicQueue();
