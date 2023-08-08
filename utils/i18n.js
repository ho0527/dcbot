"use strict";
exports.__esModule = true;
exports.i18n = void 0;
var i18n_1 = require("i18n");
exports.i18n = i18n_1["default"];
var path_1 = require("path");
var config_1 = require("./config");
i18n_1["default"].configure({
    locales: [
        "ar",
        "cs",
        "de",
        "el",
        "en",
        "es",
        "fa",
        "fr",
        "id",
        "it",
        "ja",
        "ko",
        "mi",
        "nb",
        "nl",
        "pl",
        "pt_br",
        "ru",
        "sv",
        "th",
        "tr",
        "uk",
        "vi",
        "zh_cn",
        "zh_sg",
        "zh_tw"
    ],
    directory: (0, path_1.join)(__dirname, "..", "locales"),
    defaultLocale: "en",
    retryInDefaultLocale: true,
    objectNotation: true,
    register: global,
    logWarnFn: function (msg) {
        console.log(msg);
    },
    logErrorFn: function (msg) {
        console.log(msg);
    },
    missingKeyFn: function (locale, value) {
        return value;
    },
    mustacheConfig: {
        tags: ["{{", "}}"],
        disable: false
    }
});
i18n_1["default"].setLocale(config_1.config.LOCALE);
