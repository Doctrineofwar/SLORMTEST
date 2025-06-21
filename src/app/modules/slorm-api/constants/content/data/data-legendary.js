"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_LEGENDARY = void 0;
const effect_value_value_type_1 = require("../../../model/content/enum/effect-value-value-type");
const effect_value_util_1 = require("../../../util/effect-value.util");
const utils_1 = require("../../../util/utils");
function setStat(effect, index, stat) {
    const value = effect.effects[index];
    if (value) {
        (0, utils_1.warnIfEqual)(value.effect.stat, stat, 'legendary(' + effect.id + ') setStat at index ' + index + ' did not changed anthing', effect);
        value.effect.stat = stat;
    }
    else {
        throw new Error('failed to update stat for legendary(' + effect.id + ') effect at index ' + index);
    }
}
function setValueType(effect, index, type) {
    const value = effect.effects[index];
    if (value) {
        (0, utils_1.warnIfEqual)(value.effect.type, type, 'legendary(' + effect.id + ') setValueType at index ' + index + ' did not changed anthing', effect);
        value.effect.valueType = type;
    }
    else {
        throw new Error('failed to update value type for legendary(' + effect.id + ') effect at index ' + index);
    }
}
function setScore(effect, index, score) {
    const value = effect.effects[index];
    if (value) {
        (0, utils_1.warnIfEqual)(value.score, score, 'legendary(' + effect.id + ') setValue at index ' + index + ' did not changed anthing', effect);
        value.score = score;
    }
    else {
        throw new Error('failed to update value for legendary(' + effect.id + ') effect at index ' + index);
    }
}
function valueMultiply100(effect, index) {
    const value = effect.effects[index];
    if (value) {
        value.score = value.score * 100;
    }
    else {
        throw new Error('failed to multiply legendary(' + effect.id + ') synergy value at index ' + index);
    }
}
function synergySetAllowMinMax(effect, index, allowMinMaw) {
    const value = effect.effects[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value.effect)) {
        (0, utils_1.warnIfEqual)(value.effect.allowMinMax, allowMinMaw, 'legendary(' + effect.id + ') synergySetAllowMinMax at index ' + index + ' did not changed anthing', effect);
        value.effect.allowMinMax = allowMinMaw;
    }
    else {
        throw new Error('failed to update legendary(' + effect.id + ') allow min max at index ' + index);
    }
}
function addConstant(effect, value, stat, valueType, percent = false) {
    effect.effects.push({
        score: value,
        craftedValue: 0,
        possibleCraftedValues: [],
        basePossibleCraftedValues: [],
        maxPossibleCraftedValue: 0,
        minPossibleCraftedValue: 0,
        effect: (0, effect_value_util_1.effectValueConstant)(value, percent, stat, valueType)
    });
}
function allowSynergyToCascade(effect, index) {
    const value = effect.effects[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value.effect)) {
        value.effect.cascadeSynergy = true;
    }
    else {
        throw new Error('failed to update legendary(' + effect.id + ') synergy cascading at index ' + index);
    }
}
function setSource(effect, index, source) {
    const value = effect.effects[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value.effect)) {
        value.effect.source = source;
    }
    else {
        throw new Error('failed to update source at index ' + index);
    }
}
function useOnlyMaxSource(effect, index) {
    const value = effect.effects[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value.effect)) {
        value.effect.useOnlyMaxSource = true;
    }
    else {
        throw new Error('failed to update useOnlyMaxSource at index ' + index);
    }
}
function setSynergyPrecision(effect, index, precision) {
    const value = effect.effects[index];
    if (value && (0, utils_1.isEffectValueSynergy)(value.effect)) {
        value.effect.precision = precision;
    }
    else {
        throw new Error('failed to update synergy precision at index ' + index);
    }
}
exports.DATA_LEGENDARY = {
    12: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
        }
    },
    13: {
        override: (effect) => {
            setStat(effect, 0, 'coward_effect_cooldown');
            setStat(effect, 1, 'coward_effect_missing_health_restored');
        }
    },
    14: {
        override: (effect) => {
            setStat(effect, 0, 'damages_dealt_to_mana');
        }
    },
    15: {
        override: (effect) => {
            setStat(effect, 0, 'immortal_grasp_health_restored');
            setStat(effect, 0, 'immortal_grasp_duration');
            synergySetAllowMinMax(effect, 1, false);
            allowSynergyToCascade(effect, 1);
        }
    },
    16: {
        override: (effect) => {
            setStat(effect, 0, 'stability_max_stacks');
            setStat(effect, 1, 'stability_stack_reduced_on_all');
        }
    },
    17: {
        override: (effect) => {
            setStat(effect, 0, 'arah_restoration_chance');
            setStat(effect, 1, 'arah_restoration_missing_mana_percent');
        }
    },
    18: {
        override: (effect) => {
            setStat(effect, 0, 'cooldown_time_reduction_multiplier');
        }
    },
    19: {
        override: (effect) => {
            setStat(effect, 0, 'movement_skill_cooldown_reduction_percent');
            setStat(effect, 1, 'hremesal_effect_cooldown');
        }
    },
    20: {
        override: (effect) => {
            setStat(effect, 0, 'crit_chance_global_mult_per_yard');
        }
    },
    23: {
        override: (effect) => {
            setStat(effect, 1, 'indomptable_mountain_res_phy_add');
            setStat(effect, 2, 'garbage_stat'); // BUG Indomitable Mountain actualy increase by 200% when hit
            setStat(effect, 3, 'buff_indomptable_mountain_def_phy_duration');
            allowSynergyToCascade(effect, 1);
            addConstant(effect, 200, 'buff_indomptable_mountain_def_phy_mult', effect_value_value_type_1.EffectValueValueType.Stat);
        }
    },
    24: {
        override: (effect) => {
            setStat(effect, 0, 'enemy_low_life_crit_chance_global_mult');
            setStat(effect, 1, 'enemy_low_life_crit_chance_global_mult_treshold');
        }
    },
    26: {
        override: (effect) => {
            setStat(effect, 0, 'conquest_stack_inner_fire_max_number_add');
            setStat(effect, 1, 'conquest_stack_duration');
            setStat(effect, 2, 'conquest_max_stacks');
        }
    },
    28: {
        override: (effect) => {
            setStat(effect, 0, 'staggered_damage_percent');
            addConstant(effect, 10, 'staggered_damage_duration', effect_value_value_type_1.EffectValueValueType.Stat);
        }
    },
    29: {
        override: (effect) => {
            setStat(effect, 0, 'ancestral_fervor_buff_chance_on_ancestral_skill_cast');
            setStat(effect, 1, 'ancestral_fervor_buff_crit_chance_percent');
            setStat(effect, 2, 'ancestral_fervor_buff_duration');
        }
    },
    30: {
        override: (effect) => {
            setStat(effect, 0, 'soul_mantle_enemy_max_health_as_additional_damage_per_tick');
        }
    },
    31: {
        override: (effect) => {
            setStat(effect, 0, 'ancient_recognition_buff_duration');
        }
    },
    32: {
        override: (effect) => {
            setStat(effect, 0, 'overdrive_damage_global_mult_per_bounce_left');
        }
    },
    33: {
        override: (effect) => {
            setStat(effect, 0, 'overdrive_damage_global_mult_last_bounce');
            valueMultiply100(effect, 0);
        }
    },
    34: {
        override: (effect) => {
            setStat(effect, 0, 'phoenix_revive_max_health_percent');
            setStat(effect, 1, 'phoenix_invulnerability_duration');
            setStat(effect, 2, 'phoenix_revive_cooldown');
        }
    },
    36: {
        override: (effect) => {
            addConstant(effect, 100, 'reaper_added_to_elements', effect_value_value_type_1.EffectValueValueType.Stat);
        }
    },
    37: {
        override: (effect) => {
            setStat(effect, 0, 'idle_remove_delay');
        }
    },
    38: {
        override: (effect) => {
            setStat(effect, 0, 'slorm_reaper_copy_chance');
            allowSynergyToCascade(effect, 1);
        }
    },
    39: {
        override: (effect) => {
            setStat(effect, 0, 'physical_damage');
            allowSynergyToCascade(effect, 0);
            // valueMultiply100(effect, 0);
        }
    },
    40: {
        override: (effect) => {
            allowSynergyToCascade(effect, 0);
        }
    },
    41: {
        override: (effect) => {
            setStat(effect, 0, 'vilinis_delay');
            setStat(effect, 1, 'vilinis_damage_from_initial_hit');
            setStat(effect, 2, 'vilinis_reapply_chance');
        }
    },
    43: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    45: {
        override: (effect) => {
            setStat(effect, 0, 'splintered_max_stacks');
            setStat(effect, 1, 'splintered_stack_increased_effect');
        }
    },
    49: {
        override: (effect) => {
            setStat(effect, 0, 'astral_retribution_on_elder_lance_cast_chance_per_cosmic_stack_max');
        }
    },
    50: {
        override: (effect) => {
            if (effect.effects[0]) {
                effect.effects[0].effect = (0, effect_value_util_1.effectValueConstant)(0.1, false, 'garbage_stat');
                effect.template = effect.template.replace('@', '~');
            }
        }
    },
    52: {
        override: (effect) => {
            setStat(effect, 0, 'revengeance_stack_thorns_percent');
            setStat(effect, 1, 'revengeance_stack_retaliate_percent');
            setStat(effect, 2, 'revengeance_stack_duration');
        }
    },
    54: {
        override: (effect) => {
            setStat(effect, 0, 'stab_copy_chance');
            setStat(effect, 1, 'stab_copy_count');
        }
    },
    55: {
        override: (effect) => {
            setStat(effect, 0, 'explosive_projectile_cooldown_reduction_percent_per_hit');
        }
    },
    56: {
        override: (effect) => {
            setStat(effect, 0, 'additional_wandering_arrow_add');
        }
    },
    57: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            addConstant(effect, 4, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    58: {
        override: (effect) => {
            setStat(effect, 0, 'poison_spread_chance_per_previous_tick');
        }
    },
    61: {
        override: (effect) => {
            setStat(effect, 0, 'arrow_shot_fork_chance_after_rebound');
        }
    },
    62: {
        override: (effect) => {
            addConstant(effect, 5, 'trap_pull_distance', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    63: {
        override: (effect) => {
            setStat(effect, 0, 'elemental_weakness_stack_chance');
            setStat(effect, 1, 'elemental_weakness_stack_elemental_damage_mult');
            setStat(effect, 2, 'elemental_weakness_stack_duration');
            setStat(effect, 3, 'elemental_weakness_max_stacks');
        }
    },
    64: {
        override: (effect) => {
            setStat(effect, 0, 'book_smash_trigger_count_on_critical');
        }
    },
    65: {
        override: (effect) => {
            setStat(effect, 0, 'rift_nova_autocast_chance');
            if (effect.effects[1]) {
                effect.effects[1].effect = (0, effect_value_util_1.effectValueConstant)(1.5, false, 'garbage_stat');
                effect.template = effect.template.replace('every @', 'every ~');
            }
        }
    },
    67: {
        override: (effect) => {
            setStat(effect, 0, 'orb_of_the_arcane_master_max_reduction');
            // hack for orb_of_the_arcane_master_max_reduction until i find a better solution
            addConstant(effect, 0.5, 'orb_of_the_arcane_master_reduction_multiplier', effect_value_value_type_1.EffectValueValueType.Upgrade);
        }
    },
    69: {
        override: (effect) => {
            allowSynergyToCascade(effect, 0);
            addConstant(effect, 2, 'distortion_wave_push_distance', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    70: {
        override: (effect) => {
            setStat(effect, 0, 'time_lock_damage_max_health_percent_treshold');
            setStat(effect, 1, 'time_lock_damage_max_health_percent_increased_damage_mult');
        }
    },
    72: {
        override: (effect) => {
            setStat(effect, 0, 'arcane_bond_duration_add');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    73: {
        override: (effect) => {
            setStat(effect, 0, 'burning_trail_burning_rage_burning_change');
        }
    },
    74: {
        override: (effect) => {
            setStat(effect, 0, 'frist_crit_chance_per_frostbolt_shot_recently');
            setStat(effect, 1, 'frist_crit_damage_per_frostbolt_shot_recently');
            setStat(effect, 2, 'frostbolt_shot_recently_duration');
        }
    },
    75: {
        override: (effect) => {
            setStat(effect, 0, 'high_voltage_max_stacks');
            setStat(effect, 1, 'high_voltage_stack_spark_machine_increased_damage');
        }
    },
    76: {
        override: (effect) => {
            setStat(effect, 0, 'enligntment_stack_min_elemental_damage_add');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    78: {
        override: (effect) => {
            setStat(effect, 0, 'ancestral_rank_add');
        }
    },
    81: {
        override: (effect) => {
            effect.template = effect.template.substring(0, effect.template.indexOf('|'));
        }
    },
    83: {
        override: (effect) => {
            setStat(effect, 0, 'min_reaper_level');
        }
    },
    96: {
        override: (effect) => {
            valueMultiply100(effect, 0);
            valueMultiply100(effect, 1);
            allowSynergyToCascade(effect, 1);
        }
    },
    98: {
        override: (effect) => {
            setStat(effect, 1, 'projectile_ancestral_chance');
        }
    },
    99: {
        override: (effect) => {
            valueMultiply100(effect, 0);
            setValueType(effect, 1, effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
            addConstant(effect, 3, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    100: {
        override: (effect) => {
            valueMultiply100(effect, 0);
        }
    },
    101: {
        override: (effect) => {
            setSource(effect, 1, 'overdrive_damage');
            synergySetAllowMinMax(effect, 1, false);
            useOnlyMaxSource(effect, 1);
        }
    },
    105: {
        override: (effect) => {
            setStat(effect, 0, 'all_skill_cost_reduction');
            addConstant(effect, 1, 'skill_mana_cost_to_life_cost', effect_value_value_type_1.EffectValueValueType.Stat);
        }
    },
    108: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'skill_retention_stack_basic_damage_global_mult');
            setStat(effect, 3, 'elemental_retention_stack_elemental_damage_global_mult');
            setStat(effect, 4, 'garbage_stat');
            setStat(effect, 5, 'retention_max_stacks');
        }
    },
    112: {
        override: (effect) => {
            allowSynergyToCascade(effect, 0);
        }
    },
    114: {
        override: (effect) => {
            effect.template = effect.template.replace('@ for each', '~ for each');
            setStat(effect, 0, 'first_slot_cooldown_reduction_global_mult');
            setStat(effect, 1, 'non_first_slot_cooldown_reduction_global_mult');
            setScore(effect, 1, 500);
            addConstant(effect, 5, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Static, true);
        }
    },
    115: {
        override: (effect) => {
            effect.template = effect.template.replace('@ for each', '~ for each');
            setStat(effect, 0, 'second_slot_activable_cost_reduction');
            setStat(effect, 1, 'non_second_slot_activable_cost_reduction');
            setScore(effect, 1, 500);
            addConstant(effect, 5, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Static, true);
        }
    },
    116: {
        override: (effect) => {
            effect.template = effect.template.replace('@ for each', '~ for each');
            setStat(effect, 0, 'thirst_slot_increased_damage');
            setStat(effect, 1, 'non_thirst_slot_increased_damage');
            setScore(effect, 1, 500);
            addConstant(effect, 5, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Static, true);
        }
    },
    117: {
        override: (effect) => {
            effect.template = effect.template.replace('@ for each', '~ for each');
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setScore(effect, 1, 500);
            addConstant(effect, 5, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Static, true);
        }
    },
    118: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            addConstant(effect, 10, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Duration);
        }
    },
    120: {
        override: (effect) => {
            synergySetAllowMinMax(effect, 0, false);
            setStat(effect, 0, 'garbage_stat');
        }
    },
    121: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'garbage_stat');
            setStat(effect, 3, 'garbage_stat');
        }
    },
    122: {
        override: (effect) => {
            setSource(effect, 0, 'critical_chance');
            valueMultiply100(effect, 0);
        }
    },
    123: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'garbage_stat');
            setStat(effect, 3, 'garbage_stat');
        }
    },
    124: {
        override: (effect) => {
            addConstant(effect, 4, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    125: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    126: {
        override: (effect) => {
            setStat(effect, 0, 'secondary_skill_additional_damages');
            setSynergyPrecision(effect, 0, 0);
            allowSynergyToCascade(effect, 0);
        }
    },
    130: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'transference_max_stack');
            setStat(effect, 2, 'transference_stack_increased_indirect_damage');
        }
    },
    131: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'garbage_stat');
            addConstant(effect, 7, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    134: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    139: {
        override: (effect) => {
            setStat(effect, 1, 'garbage_stat');
        }
    },
    140: {
        override: (effect) => {
            setStat(effect, 0, 'secondary_boost_max_stacks');
            setStat(effect, 1, 'secondary_boost_stack_secondary_skill_decreased_damage_mult');
        }
    },
    143: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
        }
    },
    144: {
        override: (effect) => {
            setStat(effect, 0, 'undamaged_crit_chance_percent');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    145: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
        }
    },
    146: {
        override: (effect) => {
            synergySetAllowMinMax(effect, 0, false);
            setStat(effect, 0, 'garbage_stat');
        }
    },
    147: {
        override: (effect) => {
            setStat(effect, 0, 'ultimatum_increased_level');
        }
    },
    148: {
        override: (effect) => {
            setStat(effect, 0, 'steel_manipulator_min_weapon_damage_add');
            synergySetAllowMinMax(effect, 0, false);
            allowSynergyToCascade(effect, 0);
            addConstant(effect, 0, 'basic_not_added_to_skill_damage', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    151: {
        override: (effect) => {
            setStat(effect, 0, 'ring_defensive_stat_multiplier');
        }
    },
    153: {
        override: (effect) => {
            setStat(effect, 0, 'necromancy_set_minion_increased_damage_percent');
            allowSynergyToCascade(effect, 0);
        }
    },
    154: {
        override: (effect) => {
            setStat(effect, 0, 'necromancy_set_minion_increased_damage_percent');
            allowSynergyToCascade(effect, 0);
        }
    },
    155: {
        override: (effect) => {
            setStat(effect, 0, 'necromancy_set_minion_increased_damage_percent');
            allowSynergyToCascade(effect, 0);
        }
    },
    156: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'elemental_damage');
            setValueType(effect, 2, effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
            addConstant(effect, 2, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    160: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
        }
    },
    161: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
        }
    },
    163: {
        override: (effect) => {
            setStat(effect, 0, 'extreme_confidence_attack_speed_global_mult');
            setStat(effect, 1, 'extreme_confidence_cooldown_reduction_global_mult');
        }
    },
    165: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            addConstant(effect, 5, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
        }
    },
    168: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    169: {
        override: (effect) => {
            setStat(effect, 0, 'remnant_chance_to_pierce_percent');
        }
    },
    178: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'garbage_stat');
        }
    },
    180: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
        }
    },
    181: {
        override: (effect) => {
            setStat(effect, 0, 'fate_crusher_reapersmith_all');
        }
    },
    184: {
        override: (effect) => {
            setStat(effect, 1, 'garbage_stat');
        }
    },
    185: {
        override: (effect) => {
            setStat(effect, 0, 'primary_secondary_skill_additional_damage');
        }
    },
    186: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
        }
    },
    187: {
        override: (effect) => {
            setStat(effect, 0, 'wreak_havoc_max_stacks');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'garbage_stat');
        }
    },
    189: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
        }
    },
    190: {
        override: (effect) => {
            setStat(effect, 0, 'garbage_stat');
            setStat(effect, 1, 'garbage_stat');
            setStat(effect, 2, 'garbage_stat');
        }
    },
    192: {
        override: (effect) => {
            setStat(effect, 0, 'fisherman_set_booster_max_cooldown_reduction_global_mult');
            setStat(effect, 1, 'fisherman_set_booster_max_elemental_damage_percent');
            setStat(effect, 2, 'fisherman_set_booster_max_basic_damage_percent_percent');
            setStat(effect, 3, 'fisherman_set_booster_max_cooldown');
            addConstant(effect, -45, 'fisherman_set_booster_max_cooldown_reduce', effect_value_value_type_1.EffectValueValueType.Stat);
        }
    },
    201: {
        override: (effect) => {
            setStat(effect, 0, 'blorm_increased_damage');
        }
    },
    202: {
        override: (effect) => {
            setStat(effect, 0, 'avatar_of_shadow_duration_add');
        }
    },
};
//# sourceMappingURL=data-legendary.js.map