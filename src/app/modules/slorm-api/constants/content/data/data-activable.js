"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_ACTIVABLE = void 0;
const effect_value_value_type_1 = require("../../../model/content/enum/effect-value-value-type");
const effect_value_util_1 = require("../../../util/effect-value.util");
const utils_1 = require("../../../util/utils");
function overrideValueStat(effects, index, stat) {
    const effect = effects[index];
    if (effect) {
        effect.stat = stat;
    }
    else {
        throw new Error('failed to override effect stat at index ' + index + ' with : ' + stat);
    }
}
function setValueType(values, index, valueType) {
    const value = values[index];
    if (value) {
        value.valueType = valueType;
    }
    else {
        throw new Error('failed to change valueType for effect value at index ' + index);
    }
}
function setBaseValue(values, index, baseValue) {
    const value = values[index];
    if (value) {
        value.baseValue = baseValue;
    }
    else {
        throw new Error('failed to change base value for effect value at index ' + index);
    }
}
function setUpgradeValue(values, index, upgrade) {
    const value = values[index];
    if (value && ((0, utils_1.isEffectValueVariable)(value) || (0, utils_1.isEffectValueSynergy)(value))) {
        value.baseUpgrade = upgrade;
        value.upgrade = upgrade;
    }
    else {
        throw new Error('failed to change base value for effect value at index ' + index);
    }
}
function setSynergyAnchor(values, index, anchor) {
    const value = values[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value)) {
        value.anchor = anchor;
    }
    else {
        throw new Error('failed to change synergy anchor at index ' + index);
    }
}
function setSynergySource(values, index, source) {
    const value = values[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value)) {
        value.source = source;
    }
    else {
        throw new Error('failed to change synergy source at index ' + index);
    }
}
function setSynergyShowValue(values, index, showValue) {
    const value = values[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value)) {
        value.showValue = showValue;
    }
    else {
        throw new Error('failed to change synergy showValue at index ' + index);
    }
}
function halveSynergy(effects, index) {
    const effect = effects[index];
    if (effect && (0, utils_1.isEffectValueSynergy)(effect)) {
        effect.baseValue = effect.baseValue / 2;
        effect.upgrade = effect.upgrade / 2;
    }
    else {
        throw new Error('failed to halve synergy at index ' + index);
    }
}
function addConstant(values, value, percent, valueType, stat = null) {
    values.push((0, effect_value_util_1.effectValueConstant)(value, percent, stat, valueType));
}
function synergyMultiply100(effects, index) {
    const value = effects[index];
    if (value && ((0, utils_1.isEffectValueVariable)(value) || (0, utils_1.isEffectValueSynergy)(value))) {
        value.baseValue = value.baseValue * 100;
    }
    else {
        throw new Error('failed to change value for effect value at index ' + index);
    }
}
function setSynergyAllowMinMax(values, index, allowMinMax) {
    const value = values[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value)) {
        value.allowMinMax = allowMinMax;
    }
    else {
        throw new Error('failed to update allowMinMax at index ' + index);
    }
}
function setSynergyPrecision(values, index, precision) {
    const value = values[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value)) {
        value.precision = precision;
    }
    else {
        throw new Error('failed to update precision at index ' + index);
    }
}
function allowSynergyToCascade(values, index) {
    const value = values[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value)) {
        value.cascadeSynergy = true;
    }
    else {
        throw new Error('failed to change synergy cascade at index ' + index);
    }
}
exports.DATA_ACTIVABLE = {
    0: {
        override: values => {
            overrideValueStat(values, 0, 'golden_buff_retaliate_percent');
            overrideValueStat(values, 1, 'golden_buff_reduced_damage_from_all_percent');
            overrideValueStat(values, 2, 'golden_buff_duration');
        }
    },
    1: {
        override: values => {
            overrideValueStat(values, 0, 'sleeping_powder_duration');
        }
    },
    2: {
        override: values => {
            overrideValueStat(values, 0, 'health_regen_add');
            overrideValueStat(values, 1, 'manabender_buff_duration');
        }
    },
    3: {
        override: values => {
            overrideValueStat(values, 0, 'duration');
        }
    },
    4: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            synergyMultiply100(values, 0);
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'ultra_cannon_max');
        }
    },
    5: {
        override: values => {
            overrideValueStat(values, 0, 'mega_heal_heal');
        }
    },
    6: {
        override: values => {
            overrideValueStat(values, 0, 'booster_max_cooldown_reduction_global_mult');
            overrideValueStat(values, 1, 'booster_max_elemental_damage_percent');
            overrideValueStat(values, 2, 'booster_max_basic_damage_percent_percent');
            overrideValueStat(values, 3, 'garbage_stat');
        }
    },
    7: {
        override: values => {
            overrideValueStat(values, 0, 'health_restored');
            allowSynergyToCascade(values, 0);
            halveSynergy(values, 0);
            overrideValueStat(values, 1, 'ring_of_life_health_restored_over_time');
            allowSynergyToCascade(values, 1);
            halveSynergy(values, 1);
            overrideValueStat(values, 2, 'ring_of_health_duration');
        }
    },
    8: {
        override: values => {
            overrideValueStat(values, 0, 'mana_restored');
            allowSynergyToCascade(values, 0);
            halveSynergy(values, 0);
            overrideValueStat(values, 1, 'mana_restored_over_time');
            allowSynergyToCascade(values, 1);
            halveSynergy(values, 1);
            overrideValueStat(values, 2, 'mana_restored_over_time_duration');
        }
    },
    9: {
        override: values => {
            overrideValueStat(values, 0, 'shadow_repercussion_buff_duration');
        }
    },
    10: {
        override: values => {
            addConstant(values, 4, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'inextricable_torment_aura_range');
            overrideValueStat(values, 0, 'inextricable_torment_aura_enemy_increased_damage');
            overrideValueStat(values, 1, 'inextricable_torment_aura_enemy_cooldown_reduction_percent');
        }
    },
    11: {
        override: values => {
            overrideValueStat(values, 0, 'fenren_trigger_chance');
        }
    },
    12: {
        override: values => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            setBaseValue(values, 0, 150);
            setUpgradeValue(values, 0, 10);
            overrideValueStat(values, 1, 'septimius_blade_delay');
        }
    },
    13: {
        override: values => {
            overrideValueStat(values, 0, 'weapon_damage');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Damage);
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'duration');
            setValueType(values, 1, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 2, 'garbage_stat');
            addConstant(values, 1.5, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'mana_harvest_range');
        }
    },
    14: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
        }
    },
    15: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            overrideValueStat(values, 1, 'concentration_buff_inner_fire_damage_percent');
            overrideValueStat(values, 2, 'concentration_buff_inner_fire_damage_percent_on_elite');
        }
    },
    16: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setSynergyAnchor(values, 1, '@');
            overrideValueStat(values, 1, 'physical_damage');
            allowSynergyToCascade(values, 1);
            setSynergyAllowMinMax(values, 1, false);
            setSynergyPrecision(values, 1, 0);
            overrideValueStat(values, 2, 'garbage_stat');
        }
    },
    17: {
        override: values => {
            setBaseValue(values, 0, 40);
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            setSynergyAnchor(values, 1, '@');
            overrideValueStat(values, 1, 'skeleton_squire_max_health');
            allowSynergyToCascade(values, 1);
            overrideValueStat(values, 2, 'increased_mana_cost_per_skeleton');
            setValueType(values, 2, effect_value_value_type_1.EffectValueValueType.Static);
            setUpgradeValue(values, 2, 0);
        }
    },
    18: {
        override: values => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'garbage_stat');
            addConstant(values, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'unstable_bones_aoe_range');
        }
    },
    19: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 1, 'garbage_stat');
            setValueType(values, 1, effect_value_value_type_1.EffectValueValueType.Static);
        }
    },
    21: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 1, 'elemental_damage');
            allowSynergyToCascade(values, 1);
        }
    },
    23: {
        override: values => {
            overrideValueStat(values, 0, 'exposed_armor_primary_secondary_skill_increased_damage_mult');
            synergyMultiply100(values, 0);
            allowSynergyToCascade(values, 0);
            setSynergyPrecision(values, 0, 0);
            setSynergyAnchor(values, 0, '@');
        }
    },
    24: {
        override: values => {
            allowSynergyToCascade(values, 0);
            setBaseValue(values, 0, 50);
            overrideValueStat(values, 1, 'garbage_stat');
        }
    },
    25: {
        override: values => {
            addConstant(values, 3, false, effect_value_value_type_1.EffectValueValueType.Stat, 'garbage_stat');
        }
    },
    28: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
        }
    },
    29: {
        override: values => {
            addConstant(values, 5, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    30: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
        }
    },
    31: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Duration);
            overrideValueStat(values, 1, 'garbage_stat');
            synergyMultiply100(values, 1);
            setSynergyShowValue(values, 1, false);
            setValueType(values, 2, effect_value_value_type_1.EffectValueValueType.Damage);
            overrideValueStat(values, 2, 'physical_damage');
            allowSynergyToCascade(values, 2);
            addConstant(values, 1.5, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    32: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Duration);
            overrideValueStat(values, 1, 'physical_damage');
            allowSynergyToCascade(values, 1);
            setValueType(values, 1, effect_value_value_type_1.EffectValueValueType.Static);
            setBaseValue(values, 1, 150);
            addConstant(values, 2.5, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    33: {
        override: values => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            setSynergyShowValue(values, 0, false);
            overrideValueStat(values, 1, 'elemental_damage');
            allowSynergyToCascade(values, 1);
            setSynergyAnchor(values, 1, '_');
            setSynergyShowValue(values, 1, false);
            addConstant(values, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    34: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            addConstant(values, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    35: {
        override: values => {
            setBaseValue(values, 0, 200);
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'garbage_stat');
            addConstant(values, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    36: {
        override: values => {
            setBaseValue(values, 0, 150);
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'garbage_stat');
            overrideValueStat(values, 2, 'garbage_stat');
            //setUpgradeValue(values, 2, 1.5);
            addConstant(values, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    38: {
        override: values => {
            allowSynergyToCascade(values, 0);
            addConstant(values, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    39: {
        override: values => {
            overrideValueStat(values, 0, 'cooldown_reduction_global_mult_per_bloodthirst_stack');
            overrideValueStat(values, 1, 'increased_damage_mult_per_bloodthirst_stack');
            overrideValueStat(values, 2, 'garbage_stat');
        }
    },
    40: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
        }
    },
    41: {
        override: values => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            addConstant(values, 1.5, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    42: {
        override: values => {
            overrideValueStat(values, 0, 'elemental_damage');
            allowSynergyToCascade(values, 0);
            setSynergyAnchor(values, 0, '@');
            addConstant(values, 1.5, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    43: {
        override: values => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'elemental_damage');
            allowSynergyToCascade(values, 1);
            setSynergyAnchor(values, 1, '@');
            addConstant(values, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    44: {
        override: values => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'garbage_stat');
            overrideValueStat(values, 2, 'garbage_stat');
            overrideValueStat(values, 3, 'garbage_stat');
        }
    },
    45: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            overrideValueStat(values, 1, 'garbage_stat');
        }
    },
    46: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
        }
    },
    47: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            allowSynergyToCascade(values, 0);
            setSynergyShowValue(values, 0, true);
        }
    },
    48: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'garbage_stat');
        }
    },
    49: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            allowSynergyToCascade(values, 0);
            addConstant(values, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    50: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 1, 'garbage_stat');
            setValueType(values, 1, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 2, 'garbage_stat');
            setValueType(values, 2, effect_value_value_type_1.EffectValueValueType.Static);
        }
    },
    53: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            overrideValueStat(values, 1, 'garbage_stat');
            allowSynergyToCascade(values, 1);
            overrideValueStat(values, 2, 'garbage_stat');
        }
    },
    54: {
        override: values => {
            overrideValueStat(values, 0, 'the_max_mana_add');
            allowSynergyToCascade(values, 0);
        }
    },
    55: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setUpgradeValue(values, 0, 0);
            overrideValueStat(values, 1, 'garbage_stat');
            allowSynergyToCascade(values, 1);
            setSynergyAllowMinMax(values, 1, false);
        }
    },
    56: {
        override: values => {
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 0, 'garbage_stat');
            overrideValueStat(values, 1, 'physical_damage');
            setBaseValue(values, 1, 30);
            allowSynergyToCascade(values, 1);
            overrideValueStat(values, 2, 'elemental_damage');
            setBaseValue(values, 2, 30);
            allowSynergyToCascade(values, 2);
        }
    },
    57: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            addConstant(values, 0, false, effect_value_value_type_1.EffectValueValueType.Stat, 'mana_cost_to_life_cost');
        }
    },
    58: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            addConstant(values, 7, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
            addConstant(values, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    59: {
        override: values => {
            addConstant(values, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    60: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 1, 'physical_damage');
            allowSynergyToCascade(values, 1);
            overrideValueStat(values, 2, 'garbage_stat');
            setSynergySource(values, 2, 'percent_locked_health');
            allowSynergyToCascade(values, 2);
            overrideValueStat(values, 3, 'garbage_stat');
            allowSynergyToCascade(values, 3);
            addConstant(values, 4, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    61: {
        override: values => {
            overrideValueStat(values, 0, 'the_max_health_global_mult');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
        }
    },
    62: {
        override: values => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            setBaseValue(values, 0, 70);
            overrideValueStat(values, 1, 'garbage_stat');
            allowSynergyToCascade(values, 1);
            overrideValueStat(values, 2, 'garbage_stat');
            setValueType(values, 2, effect_value_value_type_1.EffectValueValueType.Static);
        }
    },
    63: {
        override: values => {
            overrideValueStat(values, 0, 'elemental_damage');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'garbage_stat');
            allowSynergyToCascade(values, 1);
            overrideValueStat(values, 2, 'garbage_stat');
            setValueType(values, 2, effect_value_value_type_1.EffectValueValueType.Static);
        }
    },
    64: {
        override: values => {
            overrideValueStat(values, 0, 'elemental_damage');
            allowSynergyToCascade(values, 0);
            overrideValueStat(values, 1, 'garbage_stat');
            allowSynergyToCascade(values, 1);
            overrideValueStat(values, 2, 'garbage_stat');
            setValueType(values, 2, effect_value_value_type_1.EffectValueValueType.Static);
        }
    },
    65: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 1, 'garbage_stat');
            addConstant(values, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    66: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 1, 'garbage_stat');
            setValueType(values, 1, effect_value_value_type_1.EffectValueValueType.Static);
            overrideValueStat(values, 2, 'garbage_stat');
            setValueType(values, 2, effect_value_value_type_1.EffectValueValueType.Static);
            addConstant(values, 3, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    67: {
        override: values => {
            overrideValueStat(values, 0, 'garbage_stat');
            addConstant(values, 5, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    68: {
        override: values => {
            overrideValueStat(values, 0, 'elemental_damage');
            allowSynergyToCascade(values, 0);
            addConstant(values, 4, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
    69: {
        override: (values) => {
            overrideValueStat(values, 0, 'physical_damage');
            allowSynergyToCascade(values, 0);
            setValueType(values, 0, effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
            overrideValueStat(values, 1, 'elemental_damage');
            allowSynergyToCascade(values, 1);
            setValueType(values, 1, effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
            addConstant(values, 2, false, effect_value_value_type_1.EffectValueValueType.AreaOfEffect, 'garbage_stat');
        }
    },
};
//# sourceMappingURL=data-activable.js.map