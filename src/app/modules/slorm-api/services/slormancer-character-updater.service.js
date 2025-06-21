"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerCharacterUpdaterService = void 0;
const core_1 = require("@angular/core");
const common_1 = require("../constants/common");
const data_hero_base_stats_1 = require("../constants/content/data/data-hero-base-stats");
const model_1 = require("../model");
const attribute_1 = require("../model/content/enum/attribute");
const gear_slot_1 = require("../model/content/enum/gear-slot");
const reaper_smith_1 = require("../model/content/enum/reaper-smith");
const skill_genre_1 = require("../model/content/enum/skill-genre");
const skill_element_1 = require("../model/content/skill-element");
const util_1 = require("../util");
const utils_1 = require("../util/utils");
let SlormancerCharacterUpdaterService = class SlormancerCharacterUpdaterService {
    constructor(slormancerAttributeService, slormancerAncestralLegacyService, slormancerTranslateService, slormancerStatsService, slormancerSkillService, slormancerReaperService, slormancerItemService, slormancerActivableService, slormancerMechanicService, slormancerClassMechanicService, slormancerRuneService, slormancerValueUpdater, slormancerSynergyResolverService, slormancerAncestralLegacyNodesService, slormancerMightService, slormancerUltimatumService) {
        this.slormancerAttributeService = slormancerAttributeService;
        this.slormancerAncestralLegacyService = slormancerAncestralLegacyService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerStatsService = slormancerStatsService;
        this.slormancerSkillService = slormancerSkillService;
        this.slormancerReaperService = slormancerReaperService;
        this.slormancerItemService = slormancerItemService;
        this.slormancerActivableService = slormancerActivableService;
        this.slormancerMechanicService = slormancerMechanicService;
        this.slormancerClassMechanicService = slormancerClassMechanicService;
        this.slormancerRuneService = slormancerRuneService;
        this.slormancerValueUpdater = slormancerValueUpdater;
        this.slormancerSynergyResolverService = slormancerSynergyResolverService;
        this.slormancerAncestralLegacyNodesService = slormancerAncestralLegacyNodesService;
        this.slormancerMightService = slormancerMightService;
        this.slormancerUltimatumService = slormancerUltimatumService;
        this.LEVEL_LABEL = this.slormancerTranslateService.translate('level').toLowerCase();
    }
    applyReaperAffinities(character, reaper, config) {
        const items = gear_slot_1.ALL_GEAR_SLOT_VALUES.map(slot => character.gear[slot]).filter(utils_1.isNotNullOrUndefined);
        let bonusAffinity = 0;
        for (const item of items) {
            if (item.reaperEnchantment !== null && item.reaperEnchantment.craftedReaperSmith == reaper.smith.id) {
                bonusAffinity += item.reaperEnchantment.craftedValue;
            }
        }
        if (bonusAffinity > common_1.MAX_REAPER_AFFINITY_BONUS) {
            bonusAffinity = common_1.MAX_REAPER_AFFINITY_BONUS;
        }
        // applying fulgurorn's reaper bonuses
        if (reaper.id === 53) {
            let fulgurornBonuses = 0;
            for (const item of items) {
                if (item.reaperEnchantment !== null && item.reaperEnchantment.craftedReaperSmith == reaper_smith_1.ReaperSmith.Fulgurorn) {
                    fulgurornBonuses += item.reaperEnchantment.craftedValue;
                }
            }
            const maxStacks = reaper.templates.base
                .map(base => base.values)
                .flat()
                .find(stat => stat.stat === 'fulgurorn_dedication_max_stacks');
            if (maxStacks !== undefined && (0, utils_1.isEffectValueSynergy)(maxStacks)) {
                let extractedStats = {};
                extractedStats['reapersmith_5'] = [{ value: fulgurornBonuses, source: { character } }];
                this.slormancerSynergyResolverService.resolveSyngleSynergy(maxStacks, [], extractedStats, { reaper });
                bonusAffinity += Math.min(maxStacks.displaySynergy, config.fulgurorn_dedication_stacks);
            }
        }
        if (reaper.bonusAffinity !== bonusAffinity) {
            reaper.bonusAffinity = bonusAffinity;
            this.slormancerReaperService.updateReaperModel(reaper);
            this.slormancerReaperService.updateReaperView(reaper);
        }
    }
    updateEquipmentBonuses(character, config) {
        const items = gear_slot_1.ALL_GEAR_SLOT_VALUES.map(slot => character.gear[slot]).filter(utils_1.isNotNullOrUndefined);
        const attributeBonuses = {
            [attribute_1.Attribute.Toughness]: 0,
            [attribute_1.Attribute.Savagery]: 0,
            [attribute_1.Attribute.Fury]: 0,
            [attribute_1.Attribute.Determination]: 0,
            [attribute_1.Attribute.Zeal]: 0,
            [attribute_1.Attribute.Willpower]: 0,
            [attribute_1.Attribute.Dexterity]: 0,
            [attribute_1.Attribute.Bravery]: 0,
        };
        const skillBonuses = {};
        let ancestralGiftBonus = 0;
        for (const item of items) {
            if (item.attributeEnchantment !== null) {
                attributeBonuses[item.attributeEnchantment.craftedAttribute] += item.attributeEnchantment.craftedValue;
            }
            if (item.skillEnchantment !== null) {
                skillBonuses[item.skillEnchantment.craftedSkill] = (0, utils_1.valueOrDefault)(skillBonuses[item.skillEnchantment.craftedSkill], 0) + item.skillEnchantment.craftedValue;
            }
            if (item.legendaryEffect !== null) {
                ancestralGiftBonus += item.legendaryEffect.effects
                    .filter(effect => effect.effect.stat === 'ancestral_rank_add')
                    .reduce((total, effect) => total + effect.effect.value, 0);
            }
        }
        this.applyReaperAffinities(character, character.reaper, config);
        for (const attribute of attribute_1.ALL_ATTRIBUTES) {
            if (character.attributes.allocated[attribute].bonusRank !== attributeBonuses[attribute]) {
                character.attributes.allocated[attribute].bonusRank = attributeBonuses[attribute];
                this.slormancerAttributeService.updateAttributeTraits(character.attributes.allocated[attribute]);
            }
        }
        for (const skill of character.skills) {
            let bonus = (0, utils_1.valueOrDefault)(skillBonuses[skill.skill.id], 0);
            if (character.primarySkill === skill.skill && [7, 8, 9].includes(character.reaper.id)) {
                bonus += character.reaper.templates.base.map(effect => effect.values).flat()
                    .filter(value => value.stat === 'primary_skill_level_bonus')
                    .reduce((total, value) => total + value.value, 0);
            }
            if (skill.skill.bonusLevel !== bonus) {
                skill.skill.bonusLevel = bonus;
                this.slormancerSkillService.updateSkillModel(skill.skill);
            }
        }
        const ancestralGifts = character.ancestralLegacies.ancestralLegacies
            .filter(ancestralLegacy => ancestralLegacy.types.includes(model_1.AncestralLegacyType.Stat));
        for (const ancestralLegacy of ancestralGifts) {
            this.slormancerAncestralLegacyService.updateAncestralLegacyModel(ancestralLegacy, ancestralLegacy.baseRank, ancestralGiftBonus);
            this.slormancerAncestralLegacyService.updateAncestralLegacyView(ancestralLegacy);
        }
    }
    updateChangedEntities(statsResult, defensiveStatMultiplier) {
        for (const item of statsResult.changed.items.filter(utils_1.isFirst)) {
            this.slormancerItemService.updateEquipableItemView(item, defensiveStatMultiplier);
        }
        for (const ancestralLegacy of statsResult.changed.ancestralLegacies.filter(utils_1.isFirst)) {
            this.slormancerAncestralLegacyService.updateAncestralLegacyView(ancestralLegacy);
        }
        for (const reaper of statsResult.changed.reapers.filter(utils_1.isFirst)) {
            this.slormancerReaperService.updateReaperView(reaper);
        }
        for (const skill of statsResult.changed.skills.filter(utils_1.isFirst)) {
            this.slormancerSkillService.updateSkillView(skill);
        }
        for (const upgrade of statsResult.changed.upgrades.filter(utils_1.isFirst)) {
            this.slormancerSkillService.updateUpgradeView(upgrade);
        }
        for (const attribute of statsResult.changed.attributes.filter(utils_1.isFirst)) {
            this.slormancerAttributeService.updateAttributeTraits(attribute);
        }
        for (const activable of statsResult.changed.activables) {
            this.slormancerActivableService.updateActivableView(activable);
        }
        for (const mechanic of statsResult.changed.mechanics) {
            this.slormancerMechanicService.updateMechanicView(mechanic);
        }
        for (const rune of statsResult.changed.runes) {
            this.slormancerRuneService.updateRuneView(rune);
        }
    }
    updateIssues(character, statsResult) {
        character.issues = [];
        if (statsResult.unresolvedSynergies.length > 1) {
            let issue = null;
            const hasSavagery60 = statsResult.unresolvedSynergies
                .some(resolveData => 'attribute' in resolveData.objectSource && resolveData.objectSource.attribute.attribute === attribute_1.Attribute.Savagery && resolveData.objectSource.attribute.rank >= 60);
            const convertReaperToElemental = statsResult.unresolvedSynergies
                .some(resolveData => ['weapon_to_elemental_damage'].includes(resolveData.effect.stat));
            if (hasSavagery60 && convertReaperToElemental) {
                issue = 'Your build is using the Savagery rank 60 trait and convert reaper damage to elemental damage leading to a synergy loop.';
            }
            else {
                const names = statsResult.unresolvedSynergies
                    .map(unresolvedSynergy => {
                    let result = null;
                    if ('activable' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.activable.name;
                    }
                    else if ('ancestralLegacy' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.ancestralLegacy.name;
                    }
                    else if ('attribute' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.attribute.attributeName;
                    }
                    else if ('item' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.item.name;
                    }
                    else if ('reaper' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.reaper.name;
                    }
                    else if ('skill' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.skill.name;
                    }
                    else if ('upgrade' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.upgrade.name;
                    }
                    else if ('mechanic' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.mechanic.name;
                    }
                    else if ('classMechanic' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.classMechanic.name;
                    }
                    else if ('rune' in unresolvedSynergy.objectSource) {
                        result = unresolvedSynergy.objectSource.rune.name;
                    }
                    return result;
                }).filter(utils_1.isNotNullOrUndefined)
                    .filter(utils_1.isFirst);
                issue = 'Your build contain an unresolved synergy loop between : ' + names.join(', ');
            }
            if (issue !== null) {
                character.issues.push(issue + "\n\n" + 'Stats from synergy loops cannot be statically computed.');
            }
        }
        if (character.fromCorrupted) {
            character.issues.push('This build has been recovered from a corrupted version of the slorm planner, data may be incomplete');
        }
        // déplacer dans le updateIssues avec stats au dessus du max ?
        const noMaxManaLock = 'ungifted_mana_lock_no_max' in statsResult.extractedStats;
        const manaLockpercentStat = statsResult.extractedStats['mana_lock_percent'];
        const percentLockedHealthStat = statsResult.extractedStats['percent_locked_health'];
        const manaLockpercent = manaLockpercentStat && manaLockpercentStat[0] ? manaLockpercentStat[0] : null;
        const lifeLockpercent = percentLockedHealthStat && percentLockedHealthStat[0] ? percentLockedHealthStat[0] : null;
        if (manaLockpercent && manaLockpercent.value > 100 && !noMaxManaLock) {
            character.issues.push('Mana locked is over your maximum mana');
        }
        if (lifeLockpercent && lifeLockpercent.value > 100) {
            character.issues.push('Life locked is over your maximum life');
        }
        if (character.attributes.remainingPoints < 0) {
            character.issues.push('More than ' + common_1.MAX_HERO_LEVEL + ' attribute points allocated');
        }
    }
    getCharacterStatsResult(character, config, additionalItem, additionalRunes = [], additionalStats = {}) {
        const stats = data_hero_base_stats_1.DATA_HERO_BASE_STATS[character.heroClass];
        character.baseStats = stats.baseStats.map(baseStat => ({
            stat: baseStat.stat,
            values: [baseStat.perLevel !== 0 ? Math.round(baseStat.base + character.level * baseStat.perLevel) : baseStat.base]
        }));
        const levelStats = (0, utils_1.valueOrDefault)(stats.levelonlyStat[character.level], []);
        for (const levelStat of levelStats) {
            character.baseStats.push({ stat: levelStat.stat, values: [levelStat.value] });
        }
        return this.slormancerStatsService.updateCharacterStats(character, config, additionalItem, additionalRunes, additionalStats);
    }
    updateCharacterActivables(character, statsResult, config, additionalItem, additionalRunes = [], preComputing) {
        const ancestralLegacies = character.ancestralLegacies.ancestralLegacies;
        const items = [...gear_slot_1.ALL_GEAR_SLOT_VALUES.map(slot => character.gear[slot]), ...character.inventory, ...character.sharedInventory.flat(), additionalItem]
            .filter(item => item !== null && item.legendaryEffect !== null && item.legendaryEffect.activable !== null);
        const runes = [character.runes.activation, character.runes.effect, character.runes.enhancement, ...additionalRunes]
            .filter(utils_1.isNotNullOrUndefined)
            .filter(rune => rune.activable !== null);
        const result = { items: [], ancestralLegacies: [] };
        const reapers = character.reaper.activables.length > 0 ? [character.reaper] : [];
        for (const ancestralLegacy of ancestralLegacies) {
            if (ancestralLegacy.genres.includes(skill_genre_1.SkillGenre.Aura) || !preComputing) {
                this.slormancerAncestralLegacyService.updateAncestralLegacyCost(ancestralLegacy);
                this.slormancerValueUpdater.updateAncestralLegacyActivable(character, config, ancestralLegacy, statsResult);
                result.ancestralLegacies.push(ancestralLegacy);
            }
        }
        for (const item of items) {
            const activable = item.legendaryEffect?.activable;
            if (activable.genres.includes(skill_genre_1.SkillGenre.Aura) || !preComputing) {
                this.slormancerActivableService.updateActivableCost(activable);
                this.slormancerValueUpdater.updateActivable(character, activable, statsResult, config);
                result.items.push(item);
            }
        }
        for (const reaper of reapers) {
            for (const activable of reaper.activables) {
                if (activable.genres.includes(skill_genre_1.SkillGenre.Aura) || activable.id === 17 || !preComputing) {
                    this.slormancerValueUpdater.updateActivable(character, activable, statsResult, config);
                }
            }
        }
        for (const rune of runes) {
            if (rune !== null && rune.activable !== null && !preComputing) {
                this.slormancerValueUpdater.updateActivable(character, rune.activable, statsResult, config);
            }
        }
        return { items, ancestralLegacies, reapers, runes };
    }
    updateSkillsElements(character, stats, config) {
        for (const skillAndUpgrades of character.skills) {
            skillAndUpgrades.skill.elements = [];
            if (skillAndUpgrades.skill.specialization === null) {
                if (stats.extractedStats['primary_secondary_skill_ice_imbued'] !== undefined) {
                    skillAndUpgrades.skill.elements.push(skill_element_1.SkillElement.Ice);
                }
                if (stats.extractedStats['primary_secondary_skill_lightning_imbued'] !== undefined) {
                    skillAndUpgrades.skill.elements.push(skill_element_1.SkillElement.Lightning);
                }
                if (stats.extractedStats['primary_secondary_skill_light_imbued'] !== undefined) {
                    skillAndUpgrades.skill.elements.push(skill_element_1.SkillElement.Light);
                }
                if (stats.extractedStats['primary_secondary_skill_shadow_imbued'] !== undefined) {
                    skillAndUpgrades.skill.elements.push(skill_element_1.SkillElement.Shadow);
                }
                if (stats.extractedStats['primary_secondary_skill_fire_imbued'] !== undefined) {
                    skillAndUpgrades.skill.elements.push(skill_element_1.SkillElement.Fire);
                }
            }
        }
    }
    applyReaperBonusLevel(character, config) {
        let changed = false;
        let minLevel = 0;
        const legendaryEffect = (0, util_1.getAllLegendaryEffects)(character.gear).find(legendaryEffect => legendaryEffect.id === 83);
        if (legendaryEffect) {
            const legendaryAffix = legendaryEffect.effects.find(effect => effect.effect.stat === 'min_reaper_level');
            if (legendaryAffix) {
                minLevel = Math.min(legendaryAffix.effect.value, config.highest_same_type_reaper_level);
            }
            const expectedBonusLevel = minLevel - character.reaper.baseLevel;
            if (expectedBonusLevel >= 0) {
                changed = character.reaper.bonusLevel !== expectedBonusLevel;
                character.reaper.bonusLevel = expectedBonusLevel;
            }
        }
        if (changed) {
            this.slormancerReaperService.updateReaperModel(character.reaper);
        }
        return changed;
    }
    extractAcademicianStats(character, stats) {
        const result = {};
        const misscalculatedStats = [];
        const miscalculationTresholdStat = stats.extractedStats['miscalculation_treshold'];
        if (miscalculationTresholdStat) {
            const miscalculationTresholdEntityValue = miscalculationTresholdStat[0];
            if (miscalculationTresholdEntityValue) {
                const miscalculationTreshod = miscalculationTresholdEntityValue.value;
                const percentStats = stats.stats.filter(mergedStat => common_1.PERCENT_STATS.includes(mergedStat.stat));
                for (const percentStat of percentStats) {
                    if (percentStat.total < miscalculationTreshod) {
                        result['academician_' + percentStat.stat + '_mult'] = [{ value: -100, source: { reaper: character.reaper } }];
                        misscalculatedStats.push(percentStat.stat);
                    }
                }
            }
        }
        const probabilityChangedStats = [];
        let probabilityFinalValue = 0;
        const probabilityTresholdStat = stats.extractedStats['probability_treshold'];
        const probabilityDefaultValueStat = stats.extractedStats['probability_default_value'];
        const probabilityDefaultValueIncreasedPercentStat = stats.extractedStats['probability_default_value_increased_percent'];
        if (probabilityTresholdStat && probabilityDefaultValueStat && probabilityDefaultValueIncreasedPercentStat) {
            const probabilityTresholdEntityValue = probabilityTresholdStat[0];
            const probabilityDefaultValueEntityValue = probabilityDefaultValueStat[0];
            const probabilityDefaultValueIncreasedPercentEntityValue = probabilityDefaultValueIncreasedPercentStat[0];
            if (probabilityTresholdEntityValue && probabilityDefaultValueEntityValue && probabilityDefaultValueIncreasedPercentEntityValue) {
                const PROBABILITY_STATS = [
                    'inner_fire_chance',
                    'overdrive_chance',
                    // 'recast_chance', // currently ignored by academician reaper
                    'chance_to_pierce',
                    'fork_chance',
                    'chance_to_rebound',
                    'critical_chance',
                    'ancestral_chance',
                ];
                const probabilityDefaultValue = probabilityDefaultValueEntityValue.value;
                const probabilityDefaultValueIncreasedPercent = probabilityDefaultValueIncreasedPercentEntityValue.value;
                probabilityFinalValue = (0, util_1.round)(probabilityDefaultValue * (100 + probabilityDefaultValueIncreasedPercent) / 100, 3);
                const probabilityStats = stats.stats.filter(mergedStat => PROBABILITY_STATS.includes(mergedStat.stat));
                for (const probabilityStat of probabilityStats) {
                    if (probabilityStat.total === 0 || misscalculatedStats.includes(probabilityStat.stat)) {
                        result['academician_' + probabilityStat.stat + '_extra'] = [{ value: probabilityFinalValue, source: { reaper: character.reaper } }];
                        probabilityChangedStats.push(probabilityStat.stat);
                    }
                }
            }
        }
        const criticalChanceStat = stats.stats.find(mergedStat => mergedStat.stat === 'critical_chance');
        const ancestralChanceStat = stats.stats.find(mergedStat => mergedStat.stat === 'ancestral_chance');
        if (criticalChanceStat && ancestralChanceStat) {
            let totalCritical = criticalChanceStat.total;
            let totalAncestral = ancestralChanceStat.total;
            if (probabilityChangedStats.includes('critical_chance')) {
                totalCritical = probabilityFinalValue;
            }
            if (probabilityChangedStats.includes('ancestral_chance')) {
                totalAncestral = probabilityFinalValue;
            }
            if (totalCritical === totalAncestral) {
                result['critical_chance_equal_ancestral_chance'] = [{ value: 0, source: { reaper: character.reaper } }];
                if (!result['academician_critical_damage_mult']) {
                    result['academician_critical_damage_mult'] = [{ value: -100, source: { reaper: character.reaper } }];
                }
            }
        }
        return result;
    }
    extractAuthorityStats(character, stats) {
        const result = {};
        // used in SlormancerstatService.applyAuthorityChanges 
        const authorityItem = (0, util_1.getAllItems)(character.gear).find(item => item.legendaryEffect !== null && item.legendaryEffect.id === 96);
        if (authorityItem) {
            const innerFireDamage = stats.stats.find(mergedStat => mergedStat.stat === 'inner_fire_damage');
            const overdriveDamage = stats.stats.find(mergedStat => mergedStat.stat === 'overdrive_damage');
            const innerFireChance = stats.stats.find(mergedStat => mergedStat.stat === 'inner_fire_chance');
            const overdriveChance = stats.stats.find(mergedStat => mergedStat.stat === 'overdrive_chance');
            if (innerFireChance && overdriveChance) {
                if (innerFireChance.total < overdriveChance.total) {
                    result['authority_inner_fire_chance_lower'] = [{ value: 1, source: { item: authorityItem } }];
                }
                else {
                    result['authority_overdrive_chance_lower'] = [{ value: 1, source: { item: authorityItem } }];
                }
            }
            if (innerFireDamage && overdriveDamage) {
                const innerFirePercent = innerFireDamage.values.percent.reduce((total, value) => value.value + total, 0);
                const overdriveFirePercent = overdriveDamage.values.percent.reduce((total, value) => value.value + total, 0);
                if (innerFirePercent > overdriveFirePercent) {
                    result['authority_inner_fire_damage_higher'] = [{ value: 1, source: { item: authorityItem } }];
                }
                else {
                    result['authority_overdrive_damage_higher'] = [{ value: 1, source: { item: authorityItem } }];
                }
            }
        }
        return result;
    }
    applySetChanges(character, additionalItem, stats) {
        const boosterMax = character.reaper.activables.find(activable => activable.id === 6);
        if (boosterMax) {
            const hasFishermanSet = 'has_fisherman_set' in stats.extractedStats;
            for (const value of boosterMax.values) {
                if ((0, utils_1.isEffectValueVariable)(value)) {
                    if (value.stat === 'booster_max_cooldown_reduction_global_mult'
                        || value.stat === 'booster_max_elemental_damage_percent'
                        || value.stat === 'booster_max_basic_damage_percent_percent') {
                        const setValue = stats.extractedStats['fisherman_set_' + value.stat];
                        if (setValue) {
                            value.value = hasFishermanSet ? setValue[0]?.value : value.baseValue;
                            value.upgradedValue = value.value;
                            value.displayValue = value.value;
                        }
                    }
                }
            }
        }
    }
    updateCharacterStats(character, updateViews, config, additionalItem, additionalRunes = []) {
        if (character.ultimatum !== null) {
            this.slormancerUltimatumService.updateUltimatumModel(character.ultimatum, character.ultimatum.baseLevel, (0, util_1.getOlorinUltimatumBonusLevel)(character.gear));
            this.slormancerUltimatumService.updateUltimatumView(character.ultimatum);
        }
        const defensiveStatMultiplier = this.slormancerItemService.getDefensiveStatMultiplier((0, util_1.getAllLegendaryEffects)(character.gear));
        const changedRings = [];
        if (defensiveStatMultiplier > 0) {
            if (character.gear.ring_l !== null) {
                this.slormancerItemService.updateEquipableItemModel(character.gear.ring_l, defensiveStatMultiplier);
                changedRings.push(character.gear.ring_l);
            }
            if (character.gear.ring_r !== null) {
                this.slormancerItemService.updateEquipableItemModel(character.gear.ring_r, defensiveStatMultiplier);
                changedRings.push(character.gear.ring_r);
            }
        }
        const reaperChanged = this.applyReaperBonusLevel(character, config);
        const statResultPreComputing = this.getCharacterStatsResult(character, config, additionalItem, additionalRunes);
        const preComputingChanged = this.updateCharacterActivables(character, statResultPreComputing, config, additionalItem, additionalRunes, true);
        this.slormancerValueUpdater.precomputeRunePowerAndEffect(character, additionalRunes, statResultPreComputing, config);
        if (character.ultimatum !== null) {
            character.ultimatum.locked = statResultPreComputing.extractedStats['disable_ultimatum'] !== undefined;
        }
        this.applySetChanges(character, additionalItem, statResultPreComputing);
        const additionalStats = {
            ...this.extractAcademicianStats(character, statResultPreComputing),
            ...this.extractAuthorityStats(character, statResultPreComputing)
        };
        const statsResult = this.getCharacterStatsResult(character, config, additionalItem, additionalRunes, additionalStats);
        character.stats = statsResult.stats;
        if (reaperChanged) {
            statsResult.changed.reapers.push(character.reaper);
        }
        statsResult.changed.items.push(...changedRings);
        statsResult.changed.items.push(...preComputingChanged.items);
        statsResult.changed.items.push(...statResultPreComputing.changed.items);
        statsResult.changed.ancestralLegacies.push(...preComputingChanged.ancestralLegacies);
        statsResult.changed.ancestralLegacies.push(...statResultPreComputing.changed.ancestralLegacies);
        statsResult.changed.activables.push(...statResultPreComputing.changed.activables);
        statsResult.changed.attributes.push(...statResultPreComputing.changed.attributes);
        statsResult.changed.reapers.push(...statResultPreComputing.changed.reapers);
        statsResult.changed.reapers.push(...preComputingChanged.reapers);
        statsResult.changed.skills.push(...statResultPreComputing.changed.skills);
        statsResult.changed.upgrades.push(...statResultPreComputing.changed.upgrades);
        statsResult.changed.mechanics.push(...statResultPreComputing.changed.mechanics);
        statsResult.changed.runes.push(...statResultPreComputing.changed.runes);
        statsResult.changed.runes.push(...preComputingChanged.runes);
        this.slormancerValueUpdater.updateReaper(character.reaper, statsResult);
        statsResult.changed.reapers.push(character.reaper);
        for (const ancestralLegacy of character.ancestralLegacies.ancestralLegacies) {
            if (statsResult.unlockedAncestralLegacies.includes(ancestralLegacy.id)) {
                statsResult.changed.ancestralLegacies.push(ancestralLegacy);
                this.slormancerAncestralLegacyService.updateAncestralLegacyModel(ancestralLegacy, ancestralLegacy.baseMaxRank);
                if (!character.ancestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id)) {
                    character.ancestralLegacies.activeAncestralLegacies.push(ancestralLegacy.id);
                }
            }
            for (const mechanic of ancestralLegacy.relatedMechanics) {
                this.slormancerValueUpdater.updateMechanic(mechanic, character, statsResult, config);
                statsResult.changed.mechanics.push(mechanic);
            }
        }
        const lockedSkills = [];
        if (statsResult.extractedStats['primary_slot_locked'] !== undefined && character.primarySkill !== null) {
            lockedSkills.push(character.primarySkill.id);
        }
        if (statsResult.extractedStats['secondary_slot_locked'] !== undefined && character.secondarySkill !== null) {
            lockedSkills.push(character.secondarySkill.id);
        }
        this.updateSkillsElements(character, statsResult, config);
        for (const skillAndUpgrades of character.skills) {
            const result = this.slormancerStatsService.updateSkillStats(character, skillAndUpgrades, config, statsResult);
            this.slormancerValueUpdater.updateSkillAndUpgradeValues(character, skillAndUpgrades, result, config);
            statsResult.changed.skills.push(skillAndUpgrades.skill);
            statsResult.changed.upgrades.push(...skillAndUpgrades.upgrades);
            skillAndUpgrades.stats = statsResult.stats;
            skillAndUpgrades.skill.locked = lockedSkills.includes(skillAndUpgrades.skill.id);
        }
        this.slormancerValueUpdater.updateRuneValues(character, additionalRunes, statsResult, config);
        for (const gearSlot of gear_slot_1.ALL_GEAR_SLOT_VALUES) {
            const item = character.gear[gearSlot];
            if (item !== null && item.legendaryEffect !== null) {
                if (this.slormancerValueUpdater.updateLegendaryValues(character, item.legendaryEffect, statsResult)) {
                    statsResult.changed.items.push(item);
                }
            }
        }
        const classMechanics = this.slormancerClassMechanicService.getClassMechanics(character.heroClass);
        for (const classMechanic of classMechanics) {
            this.slormancerValueUpdater.updateClassMechanic(classMechanic, statsResult);
        }
        const activableChanged = this.updateCharacterActivables(character, statsResult, config, additionalItem, additionalRunes, false);
        statsResult.changed.items.push(...activableChanged.items);
        statsResult.changed.ancestralLegacies.push(...activableChanged.ancestralLegacies);
        statsResult.changed.reapers.push(...activableChanged.reapers);
        statsResult.changed.runes.push(...activableChanged.runes);
        this.updateIssues(character, statsResult);
        if (updateViews) {
            this.updateChangedEntities(statsResult, defensiveStatMultiplier);
            this.slormancerClassMechanicService.updateClassMechanicViews(character.heroClass);
            const attackSpeed = statsResult.stats.find(stat => stat.stat === 'attack_speed')?.total ?? 0;
            for (const skill of character.skills) {
                this.slormancerSkillService.updateSkillCooldownDetails(skill.skill, attackSpeed);
            }
        }
    }
    removeUnavailableActivables(character) {
        const availableActivables = [
            ...[character.runes.activation, character.runes.effect, character.runes.enhancement]
                .map(rune => rune === null ? null : rune.activable),
            ...character.reaper.activables,
            ...character.ancestralLegacies.ancestralLegacies.filter(ancestralLegacy => ancestralLegacy.isActivable && character.ancestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id)),
            ...gear_slot_1.ALL_GEAR_SLOT_VALUES.map(slot => character.gear[slot]?.legendaryEffect?.activable)
        ].filter(utils_1.isNotNullOrUndefined)
            .map(activable => activable.id);
        if (character.activable1 !== null && !availableActivables.includes(character.activable1.id)) {
            character.activable1 = null;
        }
        if (character.activable2 !== null && !availableActivables.includes(character.activable2.id)) {
            character.activable2 = null;
        }
        if (character.activable3 !== null && !availableActivables.includes(character.activable3.id)) {
            character.activable3 = null;
        }
        if (character.activable4 !== null && !availableActivables.includes(character.activable4.id)) {
            character.activable4 = null;
        }
    }
    addAdditionalAncestralLegacySkillAtMaxRank(character, ancestralLegacy) {
        if (!character.ancestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id)) {
            character.ancestralLegacies.activeAncestralLegacies.push(ancestralLegacy.id);
        }
        if (ancestralLegacy.rank < ancestralLegacy.maxRank) {
            this.slormancerAncestralLegacyService.updateAncestralLegacyModel(ancestralLegacy, ancestralLegacy.baseRank, ancestralLegacy.bonusRank, ancestralLegacy.maxRank);
            this.slormancerAncestralLegacyService.updateAncestralLegacyView(ancestralLegacy);
        }
    }
    updateAncestralLegacySkills(character) {
        const legendaryEffects = (0, util_1.getAllLegendaryEffects)(character.gear);
        character.ancestralLegacies.activeAncestralLegacies = this.slormancerAncestralLegacyNodesService.getAncestralLegacyIds(character);
        for (const ancestralLegacy of character.ancestralLegacies.ancestralLegacies) {
            if (ancestralLegacy.forcedRank !== null) {
                this.slormancerAncestralLegacyService.updateAncestralLegacyModel(ancestralLegacy);
                this.slormancerAncestralLegacyService.updateAncestralLegacyView(ancestralLegacy);
            }
        }
        if (character.reaper.id === 77 && character.reaper.primordial) {
            const activeImbues = character.ancestralLegacies.ancestralLegacies
                .filter(ancestralLegacy => character.ancestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id) && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Imbue));
            const elements = activeImbues.map(ancestralLegacy => ancestralLegacy.element).filter(utils_1.isFirst);
            for (const element of elements) {
                const elementImbues = activeImbues.filter(ancestralLegacy => ancestralLegacy.element === element);
                if (elementImbues.length === 2) {
                    const elementImbues = character.ancestralLegacies.ancestralLegacies
                        .filter(ancestralLegacy => ancestralLegacy.element === element && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Imbue));
                    if (elementImbues.length > 0) {
                        const highestImbueId = Math.max(...elementImbues.map(ancestralLegacy => ancestralLegacy.id));
                        const highestImbue = elementImbues.find(ancestralLegacy => ancestralLegacy.id === highestImbueId);
                        this.addAdditionalAncestralLegacySkillAtMaxRank(character, highestImbue);
                    }
                }
            }
        }
        if (character.reaper.id === 86) {
            const adjacentRealmIds = this.slormancerAncestralLegacyNodesService.getAdjacentRealms(character)
                .map(realm => realm.realm);
            const adjacentAncestralStrikes = character.ancestralLegacies.ancestralLegacies
                .filter(ancestralLegacy => adjacentRealmIds.includes(ancestralLegacy.realm) && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Ancestral));
            for (const ancestralStrike of adjacentAncestralStrikes) {
                this.addAdditionalAncestralLegacySkillAtMaxRank(character, ancestralStrike);
            }
        }
        if (character.reaper.id === 108) {
            const judgeOfLight = character.ancestralLegacies.ancestralLegacies.find(ancestralLegacy => ancestralLegacy.id === 54);
            if (judgeOfLight) {
                this.addAdditionalAncestralLegacySkillAtMaxRank(character, judgeOfLight);
            }
        }
        if (character.reaper.id === 109) {
            const blackPact = character.ancestralLegacies.ancestralLegacies.find(ancestralLegacy => ancestralLegacy.id === 68);
            if (blackPact) {
                this.addAdditionalAncestralLegacySkillAtMaxRank(character, blackPact);
            }
        }
        if (character.reaper.id === 116) {
            const windsOfWinter = character.ancestralLegacies.ancestralLegacies.find(ancestralLegacy => ancestralLegacy.id === 27);
            if (windsOfWinter) {
                this.addAdditionalAncestralLegacySkillAtMaxRank(character, windsOfWinter);
            }
        }
        if (character.reaper.id === 119) {
            const blormUp = character.ancestralLegacies.ancestralLegacies.find(ancestralLegacy => ancestralLegacy.id === 63);
            if (blormUp) {
                this.addAdditionalAncestralLegacySkillAtMaxRank(character, blormUp);
            }
        }
        if (character.reaper.id === 115 && character.reaper.primordial) {
            const fieryWeapon = character.ancestralLegacies.ancestralLegacies.find(ancestralLegacy => ancestralLegacy.id === 8);
            if (fieryWeapon) {
                this.addAdditionalAncestralLegacySkillAtMaxRank(character, fieryWeapon);
            }
            const moreFire = character.ancestralLegacies.ancestralLegacies.find(ancestralLegacy => ancestralLegacy.id === 9);
            if (moreFire) {
                this.addAdditionalAncestralLegacySkillAtMaxRank(character, moreFire);
            }
            const normalOrFireAncestralLegacies = character.ancestralLegacies.ancestralLegacies
                .filter(ancestralLegacy => ancestralLegacy.element === skill_element_1.SkillElement.Neutral || ancestralLegacy.element === skill_element_1.SkillElement.Fire)
                .map(ancestralLegacy => ancestralLegacy.id);
            character.ancestralLegacies.activeAncestralLegacies = character.ancestralLegacies.activeAncestralLegacies
                .filter(ancestralLegacyId => normalOrFireAncestralLegacies.includes(ancestralLegacyId));
        }
        if (character.gear.cape !== null && character.gear.cape.legendaryEffect !== null) {
            // Cloak of the Fire Zealot
            if (legendaryEffects.find(legendaryEffect => legendaryEffect.id === 196)) {
                const fireSeals = character.ancestralLegacies.ancestralLegacies
                    .filter(ancestralLegacy => ancestralLegacy.element === skill_element_1.SkillElement.Fire && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Seal));
                for (const fireSeal of fireSeals) {
                    this.addAdditionalAncestralLegacySkillAtMaxRank(character, fireSeal);
                }
            }
            // Cloak of the Ice Zealot
            if (legendaryEffects.find(legendaryEffect => legendaryEffect.id === 197)) {
                const iceSeals = character.ancestralLegacies.ancestralLegacies
                    .filter(ancestralLegacy => ancestralLegacy.element === skill_element_1.SkillElement.Ice && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Seal));
                for (const iceSeal of iceSeals) {
                    this.addAdditionalAncestralLegacySkillAtMaxRank(character, iceSeal);
                }
            }
            // Cloak of the Lightning Zealot
            if (legendaryEffects.find(legendaryEffect => legendaryEffect.id === 198)) {
                const lightningSeals = character.ancestralLegacies.ancestralLegacies
                    .filter(ancestralLegacy => ancestralLegacy.element === skill_element_1.SkillElement.Lightning && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Seal));
                for (const lightningSeal of lightningSeals) {
                    this.addAdditionalAncestralLegacySkillAtMaxRank(character, lightningSeal);
                }
            }
            // Cloak of the Light Zealot
            if (legendaryEffects.find(legendaryEffect => legendaryEffect.id === 199)) {
                const lightSeals = character.ancestralLegacies.ancestralLegacies
                    .filter(ancestralLegacy => ancestralLegacy.element === skill_element_1.SkillElement.Light && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Seal));
                for (const lightSeal of lightSeals) {
                    this.addAdditionalAncestralLegacySkillAtMaxRank(character, lightSeal);
                }
            }
            // Cloak of the Shadow Zealot
            if (legendaryEffects.find(legendaryEffect => legendaryEffect.id === 200)) {
                const shadowSeals = character.ancestralLegacies.ancestralLegacies
                    .filter(ancestralLegacy => ancestralLegacy.element === skill_element_1.SkillElement.Shadow && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Seal));
                for (const shadowSeal of shadowSeals) {
                    this.addAdditionalAncestralLegacySkillAtMaxRank(character, shadowSeal);
                }
            }
        }
        // Impartiality changes
        const reverseBoosts = legendaryEffects.find(legendaryEffect => legendaryEffect.id === 149);
        const elementalBoosts = character.ancestralLegacies.ancestralLegacies.filter(a => [96, 97, 100].includes(a.id));
        const rawBoosts = character.ancestralLegacies.ancestralLegacies.filter(a => [98, 99].includes(a.id));
        const firstElementalHasElemental = elementalBoosts[0]?.values[0]?.stat?.indexOf('elemental');
        const needUpdate = firstElementalHasElemental !== undefined && (reverseBoosts
            ? (firstElementalHasElemental !== -1)
            : (firstElementalHasElemental === -1));
        if (needUpdate) {
            for (const elementalBoost of elementalBoosts) {
                for (const value of elementalBoost.values) {
                    let newStat = value.percent
                        ? (reverseBoosts ? 'basic_damage_percent' : 'elemental_damage_percent')
                        : (reverseBoosts ? 'min_basic_damage_add' : 'min_elemental_damage_add');
                    if (value.stat !== newStat) {
                        value.stat = newStat;
                    }
                }
                this.slormancerAncestralLegacyService.updateAncestralLegacyModel(elementalBoost);
                this.slormancerAncestralLegacyService.updateAncestralLegacyView(elementalBoost);
            }
            for (const rawBoost of rawBoosts) {
                for (const value of rawBoost.values) {
                    let newStat = value.percent
                        ? (reverseBoosts ? 'elemental_damage_percent' : 'basic_damage_percent')
                        : (reverseBoosts ? 'min_elemental_damage_add' : 'min_basic_damage_add');
                    value.stat = newStat;
                }
                this.slormancerAncestralLegacyService.updateAncestralLegacyModel(rawBoost);
                this.slormancerAncestralLegacyService.updateAncestralLegacyView(rawBoost);
            }
        }
    }
    updateActiveSkillUpgrades(character) {
        const addOtherNonEquippedSpecPassives = character.reaper.primordial && character.reaper.templates.benediction
            .map(be => be.values).flat()
            .find(value => value.stat === 'add_other_non_equipped_spec_passives') !== undefined;
        const removeEquippedSpecPassives = character.reaper.primordial && character.reaper.templates.malediction
            .map(ma => ma.values).flat()
            .find(value => value.stat === 'remove_equipped_spec_passives') !== undefined;
        for (const skill of character.skills) {
            const equipped = character.supportSkill === skill.skill
                || character.primarySkill === skill.skill
                || character.secondarySkill === skill.skill;
            if (skill.skill.type === model_1.SkillType.Support) {
                skill.activeUpgrades = equipped ? [...skill.selectedUpgrades] : [];
                if (equipped) {
                    if (removeEquippedSpecPassives) {
                        skill.activeUpgrades = skill.activeUpgrades
                            .map(id => skill.upgrades.find(upgrade => upgrade.id === id))
                            .filter(utils_1.isNotNullOrUndefined)
                            .filter(upgrade => upgrade.type !== model_1.SkillType.Passive)
                            .map(upgrade => upgrade.id);
                    }
                }
                else if (addOtherNonEquippedSpecPassives) {
                    skill.activeUpgrades = skill.upgrades
                        .filter(upgrade => skill.selectedUpgrades.includes(upgrade.id) && upgrade.type === model_1.SkillType.Passive)
                        .map(upgrade => upgrade.id);
                }
            }
            else {
                skill.activeUpgrades = [...skill.selectedUpgrades];
            }
        }
    }
    updateCharacter(character, config, updateViews = true, additionalItem = null, additionalRunes = []) {
        character.issues = [];
        character.name = this.slormancerTranslateService.translate('hero_' + character.heroClass);
        const specialization = character.supportSkill !== null ? character.supportSkill.specializationName : null;
        let fullName = [character.name, specialization].filter(utils_1.isNotNullOrUndefined).join(', ');
        character.fullName = fullName + ' ' + this.LEVEL_LABEL + ' ' + character.level;
        character.attributes.maxPoints = character.level;
        let allocatedPoints = attribute_1.ALL_ATTRIBUTES.map(attribute => character.attributes.allocated[attribute].baseRank).reduce((p, c) => p + c, 0);
        character.attributes.remainingPoints = character.attributes.maxPoints - allocatedPoints;
        this.slormancerAncestralLegacyNodesService.stabilize(character);
        this.updateAncestralLegacySkills(character);
        this.removeUnavailableActivables(character);
        this.updateActiveSkillUpgrades(character);
        this.updateEquipmentBonuses(character, config);
        this.slormancerMightService.updateMight(character);
        this.updateCharacterStats(character, updateViews, config, additionalItem, additionalRunes);
        console.log(character);
    }
};
SlormancerCharacterUpdaterService = __decorate([
    (0, core_1.Injectable)()
], SlormancerCharacterUpdaterService);
exports.SlormancerCharacterUpdaterService = SlormancerCharacterUpdaterService;
//# sourceMappingURL=slormancer-character-updater.service.js.map