"use strict";
exports.__esModule = true;
exports.config = void 0;
require("dotenv/config");
var config;
exports.config = config;
try {
    exports.config = config = require("../config.json");
}
catch (error) {
    exports.config = config = {
        TOKEN: process.env.TOKEN || "",
        PREFIX: process.env.PREFIX || "!",
        MAX_PLAYLIST_SIZE: parseInt(process.env.MAX_PLAYLIST_SIZE) || 10,
        PRUNING: process.env.PRUNING === "true" ? true : false,
        STAY_TIME: parseInt(process.env.STAY_TIME) || 30,
        DEFAULT_VOLUME: parseInt(process.env.DEFAULT_VOLUME) || 100,
        LOCALE: process.env.LOCALE || "en"
    };
}
