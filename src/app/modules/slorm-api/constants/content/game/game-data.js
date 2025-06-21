"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_DATA = void 0;
const dat_act_1 = require("./data/dat_act");
const dat_att_1 = require("./data/dat_att");
const dat_buf_1 = require("./data/dat_buf");
const dat_cla_0_1 = require("./data/dat_cla_0");
const dat_cla_1_1 = require("./data/dat_cla_1");
const dat_cla_2_1 = require("./data/dat_cla_2");
const dat_ele_1 = require("./data/dat_ele");
const dat_leg_1 = require("./data/dat_leg");
const dat_rea_1 = require("./data/dat_rea");
const dat_run_1 = require("./data/dat_run");
const dat_sta_1 = require("./data/dat_sta");
const dat_str_1 = require("./data/dat_str");
exports.GAME_DATA = {
    REAPER: dat_rea_1.GAME_DATA_REAPER,
    STAT: dat_sta_1.GAME_DATA_STAT,
    LEGENDARY: dat_leg_1.GAME_DATA_LEGENDARY,
    RUNE: dat_run_1.GAME_DATA_RUNE,
    ACTIVABLE: dat_act_1.GAME_DATA_ACTIVABLES,
    SKILL: {
        0: dat_cla_0_1.GAME_DATA_WARRIOR_SKILL,
        1: dat_cla_1_1.GAME_DATA_HUNTRESS_SKILL,
        2: dat_cla_2_1.GAME_DATA_MAGE_SKILL
    },
    TRANSLATION: dat_str_1.GAME_DATA_TRANSLATION,
    BUFF: dat_buf_1.GAME_DATA_BUFF,
    ANCESTRAL_LEGACY: dat_ele_1.GAME_DATA_ANCESTRAL_LEGACY,
    ATTRIBUTES: dat_att_1.GAME_DATA_ATTRIBUTES
};
//# sourceMappingURL=game-data.js.map