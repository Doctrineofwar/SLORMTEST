"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_CLASS_MECHANIC = void 0;
const effect_value_upgrade_type_1 = require("../../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../../model/content/enum/effect-value-value-type");
const hero_class_1 = require("../../../model/content/enum/hero-class");
const skill_genre_1 = require("../../../model/content/enum/skill-genre");
const effect_value_util_1 = require("../../../util/effect-value.util");
const common_1 = require("../../common");
exports.DATA_CLASS_MECHANIC = {
    [hero_class_1.HeroClass.Warrior]: {
        216: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'skewer_damage_percent', 'percent', effect_value_value_type_1.EffectValueValueType.Stat),
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'skewer_max_stacks', 'stacks', effect_value_value_type_1.EffectValueValueType.Stat),
            ]
        },
        217: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'astral_retribution_damage', 'physical_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
                (0, effect_value_util_1.effectValueConstant)(common_1.ASTRAL_RETRIBUTION_DAMAGE_PERCENT, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'astral_meteor_damage', 'physical_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
                (0, effect_value_util_1.effectValueConstant)(common_1.ASTRAL_METEOR_DAMAGE_PERCENT, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
                (0, effect_value_util_1.effectValueConstant)(common_1.ASTRAL_METEOR_AOE, false, 'astral_meteor_aoe', effect_value_value_type_1.EffectValueValueType.AreaOfEffect),
            ]
        },
        218: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'block_damage_reduction', 'percent', effect_value_value_type_1.EffectValueValueType.Stat),
            ]
        }
    },
    [hero_class_1.HeroClass.Huntress]: {
        209: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'ravenous_dagger_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
                (0, effect_value_util_1.effectValueConstant)(common_1.RAVENOUS_DAGGER_DAMAGE_PERCENT, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
            ],
            genres: [skill_genre_1.SkillGenre.AreaOfEffect]
        },
        210: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(common_1.TRAP_DAMAGE_PERCENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'trap_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
                (0, effect_value_util_1.effectValueConstant)(common_1.TRAP_DAMAGE_PERCENT, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
                (0, effect_value_util_1.effectValueConstant)(common_1.TRAP_AOE, false, 'trap_aoe', effect_value_value_type_1.EffectValueValueType.AreaOfEffect),
                (0, effect_value_util_1.effectValueConstant)(common_1.TRAP_STUN_DURATION, false, 'trap_stun_duration', effect_value_value_type_1.EffectValueValueType.Duration),
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'trap_arm_time', 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, false),
            ],
            genres: [skill_genre_1.SkillGenre.AreaOfEffect],
            templateOverride: template => template.replace('£', '$')
        },
        211: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(common_1.POISON_DAMAGE_PERCENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'poison_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
                (0, effect_value_util_1.effectValueConstant)(common_1.POISON_DAMAGE_PERCENT, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
                (0, effect_value_util_1.effectValueConstant)(common_1.POISON_DURATION, false, 'duration', effect_value_value_type_1.EffectValueValueType.Stat),
            ],
            genres: [skill_genre_1.SkillGenre.DamageOverTime]
        }
    },
    [hero_class_1.HeroClass.Mage]: {
        214: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_emblems', 'max', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, false),
            ],
            templateOverride: template => template.replace('¥', '$')
        },
        215: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'time_lock_duration', 'duration', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3),
            ]
        },
        216: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'arcane_bond_damage', 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
                (0, effect_value_util_1.effectValueConstant)(common_1.ARCANE_BOND_DAMAGE_FROM_MANA_SPENT, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
                (0, effect_value_util_1.effectValueConstant)(common_1.ARCANE_BOND_DAMAGE_FROM_MAX_MANA, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'arcane_bond_duration', 'duration', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3),
            ],
            templateOverride: template => template.replace('£', '@').replace('_', '$')
        },
        217: {
            values: [
                (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'remnant_decreased_damage', 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
            ]
        },
        218: {
            values: [
                (0, effect_value_util_1.effectValueConstant)(common_1.ARCANE_CLONE_ATTACK_SPEED_REDUCTION, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
            ]
        }
    },
};
//# sourceMappingURL=data-class-mechanic.js.map