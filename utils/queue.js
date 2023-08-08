"use strict";
exports.__esModule = true;
exports.canModifyQueue = void 0;
var canModifyQueue = function (member) {
    return member.voice.channelId === member.guild.members.me.voice.channelId;
};
exports.canModifyQueue = canModifyQueue;
