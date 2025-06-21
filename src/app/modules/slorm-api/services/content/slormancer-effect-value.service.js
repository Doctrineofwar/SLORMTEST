"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerEffectValueService = void 0;
const core_1 = require("@angular/core");
const model_1 = require("../../model");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerEffectValueService = class SlormancerEffectValueService {
    getEffectValueClone(effectValue) {
        return { ...effectValue };
    }
    // TODO update effect value model / view
    updateRuneEffectValue(effectValue, upgradeMultiplier, effectMultiplier) {
        if ((0, utils_1.isEffectValueSynergy)(effectValue) || (0, utils_1.isEffectValueVariable)(effectValue)) {
            let value = effectValue.baseValue;
            let displayValue = effectValue.baseValue;
            let precision = 3;
            value = (0, math_util_1.bankerRound)(value * effectMultiplier, precision);
            displayValue = value;
            const realUpgrade = effectValue.baseUpgrade * effectMultiplier;
            effectValue.upgrade = (0, math_util_1.bankerRound)(effectValue.baseUpgrade * effectMultiplier, precision);
            if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3RuneLevel) {
                value += realUpgrade * Math.floor(upgradeMultiplier / 3);
                displayValue = value;
            }
            else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every5RuneLevel) {
                value += realUpgrade * Math.floor(upgradeMultiplier / 5);
                displayValue = value;
            }
            else {
                value += realUpgrade * upgradeMultiplier;
                displayValue = value;
            }
            effectValue.value = (0, math_util_1.round)(value, 5);
            effectValue.displayValue = (0, math_util_1.bankerRound)(displayValue, 3);
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                effectValue.upgradedValue = effectValue.value;
            }
        }
        return effectValue;
    }
    // TODO update effect value model / view
    updateEffectValue(effectValue, upgradeMultiplier, context = {}) {
        if ((0, utils_1.isEffectValueSynergy)(effectValue) || (0, utils_1.isEffectValueVariable)(effectValue)) {
            let value = effectValue.baseValue;
            let displayValue = effectValue.baseValue;
            if (context.globalMultiplier !== undefined && context.globalMultiplierPrecision !== undefined) {
                // TODO bankerRound à remplacer par round ?
                value = (0, math_util_1.bankerRound)(value * context.globalMultiplier, context.globalMultiplierPrecision);
                displayValue = value;
                effectValue.upgrade = (0, math_util_1.round)(effectValue.baseUpgrade * context.globalMultiplier, context.globalMultiplierPrecision);
            }
            if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3) {
                value += effectValue.upgrade * Math.floor(upgradeMultiplier / 3);
                displayValue = value;
            }
            else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3RuneLevel) {
                // activation rune every 3 bug
                if (context.globalMultiplier !== undefined && context.globalMultiplier !== 1) {
                    value += Math.ceil(effectValue.upgrade * upgradeMultiplier / 3);
                }
                else {
                    value += effectValue.upgrade * Math.floor(upgradeMultiplier / 3);
                }
                displayValue = value;
            }
            else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every5RuneLevel) {
                value += effectValue.upgrade * Math.floor(upgradeMultiplier / 5);
                displayValue = value;
            }
            else {
                if (context.affinityMultiplier !== undefined) {
                    const affinityMultiplier = effectValue.valueType === model_1.EffectValueValueType.Static ? 1 : context.affinityMultiplier;
                    if (context.useOldAffinityFormula === true) {
                        effectValue.upgrade = effectValue.baseUpgrade;
                        displayValue += effectValue.upgrade * affinityMultiplier * upgradeMultiplier;
                        value += effectValue.upgrade * affinityMultiplier * upgradeMultiplier;
                        effectValue.upgrade = (0, math_util_1.round)(effectValue.baseUpgrade * affinityMultiplier, 2);
                    }
                    else {
                        effectValue.upgrade = effectValue.baseUpgrade;
                        displayValue += effectValue.upgrade * affinityMultiplier * upgradeMultiplier;
                        effectValue.upgrade = (0, math_util_1.round)(effectValue.baseUpgrade * affinityMultiplier, 2);
                        value += effectValue.upgrade * upgradeMultiplier;
                    }
                }
                else {
                    value += effectValue.upgrade * upgradeMultiplier;
                    displayValue = value;
                }
            }
            effectValue.value = (0, math_util_1.round)(value, 5);
            effectValue.displayValue = (0, math_util_1.bankerRound)(displayValue, 3);
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                effectValue.upgradedValue = effectValue.value;
            }
        }
        return effectValue;
    }
};
SlormancerEffectValueService = __decorate([
    (0, core_1.Injectable)()
], SlormancerEffectValueService);
exports.SlormancerEffectValueService = SlormancerEffectValueService;
//# sourceMappingURL=slormancer-effect-value.service.js.map