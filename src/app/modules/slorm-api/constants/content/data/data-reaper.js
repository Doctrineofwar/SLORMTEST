"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_REAPER = void 0;
const effect_value_upgrade_type_1 = require("../../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../../model/content/enum/effect-value-value-type");
const effect_value_util_1 = require("../../../util/effect-value.util");
const utils_1 = require("../../../util/utils");
const common_1 = require("../../common");
function overrideValueTypeAndStat(effect, index, valueType, stat = null) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null) {
        (0, utils_1.warnIfEqual)(value.valueType + value.stat, valueType + stat, 'reaper overrideValueTypeAndStat at index ' + index + ' did not changed anthing', effect);
        value.valueType = valueType;
        if (stat !== null) {
            value.stat = stat;
        }
    }
    else {
        throw new Error('failed to override effect value at index ' + index + ' with : ' + valueType + ' / ' + stat);
    }
}
function overrideSynergySource(effect, index, source) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null && (0, utils_1.isEffectValueSynergy)(value)) {
        (0, utils_1.warnIfEqual)(value.source, source, 'reaper overrideSynergySource at index ' + index + ' did not changed anthing', effect);
        value.source = source;
    }
    else {
        throw new Error('failed to override synergy source at index ' + index + ' with : ' + source);
    }
}
function overrideSynergyPercent(effect, index, percent) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null && (0, utils_1.isEffectValueSynergy)(value)) {
        (0, utils_1.warnIfEqual)(value.percent, percent, 'reaper overrideSynergyPercent at index ' + index + ' did not changed anthing', effect);
        value.percent = percent;
    }
    else {
        throw new Error('failed to override synergy percent at index ' + index + ' with : ' + percent);
    }
}
function negateValueBaseAndUpgrade(effect, index) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null && (0, utils_1.isEffectValueVariable)(value)) {
        value.baseValue = value.baseValue * -1;
        value.upgrade = value.upgrade * -1;
    }
    else {
        throw new Error('failed to negate effect value at index ' + index);
    }
}
function nullifySynergyUpgrade(effect, index) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null && (0, utils_1.isEffectValueSynergy)(value)) {
        (0, utils_1.warnIfEqual)(value.upgrade, 0, 'reaper nullifySynergyUpgrade at index ' + index + ' did not changed anthing', effect);
        (0, utils_1.warnIfEqual)(value.baseUpgrade, 0, 'reaper nullifySynergyUpgrade at index ' + index + ' did not changed anthing', effect);
        value.baseUpgrade = 0;
        value.upgrade = 0;
    }
    else {
        throw new Error('failed to negate effect value at index ' + index);
    }
}
function copySynergyUpgradeFrom(effect, index, indexSource) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    const valueSource = effect !== null ? (0, utils_1.valueOrNull)(effect.values[indexSource]) : null;
    if (value !== null && valueSource !== null && (0, utils_1.isEffectValueSynergy)(value) && (0, utils_1.isEffectValueVariable)(valueSource)) {
        (0, utils_1.warnIfEqual)(value.upgrade, valueSource.upgrade, 'reaper copySynergyUpgradeFrom at index ' + index + ' did not changed anthing', effect);
        value.upgrade = valueSource.upgrade;
    }
    else {
        throw new Error('failed to copy synergy upgrade from variable at index ' + index);
    }
}
function changeValue(effect, index, newValue) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null && ((0, utils_1.isEffectValueVariable)(value) || (0, utils_1.isEffectValueSynergy)(value))) {
        (0, utils_1.warnIfEqual)(value.baseValue, newValue, 'reaper copySynergyUpgradeFrom at index ' + index + ' did not changed anthing', effect);
        value.baseValue = newValue;
    }
    else {
        throw new Error('failed to change value for effect value at index ' + index);
    }
}
function synergyMultiply100(effect, index) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null && ((0, utils_1.isEffectValueVariable)(value) || (0, utils_1.isEffectValueSynergy)(value))) {
        value.baseValue = value.baseValue * 100;
    }
    else {
        throw new Error('failed to change value for effect value at index ' + index);
    }
}
function synergyMultiply100BaseAndUpgrade(effect, index) {
    const value = effect !== null ? (0, utils_1.valueOrNull)(effect.values[index]) : null;
    if (value !== null && ((0, utils_1.isEffectValueVariable)(value) || (0, utils_1.isEffectValueSynergy)(value))) {
        value.baseValue = value.baseValue * 100;
        value.baseUpgrade = value.baseUpgrade * 100;
        value.upgrade = value.upgrade * 100;
    }
    else {
        throw new Error('failed to change value for effect value at index ' + index);
    }
}
function addConstant(effect, value, percent, valueType, stat) {
    if (effect !== null) {
        effect.values.push((0, effect_value_util_1.effectValueConstant)(value, percent, stat, valueType));
    }
    else {
        throw new Error('failed to add effect value with : ' + value + ' / ' + percent + ' / ' + valueType + ' / ' + stat);
    }
}
function moveValue(source, index, target) {
    if (source !== null && target !== null) {
        const [removed] = source.values.splice(index, 1);
        if (removed) {
            target.values.push(removed);
        }
        else {
            throw new Error('no effect to move found at index ' + index);
        }
    }
    else {
        throw new Error('failed to move effect value at index ' + index);
    }
}
function duplicateSynergy(source, index, stat) {
    if (source !== null) {
        const synergy = source.values[index];
        if (synergy && (0, utils_1.isEffectValueSynergy)(synergy)) {
            source.values.push((0, effect_value_util_1.effectValueSynergy)(synergy.baseValue, synergy.upgrade, synergy.upgradeType, synergy.percent, synergy.source, stat, synergy.valueType, synergy.max));
        }
        else {
            throw new Error('no synergy to duplicate found at index ' + index);
        }
    }
    else {
        throw new Error('failed to duplicate synergy at index ' + index);
    }
}
function duplicateVariableAsSynergy(effect, index, type, source, stat) {
    if (effect !== null) {
        const value = effect.values[index];
        if (value && ((0, utils_1.isEffectValueVariable)(value) || (0, utils_1.isEffectValueConstant)(value))) {
            effect.values.push((0, effect_value_util_1.effectValueSynergy)(value.baseValue, 'upgrade' in value ? value.upgrade : 0, 'upgradeType' in value ? value.upgradeType : effect_value_upgrade_type_1.EffectValueUpgradeType.None, value.percent, source, stat, type, value.max));
        }
        else {
            throw new Error('no value to duplicate found at index ' + index);
        }
    }
    else {
        throw new Error('failed to duplicate variable at index ' + index);
    }
}
function setSynergyAllowMinMax(effect, index, allowMinMax) {
    if (effect !== null) {
        const value = effect.values[index];
        if (value && (0, utils_1.isEffectValueSynergy)(value)) {
            (0, utils_1.warnIfEqual)(value.allowMinMax, allowMinMax, 'reaper setSynergyAllowMinMax at index ' + index + ' did not changed anthing', effect);
            value.allowMinMax = allowMinMax;
        }
        else {
            throw new Error('failed to update allowMinMax at index ' + index);
        }
    }
    else {
        throw new Error('failed to update allowMinMax at index ' + index);
    }
}
function setSynergyDetailOnSynergy(effect, index, detailOnSynergy) {
    if (effect !== null) {
        const value = effect.values[index];
        if (value && (0, utils_1.isEffectValueSynergy)(value)) {
            (0, utils_1.warnIfEqual)(value.detailOnSynergy, detailOnSynergy, 'reaper setSynergyDetailOnSynergy at index ' + index + ' did not changed anthing', effect);
            value.detailOnSynergy = detailOnSynergy;
        }
        else {
            throw new Error('failed to update detailOnSynergy at index ' + index);
        }
    }
    else {
        throw new Error('failed to update detailOnSynergy at index ' + index);
    }
}
function setSynergyPrecision(effect, index, precision) {
    if (effect !== null) {
        const value = effect.values[index];
        if (value && (0, utils_1.isEffectValueSynergy)(value)) {
            (0, utils_1.warnIfEqual)(value.precision, precision, 'reaper setSynergyPrecision at index ' + index + ' did not changed anthing', effect);
            value.precision = precision;
        }
        else {
            throw new Error('failed to update precision at index ' + index);
        }
    }
    else {
        throw new Error('failed to update precision at index ' + index);
    }
}
function allowSynergyToCascade(effect, index) {
    if (effect !== null) {
        const value = effect.values[index];
        if (value && (0, utils_1.isEffectValueSynergy)(value)) {
            (0, utils_1.warnIfEqual)(value.cascadeSynergy, true, 'reaper allowSynergyToCascade at index ' + index + ' did not changed anthing', effect);
            value.cascadeSynergy = true;
        }
        else {
            throw new Error('failed to change synergy cascade at index ' + index);
        }
    }
    else {
        throw new Error('failed to change synergy cascade at index ' + index);
    }
}
exports.DATA_REAPER = {
    1: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'adam_blessing_buff_attack_speed_global_mult');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Duration, 'adam_blessing_buff_duration');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Duration, 'adam_blessing_buff_duration_per_monster');
        }
    },
    2: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'health_restored_on_breach_close');
        }
    },
    3: {
        override: (ba, be, ma) => {
            synergyMultiply100(ba, 1);
            synergyMultiply100(ba, 2);
            synergyMultiply100(be, 1);
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'trainee_reaper_effect_chance');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'trainee_reaper_effect_additional_damage');
            overrideSynergySource(ba, 2, 'xp_find');
        }
    },
    4: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    5: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'increased_indirect_damage');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'indirect_crit_chance_percent');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Damage, 'indirect_crit_additional_damage');
            setSynergyAllowMinMax(ba, 2, false);
            allowSynergyToCascade(ba, 2);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'indirect_defense_max_stacks');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideSynergySource(be, 5, 'max_health');
            overrideValueTypeAndStat(be, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'skill_decreased_damage_mult');
            synergyMultiply100(be, 5);
        }
    },
    6: {
        override: (ba, be, ma) => {
            moveValue(ba, 3, be);
            synergyMultiply100(be, 1);
            addConstant(ba, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'skill_damage_lucky');
            addConstant(ma, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'cannot_imbue_skills');
        }
    },
    7: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'primary_skill_level_bonus');
            addConstant(be, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'all_masteries_accross_characters');
        }
    },
    8: {
        override: (ba, be, ma) => {
            if (ba !== null) {
                overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, ba.values[0]?.stat ?? null);
                overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, ba.values[1]?.stat ?? null);
                setSynergyDetailOnSynergy(ba, 2, false);
                setSynergyDetailOnSynergy(ba, 3, false);
                overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
                overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            }
        }
    },
    9: {
        override: (ba, be, ma) => {
            if (ba !== null) {
                overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
                overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
                overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'every_3_cast_primary_skill_increased_damage');
                setSynergyDetailOnSynergy(ba, 2, false);
            }
        }
    },
    10: {
        override: (ba, be, ma) => {
            if (ba !== null) {
                overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
                overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Damage, 'garbage_stat');
                allowSynergyToCascade(ba, 5);
                overrideSynergySource(ba, 6, 'aoe_increased_effect');
                overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'area_projectile_increased_damage');
                synergyMultiply100(ba, 6);
                allowSynergyToCascade(ba, 6);
                setSynergyPrecision(ba, 6, 2);
                changeValue(ma, 0, -100);
                overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'aoe_primary_secondary_support_damage_mult');
            }
        }
    },
    12: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'suport_streak_increased_damage');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'suport_streak_increased_aoe');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'suport_streak_increased_duration');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'support_streak_max_stacks');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'support_streak_increased_effect_per_stack');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 8, effect_value_value_type_1.EffectValueValueType.Damage, 'damage');
            allowSynergyToCascade(ba, 8);
            addConstant(ba, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
            addConstant(be, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'add_other_non_equipped_spec_passives');
            addConstant(ma, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'remove_equipped_spec_passives');
        }
    },
    13: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            allowSynergyToCascade(ba, 1);
            synergyMultiply100(ba, 1);
        }
    },
    14: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    15: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Damage, 'garbage_stat');
            allowSynergyToCascade(ba, 3);
            addConstant(ba, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    16: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    17: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'cooldown_reduction_global_mult_on_combo');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'the_speed_percent_on_combo');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'massacre_increased_duration');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'disintegration_increased_damage');
            addConstant(be, 7, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    18: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideSynergySource(ba, 8, 'critical_chance');
            synergyMultiply100(ba, 8);
            allowSynergyToCascade(ba, 8);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'overflowing_the_max_mana_add_extra');
            addConstant(ma, -100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'overflowing_the_max_mana_global_mult');
            addConstant(be, 0, false, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_to_life_modifiers');
        }
    },
    19: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'spectral_shape_cooldown_time');
            addConstant(ma, -100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'spectral_shape_cooldown_time_override');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'spectral_shape_mana_cost_percent');
            addConstant(ma, -100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'spectral_shape_mana_cost_override');
            moveValue(ba, 2, be);
            allowSynergyToCascade(be, 1);
        }
    },
    20: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'horrified_max_stacks');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'horrified_stack_increased_damage');
        }
    },
    22: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'aoe_increased_size_multiplier_mana_harvest');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            moveValue(ba, 3, be);
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Damage, 'damage');
            allowSynergyToCascade(be, 2);
        }
    },
    23: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideSynergySource(ba, 2, 'weapon_damage');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'inner_fire_damage_add_extra');
            setSynergyAllowMinMax(ba, 2, false);
            allowSynergyToCascade(ba, 2);
            setSynergyPrecision(ba, 2, 0);
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'inner_fire_duration_add');
            addConstant(ma, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'reaper_added_to_inner_fire');
        }
    },
    24: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'evade_add');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'dodge_add');
            setSynergyAllowMinMax(ba, 4, false);
            allowSynergyToCascade(ba, 4);
            setSynergyPrecision(ba, 4, 0);
            setSynergyAllowMinMax(be, 1, false);
            allowSynergyToCascade(be, 1);
            setSynergyPrecision(be, 1, 0);
            setSynergyDetailOnSynergy(be, 1, false);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'dodge_add');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'untouchable_end_increased_damage_taken');
            overrideValueTypeAndStat(ma, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'untouchable_end_duration');
        }
    },
    25: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(ba, 4);
            addConstant(ba, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    26: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'res_phy_mag_global_mult_on_low_life_treshold');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'res_phy_mag_global_mult_on_low_life');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideSynergySource(ba, 6, 'missing_health');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'berzerker_additional_damage');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'berzerker_additional_damage_mult');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            addConstant(be, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'reverse_life_regeneration_life_treshold');
            addConstant(be, -200, false, effect_value_value_type_1.EffectValueValueType.Stat, 'high_life_health_recovery_mult');
        }
    },
    27: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat);
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat);
            addConstant(ba, 1, true, effect_value_value_type_1.EffectValueValueType.Stat, 'reaper_split_to_physical_and_element');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'alpha_damage_multiplier');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'alpha_speed_size_multiplier');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 8, effect_value_value_type_1.EffectValueValueType.Stat, 'alpha_orbs_count');
            overrideValueTypeAndStat(ba, 9, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            overrideValueTypeAndStat(ba, 10, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'alpha_omega_orbs_increased_damage');
            addConstant(ma, 1, true, effect_value_value_type_1.EffectValueValueType.Stat, 'secondary_slot_locked');
        }
    },
    28: {
        override: (ba, be, ma) => {
            // TODO fix ça
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'aura_equipped_per_aura_active_add');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'aura_equipped_per_aura_equipped_multiplier');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'aura_increased_effect_percent');
            changeValue(ba, 2, 100);
            nullifySynergyUpgrade(ba, 2);
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'aura_aoe_increased_size_percent');
            allowSynergyToCascade(be, 1);
            synergyMultiply100(be, 1);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'aoe_increased_size_percent_mult');
        }
    },
    29: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage');
            allowSynergyToCascade(ba, 3);
            addConstant(ba, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
            addConstant(ba, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    30: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            moveValue(ba, 2, ma);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Damage, 'physical_damage');
            setSynergyAllowMinMax(ma, 0, false);
        }
    },
    31: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    32: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'imbued_skill_increased_damage');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_fury_max_stacks');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'imbued_skill_increased_damage_per_elemental_fury_stack');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            //addConstant(be, -100, false, EffectValueValueType.Stat, 'brut_damage_global_mult');
            if (ma) {
                addConstant(ma, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'brut_damage_equal_crit_damage');
                addConstant(ma, 100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'brut_damage_global_mult_elemental_overload_bug');
                ma.values.push((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, true, 'critical_damage', 'brut_damage_percent_extra', effect_value_value_type_1.EffectValueValueType.Stat));
            }
        }
    },
    35: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'increased_damage_on_stun');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'increased_damage_on_back');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'crit_chance_percent_on_back');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'brut_chance_percent_on_back');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ma, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    36: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'bloodthirst_max_stacks');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'health_on_kill_global_mult');
            // (ba, 5);
            overrideSynergySource(be, 0, 'life_on_kill');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'blood_frenzy_min_weapon_damage_add');
            allowSynergyToCascade(be, 0);
        }
    },
    37: {
        override: (ba, be, ma) => {
            addConstant(ma, -100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'additional_projectile_global_mult');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_1_increased_damage');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_2_chance_to_pierce_percent');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_3_fork_chance_percent');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_4_6_additional_projectile_add');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'projectile_skill_crit_damage_percent');
            overrideValueTypeAndStat(be, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'projectile_skill_brut_damage_percent');
            overrideValueTypeAndStat(be, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_war_max_stacks');
        }
    },
    38: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_4_additional_projectile_add');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_5_increased_damage');
        }
    },
    39: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_6_additional_projectile_add');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'drum_cast_7_increased_damage');
        }
    },
    40: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'thornbite_reaper_buff_idle_duration');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'thorns_global_mult');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'thornbite_reaper_buff_cooldown');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'idle_shield');
            allowSynergyToCascade(ba, 6);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Duration, 'thornbite_reaper_benediction_buff_idle_duration');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'idle_thorn_crit_chance_global_mult');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'thorn_crit_chance_percent');
            synergyMultiply100(be, 2);
            overrideSynergySource(be, 2, 'critical_chance');
            allowSynergyToCascade(be, 2);
            addConstant(ma, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'non_thorn_cannot_crit');
            if (reaperId === 41) {
                duplicateSynergy(ba, 6, 'thorns_add_if_idle');
                allowSynergyToCascade(ba, 7);
            }
        }
    },
    41: {
        override: (ba, be, ma) => {
            allowSynergyToCascade(ba, 0);
        }
    },
    42: {
        override: (ba, be, ma) => {
            if (ba !== null && ba.template !== null && ba.template.startsWith('"')) {
                ba.template = ba.template.slice(1, ba.template.length - 10);
            }
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'summon_skeleton_squire_cost_lock_reduction');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat);
            moveValue(ba, 3, be);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'minion_increased_damage_percent_necromancy');
            allowSynergyToCascade(be, 0);
            setSynergyPrecision(be, 0, 0);
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_leech_global_mult');
        }
    },
    43: {
        override: (ba, be, ma) => {
            synergyMultiply100(ba, 0);
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'unstable_bones_increased_damages');
            allowSynergyToCascade(ba, 0);
        }
    },
    45: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'figther_bane_max_stacks');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'figther_bane_res_phy_percent');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'figther_bane_armor_penetration_percent');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'mage_bane_max_stacks');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'mage_bane_res_mag_percent');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'mage_bane_elemental_penetration_percent');
            overrideValueTypeAndStat(ba, 8, effect_value_value_type_1.EffectValueValueType.Stat, 'res_phy_add');
            overrideValueTypeAndStat(ba, 9, effect_value_value_type_1.EffectValueValueType.Stat, 'res_mag_add');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'primary_secondary_skill_increased_damage_mult');
            synergyMultiply100(be, 1);
            addConstant(ma, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'half_equipment_damage_stat');
        }
    },
    46: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'ferocious_affinity_reaper_afflict_chance');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'ferocious_affinity_reaper_afflict_duration');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'min_basic_damage_add');
            allowSynergyToCascade(ba, 6);
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Damage, 'elemental_damage');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'min_elemental_damage_add');
            allowSynergyToCascade(be, 1);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    47: {
        override: (ba, be, ma) => {
            moveValue(be, 0, ma);
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(ba, 2);
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'vigilant_blade_additional_damage');
            allowSynergyToCascade(ba, 3);
            synergyMultiply100(ba, 3);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'min_weapon_damage_add');
            synergyMultiply100(be, 0);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'min_basic_damage_add_extra');
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'basic_damage_global_mult');
        }
    },
    48: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 1);
        }
    },
    49: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 1);
        }
    },
    50: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 1);
        }
    },
    51: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideSynergySource(ba, 1, 'legion_5_6');
            synergyMultiply100(ba, 1);
        }
    },
    53: {
        override: (ba, be, ma) => {
            if (ba !== null && ba.template !== null) {
                ba.template = ba.template.replace(/\.<br\/\>([a-zA-Z])/g, '.<br/><br/>$1');
            }
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'slorm_hammer_increased_damages');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Damage, 'physical_damage');
            allowSynergyToCascade(ba, 5);
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 4);
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 6);
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 7);
            overrideValueTypeAndStat(ba, 8, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 8);
            overrideValueTypeAndStat(ba, 9, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 9);
            overrideValueTypeAndStat(ba, 10, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 10);
            overrideValueTypeAndStat(ba, 11, effect_value_value_type_1.EffectValueValueType.Stat, 'fulgurorn_dedication_max_stacks');
            synergyMultiply100(ba, 11);
            overrideValueTypeAndStat(ba, 12, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 12);
            overrideValueTypeAndStat(ba, 13, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 13);
        }
    },
    54: {
        override: (ba, be, ma) => {
            moveValue(ba, 0, be);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'weapon_damage_mult');
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage_global_mult');
        }
    },
    55: {
        override: (ba, be, ma) => {
            addConstant(ba, 0, true, effect_value_value_type_1.EffectValueValueType.Stat, 'reaper_added_to_skill_and_elements');
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'meteor_increased_damage');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            if (ba && ba.template) {
                ba.template = ba.template.substring(0, ba.template.length - 10);
            }
        }
    },
    56: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
        }
    },
    57: {
        override: (ba, be, ma) => {
            addConstant(ba, 1.499, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'inner_firework_radius');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'firework_increased_damage');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'inner_weakness_increased_damage');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'inner_weakness_max_stacks');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stats');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Damage, 'elemental_damage');
            allowSynergyToCascade(ba, 7);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'cooldown_time_muliplier_per_inner_fire');
        }
    },
    58: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'increased_aoe_size_per_inner_weakness');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    59: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 8, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 9, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 10, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(ba, 10);
            overrideValueTypeAndStat(ba, 11, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(ba, 11);
            addConstant(ba, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
            moveValue(ba, 12, be);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(be, 4);
        }
    },
    60: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'projectile_weapon_damage_mult');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'projectile_armor_penetration');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'projectile_elemental_penetration');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'idle_duration');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'idle_additional_projectile_add');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'idle_duration');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'idle_additional_projectile_global_mult');
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'not_idle_additional_projectile_global_mult');
        }
    },
    61: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'additional_damage_add');
            setSynergyPrecision(be, 1, 0);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'no_gold_armor_buff_increased_damage_taken_mult');
        }
    },
    62: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'thorns_percent');
            allowSynergyToCascade(ba, 2);
            changeValue(ba, 2, 25);
            setSynergyPrecision(ba, 2, 2);
        }
    },
    63: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            moveValue(ba, 4, ma);
            moveValue(ba, 4, ma);
            moveValue(ba, 4, ma);
            moveValue(ba, 4, ma);
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'recast_chance_minus_100_add');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'melee_crit_chance_global_mult');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'melee_brut_chance_global_mult');
            overrideSynergySource(ma, 0, 'critical_chance');
            allowSynergyToCascade(ma, 0);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'crit_chance_melee');
            synergyMultiply100(ma, 0);
            allowSynergyToCascade(ma, 1);
            overrideValueTypeAndStat(ma, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideSynergySource(ma, 2, 'ancestral_chance');
            allowSynergyToCascade(ma, 2);
            overrideValueTypeAndStat(ma, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'ancestral_chance_melee');
            synergyMultiply100(ma, 2);
            allowSynergyToCascade(ma, 3);
            overrideValueTypeAndStat(ma, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            if (ma) {
                ma.values.push((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'recast_chance_minus_100', 'crit_chance_global_mult', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true));
                ma.values.push((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'recast_chance_minus_100', 'brut_chance_global_mult', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true));
            }
        }
    },
    64: {
        override: (ba, be, ma) => {
            overrideSynergySource(ba, 0, 'critical_chance');
            allowSynergyToCascade(ba, 0);
            synergyMultiply100(ba, 0);
            overrideSynergySource(ba, 1, 'ancestral_chance');
            allowSynergyToCascade(ba, 1);
            synergyMultiply100(ba, 1);
        }
    },
    65: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'vindictive_slam_reaper_effect_chance');
            allowSynergyToCascade(ba, 3);
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Damage, 'elemental_damage');
            allowSynergyToCascade(ba, 4);
            addConstant(ba, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'vindictive_slam_reaper_effect_radius');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Duration, 'vindictive_slam_reaper_benediction_effect_duration');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Damage, 'elemental_damage');
            allowSynergyToCascade(be, 2);
            addConstant(be, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'reaper_added_to_elements');
            addConstant(ma, -100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'basic_damage_global_mult');
        }
    },
    66: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'vindictive_slam_reaper_effect_radius_mult');
            allowSynergyToCascade(ba, 2);
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'vindictive_slam_reaper_effect_elemental_damage_mult');
            allowSynergyToCascade(ba, 3);
        }
    },
    67: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Duration, 'vindictive_slam_reaper_effect_stun_duration');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'vindictive_slam_reaper_effect_stun_chance');
            allowSynergyToCascade(ba, 1);
            synergyMultiply100(ba, 1);
        }
    },
    68: {
        override: (ba, be, ma) => {
            if (ba && ba.template) {
                ba.template = ba.template.replace('<br/><br/><br/><br/>', '');
            }
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    69: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    71: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'totem_increased_effect_percent');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'totem_increased_damage_percent');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            moveValue(ba, 3, ma);
            moveValue(ba, 2, be);
        }
    },
    72: {
        override: (ba, be, ma) => {
            if (ba !== null && ba.template !== null) {
                ba.template = '';
            }
        }
    },
    73: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_skill_as_life_percent');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_restored_percent_on_hit_taken');
            moveValue(ba, 3, be);
            moveValue(ba, 3, be);
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'primary_skill_additional_damages');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'the_max_health_add');
        }
    },
    74: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_regen_add');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'min_basic_damage_add');
            addConstant(be, 1, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'manabender_buff_detonation_radius');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'life_percent_removed_on_cast');
            duplicateVariableAsSynergy(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'skill_mana_cost', 'primary_secondary_skill_additional_damage');
        }
    },
    75: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'nimble_buff_crit_damage_percent');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'nimble_buff_brut_damage_percent');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'nimble_buff_crit_chance_percent');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'nimble_buff_brut_chance_percent');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'nimble_buff_primary_skill_increased_damages');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Duration, 'nimble_buff_disable_duration');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'nimble_champion_percent');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Duration, 'nimble_champion_disable_duration');
            addConstant(be, 100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'nimble_champion_max_stacks');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Duration, 'nimble_champion_lock_duration');
        }
    },
    76: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'cooldown_reduction_global_mult_while_curving_time_or_time_shifting');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'crit_chance_percent_while_curving_time_or_time_shifting');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'the_speed_percent_while_curving_time_or_time_shifting');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'increased_damage_while_curving_time_or_time_shifting');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'crit_damage_percent_while_curving_time_or_time_shifting');
            addConstant(ma, -100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'the_speed_global_mult_while_not_curving_time_or_time_shifting');
            addConstant(ma, common_1.BASE_MOVEMENT_SPEED, false, effect_value_value_type_1.EffectValueValueType.Stat, 'the_speed_add_extra_while_not_curving_time_or_time_shifting');
            // TODO : has no effect for now
            // addConstant(ma, -100, false, EffectValueValueType.Stat, 'cooldown_reduction_global_mult_while_not_curving_time_or_time_shifting');
        }
    },
    77: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'imbued_skills_and_ancestral_beam_increased_damage_per_imbue');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'ancestral_wrath_max_stacks');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(ba, 3);
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage');
            allowSynergyToCascade(ba, 4);
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 5);
            if (be) {
                be.values = [];
            }
            moveValue(ba, 6, ma);
            synergyMultiply100(ma, 0);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'skill_decreased_damage_mult');
        }
    },
    78: {
        override: (ba, be, ma, reaperId) => {
            if (reaperId === 78 || reaperId === 79) {
                negateValueBaseAndUpgrade(ba, 0);
                negateValueBaseAndUpgrade(ba, 1);
            }
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'exhaustion_max_life_as_damage_percent');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'min_cooldown_time');
        }
    },
    79: {
        override: (ba, be, ma, reaperId) => {
            if (reaperId === 79) {
                negateValueBaseAndUpgrade(ba, 0);
            }
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage_percent_for_each_negative_effect_on_ennemies');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage_percent_for_each_negative_effect_on_ennemies_radius');
        }
    },
    80: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Damage, 'butterfly_elemental_damage');
            allowSynergyToCascade(ba, 1);
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Duration, 'exhaustion_duration');
            overrideSynergySource(ba, 2, 'movement_speed');
            synergyMultiply100(ba, 2);
        }
    },
    81: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'power_crystal_count');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Damage, 'elemental_damage');
            allowSynergyToCascade(ba, 2);
            addConstant(ba, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'reaper_added_to_elements');
            if (reaperId === 82 && ba !== null) {
                changeValue(ba, 1, 2);
            }
            else if (reaperId === 83 && ba !== null) {
                changeValue(ba, 1, 3);
            }
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'power_crystal_additional_projectile_add');
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'primary_secondary_skill_increased_damage_mult');
        }
    },
    82: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'ancestral_legacy_stack_brut_chance_percent');
        }
    },
    83: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Duration, 'elemental_fervor_buff_duration');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_fervor_buff_elemental_damage_global_mult');
            overrideSynergySource(ba, 1, 'critical_chance');
            overrideSynergyPercent(ba, 1, true);
            synergyMultiply100(ba, 1);
        }
    },
    84: {
        override: (ba, be, ma, reaperId) => {
            synergyMultiply100(ba, 3);
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'mini_keeper_increased_damage');
            moveValue(ba, 3, be);
            addConstant(ma, 1, true, effect_value_value_type_1.EffectValueValueType.Stat, 'disable_ultimatum');
        }
    },
    85: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'ultimatum_increased_effect_momentum_buff');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'primary_secondary_skill_additional_damage');
            allowSynergyToCascade(ba, 5);
            setSynergyPrecision(ba, 5, 0);
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'elder_inner_fire_damage_add_extra');
            setSynergyPrecision(ba, 6, 0);
            allowSynergyToCascade(ba, 6);
            moveValue(ba, 6, be);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'inner_fire_max_number_add_extra');
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'inner_fire_max_number_global_mult');
        }
    },
    86: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'brut_chance_percent_ancestral_harmony');
            allowSynergyToCascade(ba, 3);
            synergyMultiply100(ba, 3);
            setSynergyPrecision(ba, 3, 0);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'brut_damage_percent_per_ancestral_preparation_stack');
            addConstant(ba, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'brut_chance_global_mult');
        }
    },
    87: {
        override: (ba, be, ma, reaperId) => {
            addConstant(ba, 100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            if (ma) {
                ma.values.push((0, effect_value_util_1.effectValueVariable)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, true, 'garbage_stat'));
            }
        }
    },
    88: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            synergyMultiply100(ba, 2);
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Damage, 'physical_damage');
            allowSynergyToCascade(ba, 3);
        }
    },
    89: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
        }
    },
    90: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'wreak_havoc_max_stacks');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            allowSynergyToCascade(ba, 6);
            moveValue(be, 0, ma);
            moveValue(be, 0, ma);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ma, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'wreak_havoc_cooldown_reduction_global_mult');
        }
    },
    91: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'enfeeble_stack_increased_damage');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'enfeeble_max_stacks');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'cooldown_reduction_global_mult_per_enfeeble_in_radius');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            addConstant(ma, 1, true, effect_value_value_type_1.EffectValueValueType.Stat, 'disable_attack_speed_from_gear_stats');
        }
    },
    92: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'apex_predator_stack_increased_damage_on_elite_percent');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'apex_predator_max_stacks');
        }
    },
    93: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'probability_treshold');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'probability_default_value');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'probability_default_value_increased_percent');
            moveValue(be, 0, ma);
            moveValue(be, 0, ma);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'miscalculation_treshold');
            overrideValueTypeAndStat(ma, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'miscalculation_default_value');
        }
    },
    94: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            if (ba) {
                ba.values.push((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'ancestral_damage', 'isoperimetry_crit_damage_percent_extra', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3));
            }
        }
    },
    95: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    96: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'sun_effect_health_regen_global_mult');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'moon_effect_health_on_hit_global_mult');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'moon_effect_health_regen_global_mult');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 8, effect_value_value_type_1.EffectValueValueType.Damage, 'righteous_sunlight_damage');
            allowSynergyToCascade(ba, 8);
            overrideValueTypeAndStat(ba, 9, effect_value_value_type_1.EffectValueValueType.Damage, 'righteous_sunlight_additional_damage');
            overrideSynergySource(ba, 9, 'health_regeneration_per_moonlight_stack');
            allowSynergyToCascade(ba, 9);
            setSynergyAllowMinMax(ba, 9, false);
            overrideValueTypeAndStat(ba, 10, effect_value_value_type_1.EffectValueValueType.Stat, 'moon_effect_primary_secondary_skill_additional_damage');
            overrideSynergySource(ba, 10, 'life_on_hit_per_sunlight_stack');
            allowSynergyToCascade(ba, 10);
            setSynergyAllowMinMax(ba, 10, false);
            addConstant(ba, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    97: {
        override: (ba, be, ma) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'ungifted_skill_increased_damage_mult');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'primary_skill_increased_damage');
            overrideSynergySource(ba, 1, 'ungifted_skill_increased_damage');
            copySynergyUpgradeFrom(ba, 1, 0);
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_cost_free_treshold');
            if (ba) {
                ba.values.push((0, effect_value_util_1.effectValueVariable)(0, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'garbage_stat'));
            }
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'ungifted_mana_lock_no_max');
            if (be && be.template) {
                be.template = be.template.replace('\n|', '');
            }
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_is_overrated_mana_lock_percent');
        }
    },
    98: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'overdriving_overdrive_damage_percent');
            addConstant(be, 1, true, effect_value_value_type_1.EffectValueValueType.Stat, 'overdrive_damage_based_on_skill_damage');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'melee_skill_decreased_damage_mult');
        }
    },
    99: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'reaper_storm_increased_damage');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'basic_damage_global_mult');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage_mult');
            synergyMultiply100BaseAndUpgrade(ba, 3);
            synergyMultiply100BaseAndUpgrade(ba, 4);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    100: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            allowSynergyToCascade(ba, 3);
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            allowSynergyToCascade(ba, 4);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'non_projectile_increased_damage_mult');
        }
    },
    101: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    102: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    103: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'max_life_orb');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'life_orb_the_speed_global_mult');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'missing_life_orb_health_regen_global_mult');
            overrideValueTypeAndStat(ba, 6, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 7, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 8, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 9, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 10, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 11, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100BaseAndUpgrade(ba, 12);
            overrideSynergySource(ba, 12, 'health_regeneration');
            setSynergyDetailOnSynergy(ba, 12, false);
            overrideValueTypeAndStat(ba, 12, effect_value_value_type_1.EffectValueValueType.Damage, 'physical_damage');
            synergyMultiply100BaseAndUpgrade(ba, 13);
            overrideSynergySource(ba, 13, 'health_regeneration');
            setSynergyDetailOnSynergy(ba, 13, false);
            overrideValueTypeAndStat(ba, 13, effect_value_value_type_1.EffectValueValueType.Damage, 'additional_damage');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'max_life_orb');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'missing_life_orb_life_projectile_increased_damage');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(be, 2);
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    104: {
        override: (ba, be, ma, reaperId) => {
            addConstant(ma, 1, true, effect_value_value_type_1.EffectValueValueType.Stat, 'disable_greater_traits');
        }
    },
    106: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'cooldown_time_reduction_if_life_cost');
            addConstant(ma, 100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'life_cost_multiplier');
        }
    },
    107: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    108: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'physical_damage');
            allowSynergyToCascade(ba, 4);
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'light_blorm_increased_damage');
            synergyMultiply100(ba, 5);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'shield_globe_value_add_extra');
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'shield_increased_value_mult');
        }
    },
    109: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 3);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(be, 2);
        }
    },
    110: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Unknown, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'retaliate_additional_damage');
            allowSynergyToCascade(ba, 4);
        }
    },
    111: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Duration, 'slormbane_reaper_addition_damage_slorm_duration');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Damage, 'primary_secondary_skill_additional_damage');
            synergyMultiply100(ba, 3);
            addConstant(ma, -100, true, effect_value_value_type_1.EffectValueValueType.Stat, 'health_recovery_mult');
        }
    },
    112: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Duration, 'goldscourge_reaper_addition_damage_gold_duration');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Damage, 'primary_secondary_skill_additional_damage');
            synergyMultiply100(ba, 3);
            allowSynergyToCascade(ba, 3);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideSynergySource(be, 2, 'gold_find');
            synergyMultiply100(be, 2);
            allowSynergyToCascade(be, 2);
            synergyMultiply100(be, 3);
            allowSynergyToCascade(be, 3);
            addConstant(ma, -100, false, effect_value_value_type_1.EffectValueValueType.Stat, 'overdrive_chance_multiplier');
        }
    },
    114: {
        override: (ba, be) => {
            overrideValueTypeAndStat(ba, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            synergyMultiply100(ba, 1);
            allowSynergyToCascade(ba, 1);
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'the_max_health_add');
            synergyMultiply100(ba, 2);
            allowSynergyToCascade(ba, 2);
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'basic_damage_global_mult');
            synergyMultiply100(be, 2);
            allowSynergyToCascade(be, 2);
            overrideValueTypeAndStat(be, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'elemental_damage_global_mult');
            synergyMultiply100(be, 3);
            allowSynergyToCascade(be, 3);
        }
    },
    115: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'fire_imbued_skill_increased_damage');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'increased_burn_damage');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    116: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'ice_imbued_skill_increased_damage');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'chill_frozen_increased_damage');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'temperature_increased_damage');
        }
    },
    117: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'lightning_imbued_skill_increased_damage');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'kah_veer_reaper_effect_cooldown_reduction_percent');
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'kah_veer_reaper_effect_walk_distance');
            addConstant(be, 35, false, effect_value_value_type_1.EffectValueValueType.Stat, 'unlock_ancestral_legacy_max_rank');
            addConstant(be, 1, false, effect_value_value_type_1.EffectValueValueType.Stat, 'trigger_thunderstuck_on_critical_strike');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'crit_damage_percent_mult');
        }
    },
    118: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'light_imbued_skill_increased_damage');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'shield_globe_value_add');
            setSynergyAllowMinMax(ba, 4, false);
            setSynergyPrecision(ba, 4, 0);
            moveValue(be, 0, ba);
            overrideValueTypeAndStat(ba, 5, effect_value_value_type_1.EffectValueValueType.Stat, 'shield_decrease_treshold');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'the_max_health_set');
        }
    },
    119: {
        override: (ba, be, ma, reaperId) => {
            overrideValueTypeAndStat(ba, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'shadow_imbued_skill_increased_damage');
            overrideValueTypeAndStat(ba, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ba, 4, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'blorm_increased_damage');
            overrideValueTypeAndStat(be, 1, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 2, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(be, 3, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
            overrideValueTypeAndStat(ma, 0, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        },
    }
};
//# sourceMappingURL=data-reaper.js.map