"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerValueUpdaterService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const data_character_stats_mapping_1 = require("../../constants/content/data/data-character-stats-mapping");
const model_1 = require("../../model");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const hero_class_1 = require("../../model/content/enum/hero-class");
const mechanic_type_1 = require("../../model/content/enum/mechanic-type");
const skill_cost_type_1 = require("../../model/content/enum/skill-cost-type");
const skill_genre_1 = require("../../model/content/enum/skill-genre");
const rune_type_1 = require("../../model/content/rune-type");
const skill_element_1 = require("../../model/content/skill-element");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerValueUpdaterService = class SlormancerValueUpdaterService {
    constructor(slormancerEffectValueService, slormancerStatMappingService, slormancerMergedStatUpdaterService, slormancerAncestrayLegacyService, slormancerActivableService, slormancerSkillService) {
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.slormancerStatMappingService = slormancerStatMappingService;
        this.slormancerMergedStatUpdaterService = slormancerMergedStatUpdaterService;
        this.slormancerAncestrayLegacyService = slormancerAncestrayLegacyService;
        this.slormancerActivableService = slormancerActivableService;
        this.slormancerSkillService = slormancerSkillService;
    }
    getStatValueOrDefault(stats, stat) {
        let result = stats.find(s => s.stat === stat);
        if (result === undefined) {
            result = {
                allowMinMax: false,
                readonly: false,
                suffix: '',
                precision: 0,
                displayPrecision: undefined,
                stat,
                total: 0,
                totalWithoutSynergy: 0,
                totalDisplayed: 0,
                values: { flat: [], maxPercent: [], max: [], multiplier: [], percent: [], maxMultiplier: [] }
            };
        }
        return result;
    }
    isValidBleedingMultipluer(entity) {
        let valid = true;
        if ('ancestralLegacy' in entity && entity.ancestralLegacy.id === 61) {
            valid = false;
        }
        else if ('reaper' in entity && [117, 118].includes(entity.reaper.id)) {
            valid = false;
        }
        return valid;
    }
    getValidDamageMultipliers(genres, skillStats, stats, stat, isSkill, element = skill_element_1.SkillElement.Neutral, isDirectDamage = false) {
        const multipliers = [];
        const isBleeding = stat === 'bleed_damage';
        if (!isDirectDamage) {
            multipliers.push(...skillStats.indirectIncreasedDamage.values.multiplier.map(entity => entity.value));
        }
        multipliers.push(skillStats.increasedDamage.values.percent.reduce((t, v) => t + v.value, 0));
        multipliers.push(...skillStats.increasedDamage.values.multiplier
            .map(v => v.value));
        if (isSkill) {
            const percentMultiplier = skillStats.skillIncreasedDamage.values.percent
                .reduce((total, percent) => total = total + percent.value, 0);
            multipliers.push(percentMultiplier);
            multipliers.push(...skillStats.skillIncreasedDamage.values.multiplier
                .filter(v => !isBleeding || this.isValidBleedingMultipluer(v.source))
                .map(v => v.value));
        }
        if (genres.includes(skill_genre_1.SkillGenre.AreaOfEffect)) {
            multipliers.push(skillStats.aoeIncreasedEffect.total);
        }
        if (genres.includes(skill_genre_1.SkillGenre.Totem)) {
            multipliers.push(skillStats.totemIncreasedEffect.total);
            const totemIncreasedDamage = stats.stats.find(mergedStat => mergedStat.stat === 'totem_increased_damage');
            if (totemIncreasedDamage !== undefined) {
                multipliers.push(totemIncreasedDamage.total);
            }
        }
        if (genres.includes(skill_genre_1.SkillGenre.Aura)) {
            multipliers.push(skillStats.auraIncreasedEffect.total);
        }
        if (genres.includes(skill_genre_1.SkillGenre.Minion)) {
            multipliers.push(skillStats.minionIncreasedDamage.total);
        }
        if (isBleeding || genres.includes(skill_genre_1.SkillGenre.DamageOverTime)) {
            multipliers.push(skillStats.dotIncreasedDamage.total);
        }
        if (stat == 'bleed_damage') {
            const bleedIncreasedDamage = stats.stats.find(mergedStat => mergedStat.stat === 'bleed_increased_damage');
            if (bleedIncreasedDamage) {
                multipliers.push(...bleedIncreasedDamage.values.multiplier.map(v => v.value));
            }
        }
        if (element == skill_element_1.SkillElement.Lightning) {
            const lightning = this.getStatValueOrDefault(stats.stats, 'lightning_increased_damages');
            multipliers.push(...lightning.values.multiplier.map(v => v.value));
        }
        if (stats.extractedStats['increased_damage_mult_per_potential_projectile'] !== undefined) {
            const increasedDamage = stats.extractedStats['increased_damage_mult_per_potential_projectile'][0].value;
            const projectilesMultiplier = Math.floor(skillStats.additionalProjectiles.total);
            multipliers.push(increasedDamage * projectilesMultiplier);
        }
        return multipliers.filter(v => v !== 0);
    }
    getValidStatMultipliers(genres, skillStats) {
        const multipliers = [];
        if (genres.includes(skill_genre_1.SkillGenre.AreaOfEffect)) {
            multipliers.push(skillStats.aoeIncreasedEffect.total);
        }
        if (genres.includes(skill_genre_1.SkillGenre.Totem)) {
            multipliers.push(skillStats.totemIncreasedEffect.total);
        }
        if (genres.includes(skill_genre_1.SkillGenre.Aura)) {
            multipliers.push(skillStats.auraIncreasedEffect.total);
        }
        if (genres.includes(skill_genre_1.SkillGenre.Minion)) {
            multipliers.push(skillStats.minionIncreasedDamage.total);
        }
        return multipliers.filter(v => v !== 0);
    }
    getValidDurationMultipliers(genres, stats) {
        const multipliers = [];
        if (genres.includes(skill_genre_1.SkillGenre.Totem)) {
            multipliers.push(stats.totemIncreasedEffect.total);
        }
        if (genres.includes(skill_genre_1.SkillGenre.Aura)) {
            multipliers.push(stats.auraIncreasedEffect.total);
        }
        if (genres.includes(skill_genre_1.SkillGenre.AreaOfEffect)) {
            multipliers.push(stats.aoeIncreasedEffect.total);
        }
        return multipliers.filter(v => v !== 0);
    }
    getSkillStats(stats, character) {
        return {
            mana: this.getStatValueOrDefault(stats.stats, 'skill_mana_cost'),
            life: this.getStatValueOrDefault(stats.stats, 'skill_life_cost'),
            cooldownReduction: this.getStatValueOrDefault(stats.stats, 'cooldown_reduction'),
            skillIncreasedDamage: this.getStatValueOrDefault(stats.stats, 'skill_increased_damages'),
            skillIncreasedAoe: this.getStatValueOrDefault(stats.stats, 'skill_aoe_increased_size'),
            dotIncreasedDamage: this.getStatValueOrDefault(stats.stats, 'dot_increased_damage'),
            indirectIncreasedDamage: this.getStatValueOrDefault(stats.stats, 'indirect_increased_damage'),
            increasedDamage: this.getStatValueOrDefault(stats.stats, 'increased_damages'),
            totemIncreasedEffect: this.getStatValueOrDefault(stats.stats, 'totem_increased_effect'),
            auraIncreasedEffect: this.getStatValueOrDefault(stats.stats, 'aura_increased_effect'),
            aoeIncreasedEffect: this.getStatValueOrDefault(stats.stats, 'aoe_increased_effect'),
            aoeIncreasedSize: this.getStatValueOrDefault(stats.stats, 'aoe_increased_size'),
            minionIncreasedDamage: this.getStatValueOrDefault(stats.stats, 'minion_increased_damage'),
            additionalDamages: this.getStatValueOrDefault(stats.stats, 'additional_damage'),
            additionalDuration: this.getStatValueOrDefault(stats.stats, 'skill_additional_duration'),
            additionalProjectiles: this.getStatValueOrDefault(stats.stats, 'additional_projectile'),
            characterAdditionalProjectiles: this.getStatValueOrDefault(character.stats, 'additional_projectile'),
        };
    }
    updateClassMechanic(classMechanic, statsResult) {
        const multipliers = [];
        if (classMechanic.genres.includes(skill_genre_1.SkillGenre.AreaOfEffect)) {
            const aoeStat = this.getStatValueOrDefault(statsResult.stats, 'aoe_increased_effect');
            multipliers.push(aoeStat.total);
            const aoeSizes = classMechanic.values.filter(value => value.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
            if (aoeSizes.length > 0) {
                const aoeSizeStat = this.getStatValueOrDefault(statsResult.stats, 'aoe_increased_size');
                for (const aoeSize of aoeSizes) {
                    aoeSize.value = aoeSize.baseValue * (100 + aoeSizeStat.total) / 100;
                    aoeSize.displayValue = (0, math_util_1.round)(aoeSize.value, 2);
                }
            }
        }
        if (classMechanic.genres.includes(skill_genre_1.SkillGenre.DamageOverTime)) {
            const dotStat = this.getStatValueOrDefault(statsResult.stats, 'dot_increased_damage');
            multipliers.push(dotStat.total);
        }
        if (multipliers.length > 0) {
            for (const value of classMechanic.values) {
                if ((0, utils_1.isEffectValueSynergy)(value) && (0, utils_1.isDamageType)(value.stat)) {
                    const precision = (0, utils_1.valueOrDefault)(value.precision, 0);
                    if (typeof value.synergy === 'number') {
                        for (const multiplier of multipliers) {
                            value.synergy = value.synergy * (100 + multiplier) / 100;
                        }
                        value.displaySynergy = (0, math_util_1.round)(value.synergy, precision);
                    }
                    else {
                        for (const multiplier of multipliers) {
                            value.synergy.min = value.synergy.min * (100 + multiplier) / 100;
                            value.synergy.max = value.synergy.max * (100 + multiplier) / 100;
                        }
                        value.displaySynergy = {
                            min: (0, math_util_1.round)(value.synergy.min, precision),
                            max: (0, math_util_1.round)(value.synergy.max, precision),
                        };
                    }
                }
            }
        }
    }
    updateMechanic(mechanic, character, statsResult, config) {
        const skillStats = this.getSkillStats(statsResult, character);
        for (const value of mechanic.values) {
            value.value = value.baseValue;
            if (value.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect) {
                const aoeSizeMultipliers = skillStats.aoeIncreasedSize.total;
                value.value = (0, utils_1.isEffectValueVariable)(value) ? value.upgradedValue : value.baseValue;
                value.value = value.value * (100 + aoeSizeMultipliers) / 100;
                value.displayValue = (0, math_util_1.round)(value.value, 2);
            }
            if (value.valueType === effect_value_value_type_1.EffectValueValueType.Duration) {
                const durationMultipliers = this.getValidStatMultipliers(mechanic.genres, skillStats);
                value.value = (0, utils_1.isEffectValueVariable)(value) ? value.upgradedValue : value.baseValue;
                if (value.percent) {
                    let sumMultiplier = 100;
                    for (const multiplier of durationMultipliers) {
                        sumMultiplier += multiplier;
                    }
                    value.value = value.value * sumMultiplier / 100;
                }
                else {
                    for (const multiplier of durationMultipliers) {
                        value.value = value.value * (100 + multiplier) / 100;
                    }
                }
                value.displayValue = (0, math_util_1.round)(value.value, 3);
            }
            if ((0, utils_1.isEffectValueSynergy)(value) && (0, utils_1.isDamageType)(value.stat)) {
                const additionalDamageMultipliers = [];
                let addedFlatDamage = 0;
                if (mechanic.type === mechanic_type_1.MechanicType.Burn) {
                    if (config.has_living_inferno_buff) {
                        const burnIncreasedDamageStat = statsResult.extractedStats['living_inferno_burn_increased_damage'];
                        if (burnIncreasedDamageStat) {
                            additionalDamageMultipliers.push(burnIncreasedDamageStat[0].value);
                        }
                    }
                    const increasedBurnDamage = statsResult.extractedStats['increased_burn_damage'];
                    if (increasedBurnDamage) {
                        additionalDamageMultipliers.push(increasedBurnDamage[0].value);
                    }
                }
                if (mechanic.type === mechanic_type_1.MechanicType.Blorm) {
                    const enduringBlormIncreasedDamage = statsResult.extractedStats['enduring_blorms_blorm_increased_damage'];
                    if (enduringBlormIncreasedDamage) {
                        additionalDamageMultipliers.push(enduringBlormIncreasedDamage[0].value);
                    }
                    const blormIncreasedDamage = statsResult.extractedStats['blorm_increased_damage'];
                    if (blormIncreasedDamage) {
                        additionalDamageMultipliers.push(blormIncreasedDamage[0].value);
                    }
                    // il faudrait gérer la synergie si d'autres blorm_increased_damage se rajoutent
                    const leg = (0, utils_1.getAllLegendaryEffects)(character.gear).find(legendaryEffect => legendaryEffect.id === 201);
                    if (leg) {
                        const value = (leg.effects[0]?.effect).synergy;
                        additionalDamageMultipliers.push(value);
                    }
                }
                if (mechanic.type === mechanic_type_1.MechanicType.Dart) {
                    const flashingDartAdditionalDamage = this.getStatValueOrDefault(statsResult.stats, 'flashing_dart_additional_damage');
                    if (flashingDartAdditionalDamage) {
                        addedFlatDamage = (0, math_util_1.add)(addedFlatDamage, flashingDartAdditionalDamage.total);
                    }
                }
                this.updateDamage(value, mechanic.genres, skillStats, statsResult, mechanic.element, false, additionalDamageMultipliers, addedFlatDamage, false);
            }
        }
    }
    updateReaper(reaper, statsResult) {
        const effectValues = [
            ...reaper.templates.base.map(effect => effect.values).flat(),
            ...reaper.templates.benediction.map(effect => effect.values).flat(),
            ...reaper.templates.malediction.map(effect => effect.values).flat()
        ];
        const dotIncreasedDamage = this.getStatValueOrDefault(statsResult.stats, 'dot_increased_damage').total;
        const indirectIncreaseDamage = this.getStatValueOrDefault(statsResult.stats, 'indirect_increased_damage');
        if (reaper.id === 53 && statsResult.extractedStats['fate_crusher_reapersmith_all']) {
            const reapersmithAll = statsResult.extractedStats['fate_crusher_reapersmith_all'][0];
            if (reapersmithAll) {
                for (const reapersmith of model_1.ALL_REAPER_SMITH) {
                    const smithStat = 'reapersmith_' + reapersmith;
                    let stat = statsResult.extractedStats[smithStat];
                    statsResult.extractedStats[smithStat] = stat ? [...stat, reapersmithAll] : [reapersmithAll];
                }
                let stat = statsResult.extractedStats['reaper_bonus'];
                statsResult.extractedStats['reaper_bonus'] = stat ? [...stat, reapersmithAll] : [reapersmithAll];
            }
        }
        if (reaper.id === 96) {
            const righteousSunlightAdditionalDamage = effectValues.find(effect => effect.stat === 'righteous_sunlight_additional_damage');
            if (righteousSunlightAdditionalDamage) {
                const base = reaper.templates.base[0];
                if (base) {
                    const righteous_damage = base.values[8];
                    if (righteous_damage && (0, utils_1.isEffectValueSynergy)(righteous_damage)) {
                        righteous_damage.synergy = (0, math_util_1.add)(righteous_damage.synergy, righteousSunlightAdditionalDamage.synergy);
                        righteous_damage.displaySynergy = (0, math_util_1.round)(righteous_damage.synergy, 0);
                    }
                }
            }
        }
        for (const effectValue of effectValues) {
            if (effectValue.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect) {
                let aoeSizeMultipliers = [];
                const vindictiveMultiplier = effectValues.find(effect => (0, utils_1.isEffectValueSynergy)(effect) && effect.stat === 'vindictive_slam_reaper_effect_radius_mult');
                const aoeSizeStat = this.getStatValueOrDefault(statsResult.stats, 'aoe_increased_size');
                if (vindictiveMultiplier && typeof vindictiveMultiplier.synergy === 'number') {
                    aoeSizeMultipliers.push(vindictiveMultiplier.synergy);
                }
                if (typeof aoeSizeStat.total === 'number') {
                    aoeSizeMultipliers.push(aoeSizeStat.total);
                }
                if ([12, 13, 14].includes(reaper.id)) {
                    const suportstreakIncreasedAoe = effectValues.find(effect => effect.stat === 'suport_streak_increased_aoe');
                    if (suportstreakIncreasedAoe) {
                        aoeSizeMultipliers.push(suportstreakIncreasedAoe.value);
                    }
                }
                if (reaper.id === 29) {
                    aoeSizeMultipliers = [];
                    const auraIncreasedEffect = this.getStatValueOrDefault(statsResult.stats, 'aura_increased_effect');
                    if (auraIncreasedEffect) {
                        aoeSizeMultipliers.push(auraIncreasedEffect.total);
                    }
                    const auraIncreasedSize = this.getStatValueOrDefault(statsResult.stats, 'aura_increased_size');
                    if (auraIncreasedSize) {
                        aoeSizeMultipliers.push(auraIncreasedSize.total);
                    }
                }
                effectValue.value = aoeSizeMultipliers.reduce((total, mult) => total * (100 + mult) / 100, effectValue.baseValue);
                effectValue.displayValue = (0, math_util_1.round)(effectValue.value, 2);
            }
            // special interactions
            if ((0, utils_1.isEffectValueSynergy)(effectValue) && (0, utils_1.isDamageType)(effectValue.stat) && [65, 66, 67].includes(reaper.id)) {
                let aoeEffectMultipliers = [];
                const isSlamDamages = reaper.templates.base.map(effect => effect.values).flat().includes(effectValue);
                const vindictiveMultiplier = effectValues.find(effect => (0, utils_1.isEffectValueSynergy)(effect) && effect.stat === 'vindictive_slam_reaper_effect_elemental_damage_mult');
                const aoeEffectStat = this.getStatValueOrDefault(statsResult.stats, 'aoe_increased_effect');
                if (vindictiveMultiplier && typeof vindictiveMultiplier.synergy === 'number' && isSlamDamages) {
                    aoeEffectMultipliers.push(vindictiveMultiplier.synergy);
                }
                if (typeof aoeEffectStat.total === 'number') {
                    aoeEffectMultipliers.push(aoeEffectStat.total);
                }
                effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, ...aoeEffectMultipliers);
                effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
            }
            if ((0, utils_1.isEffectValueSynergy)(effectValue) && (0, utils_1.isDamageType)(effectValue.stat)) {
                if (reaper.id === 17) {
                    const disintegrationIncreasedDamage = effectValues.find(effect => effect.stat === 'disintegration_increased_damage');
                    if (disintegrationIncreasedDamage) {
                        effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, disintegrationIncreasedDamage.displayValue);
                        effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                    }
                }
                if (reaper.id === 27) {
                    const alphaOmegaIncreasedDamage = effectValues.find(effect => (0, utils_1.isEffectValueSynergy)(effect) && effect.stat === 'alpha_omega_orbs_increased_damage');
                    if (alphaOmegaIncreasedDamage && typeof alphaOmegaIncreasedDamage.synergy === 'number') {
                        effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, alphaOmegaIncreasedDamage.synergy);
                        effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                    }
                }
                if (reaper.id === 53) {
                    const slormHammerIncreasedDamage = effectValues.find(effect => effect.stat === 'slorm_hammer_increased_damages');
                    if (slormHammerIncreasedDamage) {
                        effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, slormHammerIncreasedDamage.displayValue);
                        effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                    }
                }
                if (reaper.id === 57 || reaper.id === 58) {
                    const fireworkIncreasedDamage = effectValues.find(effect => effect.stat === 'inner_weakness_increased_damage');
                    if (fireworkIncreasedDamage) {
                        effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, fireworkIncreasedDamage.displayValue);
                        effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                    }
                }
                if (reaper.id === 77) {
                    const imbueIncreasedDamage = statsResult.extractedStats['imbued_skills_and_ancestral_beam_increased_damage_per_imbue'];
                    const equippedImbues = statsResult.extractedStats['equipped_imbues'];
                    if (imbueIncreasedDamage && equippedImbues) {
                        const imbueIncreasedDamageStat = imbueIncreasedDamage[0];
                        const equippedImbuesStat = equippedImbues[0];
                        if (imbueIncreasedDamageStat && equippedImbuesStat) {
                            const multiplier = imbueIncreasedDamageStat.value * equippedImbuesStat.value;
                            effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, multiplier);
                            effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                        }
                    }
                }
                if (constants_1.UNITY_REAPERS.includes(reaper.id)) {
                    const vigilantBladeAdditionalDamage = effectValues.find(effect => effect.stat === 'vigilant_blade_additional_damage');
                    if (vigilantBladeAdditionalDamage) {
                        effectValue.synergy = (0, math_util_1.add)(effectValue.synergy, vigilantBladeAdditionalDamage.displaySynergy);
                        effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                    }
                }
                if ([12, 13, 14].includes(reaper.id)) {
                    const suportStreakIncreasedDamage = effectValues.find(effect => effect.stat === 'suport_streak_increased_damage');
                    if (suportStreakIncreasedDamage) {
                        effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, suportStreakIncreasedDamage.value);
                        effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                    }
                }
                // deadly accuracy damage over time
                if ([87, 88, 89].includes(reaper.id)) {
                    effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, dotIncreasedDamage);
                    effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                }
                console.log('indirectIncreaseDamage : ', indirectIncreaseDamage, statsResult);
                if (indirectIncreaseDamage.values.multiplier.length > 0) {
                    effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, ...indirectIncreaseDamage.values.multiplier.map(mult => mult.value));
                    effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                }
            }
            if (effectValue.stat === 'berzerker_additional_damage' && (0, utils_1.isEffectValueSynergy)(effectValue)) {
                const berzerkerAdditionalDamageMultiplier = effectValues.find(effect => effect.stat === 'berzerker_additional_damage_mult');
                if (berzerkerAdditionalDamageMultiplier) {
                    effectValue.synergy = (0, math_util_1.mult)(effectValue.synergy, berzerkerAdditionalDamageMultiplier.value);
                    effectValue.displaySynergy = (0, math_util_1.round)(effectValue.synergy, 0);
                }
            }
            if (effectValue.stat === 'drum_cast_2_chance_to_pierce_percent' && (0, utils_1.isEffectValueVariable)(effectValue)) {
                const pierceMult = effectValues.find(value => value.stat === 'chance_to_pierce_global_mult');
                if (pierceMult) {
                    effectValue.upgradedValue = effectValue.upgradedValue * (100 + pierceMult.value) / 100;
                    effectValue.value = effectValue.value * (100 + pierceMult.value) / 100;
                    effectValue.displayValue = (0, math_util_1.round)(effectValue.value, 3);
                }
            }
            if (effectValue.stat === 'drum_cast_3_fork_chance_percent' && (0, utils_1.isEffectValueVariable)(effectValue)) {
                const forkMult = effectValues.find(value => value.stat === 'fork_chance_global_mult');
                if (forkMult) {
                    effectValue.upgradedValue = effectValue.upgradedValue * (100 + forkMult.value) / 100;
                    effectValue.value = effectValue.value * (100 + forkMult.value) / 100;
                    effectValue.displayValue = (0, math_util_1.round)(effectValue.value, 3);
                }
            }
        }
    }
    getSpecificStat(stats, mapping, config, specificstats = {}) {
        // TODO factoriser avec la version faite sur stat mapping service
        const mergedStat = this.slormancerStatMappingService.buildMergedStat({ ...stats, ...specificstats }, mapping, config);
        this.slormancerMergedStatUpdaterService.updateStatTotal(mergedStat);
        return mergedStat.total;
    }
    updateActivableCost(stats, config, source) {
        const costAdd = [];
        const entity = 'level' in source ? { activable: source } : { ancestralLegacy: source };
        if (stats['mana_cost_add']) {
            costAdd.push(...stats['mana_cost_add']);
        }
        let baseCost = source.baseCost;
        if (baseCost !== null) {
            if ('activable' in entity) {
                if (source.id === 55) {
                    const entityValue = stats['mana_is_overrated_mana_lock_percent'];
                    if (entityValue) {
                        baseCost = entityValue[0].value;
                    }
                }
                costAdd.push({ value: baseCost, source: entity });
            }
            else if (entity.ancestralLegacy.currentRankCost !== null) {
                costAdd.push({ value: entity.ancestralLegacy.currentRankCost, source: entity });
            }
        }
        if (stats['mana_cost_to_life_cost'] && config.has_life_bargain_buff && source.hasManaCost && ('level' in source || source.isActivable)) {
            if (source.costType === skill_cost_type_1.SkillCostType.ManaPercent) {
                source.costType = skill_cost_type_1.SkillCostType.LifePercent;
            }
            if (source.costType === skill_cost_type_1.SkillCostType.Mana) {
                source.costType = skill_cost_type_1.SkillCostType.Life;
            }
            if ('activable' in entity) {
                this.slormancerActivableService.updateActivableCostType(entity.activable);
            }
            else {
                this.slormancerAncestrayLegacyService.updateAncestralLegacyCostType(entity.ancestralLegacy);
            }
        }
        const skillCostStats = {
            mana_cost_add: costAdd,
            life_cost_add: costAdd,
            cost_type: [{ value: skill_cost_type_1.ALL_SKILL_COST_TYPES.indexOf(source.costType), source: entity }],
        };
        if ('activable' in entity) {
            skillCostStats['activable_id'] = [{ value: entity.activable.id, source: entity }];
        }
        else {
            skillCostStats['ancestral_legacy_id'] = [{ value: entity.ancestralLegacy.id, source: entity }];
        }
        const mapping = source.hasLifeCost ? data_character_stats_mapping_1.LIFE_COST_MAPPING : data_character_stats_mapping_1.MANA_COST_MAPPING;
        source.cost = Math.max(0, this.getSpecificStat(stats, mapping, config, skillCostStats));
        // Saving mana cost without skeleton for total squires computing
        if (source.id === 17 && 'level' in source) {
            skillCostStats['no_skeletons'] = [{ value: 1, source: entity }];
            source.unbuffedCost = Math.max(0, this.getSpecificStat(stats, mapping, config, skillCostStats));
        }
    }
    getActivableCooldown(stats, config, source, cooldownReduction) {
        let result = 0;
        if (source.baseCooldown !== null) {
            const extraStats = {};
            const cooldownstats = [];
            const entity = 'level' in source ? { activable: source } : { ancestralLegacy: source };
            if (source.genres.includes(skill_genre_1.SkillGenre.Movement)) {
                extraStats['skill_is_movement'] = [{ source: entity, value: 1 }];
            }
            if (stats['cooldown_time_add']) {
                cooldownstats.push(...stats['cooldown_time_add']);
            }
            if (source.baseCooldown !== null) {
                if ('activable' in entity) {
                    cooldownstats.push({ value: source.baseCooldown, source: entity });
                }
                else if (entity.ancestralLegacy.baseCooldown !== null) {
                    cooldownstats.push({ value: entity.ancestralLegacy.baseCooldown, source: entity });
                }
            }
            if (source.costType !== skill_cost_type_1.SkillCostType.None) {
                extraStats['cost_type'] = [{ value: skill_cost_type_1.ALL_SKILL_COST_TYPES.indexOf(source.costType), source: entity }];
            }
            extraStats['cooldown_time_add'] = cooldownstats;
            extraStats['activable_id'] = [{ value: source.id, source: entity }];
            let minCooldown = 0;
            const minCooldownStat = stats['min_cooldown_time'];
            if (minCooldownStat !== undefined && minCooldownStat.length > 0) {
                minCooldown = Math.min(...minCooldownStat.map(v => v.value));
            }
            const cooldown = Math.max(minCooldown, this.getSpecificStat(stats, data_character_stats_mapping_1.COOLDOWN_MAPPING, config, extraStats));
            result = Math.max(0, (0, math_util_1.round)(cooldown * (100 - cooldownReduction) / 100, 2));
        }
        return result;
    }
    getSkillCooldown(stats, config, skill, cooldownReduction) {
        let result = 0;
        if (skill.baseCooldown !== null) {
            const extraStats = {};
            extraStats['cost_type'] = [
                { value: skill_cost_type_1.ALL_SKILL_COST_TYPES.indexOf(skill.manaCostType), source: { skill } },
                { value: skill_cost_type_1.ALL_SKILL_COST_TYPES.indexOf(skill.lifeCostType), source: { skill } }
            ];
            if (skill.genres.includes(skill_genre_1.SkillGenre.Movement)) {
                extraStats['skill_is_movement'] = [{ source: { skill }, value: 1 }];
            }
            const masteryCooldownReduction = stats.stats.find(s => s.stat === 'mastery_cooldown_time_reduction_multiplier');
            if (masteryCooldownReduction) {
                const value = typeof masteryCooldownReduction.total === 'number' ? masteryCooldownReduction.total : masteryCooldownReduction.total.min;
                extraStats['cooldown_time_reduction_multiplier'] = [{ source: { skill }, value }];
            }
            if (skill.genres.includes(skill_genre_1.SkillGenre.Fast)) {
                extraStats['cooldown_time_add'] = [{ source: { skill }, value: constants_1.FAST_SKILL_BASE_COOLDOWN }];
            }
            else if (stats.extractedStats['cooldown_time_add']) {
                extraStats['cooldown_time_add'] = [...stats.extractedStats['cooldown_time_add']];
            }
            extraStats['skill_id'] = [{ value: skill.id, source: { skill } }];
            let minCooldown = 0;
            const minCooldownStat = stats.extractedStats['min_cooldown_time'];
            if (minCooldownStat !== undefined && minCooldownStat.length > 0) {
                minCooldown = Math.min(...minCooldownStat.map(v => v.value));
            }
            const cooldown = Math.max(minCooldown, this.getSpecificStat(stats.extractedStats, data_character_stats_mapping_1.COOLDOWN_MAPPING, config, extraStats));
            result = Math.max(0, (0, math_util_1.round)(cooldown * (100 - cooldownReduction) / 100, 2));
        }
        return result;
    }
    updateActivable(character, activable, statsResult, config) {
        const skillStats = this.getSkillStats(statsResult, character);
        const slot = this.getActivableSlot(character, activable);
        const extractedStats = this.addActivableExtraStats(statsResult, slot, activable);
        // Manabender (activable) cooldown
        if (activable.id === 2) {
            const manaRegen = character.stats.find(stat => stat.stat === 'mana_regeneration');
            const manaMax = character.stats.find(stat => stat.stat === 'max_mana');
            if (manaRegen !== undefined && manaMax !== undefined && typeof manaRegen.total === 'number' && typeof manaMax.total === 'number') {
                activable.baseCooldown = (0, math_util_1.round)(manaMax.total / manaRegen.total, 2);
            }
        }
        this.updateActivableCost(extractedStats, config, activable);
        activable.cooldown = this.getActivableCooldown(extractedStats, config, activable, skillStats.cooldownReduction.total);
        for (const value of activable.values) {
            const isSynergy = (0, utils_1.isEffectValueSynergy)(value);
            if (isSynergy || activable.id === 21) {
                if ((0, utils_1.isDamageType)(value.stat)) {
                    const additionalMultipliers = [];
                    additionalMultipliers.push(...this.getAmhenostDamageMultiplier(statsResult, slot));
                    // Unstable bones increase damage multiplier (+ bug precision)
                    if (activable.id === 18) {
                        const unstableBonesIncreasedDamages = statsResult.stats.find(stat => stat.stat === 'unstable_bones_increased_damages');
                        if (unstableBonesIncreasedDamages !== undefined) {
                            additionalMultipliers.push(...unstableBonesIncreasedDamages.values.flat.map(flat => flat.value));
                        }
                    }
                    // mini keeper increase damage multiplier (+ bug precision)
                    if (activable.id === 21) {
                        const miniKeeperIncreasedDamages = statsResult.stats.find(stat => stat.stat === 'mini_keeper_increased_damage');
                        if (miniKeeperIncreasedDamages !== undefined) {
                            additionalMultipliers.push(...miniKeeperIncreasedDamages.values.flat.map(flat => flat.value));
                        }
                    }
                    // Reaper storm increase damage multiplier
                    if (activable.id === 56) {
                        const miniKeeperIncreasedDamages = statsResult.extractedStats['reaper_storm_increased_damage'];
                        if (miniKeeperIncreasedDamages !== undefined) {
                            additionalMultipliers.push(...miniKeeperIncreasedDamages.map(flat => flat.value));
                        }
                    }
                    // mini keeper increase damage multiplier (+ bug precision)
                    if (activable.id === 32 && config.use_enemy_state) {
                        const horrifiedMaxStacksStat = statsResult.extractedStats['horrified_max_stacks'];
                        const enemyHorrifiedDamageStat = statsResult.extractedStats['horrified_stack_increased_damage'];
                        if (horrifiedMaxStacksStat !== undefined && enemyHorrifiedDamageStat !== undefined) {
                            const horrifiedMaxStacksStatValue = horrifiedMaxStacksStat[0];
                            const enemyHorrifiedDamageStatValue = enemyHorrifiedDamageStat[0];
                            if (horrifiedMaxStacksStatValue !== undefined && enemyHorrifiedDamageStatValue !== undefined) {
                                const horrifiedStacks = Math.max(0, Math.min(config.enemy_horrified_stacks, horrifiedMaxStacksStatValue.value));
                                additionalMultipliers.push(enemyHorrifiedDamageStatValue.value * horrifiedStacks);
                            }
                        }
                    }
                    if (isSynergy) {
                        this.updateDamage(value, activable.genres, skillStats, statsResult, skill_element_1.SkillElement.Neutral, false, additionalMultipliers, undefined, false);
                    }
                    else {
                        // special case mini keeper
                        const multipliers = this.getValidDamageMultipliers(activable.genres, skillStats, statsResult, value.stat, false, undefined, false);
                        value.value = (0, math_util_1.mult)(value.baseValue, ...multipliers, ...additionalMultipliers);
                        value.displayValue = (0, math_util_1.bankerRound)(value.value, 2);
                    }
                }
            }
            else if (value.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect) {
                value.value = value.baseValue * (100 + skillStats.aoeIncreasedSize.total) / 100;
                // Mana harvest increased aoe size multiplier
                if (activable.id === 13) {
                    const manaHarvestAoeIncreasedSizeValues = statsResult.extractedStats['aoe_increased_size_multiplier_mana_harvest'];
                    const manaHarvestAoeIncreasedSize = (0, utils_1.valueOrNull)(manaHarvestAoeIncreasedSizeValues !== undefined ? manaHarvestAoeIncreasedSizeValues[0] : null);
                    if (manaHarvestAoeIncreasedSize !== null) {
                        value.value = value.value * (100 + manaHarvestAoeIncreasedSize.value) / 100;
                    }
                }
                // aura increase aoe
                if (activable.genres.includes(skill_genre_1.SkillGenre.Aura)) {
                    const auraAoeIncreasedSizePercentStat = statsResult.stats.find(stat => stat.stat === 'aura_aoe_increased_size_percent');
                    if (auraAoeIncreasedSizePercentStat !== undefined) {
                        value.value = value.value * (100 + auraAoeIncreasedSizePercentStat.total) / 100;
                    }
                }
                value.displayValue = (0, math_util_1.bankerRound)(value.value, 2);
            }
            else if (value.valueType === effect_value_value_type_1.EffectValueValueType.Duration) {
                // Massacre increased duration
                if (activable.id === 31) {
                    const massacreIncreasedDurationValues = statsResult.extractedStats['massacre_increased_duration'];
                    const massacreIncreasedDuration = (0, utils_1.valueOrNull)(massacreIncreasedDurationValues !== undefined ? massacreIncreasedDurationValues[0] : null);
                    if (massacreIncreasedDuration !== null) {
                        value.value = value.value * (100 + massacreIncreasedDuration.value) / 100;
                    }
                }
                value.displayValue = (0, math_util_1.bankerRound)(value.value, 2);
            }
            else if (value.valueType !== effect_value_value_type_1.EffectValueValueType.Static) {
                const statMultipliers = this.getValidStatMultipliers(activable.genres, skillStats);
                value.value = (0, utils_1.isEffectValueVariable)(value) ? value.upgradedValue : value.baseValue;
                if (value.percent) {
                    let sumMultiplier = 100;
                    for (const multiplier of statMultipliers) {
                        sumMultiplier += multiplier;
                    }
                    value.value = value.value * sumMultiplier / 100;
                }
                else {
                    for (const multiplier of statMultipliers) {
                        value.value = value.value * (100 + multiplier) / 100;
                    }
                }
                value.displayValue = (0, math_util_1.round)(value.value, 3);
            }
        }
    }
    getActivableSlot(character, activable) {
        let slot = null;
        if (character.activable1 === activable) {
            slot = 1;
        }
        else if (character.activable2 === activable) {
            slot = 2;
        }
        else if (character.activable3 === activable) {
            slot = 3;
        }
        else if (character.activable4 === activable) {
            slot = 4;
        }
        return slot;
    }
    addActivableExtraStats(statsResult, slot, activable) {
        let extractedStats = statsResult.extractedStats;
        if (slot !== null) {
            const extra = {
                'activable_slot': [{ source: { synergy: 'Activable slot' }, value: slot }]
            };
            const nonSecondSlotActivableCostReduction = statsResult.stats.find(stat => stat.stat === 'non_second_slot_activable_cost_reduction');
            if (nonSecondSlotActivableCostReduction) {
                const value = typeof nonSecondSlotActivableCostReduction.total === 'number'
                    ? nonSecondSlotActivableCostReduction.total
                    : nonSecondSlotActivableCostReduction.total.min;
                extra['non_second_slot_activable_cost_reduction'] = [
                    { source: { synergy: 'Istrahsil non second slot effect' }, value }
                ];
            }
            const nonFirstSlotCooldownReductionGlobalMult = statsResult.stats.find(stat => stat.stat === 'non_first_slot_cooldown_reduction_global_mult');
            if (nonFirstSlotCooldownReductionGlobalMult) {
                const value = typeof nonFirstSlotCooldownReductionGlobalMult.total === 'number'
                    ? nonFirstSlotCooldownReductionGlobalMult.total
                    : nonFirstSlotCooldownReductionGlobalMult.total.min;
                extra['non_first_slot_cooldown_reduction_global_mult'] = [
                    { source: { synergy: 'Odhor non first slot effect' }, value }
                ];
            }
            extractedStats = {
                ...extractedStats,
                ...extra,
            };
        }
        return extractedStats;
    }
    updateAncestralLegacyActivable(character, config, ancestralLegacy, statsResult) {
        const skillStats = this.getSkillStats(statsResult, character);
        const slot = this.getActivableSlot(character, ancestralLegacy);
        const extractedStats = this.addActivableExtraStats(statsResult, slot, ancestralLegacy);
        if (ancestralLegacy.currentRankCost !== null) {
            this.updateActivableCost(extractedStats, config, ancestralLegacy);
        }
        if (ancestralLegacy.baseCooldown !== null) {
            ancestralLegacy.cooldown = this.getActivableCooldown(extractedStats, config, ancestralLegacy, skillStats.cooldownReduction.total);
        }
        const isIcyVeins = ancestralLegacy.id === 29;
        const isConsistencyIsKey = ancestralLegacy.id === 31;
        const isWildSlap = ancestralLegacy.id === 92;
        for (const value of ancestralLegacy.values) {
            if ((0, utils_1.isEffectValueSynergy)(value)) {
                let multipliers = [];
                multipliers.push(...this.getAmhenostDamageMultiplier(statsResult, slot));
                // spark machine and high voltage interaction
                if (ancestralLegacy.id === 30) {
                    const highVoltageMaxStacks = extractedStats['high_voltage_max_stacks'];
                    const highVoltageStackIncreasedDamage = extractedStats['high_voltage_stack_spark_machine_increased_damage'];
                    if (highVoltageMaxStacks && highVoltageMaxStacks[0] && highVoltageStackIncreasedDamage && highVoltageStackIncreasedDamage[0]) {
                        multipliers.push(highVoltageStackIncreasedDamage[0].value * Math.min(config.high_voltage_stacks, highVoltageMaxStacks[0].value));
                    }
                }
                if ((0, utils_1.isDamageType)(value.stat)) {
                    this.updateDamage(value, ancestralLegacy.genres, skillStats, statsResult, ancestralLegacy.element, false, multipliers, undefined, false);
                }
            }
            else if (value.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect) {
                value.value = value.baseValue;
                // aura increase aoe
                if (ancestralLegacy.genres.includes(skill_genre_1.SkillGenre.Aura)) {
                    const auraAoeIncreasedSizePercentStat = statsResult.stats.find(stat => stat.stat === 'aura_aoe_increased_size_percent');
                    if (auraAoeIncreasedSizePercentStat !== undefined) {
                        value.value = value.value * (100 + auraAoeIncreasedSizePercentStat.total) / 100;
                    }
                }
                value.value = value.value * (100 + skillStats.aoeIncreasedSize.total) / 100;
                value.displayValue = (0, math_util_1.bankerRound)(value.value, 2);
            }
            else if (value.valueType === effect_value_value_type_1.EffectValueValueType.Duration) {
                value.value = value.baseValue;
                if (value.stat === 'avatar_of_shadow_duration') {
                    const avatarOfShadowDurationAdd = extractedStats['avatar_of_shadow_duration_add'];
                    if (avatarOfShadowDurationAdd !== undefined) {
                        for (const addedValue of avatarOfShadowDurationAdd) {
                            value.value = value.value + addedValue.value;
                        }
                    }
                }
                value.displayValue = (0, math_util_1.bankerRound)(value.value, 2);
            }
            else if (value.valueType !== effect_value_value_type_1.EffectValueValueType.Static && !isIcyVeins) {
                const statMultipliers = this.getValidStatMultipliers(ancestralLegacy.genres, skillStats);
                value.value = (0, utils_1.isEffectValueVariable)(value) ? value.upgradedValue : value.baseValue;
                if (value.percent) {
                    if (!isWildSlap) {
                        let sumMultiplier = 100;
                        for (const multiplier of statMultipliers) {
                            if (isConsistencyIsKey) {
                                sumMultiplier -= multiplier;
                            }
                            else {
                                sumMultiplier += multiplier;
                            }
                        }
                        value.value = value.value * Math.max(0, sumMultiplier) / 100;
                        if (isConsistencyIsKey) {
                            value.value = Math.max(1, value.value);
                        }
                    }
                }
                else {
                    for (const multiplier of statMultipliers) {
                        value.value = value.value * (100 + multiplier) / 100;
                    }
                }
                value.displayValue = (0, math_util_1.round)(value.value, 3);
            }
            if (ancestralLegacy.id === 1) {
                const auraReduction = Math.min(50, skillStats.auraIncreasedEffect.total);
                const value = ancestralLegacy.values[0];
                value.value = value.upgradedValue * (100 - auraReduction) / 100;
                value.displayValue = (0, math_util_1.round)(value.value, 3);
            }
        }
    }
    updateSkillAndUpgradeValues(character, skillAndUpgrades, stats, config) {
        const skillStats = this.getSkillStats(stats, character);
        this.updateSkillValues(skillAndUpgrades, skillStats, stats, config);
        // hack to add multiply and conquer bug
        if (skillAndUpgrades.skill.heroClass === hero_class_1.HeroClass.Huntress && skillAndUpgrades.skill.id === 5 && skillAndUpgrades.activeUpgrades.includes(45) && skillAndUpgrades.activeUpgrades.includes(52)) {
            const critChanceToRemove = skillAndUpgrades.upgrades.find(u => u.id === 45)?.values[0]?.value;
            const multiplyAndConquerSynergy = skillAndUpgrades.upgrades.find(u => u.id === 52)?.values[0];
            multiplyAndConquerSynergy.synergy -= critChanceToRemove;
            multiplyAndConquerSynergy.displaySynergy -= critChanceToRemove;
        }
        for (const upgrade of skillAndUpgrades.upgrades) {
            this.updateUpgradeValues(upgrade, skillStats, stats);
        }
        return [];
    }
    precomputeRunePowerAndEffect(character, additionalRunes, stats, config) {
        const allRunes = [character.runes.activation, character.runes.effect, character.runes.enhancement, ...additionalRunes].filter(utils_1.isNotNullOrUndefined);
        // trouver pourquoi ça déconne ici
        let reduced_power = stats.extractedStats['effect_rune_reduced_power'] ? (0, utils_1.valueOrNull)(stats.extractedStats['effect_rune_reduced_power'][0]?.value) : null;
        // utiliser effect_rune_increased_power une fois le bug corrigé
        const increased_power = stats.extractedStats['effect_rune_increased_effect'] ? (0, utils_1.valueOrNull)(stats.extractedStats['effect_rune_increased_effect'][0]?.value) : null;
        const power_override = stats.extractedStats['rune_power_override'] ? (0, utils_1.valueOrNull)(stats.extractedStats['rune_power_override'][0]?.value) : null;
        if (reduced_power !== null) {
            let enhancement_rune_increased_effect = stats.stats.find(stat => stat.stat === 'enhancement_rune_increased_effect');
            if (enhancement_rune_increased_effect) {
                reduced_power = reduced_power * (100 + enhancement_rune_increased_effect.total) / 100;
            }
        }
        for (const rune of allRunes) {
            if ((0, rune_type_1.isEffectRune)(rune)) {
                if (reduced_power !== null) {
                    rune.constraint = (0, math_util_1.bankerRound)(rune.baseConstraint * (100 - reduced_power) / 100, 2);
                }
                else if (increased_power !== null) {
                    rune.constraint = (0, math_util_1.bankerRound)(rune.baseConstraint * (100 + increased_power) / 100, 2);
                }
                else if (power_override !== null) {
                    rune.constraint = power_override;
                }
                stats.changed.runes.push(rune);
            }
        }
        const power = character.runes.effect !== null ? character.runes.effect.constraint : 100;
        const powerMultiplier = power / 100;
        const effectMultiplier = (100 + (0, utils_1.valueOrDefault)(stats.stats.find(stat => stat.stat === 'effect_rune_effect')?.total, 100)) / 100;
        const ignoredEffectMultiplierStats = [
            'inner_fire_chance_percent',
            'firework_trigger_chance',
            'brut_chance_percent',
            'crit_chance_percent',
            'unrelenting_stacks_max',
            'min_basic_damage_add',
            'afflict_chance',
            'afflict_duration',
            'alpha_omega_mana_treshold',
            'alpha_omega_increased_damage',
            'alpha_omega_increased_size',
            'prime_totem_shoot_count',
            'prime_totem_duration',
            'mana_harvest_duration',
            'cooldown_reduction_per_walk',
            'cooldown_reduction_per_walk_distance',
            'max_skeleton_count',
        ];
        for (const rune of allRunes) {
            let changed = false;
            if (rune.activable !== null && rune.id === 4 && rune.activable.baseCooldown !== null) {
                const durationReduction = rune.values[0];
                if (durationReduction) {
                    rune.activable.baseCooldown = (rune.activable.baseCooldown - durationReduction.value) * powerMultiplier;
                    changed = true;
                }
            }
            if (rune.type === rune_type_1.RuneType.Activation) {
                for (const effectValue of rune.values) {
                    if (((0, utils_1.isEffectValueVariable)(effectValue) || (0, utils_1.isEffectValueSynergy)(effectValue))) {
                        this.slormancerEffectValueService.updateRuneEffectValue(effectValue, rune.level, powerMultiplier);
                        changed = true;
                    }
                }
            }
            if (rune.type === rune_type_1.RuneType.Effect) {
                for (const effectValue of rune.values) {
                    if ((0, utils_1.isEffectValueVariable)(effectValue) || (0, utils_1.isEffectValueSynergy)(effectValue)) {
                        if (!ignoredEffectMultiplierStats.includes(effectValue.stat) && (!(0, utils_1.isEffectValueSynergy)(effectValue) || (effectValue.source !== 'victims_current_reaper' && effectValue.source !== 'max_mana'))) {
                            // thornbite only has 75% of the effect it should have
                            const thornbiteBugMultiplier = rune.id === 12 ? 0.75 : 1;
                            this.slormancerEffectValueService.updateRuneEffectValue(effectValue, rune.level, effectMultiplier * thornbiteBugMultiplier);
                            changed = true;
                        }
                    }
                }
            }
            if (rune.id === 22) {
                for (const effectValue of rune.values) {
                    if ((0, utils_1.isEffectValueVariable)(effectValue) && effectValue.stat === 'effect_rune_trigger_chance') {
                        const triggerMultiplier = 1 + (100 - power) / 200;
                        this.slormancerEffectValueService.updateRuneEffectValue(effectValue, rune.level, triggerMultiplier);
                        changed = true;
                    }
                }
            }
            if (changed) {
                stats.changed.runes.push(rune);
            }
        }
    }
    updateRuneValues(character, additionalRunes, stats, config) {
        const skillStats = this.getSkillStats(stats, character);
        const allRunes = [character.runes.activation, character.runes.effect, character.runes.enhancement, ...additionalRunes].filter(utils_1.isNotNullOrUndefined);
        for (const rune of allRunes) {
            let changed = false;
            for (const effectValue of rune.values) {
                if (effectValue.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect) {
                    const aoeMultiplier = skillStats.aoeIncreasedSize.total;
                    effectValue.value = effectValue.baseValue * (100 + aoeMultiplier) / 100;
                    effectValue.displayValue = (0, math_util_1.bankerRound)(effectValue.value, 2);
                    changed = true;
                }
            }
            if (rune.id === 16) {
                const canonDamage = rune.values[1];
                const maxCanonDamage = rune.values[0];
                if (canonDamage && maxCanonDamage) {
                    canonDamage.displaySynergy = Math.min(canonDamage.displaySynergy, maxCanonDamage.displayValue);
                    changed = true;
                }
            }
            if (changed) {
                stats.changed.runes.push(rune);
            }
        }
    }
    updateLegendaryValues(character, legendaryEffect, stats) {
        let changed = false;
        const skillStats = this.getSkillStats(stats, character);
        for (const effect of legendaryEffect.effects) {
            const value = effect.effect;
            if (value.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect) {
                if ((0, utils_1.isEffectValueSynergy)(value)) {
                    const precision = (0, utils_1.valueOrDefault)(value.precision, 0);
                    if (typeof value.synergy === 'number') {
                        value.synergy = value.synergy * (100 + skillStats.aoeIncreasedEffect.total) / 100;
                        value.displaySynergy = (0, math_util_1.bankerRound)(value.synergy, precision);
                    }
                    else {
                        value.synergy.min = value.synergy.min * (100 + skillStats.aoeIncreasedEffect.total) / 100;
                        value.synergy.max = value.synergy.max * (100 + skillStats.aoeIncreasedEffect.total) / 100;
                        value.displaySynergy = {
                            min: (0, math_util_1.bankerRound)(value.synergy.min, precision),
                            max: (0, math_util_1.bankerRound)(value.synergy.max, precision)
                        };
                    }
                }
                else {
                    value.value = value.baseValue * (100 + skillStats.aoeIncreasedSize.total) / 100;
                    value.displayValue = (0, math_util_1.bankerRound)(value.value, 2);
                }
                changed = true;
            }
        }
        return changed;
    }
    spreadAdditionalDamages(damages, additional) {
        if (typeof additional === 'number' && additional > 0 || typeof additional !== 'number' && (additional.min > 0 || additional.max > 0)) {
            const averageDamages = damages.map(v => typeof v.synergy === 'number' ? v.synergy : ((v.synergy.min + v.synergy.max) / 2));
            const totalDamages = averageDamages.reduce((t, v) => t + v, 0);
            damages.forEach((synergy, index) => {
                const ratio = totalDamages === 0 ? 1 / damages.length : averageDamages[index] / totalDamages;
                const additionalDamages = typeof additional === 'number' ? additional * ratio : { min: additional.min * ratio, max: additional.max * ratio };
                synergy.synergy = (0, math_util_1.add)(synergy.synergy, additionalDamages);
            });
        }
    }
    updateDamage(damage, genres, skillStats, statsResult, element, isSkill = false, additionalMultipliers = [], addedFlatDamage = 0, isDirectDamage = false) {
        const multipliers = this.getValidDamageMultipliers(genres, skillStats, statsResult, damage.stat, isSkill, element, isDirectDamage);
        addedFlatDamage = (0, math_util_1.mult)(addedFlatDamage, ...multipliers, ...additionalMultipliers);
        if (typeof addedFlatDamage === 'number') {
            addedFlatDamage = { min: addedFlatDamage, max: addedFlatDamage };
        }
        if (element === skill_element_1.SkillElement.Lightning && typeof damage.synergy === 'number') {
            damage.synergy = {
                min: damage.synergy,
                max: damage.synergy
            };
        }
        if (typeof damage.synergy === 'number') {
            for (const multiplier of multipliers) {
                damage.synergy = damage.synergy * (100 + multiplier) / 100;
            }
            for (const multiplier of additionalMultipliers) {
                damage.synergy = damage.synergy * (100 + multiplier) / 100;
            }
            damage.displaySynergy = (0, math_util_1.bankerRound)(damage.synergy, (0, utils_1.valueOrDefault)(damage.precision, 0));
        }
        else {
            for (const multiplier of multipliers) {
                damage.synergy.min = damage.synergy.min * (100 + multiplier) / 100;
                damage.synergy.max = damage.synergy.max * (100 + multiplier) / 100;
            }
            for (const multiplier of additionalMultipliers) {
                damage.synergy.min = damage.synergy.min * (100 + multiplier) / 100;
                damage.synergy.max = damage.synergy.max * (100 + multiplier) / 100;
            }
            if (isSkill) {
                for (const maxMultiplier of skillStats.skillIncreasedDamage.values.maxMultiplier) {
                    damage.synergy.max = damage.synergy.max * (100 + maxMultiplier.value) / 100;
                }
            }
            let minimumDamage = 0;
            if (element === skill_element_1.SkillElement.Lightning) {
                damage.synergy.min = 1;
                const value = statsResult.stats.find(v => v.stat === 'lightning_upper_damage_range');
                if (value && value.total > 0) {
                    // Bug max reaper damage ignored for consistency is key
                    const splitReaperToPhysicalAndElement = statsResult.extractedStats['reaper_split_to_physical_and_element'] !== undefined;
                    const addReaperToElements = statsResult.extractedStats['reaper_added_to_elements'] !== undefined;
                    let reaperDamageRatio = 0;
                    if (splitReaperToPhysicalAndElement) {
                        reaperDamageRatio += 0.5;
                    }
                    if (addReaperToElements) {
                        reaperDamageRatio += 1;
                    }
                    const reaper = statsResult.stats.find(v => v.stat === 'weapon_damage');
                    const reaperMaximumDamage = reaper ? (typeof reaper.total === 'number' ? reaper.total : reaper.total.max) * damage.value / 100 : 0;
                    minimumDamage = ((damage.synergy.max - reaperMaximumDamage * reaperDamageRatio) * (100 - value.total) / 100) + addedFlatDamage.min;
                }
            }
            damage.displaySynergy = {
                min: (0, math_util_1.bankerRound)(Math.max(minimumDamage, damage.synergy.min + addedFlatDamage.min), (0, utils_1.valueOrDefault)(damage.precision, 0)),
                max: (0, math_util_1.bankerRound)(damage.synergy.max + addedFlatDamage.max, (0, utils_1.valueOrDefault)(damage.precision, 0)),
            };
        }
    }
    updateDuration(duration, genres, skillStats) {
        const durationMultipliers = this.getValidDurationMultipliers(genres, skillStats);
        duration.value = duration.baseValue;
        if (duration.stat === 'skill_duration') {
            duration.value = this.slormancerMergedStatUpdaterService.applyMergedStatToValue(duration.value, skillStats.additionalDuration);
        }
        for (const multiplier of durationMultipliers) {
            duration.value = duration.value * (100 + multiplier) / 100;
        }
        duration.value = Math.max(0, duration.value);
        duration.displayValue = (0, math_util_1.round)(duration.value, 2);
    }
    updateSkillCost(skillAndUpgrades, skillStats, statsResult, config) {
        const manaCostAdd = [];
        const lifeCostAdd = [];
        const entity = { skill: skillAndUpgrades.skill };
        const convertManaToLifeCost = statsResult.extractedStats['mana_cost_to_life_cost'] && config.has_life_bargain_buff;
        const convertSkillManaToLifeCost = statsResult.extractedStats['skill_mana_cost_to_life_cost'];
        const addManaCostToLifeCost = statsResult.extractedStats['add_life_cost_to_mana_cost'];
        const noLongerCostPersecond = statsResult.extractedStats['no_longer_cost_per_second'] !== undefined;
        let skillHasNoCost = (statsResult.extractedStats['last_cast_tormented_remove_cost'] !== undefined && config.last_cast_tormented)
            || (statsResult.extractedStats['no_cost_if_tormented'] !== undefined && config.serenity <= 0);
        this.slormancerSkillService.updateSkillCost(skillAndUpgrades.skill);
        if (skillHasNoCost) {
            skillAndUpgrades.skill.hasNoCost = true;
        }
        if (noLongerCostPersecond) {
            if (skillAndUpgrades.skill.manaCostType === skill_cost_type_1.SkillCostType.ManaSecond) {
                skillAndUpgrades.skill.manaCostType = skill_cost_type_1.SkillCostType.Mana;
            }
            if (skillAndUpgrades.skill.lifeCostType === skill_cost_type_1.SkillCostType.LifeSecond) {
                skillAndUpgrades.skill.lifeCostType = skill_cost_type_1.SkillCostType.Life;
            }
        }
        if (addManaCostToLifeCost) {
            lifeCostAdd.push({ value: Math.max(0, skillStats.mana.total), source: entity });
            if (skillAndUpgrades.skill.manaCostType === skill_cost_type_1.SkillCostType.ManaPercent) {
                skillAndUpgrades.skill.lifeCostType = skill_cost_type_1.SkillCostType.LifePercent;
            }
            if (skillAndUpgrades.skill.manaCostType === skill_cost_type_1.SkillCostType.Mana) {
                skillAndUpgrades.skill.lifeCostType = skill_cost_type_1.SkillCostType.Life;
            }
        }
        if (convertManaToLifeCost || convertSkillManaToLifeCost) {
            lifeCostAdd.push({ value: Math.max(0, skillStats.mana.total), source: entity });
            if (skillAndUpgrades.skill.manaCostType === skill_cost_type_1.SkillCostType.ManaPercent) {
                skillAndUpgrades.skill.lifeCostType = skill_cost_type_1.SkillCostType.LifePercent;
                skillAndUpgrades.skill.manaCostType = skill_cost_type_1.SkillCostType.None;
            }
            if (skillAndUpgrades.skill.manaCostType === skill_cost_type_1.SkillCostType.Mana) {
                skillAndUpgrades.skill.lifeCostType = skill_cost_type_1.SkillCostType.Life;
                skillAndUpgrades.skill.manaCostType = skill_cost_type_1.SkillCostType.None;
            }
            if (convertSkillManaToLifeCost && skillAndUpgrades.skill.manaCostType === skill_cost_type_1.SkillCostType.ManaSecond) {
                skillAndUpgrades.skill.lifeCostType = skill_cost_type_1.SkillCostType.LifeSecond;
                skillAndUpgrades.skill.manaCostType = skill_cost_type_1.SkillCostType.None;
            }
        }
        else {
            manaCostAdd.push({ value: Math.max(0, skillStats.mana.total), source: entity });
        }
        const manaExtraStats = {
            mana_cost_add: manaCostAdd,
            cost_type: [{ value: skill_cost_type_1.ALL_SKILL_COST_TYPES.indexOf(skillAndUpgrades.skill.manaCostType), source: entity }],
        };
        skillAndUpgrades.skill.manaCost = Math.max(0, this.getSpecificStat(statsResult.extractedStats, data_character_stats_mapping_1.MANA_COST_MAPPING, config, manaExtraStats));
        lifeCostAdd.push({ value: Math.max(0, skillStats.life.total), source: entity });
        const expectdLifeCostType = skillAndUpgrades.skill.manaCostType === skill_cost_type_1.SkillCostType.Mana ? skill_cost_type_1.SkillCostType.Life : skillAndUpgrades.skill.lifeCostType;
        const lifeExtraStats = {
            life_cost_add: lifeCostAdd,
            cost_type: [{ value: skill_cost_type_1.ALL_SKILL_COST_TYPES.indexOf(expectdLifeCostType), source: entity }],
        };
        skillAndUpgrades.skill.lifeCost = Math.max(0, this.getSpecificStat(statsResult.extractedStats, data_character_stats_mapping_1.LIFE_COST_MAPPING, config, lifeExtraStats));
        if (skillAndUpgrades.skill.lifeCost > 0) {
            skillAndUpgrades.skill.hasLifeCost = skillAndUpgrades.skill.lifeCost > 0;
            skillAndUpgrades.skill.lifeCostType = expectdLifeCostType;
        }
        this.slormancerSkillService.updateSkillCostType(skillAndUpgrades.skill);
    }
    updateSkillValues(skillAndUpgrades, skillStats, statsResult, config) {
        const isNonSupportSkill = skillAndUpgrades.skill.specialization === null;
        this.updateSkillCost(skillAndUpgrades, skillStats, statsResult, config);
        skillAndUpgrades.skill.cooldown = this.getSkillCooldown(statsResult, config, skillAndUpgrades.skill, skillStats.cooldownReduction.total);
        const damageValues = skillAndUpgrades.skill.values.filter(utils_1.isEffectValueSynergy).filter(value => (0, utils_1.isDamageType)(value.stat));
        if (damageValues.length > 0) {
            this.spreadAdditionalDamages(damageValues.filter(damage => damage.stat !== 'bleed_damage'), skillStats.additionalDamages.total);
            if (skillAndUpgrades.skill.heroClass === hero_class_1.HeroClass.Warrior && skillAndUpgrades.skill.id === 10) {
                const trainingLanceAdditionalDamage = statsResult.stats.find(mergedStat => mergedStat.stat === 'training_lance_additional_damage');
                const elderLanceAdditionalDamage = statsResult.stats.find(mergedStat => mergedStat.stat === 'elder_lance_additional_damage');
                const trainingLanceDamage = skillAndUpgrades.skill.values[0];
                const elderLanceDamage = skillAndUpgrades.skill.values[1];
                if (trainingLanceAdditionalDamage && trainingLanceDamage) { // 123
                    // equivalent a simplement changer la base value et upgrade
                    if (statsResult.extractedStats['add_twice_elder_lance_to_training_lance'] !== undefined && elderLanceDamage && skillAndUpgrades.activeUpgrades.includes(123)) {
                        trainingLanceAdditionalDamage.total = (0, math_util_1.add)(trainingLanceAdditionalDamage.total, (0, math_util_1.add)(elderLanceDamage.synergy, elderLanceDamage.synergy));
                    }
                    this.spreadAdditionalDamages([trainingLanceDamage], trainingLanceAdditionalDamage.total);
                }
                if (elderLanceAdditionalDamage && elderLanceDamage) {
                    this.spreadAdditionalDamages([elderLanceDamage], elderLanceAdditionalDamage.total);
                }
            }
            if (skillAndUpgrades.skill.heroClass === hero_class_1.HeroClass.Huntress && skillAndUpgrades.skill.id === 7) {
                const swiftAsTheWind = skillAndUpgrades.upgrades.find(upgrade => upgrade.id === 84);
                if (swiftAsTheWind && skillAndUpgrades.activeUpgrades.includes(swiftAsTheWind.id)) {
                    const latentStormAdditionalDamage = swiftAsTheWind.values
                        .filter(utils_1.isEffectValueSynergy)
                        .find(value => value.stat === 'latent_storm_additional_damage');
                    if (latentStormAdditionalDamage) {
                        const latentStormDamage = skillAndUpgrades.skill.values[1];
                        this.spreadAdditionalDamages([latentStormDamage], latentStormAdditionalDamage.synergy);
                    }
                }
            }
            for (const damageValue of damageValues) {
                const additionamMultipliers = [];
                if (skillAndUpgrades.skill.heroClass == hero_class_1.HeroClass.Warrior && skillAndUpgrades.skill.id === 6 && damageValues.indexOf(damageValue) === 0) {
                    const stat = statsResult.stats.find(mergedStat => mergedStat.stat === 'non_magnified_increased_damage_mult');
                    if (stat) {
                        additionamMultipliers.push(stat.total);
                    }
                }
                if (skillAndUpgrades.skill.heroClass === hero_class_1.HeroClass.Warrior && skillAndUpgrades.skill.id === 10) {
                    if (skillAndUpgrades.skill.values.indexOf(damageValue) === 1) {
                        const elderLanceIncreasedDamage = statsResult.stats.find(mergedStat => mergedStat.stat === 'elder_lance_increased_damage');
                        if (elderLanceIncreasedDamage) {
                            additionamMultipliers.push(...elderLanceIncreasedDamage.values.multiplier.map(v => v.value));
                        }
                    }
                }
                if (damageValue.stat === 'elemental_damage') {
                    const elementalMultipliers = statsResult.extractedStats['skill_elemental_damage_mult'];
                    if (elementalMultipliers) {
                        additionamMultipliers.push(...elementalMultipliers.map(v => v.value));
                    }
                    const elementalMultiplierSynergy = statsResult.stats.find(stat => stat.stat === 'skill_elemental_damage_mult');
                    if (elementalMultiplierSynergy) {
                        additionamMultipliers.push(elementalMultiplierSynergy.total);
                    }
                }
                if (damageValue.stat === 'wandering_arrow_damage') {
                    additionamMultipliers.push(skillStats.minionIncreasedDamage.total);
                }
                if (damageValue.stat === 'physical_damage') {
                    const physicalMultipliers = statsResult.extractedStats['skill_physical_damage_mult'];
                    if (physicalMultipliers) {
                        additionamMultipliers.push(...physicalMultipliers.map(v => v.value));
                    }
                }
                this.updateDamage(damageValue, skillAndUpgrades.skill.genres, skillStats, statsResult, skill_element_1.SkillElement.Neutral, true, additionamMultipliers, 0, isNonSupportSkill);
            }
        }
        const durationValues = skillAndUpgrades.skill.values.filter(value => value.valueType === effect_value_value_type_1.EffectValueValueType.Duration);
        for (const durationValue of durationValues) {
            this.updateDuration(durationValue, skillAndUpgrades.skill.genres, skillStats);
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.AreaOfEffect)) {
            const aoeValues = skillAndUpgrades.skill.values.filter(value => value.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
            if (aoeValues.length > 0) {
                for (const value of aoeValues) {
                    value.value = value.baseValue * (100 + skillStats.aoeIncreasedSize.total) / 100;
                    for (const multiplier of skillStats.skillIncreasedAoe.values.multiplier) {
                        value.value = value.value * (100 + multiplier.value) / 100;
                    }
                    value.displayValue = (0, math_util_1.round)(value.value, 2);
                }
            }
        }
        const climaxValue = skillAndUpgrades.skill.values.find(value => value.stat === 'climax_increased_damage');
        if (climaxValue) {
            const climaxAdd = (0, utils_1.valueOrDefault)(statsResult.extractedStats['climax_increased_damage_add'], []);
            climaxValue.value = climaxAdd.reduce((t, v) => t + v.value, climaxValue.baseValue);
            climaxValue.displayValue = (0, math_util_1.round)(climaxValue.value, 3);
        }
        const voidArrowCountValue = skillAndUpgrades.skill.values.find(value => value.stat === 'void_arrow_count_if_fully_charged');
        if (voidArrowCountValue) {
            const voidArrowCountOverride = (0, utils_1.valueOrDefault)(statsResult.extractedStats['void_arrow_count_if_fully_charged_override'], [])[0];
            if (voidArrowCountOverride) {
                voidArrowCountValue.displayValue = voidArrowCountOverride.value;
            }
            else {
                voidArrowCountValue.displayValue = voidArrowCountValue.value;
            }
        }
        const instructionsValue = skillAndUpgrades.skill.values.find(value => value.stat === 'instructions');
        if (instructionsValue && (0, utils_1.isEffectValueVariable)(instructionsValue)) {
            this.slormancerEffectValueService.updateEffectValue(instructionsValue, skillAndUpgrades.skill.level);
            const instructionsTotal = (0, utils_1.valueOrDefault)(statsResult.stats.find(stat => stat.stat === 'additional_instructions')?.total, 0);
            instructionsValue.value += instructionsTotal;
            instructionsValue.displayValue = (0, math_util_1.round)(instructionsValue.value, 3);
        }
        const cadenceCastCount = skillAndUpgrades.skill.values.find(value => value.stat === 'cadence_cast_count');
        if (cadenceCastCount && (0, utils_1.isEffectValueConstant)(cadenceCastCount)) {
            const cadenceCastCountNewvalue = statsResult.extractedStats['cadence_cast_count_new_value'];
            if (cadenceCastCountNewvalue && cadenceCastCountNewvalue[0] !== undefined) {
                cadenceCastCount.value = cadenceCastCountNewvalue[0].value;
            }
            else {
                cadenceCastCount.value = cadenceCastCount.baseValue;
            }
            cadenceCastCount.displayValue = (0, math_util_1.round)(cadenceCastCount.value, 3);
        }
        if (statsResult.extractedStats['pierce_fork_rebound_is_highest']) {
            const forkChance = statsResult.stats.find(value => value.stat === 'fork_chance');
            const chanceToRebound = statsResult.stats.find(value => value.stat === 'chance_to_rebound');
            const chanceToPierce = statsResult.stats.find(value => value.stat === 'chance_to_pierce');
            if (forkChance && chanceToPierce && chanceToRebound) {
                const newTotal = Math.max(forkChance.total, chanceToRebound.total, chanceToPierce.total);
                forkChance.total = newTotal;
                chanceToRebound.total = newTotal;
                chanceToPierce.total = newTotal;
            }
        }
    }
    updateUpgradeValues(upgrade, skillStats, statsResult) {
        const damageValues = upgrade.values.filter(utils_1.isEffectValueSynergy).filter(value => (0, utils_1.isDamageType)(value.stat));
        for (const damageValue of damageValues) {
            this.updateDamage(damageValue, upgrade.genres, skillStats, statsResult, skill_element_1.SkillElement.Neutral, undefined, undefined, undefined, false);
        }
        const durationValues = upgrade.values.filter(value => value.valueType === effect_value_value_type_1.EffectValueValueType.Duration);
        for (const durationValue of durationValues) {
            this.updateDuration(durationValue, upgrade.genres, skillStats);
        }
        if (upgrade.genres.includes(skill_genre_1.SkillGenre.AreaOfEffect)) {
            const aoeValues = upgrade.values.filter(value => value.valueType === effect_value_value_type_1.EffectValueValueType.AreaOfEffect);
            for (const value of aoeValues) {
                let base;
                let precision;
                if ((0, utils_1.isEffectValueVariable)(value)) {
                    base = value.upgradedValue;
                    precision = 3;
                }
                else {
                    base = value.baseValue;
                    precision = 2;
                }
                value.value = base * (100 + skillStats.aoeIncreasedSize.total) / 100;
                value.displayValue = (0, math_util_1.round)(value.value, precision);
            }
        }
    }
    getAmhenostDamageMultiplier(stats, slot) {
        let multipliers = [];
        if (slot !== null) {
            const thirdSlotIncreasedDamage = stats.extractedStats['thirst_slot_increased_damage'];
            const nonThirdSlotIncreasedDamage = stats.stats.find(stat => stat.stat === 'non_thirst_slot_increased_damage');
            if (thirdSlotIncreasedDamage && slot === 3) {
                multipliers.push(...thirdSlotIncreasedDamage.map(flat => flat.value));
            }
            else if (nonThirdSlotIncreasedDamage && slot !== 3) {
                multipliers.push(...nonThirdSlotIncreasedDamage.values.flat.map(flat => flat.value));
            }
        }
        return multipliers;
    }
};
SlormancerValueUpdaterService = __decorate([
    (0, core_1.Injectable)()
], SlormancerValueUpdaterService);
exports.SlormancerValueUpdaterService = SlormancerValueUpdaterService;
//# sourceMappingURL=slormancer-value-updater.service.js.map