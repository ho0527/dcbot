"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Song = void 0;
var voice_1 = require("@discordjs/voice");
var youtube_sr_1 = require("youtube-sr");
var i18n_1 = require("../utils/i18n");
var patterns_1 = require("../utils/patterns");
var _a = require('play-dl'), stream = _a.stream, video_basic_info = _a.video_basic_info;
var Song = /** @class */ (function () {
    function Song(_a) {
        var url = _a.url, title = _a.title, duration = _a.duration;
        this.url = url;
        this.title = title;
        this.duration = duration;
    }
    Song.from = function (url, search) {
        if (url === void 0) { url = ""; }
        if (search === void 0) { search = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var isYoutubeUrl, songInfo, result, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isYoutubeUrl = patterns_1.videoPattern.test(url);
                        if (!isYoutubeUrl) return [3 /*break*/, 2];
                        return [4 /*yield*/, video_basic_info(url)];
                    case 1:
                        songInfo = _a.sent();
                        return [2 /*return*/, new this({
                                url: songInfo.video_details.url,
                                title: songInfo.video_details.title,
                                duration: parseInt(songInfo.video_details.durationInSec)
                            })];
                    case 2: return [4 /*yield*/, youtube_sr_1["default"].searchOne(search)];
                    case 3:
                        result = _a.sent();
                        result ? null : console.log("No results found for ".concat(search)); // This is for handling the case where no results are found (spotify links for example)
                        if (!result) {
                            err = new Error("No search results found for ".concat(search));
                            err.name = "NoResults";
                            if (patterns_1.isURL.test(url))
                                err.name = "InvalidURL";
                            throw err;
                        }
                        return [4 /*yield*/, video_basic_info("https://youtube.com/watch?v=".concat(result.id))];
                    case 4:
                        songInfo = _a.sent();
                        return [2 /*return*/, new this({
                                url: songInfo.video_details.url,
                                title: songInfo.video_details.title,
                                duration: parseInt(songInfo.video_details.durationInSec)
                            })];
                }
            });
        });
    };
    Song.prototype.makeResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playStream, type, source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = this.url.includes("youtube.com") ? voice_1.StreamType.Opus : voice_1.StreamType.OggOpus;
                        source = this.url.includes("youtube") ? "youtube" : "soundcloud";
                        if (!(source === "youtube")) return [3 /*break*/, 2];
                        return [4 /*yield*/, stream(this.url)];
                    case 1:
                        playStream = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!stream)
                            return [2 /*return*/];
                        return [2 /*return*/, (0, voice_1.createAudioResource)(playStream.stream, { metadata: this, inputType: playStream.type, inlineVolume: true })];
                }
            });
        });
    };
    Song.prototype.startMessage = function () {
        return i18n_1.i18n.__mf("play.startedPlaying", { title: this.title, url: this.url });
    };
    return Song;
}());
exports.Song = Song;
