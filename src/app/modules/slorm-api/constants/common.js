"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_TO_GAME_VERSION_MAPPER = exports.API_VERSION = exports.GAME_VERSION = exports.TIME_LOCK_DURATION = exports.ARCANE_BOND_DURATION = exports.POISON_DURATION = exports.SHIELD_DURATION = exports.PRIME_TOTEM_SKILL = exports.DAMAGE_PER_OBLITERATION_EMBLEM = exports.COOLDOWN_REDUCTION_PER_TEMPORAL_EMBLEM = exports.ATTACK_SPEED_PER_ARCANIC_EMBLEM = exports.FAST_SKILL_BASE_COOLDOWN = exports.MAX_EFFECT_AFFINITY_BASE = exports.MAX_REAPER_AFFINITY_BASE = exports.MAX_REAPER_AFFINITY_BONUS = exports.REMNANT_DAMAGE_REDUCTION = exports.MAX_EMBLEMS = exports.ARCANE_BOND_DAMAGE_FROM_MAX_MANA = exports.ARCANE_BOND_DAMAGE_FROM_MANA_SPENT = exports.ARCANE_CLONE_ATTACK_SPEED_REDUCTION = exports.ASTRAL_METEOR_AOE = exports.ASTRAL_METEOR_DAMAGE_PERCENT = exports.ASTRAL_RETRIBUTION_DAMAGE_PERCENT = exports.TRAP_ARM_DURATION = exports.TRAP_STUN_DURATION = exports.TRAP_AOE = exports.TRAP_DAMAGE_PERCENT = exports.RAVENOUS_DAGGER_DAMAGE_PERCENT = exports.POISON_DAMAGE_PERCENT = exports.BASE_MOVEMENT_SPEED = exports.COOLDOWN_REDUCTION_PER_DELIGHTED_STACK = exports.ATTACK_SPEED_PER_DELIGHTED_STACK = exports.DELIGHTED_VALUE = exports.MAXIMUM_ANCESTRAL_LEGACY_POINTS = exports.UNLOCKED_ANCESTRAL_LEGACY_POINTS = exports.ULTIMATUM_MAX_LEVEL = exports.SKILL_MAX_MASTERY = exports.STASH_TABS_COUNT = exports.STASH_SIZE = exports.INVENTORY_SIZE = exports.MAX_REINFORCEMENT_UPGRADE = exports.MAX_EPIC_STATS = exports.MAX_RARE_STATS = exports.MAX_MAGIC_STATS = exports.MAX_DEFENSIVE_STATS = exports.MAX_REAPER_LEVEL = exports.MAX_ATTRIBUTE_RANK = exports.MAX_NEITHER_ITEM_LEVEL = exports.MAX_ITEM_LEVEL = exports.MAX_HERO_LEVEL = void 0;
exports.UNITY_REAPERS = exports.PERCENT_STATS = void 0;
const environment_1 = require("src/environments/environment");
const model_1 = require("../model");
exports.MAX_HERO_LEVEL = 100;
exports.MAX_ITEM_LEVEL = exports.MAX_HERO_LEVEL;
exports.MAX_NEITHER_ITEM_LEVEL = exports.MAX_ITEM_LEVEL + 20;
exports.MAX_ATTRIBUTE_RANK = 75;
exports.MAX_REAPER_LEVEL = 100;
exports.MAX_DEFENSIVE_STATS = 1;
exports.MAX_MAGIC_STATS = 1;
exports.MAX_RARE_STATS = 1;
exports.MAX_EPIC_STATS = 3;
exports.MAX_REINFORCEMENT_UPGRADE = 15;
exports.INVENTORY_SIZE = 64;
exports.STASH_SIZE = 35;
exports.STASH_TABS_COUNT = 12;
exports.SKILL_MAX_MASTERY = 15;
exports.ULTIMATUM_MAX_LEVEL = 15;
exports.UNLOCKED_ANCESTRAL_LEGACY_POINTS = 7;
exports.MAXIMUM_ANCESTRAL_LEGACY_POINTS = 7;
exports.DELIGHTED_VALUE = 12;
exports.ATTACK_SPEED_PER_DELIGHTED_STACK = 2;
exports.COOLDOWN_REDUCTION_PER_DELIGHTED_STACK = 1;
exports.BASE_MOVEMENT_SPEED = 2.4;
exports.POISON_DAMAGE_PERCENT = 200;
exports.RAVENOUS_DAGGER_DAMAGE_PERCENT = 100;
exports.TRAP_DAMAGE_PERCENT = 200;
exports.TRAP_AOE = 1.5;
exports.TRAP_STUN_DURATION = 3;
exports.TRAP_ARM_DURATION = 1;
exports.ASTRAL_RETRIBUTION_DAMAGE_PERCENT = 300;
exports.ASTRAL_METEOR_DAMAGE_PERCENT = 300;
exports.ASTRAL_METEOR_AOE = 1.5;
exports.ARCANE_CLONE_ATTACK_SPEED_REDUCTION = -35;
exports.ARCANE_BOND_DAMAGE_FROM_MANA_SPENT = 100;
exports.ARCANE_BOND_DAMAGE_FROM_MAX_MANA = 15;
exports.MAX_EMBLEMS = 3;
exports.REMNANT_DAMAGE_REDUCTION = 50;
exports.MAX_REAPER_AFFINITY_BONUS = 50;
exports.MAX_REAPER_AFFINITY_BASE = 100;
exports.MAX_EFFECT_AFFINITY_BASE = exports.MAX_REAPER_AFFINITY_BASE * model_1.ALL_UPGRADABLE_REAPER_SMITH.length;
exports.FAST_SKILL_BASE_COOLDOWN = 0.33;
exports.ATTACK_SPEED_PER_ARCANIC_EMBLEM = 5;
exports.COOLDOWN_REDUCTION_PER_TEMPORAL_EMBLEM = 3;
exports.DAMAGE_PER_OBLITERATION_EMBLEM = 5;
exports.PRIME_TOTEM_SKILL = {
    [model_1.HeroClass.Huntress]: 3,
    [model_1.HeroClass.Mage]: 3,
    [model_1.HeroClass.Warrior]: 4,
};
exports.SHIELD_DURATION = 3;
exports.POISON_DURATION = 7;
exports.ARCANE_BOND_DURATION = 7;
exports.TIME_LOCK_DURATION = 3;
exports.GAME_VERSION = environment_1.environment.gameVersion;
exports.API_VERSION = environment_1.environment.version;
exports.API_TO_GAME_VERSION_MAPPER = {
    '0.0.9': '0.3.015',
    '0.0.10': '0.3.015',
    '0.0.11': '0.3.015',
    '0.0.12': '0.3.015',
    '0.1.0': '0.3.1071',
    '0.1.1': '0.3.1071',
    '0.1.2': '0.4.191',
    '0.1.3': '0.4.191',
    '0.1.4': '0.4.191',
    '0.1.5': '0.4.21',
    '0.2.0': '0.4.6a',
    '0.2.1': '0.4.6a',
    '0.2.2': '0.4.6a',
    '0.2.3': '0.4.6fa',
    '0.2.5': '0.4.91b',
    '0.3.0': '0.5.01e',
    '0.3.1': '0.5.01e',
    '0.4.0': '0.6.5l',
    '0.4.1': '0.6.5n',
    '0.5.0': '0.7.0g',
    '0.5.1': '0.7.0g',
    '0.6.0': '0.8.0i',
    '0.6.1': '0.8.0i',
    '0.6.2': '0.8.0i',
    '0.6.4': '0.8.0i',
    '0.7.0': '0.9.3b',
    '0.8.0': '1.0.0i',
    '0.8.1': '1.0.0i',
    '0.8.2': '1.0.0m',
    '0.8.3': '1.0.0p',
    '1.0.0': '1.0.01a',
    '1.0.1': '1.0.1e',
};
exports.PERCENT_STATS = [
    'essence_find',
    'xp_find',
    'influence_gain',
    'mf_find',
    'mf_qual',
    'health_leech_percent',
    'mana_leech_percent',
    'critical_chance',
    'critical_damage',
    'ancestral_chance',
    'ancestral_damage',
    'armor_penetration',
    'elemental_penetration',
    'dot_increased_damage',
    'increased_on_elite',
    'fire_resistance',
    'ice_resistance',
    'lightning_resistance',
    'light_resistance',
    'shadow_resistance',
    'retaliate',
    'tenacity',
    'reduced_on_all',
    'reduced_by_elite',
    'reduced_on_melee',
    'reduced_on_projectile',
    'reduced_on_area',
    'gold_find',
    'scrap_find',
    'slormite_find',
    'slormeline_find',
    'reaper_find',
    'skill_mastery_gain',
    'inner_fire_chance',
    'overdrive_chance',
    'recast_chance',
    'knockback_melee',
    'chance_to_pierce',
    'fork_chance',
    'chance_to_rebound',
    'projectile_speed',
    'knockback_projectile',
    'aoe_increased_size',
    'aoe_increased_effect',
    'totem_increased_effect',
    'aura_increased_effect',
    'minion_increased_damage',
];
exports.UNITY_REAPERS = [47, 48, 49, 50, 51, 52];
//# sourceMappingURL=common.js.map