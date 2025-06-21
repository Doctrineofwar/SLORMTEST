"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectValueSynergy = exports.effectValueVariable = exports.effectValueConstant = void 0;
const effect_value_type_1 = require("../model/content/enum/effect-value-type");
const effect_value_value_type_1 = require("../model/content/enum/effect-value-value-type");
function effectValueConstant(value, percent, stat = null, valueType = effect_value_value_type_1.EffectValueValueType.Unknown) {
    return {
        type: effect_value_type_1.EffectValueType.Constant,
        valueType,
        stat,
        percent,
        baseValue: value,
        value,
        displayValue: value
    };
}
exports.effectValueConstant = effectValueConstant;
function effectValueVariable(value, upgrade, upgradeType, percent, stat = null, valueType = effect_value_value_type_1.EffectValueValueType.Unknown, max) {
    return {
        type: effect_value_type_1.EffectValueType.Variable,
        valueType,
        stat,
        percent,
        value,
        displayValue: value,
        max,
        baseValue: value,
        baseUpgrade: upgrade,
        upgrade,
        upgradedValue: value,
        upgradeType
    };
}
exports.effectValueVariable = effectValueVariable;
function effectValueSynergy(value, upgrade, upgradeType, percent, source, stat = null, valueType = effect_value_value_type_1.EffectValueValueType.Unknown, max, precision = null, allowMinMax = true, detailOnSynergy = true, showValue = true, cascadeSynergy = false) {
    return {
        type: effect_value_type_1.EffectValueType.Synergy,
        valueType,
        stat,
        percent,
        value,
        displayValue: value,
        max,
        baseValue: value,
        baseUpgrade: upgrade,
        upgrade,
        upgradeType,
        source,
        baseSynergy: 0,
        synergy: 0,
        displaySynergy: 0,
        precision,
        allowMinMax,
        detailOnSynergy,
        showValue,
        cascadeSynergy
    };
}
exports.effectValueSynergy = effectValueSynergy;
//# sourceMappingURL=effect-value.util.js.map