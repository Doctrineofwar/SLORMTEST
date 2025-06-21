"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerStatsService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const data_character_stats_mapping_1 = require("../../constants/content/data/data-character-stats-mapping");
const hero_class_1 = require("../../model/content/enum/hero-class");
const skill_genre_1 = require("../../model/content/enum/skill-genre");
const utils_1 = require("../../util/utils");
let SlormancerStatsService = class SlormancerStatsService {
    constructor(slormancerStatsExtractorService, slormancerSynergyResolverService, slormancerStatUpdaterService, slormancerStatMappingService, slormancerReaperService) {
        this.slormancerStatsExtractorService = slormancerStatsExtractorService;
        this.slormancerSynergyResolverService = slormancerSynergyResolverService;
        this.slormancerStatUpdaterService = slormancerStatUpdaterService;
        this.slormancerStatMappingService = slormancerStatMappingService;
        this.slormancerReaperService = slormancerReaperService;
    }
    hasSynergyValueChanged(synergy) {
        let result = true;
        if (typeof synergy.originalValue === typeof synergy.effect.displaySynergy) {
            if (typeof synergy.originalValue === 'number') {
                result = synergy.originalValue !== synergy.effect.displaySynergy;
            }
            else {
                result = synergy.originalValue.min !== synergy.effect.displaySynergy.min
                    || synergy.originalValue.max !== synergy.effect.displaySynergy.max;
            }
        }
        return result;
    }
    applyReaperSpecialChanges(character, config) {
        if (character.reaper.id === 84) {
            const activable = character.reaper.activables.find(activable => activable.id === 21);
            if (activable !== undefined) {
                const hasTotem = activable.genres.includes(skill_genre_1.SkillGenre.Totem);
                if (config.show_temple_keeper_as_totem && !hasTotem) {
                    activable.genres.push(skill_genre_1.SkillGenre.Totem);
                }
                else if (!config.show_temple_keeper_as_totem && hasTotem) {
                    activable.genres.splice(activable.genres.indexOf(skill_genre_1.SkillGenre.Totem), 1);
                }
            }
        }
    }
    applyAuthorityChanges(character, mapping, stats) {
        if ((0, utils_1.getAllLegendaryEffects)(character.gear).some(legendaryEffect => legendaryEffect.id === 96)) {
            const authorityInnerFireChanceLower = 'authority_inner_fire_chance_lower' in stats;
            const authorityOverdriveChanceLower = 'authority_overdrive_chance_lower' in stats;
            const authorityInnerFireHigher = 'authority_inner_fire_damage_higher' in stats;
            const authorityOverdriveDamageHigher = 'authority_overdrive_damage_higher' in stats;
            if (authorityInnerFireChanceLower || authorityOverdriveChanceLower || authorityInnerFireHigher || authorityOverdriveDamageHigher) {
                // apply authority meta changes
                const innerFireDamage = mapping.find(mergedStat => mergedStat.stat === 'inner_fire_damage');
                const overdriveDamage = mapping.find(mergedStat => mergedStat.stat === 'overdrive_damage');
                const innerFireChance = mapping.find(mergedStat => mergedStat.stat === 'inner_fire_chance');
                const overdriveChance = mapping.find(mergedStat => mergedStat.stat === 'overdrive_chance');
                const innerOrOverdriveDamageHigh = mapping.find(mergedStat => mergedStat.stat === 'inner_or_overdrive_damage_high');
                if (innerFireChance && overdriveChance) {
                    if (authorityInnerFireChanceLower) {
                        overdriveChance.source = { ...data_character_stats_mapping_1.INNER_FIRE_CHANCE_MAPPING.source };
                    }
                    else if (authorityOverdriveChanceLower) {
                        innerFireChance.source = { ...data_character_stats_mapping_1.OVERDRIVE_CHANCE_MAPPING.source };
                    }
                }
                if (innerFireDamage && overdriveDamage && innerOrOverdriveDamageHigh) {
                    if (authorityInnerFireHigher) {
                        overdriveDamage.source = {
                            ...data_character_stats_mapping_1.INNER_FIRE_DAMAGE_MAPPING.source,
                            flat: overdriveDamage.source.flat
                        };
                        innerOrOverdriveDamageHigh.source.flat = [
                            { stat: 'hundred' },
                            ...data_character_stats_mapping_1.INNER_FIRE_DAMAGE_MAPPING.source.percent
                        ];
                        innerOrOverdriveDamageHigh.source.multiplier = [...data_character_stats_mapping_1.INNER_FIRE_DAMAGE_MAPPING.source.multiplier];
                    }
                    else if (authorityOverdriveDamageHigher) {
                        innerFireDamage.source = {
                            ...data_character_stats_mapping_1.OVERDRIVE_DAMAGE_MAPPING.source,
                            flat: innerFireDamage.source.flat
                        };
                        innerOrOverdriveDamageHigh.source.flat = [
                            { stat: 'hundred' },
                            ...data_character_stats_mapping_1.OVERDRIVE_DAMAGE_MAPPING.source.percent
                        ];
                        innerOrOverdriveDamageHigh.source.multiplier = [...data_character_stats_mapping_1.OVERDRIVE_DAMAGE_MAPPING.source.multiplier];
                    }
                }
            }
        }
    }
    updateCharacterStats(character, config, additionalItem = null, additionalRunes = [], additionalStats = {}) {
        const result = {
            unlockedAncestralLegacies: [],
            unresolvedSynergies: [],
            resolvedSynergies: [],
            extractedStats: {},
            stats: [],
            changed: {
                items: [],
                ancestralLegacies: [],
                skills: [],
                upgrades: [],
                reapers: [],
                attributes: [],
                activables: [],
                mechanics: [],
                runes: [],
            }
        };
        const mapping = this.getStatsMapping(character);
        this.applyAuthorityChanges(character, mapping, additionalStats);
        const extractedStats = this.slormancerStatsExtractorService.extractCharacterStats(character, config, additionalItem, additionalRunes, mapping, additionalStats);
        this.applyReaperSpecialChanges(character, config);
        result.extractedStats = extractedStats.stats;
        result.stats = this.slormancerStatMappingService.buildMergedStats(extractedStats.stats, mapping, config);
        if (character.ultimatum !== null && !character.ultimatum.locked) {
            this.slormancerStatMappingService.applyUltimatum(result.stats, mapping, character.ultimatum, config, result.extractedStats);
        }
        for (const stats of result.stats) {
            this.slormancerStatUpdaterService.updateStatTotal(stats);
        }
        const synergyResult = this.slormancerSynergyResolverService.resolveSynergies(extractedStats.synergies, result.stats, extractedStats.stats, config);
        result.unresolvedSynergies = synergyResult.unresolved;
        result.resolvedSynergies = synergyResult.resolved;
        result.unlockedAncestralLegacies = (0, utils_1.valueOrDefault)(extractedStats.stats['unlock_ancestral_legacy_max_rank'], []).map(v => v.value);
        this.slormancerSynergyResolverService.resolveIsolatedSynergies(extractedStats.isolatedSynergies, result.stats, extractedStats.stats);
        for (const synergy of [...extractedStats.synergies, ...extractedStats.isolatedSynergies]) {
            if (this.hasSynergyValueChanged(synergy)) {
                if ('ancestralLegacy' in synergy.objectSource) {
                    result.changed.ancestralLegacies.push(synergy.objectSource.ancestralLegacy);
                }
                else if ('attribute' in synergy.objectSource) {
                    result.changed.attributes.push(synergy.objectSource.attribute);
                }
                else if ('item' in synergy.objectSource) {
                    result.changed.items.push(synergy.objectSource.item);
                }
                else if ('reaper' in synergy.objectSource) {
                    result.changed.reapers.push(synergy.objectSource.reaper);
                }
                else if ('skill' in synergy.objectSource) {
                    result.changed.skills.push(synergy.objectSource.skill);
                }
                else if ('upgrade' in synergy.objectSource) {
                    result.changed.upgrades.push(synergy.objectSource.upgrade);
                }
                else if ('activable' in synergy.objectSource) {
                    result.changed.activables.push(synergy.objectSource.activable);
                }
                else if ('mechanic' in synergy.objectSource) {
                    result.changed.mechanics.push(synergy.objectSource.mechanic);
                }
                else if ('rune' in synergy.objectSource) {
                    result.changed.runes.push(synergy.objectSource.rune);
                }
            }
        }
        return result;
    }
    applySkillSpecialChanges(character, skillAndUpgrades, config, extractedStats, result) {
        skillAndUpgrades.skill.manaCostType = skillAndUpgrades.skill.baseCostType;
        skillAndUpgrades.skill.genres = skillAndUpgrades.skill.baseGenres.slice(0);
        if (extractedStats.stats['skill_is_projectile'] !== undefined && !skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Projectile)) {
            skillAndUpgrades.skill.genres.push(skill_genre_1.SkillGenre.Projectile);
        }
        if (extractedStats.stats['skill_is_fast'] !== undefined && !skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Fast)) {
            skillAndUpgrades.skill.genres.push(skill_genre_1.SkillGenre.Fast);
        }
        if (extractedStats.stats['skill_is_no_longer_fast'] !== undefined && skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Fast)) {
            const index = skillAndUpgrades.skill.genres.findIndex(genre => genre === skill_genre_1.SkillGenre.Fast);
            if (index !== -1) {
                skillAndUpgrades.skill.genres.splice(index, 1);
            }
        }
        if (character.heroClass === hero_class_1.HeroClass.Huntress && skillAndUpgrades.skill.id === 4) {
            const physicalDamage = extractedStats.stats['damage_type_to_elemental'] === undefined;
            const damageValues = skillAndUpgrades.skill.values
                .filter(utils_1.isEffectValueSynergy)
                .filter(value => (0, utils_1.isDamageType)(value.stat));
            for (const damageValue of damageValues) {
                damageValue.stat = physicalDamage ? 'physical_damage' : 'elemental_damage';
                damageValue.source = physicalDamage ? 'physical_damage' : 'elemental_damage';
            }
        }
        if (character.heroClass === hero_class_1.HeroClass.Mage) {
            if (extractedStats.stats['cast_by_clone'] !== undefined) {
                skillAndUpgrades.skill.genres.push(skill_genre_1.SkillGenre.Totem);
            }
            let newMagicSchool = null; // config
            if (character.heroClass === hero_class_1.HeroClass.Mage && skillAndUpgrades.skill.id === 8) {
                newMagicSchool = config.attunment_pulse_current_school;
            }
            else if (extractedStats.stats['skill_is_now_temporal'] !== undefined) {
                newMagicSchool = skill_genre_1.SkillGenre.Temporal;
            }
            else if (extractedStats.stats['skill_is_now_obliteration'] !== undefined) {
                newMagicSchool = skill_genre_1.SkillGenre.Obliteration;
            }
            if (newMagicSchool !== null) {
                const index = skillAndUpgrades.skill.genres.findIndex(genre => genre === skill_genre_1.SkillGenre.Arcanic || genre === skill_genre_1.SkillGenre.Temporal || genre === skill_genre_1.SkillGenre.Obliteration);
                if (index !== -1) {
                    skillAndUpgrades.skill.genres.splice(index, 1, newMagicSchool);
                }
            }
        }
        if (constants_1.PRIME_TOTEM_SKILL[character.heroClass] === skillAndUpgrades.skill.id && config.add_totem_tag_to_prime_totem_skills && [71, 72].includes(character.reaper.id) && !skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Totem)) {
            skillAndUpgrades.skill.genres.push(skill_genre_1.SkillGenre.Totem);
        }
    }
    getStatsMapping(character, skillAndUpgrades = null) {
        let result = [
            ...data_character_stats_mapping_1.GLOBAL_MERGED_STATS_MAPPING,
            ...data_character_stats_mapping_1.HERO_MERGED_STATS_MAPPING[character.heroClass]
        ];
        if (skillAndUpgrades) {
            const skillMapping = data_character_stats_mapping_1.SKILL_MERGED_STATS_MAPPING[character.heroClass][skillAndUpgrades.skill.id];
            if (skillMapping) {
                result.push(...skillMapping);
            }
        }
        const reaperParents = this.slormancerReaperService.getReaperParentIds(character.reaper.id);
        const reaperMapping = reaperParents
            .map(reaperId => data_character_stats_mapping_1.REAPER_STATS_MAPPING[reaperId])
            .filter(utils_1.isNotNullOrUndefined)
            .flat();
        if (reaperMapping.length > 0) {
            result.push(...reaperMapping);
        }
        return result.map(mapping => ({
            ...mapping,
            source: {
                flat: mapping.source.flat.map(v => ({ ...v })),
                max: mapping.source.max.map(v => ({ ...v })),
                maxMultiplier: mapping.source.maxMultiplier.map(v => ({ ...v })),
                maxPercent: mapping.source.maxPercent.map(v => ({ ...v })),
                multiplier: mapping.source.multiplier.map(v => ({ ...v })),
                percent: mapping.source.percent.map(v => ({ ...v })),
            }
        }));
    }
    updateSkillStats(character, skillAndUpgrades, config, characterStats) {
        const result = {
            unresolvedSynergies: [],
            extractedStats: {},
            stats: [],
            changed: {
                skills: [],
                upgrades: []
            }
        };
        const mapping = this.getStatsMapping(character, skillAndUpgrades);
        const extractedStats = this.slormancerStatsExtractorService.extractSkillStats(skillAndUpgrades, characterStats, mapping, config);
        this.applySkillSpecialChanges(character, skillAndUpgrades, config, extractedStats, result);
        this.slormancerStatsExtractorService.extractSkillInfoStats(character, skillAndUpgrades, extractedStats);
        result.extractedStats = extractedStats.stats;
        result.stats = this.slormancerStatMappingService.buildMergedStats(extractedStats.stats, mapping, config);
        if (character.ultimatum !== null && !character.ultimatum.locked) {
            this.slormancerStatMappingService.applyUltimatum(result.stats, mapping, character.ultimatum, config, result.extractedStats);
        }
        for (const stats of result.stats) {
            this.slormancerStatUpdaterService.updateStatTotal(stats);
        }
        const synergies = extractedStats.synergies.filter(synergy => synergy.effect.stat !== 'berzerker_additional_damage');
        const synergyResult = this.slormancerSynergyResolverService.resolveSynergies(synergies, result.stats, extractedStats.stats, config);
        result.unresolvedSynergies = synergyResult.unresolved;
        this.slormancerSynergyResolverService.resolveIsolatedSynergies(extractedStats.isolatedSynergies, result.stats, extractedStats.stats);
        for (const synergy of [...extractedStats.synergies, ...extractedStats.isolatedSynergies]) {
            if (this.hasSynergyValueChanged(synergy)) {
                if ('skill' in synergy.objectSource) {
                    result.changed.skills.push(synergy.objectSource.skill);
                }
                else if ('upgrade' in synergy.objectSource) {
                    result.changed.upgrades.push(synergy.objectSource.upgrade);
                }
            }
        }
        return result;
    }
};
SlormancerStatsService = __decorate([
    (0, core_1.Injectable)()
], SlormancerStatsService);
exports.SlormancerStatsService = SlormancerStatsService;
//# sourceMappingURL=slormancer-stats.service.js.map