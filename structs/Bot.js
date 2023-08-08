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
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
exports.Bot = void 0;
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var path_1 = require("path");
var checkPermissions_1 = require("../utils/checkPermissions");
var config_1 = require("../utils/config");
var i18n_1 = require("../utils/i18n");
var MissingPermissionsException_1 = require("../utils/MissingPermissionsException");
var Bot = /** @class */ (function () {
    function Bot(client) {
        var _this = this;
        this.client = client;
        this.prefix = config_1.config.PREFIX;
        this.commands = new discord_js_1.Collection();
        this.slashCommands = new Array();
        this.slashCommandsMap = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.queues = new discord_js_1.Collection();
        this.client.login(config_1.config.TOKEN);
        this.client.on("ready", function () {
            console.log("".concat(_this.client.user.username, " ready!"));
            _this.registerSlashCommands();
        });
        this.client.on("warn", function (info) { return console.log(info); });
        this.client.on("error", console.error);
        this.onInteractionCreate();
    }
    Bot.prototype.registerSlashCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rest, commandFiles, _i, commandFiles_1, file, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rest = new discord_js_1.REST({ version: "9" }).setToken(config_1.config.TOKEN);
                        commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "..", "commands")).filter(function (file) { return !file.endsWith(".map"); });
                        _i = 0, commandFiles_1 = commandFiles;
                        _a.label = 1;
                    case 1:
                        if (!(_i < commandFiles_1.length)) return [3 /*break*/, 4];
                        file = commandFiles_1[_i];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require((0, path_1.join)(__dirname, "..", "commands", "".concat(file))); })];
                    case 2:
                        command = _a.sent();
                        this.slashCommands.push(command["default"].data);
                        this.slashCommandsMap.set(command["default"].data.name, command["default"]);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, rest.put(discord_js_1.Routes.applicationCommands(this.client.user.id), { body: this.slashCommands })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.onInteractionCreate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.client.on(discord_js_1.Events.InteractionCreate, function (interaction) {
                    return __awaiter(_this, void 0, void 0, function () {
                        var command, now, timestamps, cooldownAmount, expirationTime, timeLeft, permissionsCheck, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!interaction.isChatInputCommand())
                                        return [2 /*return*/];
                                    command = this.slashCommandsMap.get(interaction.commandName);
                                    if (!command)
                                        return [2 /*return*/];
                                    if (!this.cooldowns.has(interaction.commandName)) {
                                        this.cooldowns.set(interaction.commandName, new discord_js_1.Collection());
                                    }
                                    now = Date.now();
                                    timestamps = this.cooldowns.get(interaction.commandName);
                                    cooldownAmount = (command.cooldown || 1) * 1000;
                                    if (timestamps.has(interaction.user.id)) {
                                        expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                                        if (now < expirationTime) {
                                            timeLeft = (expirationTime - now) / 1000;
                                            return [2 /*return*/, interaction.reply({
                                                content: i18n_1.i18n.__mf("common.cooldownMessage", {
                                                    time: timeLeft.toFixed(1),
                                                    name: interaction.commandName
                                                }),
                                                ephemeral: true
                                            })];
                                        }
                                    }
                                    timestamps.set(interaction.user.id, now);
                                    setTimeout(function () { return timestamps["delete"](interaction.user.id); }, cooldownAmount);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, checkPermissions_1.checkPermissions)(command, interaction)];
                                case 2:
                                    permissionsCheck = _a.sent();
                                    if (permissionsCheck.result) {
                                        command.execute(interaction);
                                    }
                                    else {
                                        throw new MissingPermissionsException_1.MissingPermissionsException(permissionsCheck.missing);
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    console.error(error_1);
                                    if (error_1.message.includes("permissions")) {
                                        interaction.reply({ content: error_1.toString(), ephemeral: true })["catch"](console.error);
                                    }
                                    else {
                                        interaction.reply({ content: i18n_1.i18n.__("common.errorCommand"), ephemeral: true })["catch"](console.error);
                                    }
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    return Bot;
}());

export default Bot