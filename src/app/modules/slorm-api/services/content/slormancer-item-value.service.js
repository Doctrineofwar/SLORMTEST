"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerItemValueService = void 0;
const core_1 = require("@angular/core");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const rarity_1 = require("../../model/content/enum/rarity");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerItemValueService = class SlormancerItemValueService {
    constructor() {
        this.DAMAGE_STATS = [
            'min_basic_damage_add',
            'min_elemental_damage_add',
        ];
        this.DEFENSE_STATS = [
            'res_phy_add',
            'res_mag_add',
            'dodge_add',
        ];
        this.REINFORCEMENT_CACHE = {};
        this.AFFIX_MIN_MAX = {
            [rarity_1.Rarity.Normal]: {
                '': {
                    1: { min: 70, max: 100 },
                    2: { min: 70, max: 100 },
                    3: { min: 70, max: 100 },
                    4: { min: 70, max: 100 },
                    5: { min: 70, max: 100 },
                },
                '%': {
                    1: { min: 14, max: 20 },
                    2: { min: 28, max: 40 },
                    3: { min: 42, max: 60 },
                    4: { min: 56, max: 80 },
                    5: { min: 70, max: 100 },
                }
            },
            [rarity_1.Rarity.Defensive]: {
                '': {
                    1: { min: 45, max: 65 },
                    2: { min: 45, max: 65 },
                    3: { min: 45, max: 65 },
                    4: { min: 45, max: 65 },
                    5: { min: 45, max: 65 },
                },
                '%': {
                    1: { min: 9, max: 13 },
                    2: { min: 18, max: 26 },
                    3: { min: 27, max: 39 },
                    4: { min: 36, max: 52 },
                    5: { min: 45, max: 65 },
                }
            },
            [rarity_1.Rarity.Magic]: {
                '': {
                    1: { min: 45, max: 65 },
                    2: { min: 45, max: 65 },
                    3: { min: 45, max: 65 },
                    4: { min: 45, max: 65 },
                    5: { min: 45, max: 65 },
                },
                '%': {
                    1: { min: 9, max: 13 },
                    2: { min: 18, max: 26 },
                    3: { min: 27, max: 39 },
                    4: { min: 36, max: 52 },
                    5: { min: 45, max: 65 },
                }
            },
            [rarity_1.Rarity.Rare]: {
                '': {
                    1: { min: 45, max: 65 },
                    2: { min: 45, max: 65 },
                    3: { min: 45, max: 65 },
                    4: { min: 45, max: 65 },
                    5: { min: 45, max: 65 },
                },
                '%': {
                    1: { min: 9, max: 13 },
                    2: { min: 18, max: 26 },
                    3: { min: 27, max: 39 },
                    4: { min: 36, max: 52 },
                    5: { min: 45, max: 65 },
                }
            },
            [rarity_1.Rarity.Epic]: {
                '': {
                    1: { min: 20, max: 40 },
                    2: { min: 20, max: 40 },
                    3: { min: 20, max: 40 },
                    4: { min: 20, max: 40 },
                    5: { min: 20, max: 40 },
                },
                '%': {
                    1: { min: 4, max: 8 },
                    2: { min: 8, max: 16 },
                    3: { min: 12, max: 24 },
                    4: { min: 16, max: 32 },
                    5: { min: 20, max: 40 },
                }
            },
            [rarity_1.Rarity.Legendary]: {
                '': {
                    1: { min: 75, max: 100 },
                    2: { min: 75, max: 100 },
                    3: { min: 75, max: 100 },
                    4: { min: 75, max: 100 },
                    5: { min: 75, max: 100 },
                },
                '%': {
                    1: { min: 75, max: 100 },
                    2: { min: 75, max: 100 },
                    3: { min: 75, max: 100 },
                    4: { min: 75, max: 100 },
                    5: { min: 75, max: 100 },
                }
            },
            [rarity_1.Rarity.Neither]: {}
        };
    }
    getLevelPercentScore(level) {
        let result = 1;
        if (level >= 52) {
            result = 5;
        }
        else if (level >= 45) {
            result = 4;
        }
        else if (level >= 35) {
            result = 3;
        }
        else if (level >= 20) {
            result = 2;
        }
        return result;
    }
    getComputedBaseValue(level, stat, score, percent) {
        let damageStatMultiplier = 0;
        if (this.DAMAGE_STATS.includes(stat)) {
            damageStatMultiplier = level * level * 1.2;
        }
        else if (this.DEFENSE_STATS.includes(stat)) {
            damageStatMultiplier = level * level * 0.9;
        }
        return percent
            ? this.getLevelPercentScore(level) * score * 20
            : score * (100 + (level * 30 + damageStatMultiplier)) / 100;
    }
    roundValue(value, precisionValue, percent) {
        let result = value;
        if (percent) {
            if (precisionValue) {
                result = (0, math_util_1.round)(value / 100, 6);
            }
            else {
                result = (0, math_util_1.round)(value / 100, 2);
            }
        }
        else {
            if (precisionValue) {
                result = (0, math_util_1.bankerRound)(value, 1);
            }
            else {
                result = Math.max(1, (0, math_util_1.bankerRound)(value));
            }
        }
        return result;
    }
    getValueRatio(level, value, percent) {
        const levelScore = this.getLevelPercentScore(level);
        let ratio = value;
        if (percent) {
            ratio = ratio * 5 / levelScore;
        }
        return ratio;
    }
    getReinforcementratio(reinforcement) {
        let ratio = this.REINFORCEMENT_CACHE[reinforcement];
        if (ratio === undefined) {
            ratio = 100 + Math.max(reinforcement - 14, 0) + Array.from(new Array(Math.min(14, reinforcement)).keys()).map(i => Math.max(1, 15 - i)).reduce((current, sum) => current + sum, 0);
            this.REINFORCEMENT_CACHE[reinforcement] = ratio;
        }
        return ratio;
    }
    computeAffixValue(level, stat, reinforcement, score, value, percent, pure, multiplier) {
        const baseValue = this.getComputedBaseValue(level, stat, score, percent);
        const reinforcementRatio = this.getReinforcementratio(reinforcement);
        const valueRatio = this.getValueRatio(level, value, percent);
        const pureRatio = pure === null || pure === 0 ? 100 : pure;
        const multiplierRatio = 100 + (multiplier === null ? 0 : multiplier);
        return this.roundValue(baseValue * reinforcementRatio * valueRatio * pureRatio * multiplierRatio / (100 * 100 * 100 * 100), score < 2.5, percent);
    }
    getAffixMinMax(rarity, percent, levelScore) {
        let minMax = null;
        const rarityMinmax = this.AFFIX_MIN_MAX[rarity];
        if (rarityMinmax) {
            const percentMinMax = rarityMinmax[percent ? '%' : ''];
            if (percentMinMax) {
                const levelMinMax = percentMinMax[levelScore];
                minMax = levelMinMax ? levelMinMax : null;
            }
        }
        return minMax;
    }
    getAffixValues(level, stat, reinforcement, score, percent, rarity, pure, multiplier) {
        let values = [];
        const levelScore = this.getLevelPercentScore(level);
        const range = this.getAffixMinMax(rarity, percent, levelScore);
        if (range !== null) {
            values = (0, math_util_1.list)(range.min, range.max).map(v => ({ craft: v, value: this.computeAffixValue(level, stat, reinforcement, score, v, percent, pure, multiplier) }));
        }
        return values;
    }
    computeEffectRange(value, min, max, upgrade, precision = false) {
        return (0, math_util_1.list)(min, max).map(ratio => ({ craft: ratio, value: this.roundValue(value * ratio / 100, precision, false) + upgrade }));
    }
    computeEffectVariableDetails(effect, itemValue, reinforcement) {
        let upgradeMultiplier = reinforcement;
        if (effect.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3 || effect.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3RuneLevel) {
            upgradeMultiplier = Math.floor(upgradeMultiplier / 3);
        }
        else if (effect.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every5RuneLevel) {
            upgradeMultiplier = Math.floor(upgradeMultiplier / 5);
        }
        const result = {
            value: 0,
            baseValue: effect.value,
            range: null,
            baseRange: null,
            upgrade: effect.upgrade,
            baseFormulaUpgrade: 0,
            upgradeType: effect.upgradeType,
            percent: effect.percent,
            synergy: null,
        };
        result.value = result.range ? (0, utils_1.valueOrDefault)(result.range[itemValue], 0) : (0, math_util_1.round)(effect.value + effect.upgrade * upgradeMultiplier, 2);
        result.baseFormulaUpgrade = result.range ? (0, utils_1.valueOrDefault)(result.range[itemValue], 0) : (0, math_util_1.round)(effect.value + effect.upgrade, 2);
        return result;
    }
    computeEffectSynergyDetails(effect, itemValue, reinforcement) {
        const upgradeMultiplier = (effect.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3 || effect.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3RuneLevel) ? Math.floor(reinforcement / 3) : reinforcement;
        const result = {
            value: 0,
            baseValue: effect.value,
            range: null,
            baseRange: null,
            upgrade: effect.upgrade,
            baseFormulaUpgrade: 0,
            upgradeType: effect.upgradeType,
            percent: true,
            synergy: null,
        };
        result.value = result.range ? (0, utils_1.valueOrDefault)(result.range[itemValue], 0) : (0, math_util_1.round)(effect.value + effect.upgrade * upgradeMultiplier, 2);
        result.baseFormulaUpgrade = result.range ? (0, utils_1.valueOrDefault)(result.range[itemValue], 0) : (0, math_util_1.round)(effect.value + effect.upgrade, 2);
        return result;
    }
    computeReaperEnchantmentValues() {
        const values = {};
        for (let value of (0, math_util_1.list)(1, 5)) {
            values[value] = value;
        }
        return values;
    }
    computeSkillEnchantmentValues() {
        const values = {};
        for (let value of (0, math_util_1.list)(1, 2)) {
            values[value] = value;
        }
        return values;
    }
    computeAttributeEnchantmentValues() {
        const values = {};
        for (let value of (0, math_util_1.list)(1, 3)) {
            values[value] = value;
        }
        return values;
    }
};
SlormancerItemValueService = __decorate([
    (0, core_1.Injectable)()
], SlormancerItemValueService);
exports.SlormancerItemValueService = SlormancerItemValueService;
//# sourceMappingURL=slormancer-item-value.service.js.map