"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_MECHANIC = void 0;
const effect_value_upgrade_type_1 = require("../../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../../model/content/enum/effect-value-value-type");
const mechanic_type_1 = require("../../../model/content/enum/mechanic-type");
const skill_genre_1 = require("../../../model/content/enum/skill-genre");
const skill_element_1 = require("../../../model/content/skill-element");
const effect_value_util_1 = require("../../../util/effect-value.util");
const common_1 = require("../../common");
exports.DATA_MECHANIC = {
    [mechanic_type_1.MechanicType.InnerFire]: {
        values: [
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'inner_fire_duration', 'duration', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'inner_fire_damage', 'basic_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, undefined, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'inner_fire_max_number', 'max', effect_value_value_type_1.EffectValueValueType.Stat),
        ]
    },
    [mechanic_type_1.MechanicType.ShieldGlobe]: {
        values: [
            (0, effect_value_util_1.effectValueConstant)(common_1.SHIELD_DURATION, false, 'duration', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'shield_globe_value', 'shield', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 2, false),
        ]
    },
    [mechanic_type_1.MechanicType.Overdrive]: {
        values: [
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'overdrive_bounce_number', 'bounces', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'overdrive_damage', 'basic_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, undefined, undefined, undefined, undefined, true),
        ]
    },
    [mechanic_type_1.MechanicType.Fireball]: {
        values: [
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_damage', 'elemental_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, undefined, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(100, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
        ]
    },
    [mechanic_type_1.MechanicType.WalkingBomb]: {
        values: [
            (0, effect_value_util_1.effectValueConstant)(2, false, 'duration', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_damage', 'elemental_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 2, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(100, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueConstant)(1, false, 'walking_bomb_aoe', effect_value_value_type_1.EffectValueValueType.AreaOfEffect),
        ],
        genres: [skill_genre_1.SkillGenre.AreaOfEffect]
    },
    [mechanic_type_1.MechanicType.Dart]: {
        values: [
            (0, effect_value_util_1.effectValueSynergy)(40, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_damage', 'elemental_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, undefined, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(40, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
        ]
    },
    [mechanic_type_1.MechanicType.Frostbolt]: {
        values: [
            (0, effect_value_util_1.effectValueSynergy)(120, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_damage', 'elemental_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 1, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(120, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
        ]
    },
    [mechanic_type_1.MechanicType.LightningRod]: {
        values: [
            (0, effect_value_util_1.effectValueConstant)(7, false, 'duration', effect_value_value_type_1.EffectValueValueType.Duration),
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_damage', 'elemental_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 1, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(100, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
        ],
        genres: [skill_genre_1.SkillGenre.Totem],
        element: skill_element_1.SkillElement.Lightning,
        template: template => template.replace('between 1 and ', '')
    },
    [mechanic_type_1.MechanicType.SoulBound]: {
        values: [
            (0, effect_value_util_1.effectValueSynergy)(15, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'basic_damage', 'basic_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 2, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(15, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueConstant)(10, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
        ]
    },
    [mechanic_type_1.MechanicType.Burn]: {
        values: [
            (0, effect_value_util_1.effectValueSynergy)(300, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_damage', 'elemental_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 2, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(300, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueConstant)(7, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
        ],
        genres: [skill_genre_1.SkillGenre.DamageOverTime],
    },
    [mechanic_type_1.MechanicType.Blorm]: {
        values: [
            (0, effect_value_util_1.effectValueConstant)(10, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
            (0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'physical_damage', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true),
            (0, effect_value_util_1.effectValueConstant)(100, false, 'garbage_stat', effect_value_value_type_1.EffectValueValueType.Stat),
        ],
        genres: [skill_genre_1.SkillGenre.Minion],
    },
};
//# sourceMappingURL=data-mechanic.js.map