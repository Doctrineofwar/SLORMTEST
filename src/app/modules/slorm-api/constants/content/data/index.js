"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.COMBAT_CONFIG = exports.DATA_ULTIMATUM = exports.DATA_TRANSLATE = exports.DATA_TEMPLATE_MECHANIC = exports.DATA_SKILL_XP = exports.DATA_SKILL_CLASS_MECHANIC_ID = exports.DATA_SKILL_BUFF = exports.DATA_RUNE = exports.DATA_REAPER_LEVEL = exports.DATA_MECHANIC = exports.DATA_LEGENDARY = exports.DATA_LEGENDARY_BASE = exports.DATA_KEYWORD_NAME = exports.DATA_HERO_XP_NEXT_LEVEL = exports.DATA_HERO_BASE_STATS = exports.DATA_EQUIPABLE_ITEM = exports.DATA_CLASS_MECHANIC = exports.DATA_BASE_MAX_BASIC_STATS = exports.DATA_ATTRIBUTE = exports.DATA_ATTRIBUTE_MECHANIC = exports.DATA_ANCESTRAL_LEGACY = exports.INITIAL_NODES = exports.ANCESTRAL_LEGACY_REALMS = exports.DATA_ACTIVABLE = void 0;
var data_activable_1 = require("./data-activable");
Object.defineProperty(exports, "DATA_ACTIVABLE", { enumerable: true, get: function () { return data_activable_1.DATA_ACTIVABLE; } });
var data_ancestral_legacy_realms_1 = require("./data-ancestral-legacy-realms");
Object.defineProperty(exports, "ANCESTRAL_LEGACY_REALMS", { enumerable: true, get: function () { return data_ancestral_legacy_realms_1.ANCESTRAL_LEGACY_REALMS; } });
Object.defineProperty(exports, "INITIAL_NODES", { enumerable: true, get: function () { return data_ancestral_legacy_realms_1.INITIAL_NODES; } });
var data_ancestral_legacy_1 = require("./data-ancestral-legacy");
Object.defineProperty(exports, "DATA_ANCESTRAL_LEGACY", { enumerable: true, get: function () { return data_ancestral_legacy_1.DATA_ANCESTRAL_LEGACY; } });
var data_attribute_mechanic_1 = require("./data-attribute-mechanic");
Object.defineProperty(exports, "DATA_ATTRIBUTE_MECHANIC", { enumerable: true, get: function () { return data_attribute_mechanic_1.DATA_ATTRIBUTE_MECHANIC; } });
var data_attribute_1 = require("./data-attribute");
Object.defineProperty(exports, "DATA_ATTRIBUTE", { enumerable: true, get: function () { return data_attribute_1.DATA_ATTRIBUTE; } });
var data_base_max_basic_stat_1 = require("./data-base-max-basic-stat");
Object.defineProperty(exports, "DATA_BASE_MAX_BASIC_STATS", { enumerable: true, get: function () { return data_base_max_basic_stat_1.DATA_BASE_MAX_BASIC_STATS; } });
__exportStar(require("./data-character-stats-mapping"), exports);
var data_class_mechanic_1 = require("./data-class-mechanic");
Object.defineProperty(exports, "DATA_CLASS_MECHANIC", { enumerable: true, get: function () { return data_class_mechanic_1.DATA_CLASS_MECHANIC; } });
var data_equipable_item_1 = require("./data-equipable-item");
Object.defineProperty(exports, "DATA_EQUIPABLE_ITEM", { enumerable: true, get: function () { return data_equipable_item_1.DATA_EQUIPABLE_ITEM; } });
var data_hero_base_stats_1 = require("./data-hero-base-stats");
Object.defineProperty(exports, "DATA_HERO_BASE_STATS", { enumerable: true, get: function () { return data_hero_base_stats_1.DATA_HERO_BASE_STATS; } });
var data_hero_xp_1 = require("./data-hero-xp");
Object.defineProperty(exports, "DATA_HERO_XP_NEXT_LEVEL", { enumerable: true, get: function () { return data_hero_xp_1.DATA_HERO_XP_NEXT_LEVEL; } });
var data_keyword_name_1 = require("./data-keyword-name");
Object.defineProperty(exports, "DATA_KEYWORD_NAME", { enumerable: true, get: function () { return data_keyword_name_1.DATA_KEYWORD_NAME; } });
var data_legendary_base_1 = require("./data-legendary-base");
Object.defineProperty(exports, "DATA_LEGENDARY_BASE", { enumerable: true, get: function () { return data_legendary_base_1.DATA_LEGENDARY_BASE; } });
var data_legendary_1 = require("./data-legendary");
Object.defineProperty(exports, "DATA_LEGENDARY", { enumerable: true, get: function () { return data_legendary_1.DATA_LEGENDARY; } });
var data_mechanic_1 = require("./data-mechanic");
Object.defineProperty(exports, "DATA_MECHANIC", { enumerable: true, get: function () { return data_mechanic_1.DATA_MECHANIC; } });
var data_reaper_level_1 = require("./data-reaper-level");
Object.defineProperty(exports, "DATA_REAPER_LEVEL", { enumerable: true, get: function () { return data_reaper_level_1.DATA_REAPER_LEVEL; } });
var data_rune_1 = require("./data-rune");
Object.defineProperty(exports, "DATA_RUNE", { enumerable: true, get: function () { return data_rune_1.DATA_RUNE; } });
var data_skill_buff_1 = require("./data-skill-buff");
Object.defineProperty(exports, "DATA_SKILL_BUFF", { enumerable: true, get: function () { return data_skill_buff_1.DATA_SKILL_BUFF; } });
var data_skill_class_mechanic_id_1 = require("./data-skill-class-mechanic-id");
Object.defineProperty(exports, "DATA_SKILL_CLASS_MECHANIC_ID", { enumerable: true, get: function () { return data_skill_class_mechanic_id_1.DATA_SKILL_CLASS_MECHANIC_ID; } });
var data_skill_xp_1 = require("./data-skill-xp");
Object.defineProperty(exports, "DATA_SKILL_XP", { enumerable: true, get: function () { return data_skill_xp_1.DATA_SKILL_XP; } });
var data_template_mechanic_1 = require("./data-template-mechanic");
Object.defineProperty(exports, "DATA_TEMPLATE_MECHANIC", { enumerable: true, get: function () { return data_template_mechanic_1.DATA_TEMPLATE_MECHANIC; } });
var data_translate_1 = require("./data-translate");
Object.defineProperty(exports, "DATA_TRANSLATE", { enumerable: true, get: function () { return data_translate_1.DATA_TRANSLATE; } });
var data_ultimatum_1 = require("./data-ultimatum");
Object.defineProperty(exports, "DATA_ULTIMATUM", { enumerable: true, get: function () { return data_ultimatum_1.DATA_ULTIMATUM; } });
var default_configs_1 = require("./default-configs");
Object.defineProperty(exports, "COMBAT_CONFIG", { enumerable: true, get: function () { return default_configs_1.COMBAT_CONFIG; } });
Object.defineProperty(exports, "DEFAULT_CONFIG", { enumerable: true, get: function () { return default_configs_1.DEFAULT_CONFIG; } });
//# sourceMappingURL=index.js.map