"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_ULTIMATUM = void 0;
const effect_value_upgrade_type_1 = require("../../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../../model/content/enum/effect-value-value-type");
const ultimatum_type_1 = require("../../../model/content/enum/ultimatum-type");
const effect_value_util_1 = require("../../../util/effect-value.util");
exports.DATA_ULTIMATUM = {
    [ultimatum_type_1.UltimatumType.InfiniteWisdom]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(20, 3, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'xp_find', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: false
    },
    [ultimatum_type_1.UltimatumType.IndisputedSpeed]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(2.6, 0.05, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, false, 'movement_speed', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: false
    },
    [ultimatum_type_1.UltimatumType.AdamantAbundance]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(125, 25, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, false, 'mana_regeneration', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: false
    },
    [ultimatum_type_1.UltimatumType.EndlessWealth]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(25, 5, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'gold_find', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: false
    },
    [ultimatum_type_1.UltimatumType.EchoingBeyond]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(15, 1.5, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'recast_chance', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.ProfoundDepth]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(5, 2, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'reduced_on_area', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: false
    },
    [ultimatum_type_1.UltimatumType.PerfectSegmentation]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(10, 2, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'fork_chance', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.ImpeccableTechnique]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(25, 15, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'inner_fire_damage', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.FlawlessPower]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(175, 7, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'critical_damage', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.SplendidHorizon]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(15, 2, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'increased_on_elite', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.ProdigiousCalamity]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(10, 1.5, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'attack_speed', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.MarvelousJudgment]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(15, 1.5, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'aoe_increased_size', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.PerpendicularParallelism]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(1.1, 0.06, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, false, 'additional_projectile', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.DivineIntervention]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(10, 1.5, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'critical_chance', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
    [ultimatum_type_1.UltimatumType.StoicWrath]: {
        value: () => (0, effect_value_util_1.effectValueVariable)(7.5, 0.5, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank, true, 'ancestral_chance', effect_value_value_type_1.EffectValueValueType.Stat),
        extendedMalus: true
    },
};
//# sourceMappingURL=data-ultimatum.js.map