"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerStatsExtractorService = void 0;
const core_1 = require("@angular/core");
const common_1 = require("../../constants/common");
const data_character_stats_mapping_1 = require("../../constants/content/data/data-character-stats-mapping");
const model_1 = require("../../model");
const attribute_1 = require("../../model/content/enum/attribute");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const equipable_item_base_1 = require("../../model/content/enum/equipable-item-base");
const gear_slot_1 = require("../../model/content/enum/gear-slot");
const hero_class_1 = require("../../model/content/enum/hero-class");
const reaper_smith_1 = require("../../model/content/enum/reaper-smith");
const skill_cost_type_1 = require("../../model/content/enum/skill-cost-type");
const skill_genre_1 = require("../../model/content/enum/skill-genre");
const trait_level_1 = require("../../model/content/enum/trait-level");
const rune_type_1 = require("../../model/content/rune-type");
const skill_type_1 = require("../../model/content/skill-type");
const util_1 = require("../../util");
const effect_value_util_1 = require("../../util/effect-value.util");
const synergy_resolver_util_1 = require("../../util/synergy-resolver.util");
const utils_1 = require("../../util/utils");
let SlormancerStatsExtractorService = class SlormancerStatsExtractorService {
    constructor(slormancerStatMappingService, slormancerMergedStatUpdaterService, slormancerDataService, slormancerReaperService, slormancerSkillService, slormancerClassMechanicService, slormancerAncestralLegacyNodeService) {
        this.slormancerStatMappingService = slormancerStatMappingService;
        this.slormancerMergedStatUpdaterService = slormancerMergedStatUpdaterService;
        this.slormancerDataService = slormancerDataService;
        this.slormancerReaperService = slormancerReaperService;
        this.slormancerSkillService = slormancerSkillService;
        this.slormancerClassMechanicService = slormancerClassMechanicService;
        this.slormancerAncestralLegacyNodeService = slormancerAncestralLegacyNodeService;
        this.PHYSICAL_ELEMENTAL_STATS = [
            'min_elemental_damage_add',
            //'elemental_damage_percent',
            'min_basic_damage_add',
            //'basic_damage_percent',
        ];
    }
    getSynergyStatsItWillUpdate(stat, mergedStatMapping, config, stats) {
        let result = [];
        for (const mapping of mergedStatMapping) {
            if (mapping.source.flat.some(s => s.stat === stat && (s.condition === undefined || s.condition(config, stats)))
                || mapping.source.max.some(s => s.stat === stat && (s.condition === undefined || s.condition(config, stats)))
                || mapping.source.percent.some(s => s.stat === stat && (s.condition === undefined || s.condition(config, stats)))
                || mapping.source.multiplier.some(s => s.stat === stat && (s.condition === undefined || s.condition(config, stats)))) {
                result.push({ stat: mapping.stat, mapping });
            }
        }
        if (result.length === 0) {
            result.push({ stat });
        }
        return result;
    }
    addDefaultSynergies(character, config, extractedStats, mergedStatMapping) {
        const addReaperToInnerFire = extractedStats.stats['reaper_added_to_inner_fire'] !== undefined;
        const splitReaperToPhysicalAndElement = extractedStats.stats['reaper_split_to_physical_and_element'] !== undefined;
        const addReaperToElements = extractedStats.stats['reaper_added_to_elements'] !== undefined;
        const addReaperToSkillAndElements = extractedStats.stats['reaper_added_to_skill_and_elements'] !== undefined;
        const overdriveDamageBasedOnSkillDamage = extractedStats.stats['overdrive_damage_based_on_skill_damage'] !== undefined;
        let mapping = mergedStatMapping.find(m => m.stat === 'physical_damage');
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'basic_damage', 'basic_to_physical_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Basic damages' }, [{ stat: 'physical_damage', mapping }], true));
        mapping = mergedStatMapping.find(m => m.stat === 'sum_all_resistances');
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'armor', 'sum_all_resistances_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Armor' }, [{ stat: 'sum_all_resistances', mapping }]));
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'dodge', 'sum_all_resistances_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Dodge' }, [{ stat: 'sum_all_resistances', mapping }]));
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_resist', 'sum_all_resistances_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Elemental resistance' }, [{ stat: 'sum_all_resistances', mapping }]));
        mapping = mergedStatMapping.find(m => m.stat === 'sum_reduced_resistances');
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'reduced_on_melee', 'sum_reduced_resistances_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Reduce on melee' }, [{ stat: 'sum_reduced_resistances', mapping }]));
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'reduced_on_projectile', 'sum_reduced_resistances_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Reduce on projectile' }, [{ stat: 'sum_reduced_resistances', mapping }]));
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'reduced_on_area', 'sum_reduced_resistances_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Reduce on area' }, [{ stat: 'sum_reduced_resistances', mapping }]));
        mapping = mergedStatMapping.find(m => m.stat === 'skill_elem_damage');
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'skill_elem_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Skill damage' }, [{ stat: 'skill_elem_damage', mapping }]));
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'elemental_damage', 'skill_elem_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Elemental damage' }, [{ stat: 'skill_elem_damage', mapping }]));
        mapping = mergedStatMapping.find(m => m.stat === 'overdrive_damage');
        if (overdriveDamageBasedOnSkillDamage) {
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'overdrive_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Skill damage' }, [{ stat: 'overdrive_damage', mapping }], true));
        }
        else {
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'basic_damage', 'overdrive_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Raw damage' }, [{ stat: 'overdrive_damage', mapping }], true));
        }
        // flat_overdrive_damage
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'overdrive_damage', 'flat_overdrive_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, false, true, true, true), 0, { synergy: 'Overdrive damage' }, [{ stat: 'flat_overdrive_damage', mapping }]));
        mapping = mergedStatMapping.find(m => m.stat === 'inner_fire_damage');
        extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'basic_damage', 'inner_fire_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Raw damage' }, [{ stat: 'inner_fire_damage', mapping }], true));
        if (character.heroClass === hero_class_1.HeroClass.Warrior) {
            mapping = mergedStatMapping.find(m => m.stat === 'astral_retribution_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.ASTRAL_RETRIBUTION_DAMAGE_PERCENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'astral_retribution_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Skill damage' }, [{ stat: 'astral_retribution_damage', mapping }]));
            mapping = mergedStatMapping.find(m => m.stat === 'astral_meteor_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.ASTRAL_METEOR_DAMAGE_PERCENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'astral_meteor_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Skill damage' }, [{ stat: 'astral_meteor_damage', mapping }]));
        }
        if (character.heroClass === hero_class_1.HeroClass.Mage) {
            mapping = mergedStatMapping.find(m => m.stat === 'arcane_bond_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.ARCANE_BOND_DAMAGE_FROM_MANA_SPENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'mana_lost_last_second', 'arcane_bond_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Mana lost last second' }, [{ stat: 'arcane_bond_damage', mapping }]));
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.ARCANE_BOND_DAMAGE_FROM_MAX_MANA, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_mana', 'arcane_bond_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Mana lost last second' }, [{ stat: 'arcane_bond_damage', mapping }]));
            // reduced by percent_restored_mana_as_arcane_bond_damage
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.ARCANE_BOND_DAMAGE_FROM_MANA_SPENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'mana_gained_last_second', 'arcane_bond_damage_add_from_restored_mana', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Mana gained last second' }, [{ stat: 'arcane_bond_damage', mapping }]));
        }
        if (character.heroClass === hero_class_1.HeroClass.Huntress) {
            mapping = mergedStatMapping.find(m => m.stat === 'poison_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.POISON_DAMAGE_PERCENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'poison_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Skill damage' }, [{ stat: 'poison_damage', mapping }]));
            mapping = mergedStatMapping.find(m => m.stat === 'ravenous_dagger_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.RAVENOUS_DAGGER_DAMAGE_PERCENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'ravenous_dagger_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Reaper damage' }, [{ stat: 'ravenous_dagger_damage', mapping }]));
            mapping = mergedStatMapping.find(m => m.stat === 'trap_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(common_1.TRAP_DAMAGE_PERCENT, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'physical_damage', 'trap_damage_add', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Skill damage' }, [{ stat: 'trap_damage', mapping }]));
        }
        if (character.reaper.id === 5) {
            let indirect_defense_max_stacks = 0;
            if (extractedStats.stats['indirect_defense_max_stacks'] && extractedStats.stats['indirect_defense_max_stacks'][0]) {
                indirect_defense_max_stacks = extractedStats.stats['indirect_defense_max_stacks'][0].value;
            }
            const indirect_defense = 100 - Math.max(Math.min(indirect_defense_max_stacks, config.indirect_defense_stacks), 0);
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(indirect_defense, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_health', 'indirect_defense', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Max health' }, [{ stat: 'indirect_defense', mapping }]));
        }
        if (addReaperToSkillAndElements) {
            mapping = mergedStatMapping.find(m => m.stat === 'elemental_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_elemental_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages' }, [{ stat: 'elemental_damage', mapping }]));
            mapping = mergedStatMapping.find(m => m.stat === 'physical_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_physical_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages' }, [{ stat: 'physical_damage', mapping }]));
        }
        else if (addReaperToInnerFire) {
            mapping = mergedStatMapping.find(m => m.stat === 'inner_fire_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'inner_fire_damage_add_extra', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages' }, [{ stat: 'inner_fire_damage', mapping }]));
        }
        else if (splitReaperToPhysicalAndElement) {
            mapping = mergedStatMapping.find(m => m.stat === 'elemental_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(50, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_elemental_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages' }, [{ stat: 'elemental_damage', mapping }]));
            mapping = mergedStatMapping.find(m => m.stat === 'physical_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(50, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_physical_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages' }, [{ stat: 'physical_damage', mapping }]));
            if (addReaperToElements) {
                mapping = mergedStatMapping.find(m => m.stat === 'elemental_damage');
                extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_elemental_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages (bug ?)' }, [{ stat: 'elemental_damage', mapping }]));
                mapping = mergedStatMapping.find(m => m.stat === 'physical_damage');
                extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(-50, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_physical_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages (bug ?)' }, [{ stat: 'physical_damage', mapping }]));
            }
        }
        else if (addReaperToElements) {
            let mapping = mergedStatMapping.find(m => m.stat === 'elemental_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_elemental_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages' }, [{ stat: 'elemental_damage', mapping }]));
        }
        else {
            let mapping = mergedStatMapping.find(m => m.stat === 'physical_damage');
            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'weapon_damage', 'weapon_to_physical_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), -1, { synergy: 'Reaper damages' }, [{ stat: 'physical_damage', mapping }]));
        }
        return true;
    }
    addCharacterValues(character, config, stats) {
        const legendaryEffects = (0, util_1.getAllLegendaryEffects)(character.gear);
        const activables = this.getAllActiveActivables(character);
        this.addStat(stats.stats, 'hundred', 100, { character });
        this.addStat(stats.stats, 'light_shield', 0, { character });
        this.addStat(stats.stats, 'half_level', character.level / 2, { character });
        this.addStat(stats.stats, 'remnant_damage_reduction_mult', -common_1.REMNANT_DAMAGE_REDUCTION, { synergy: 'Remnant base damage reduction' });
        this.addStat(stats.stats, 'arcane_clone_attack_speed_global_mult', common_1.ARCANE_CLONE_ATTACK_SPEED_REDUCTION, { synergy: 'Arcane clone base attack speed reduction' });
        if (character.might.ancestral > 0) {
            this.addStat(stats.stats, 'min_elemental_damage_add', character.might.ancestral, { might: 'Ancestral might' });
        }
        if (character.might.skill > 0) {
            this.addStat(stats.stats, 'min_basic_damage_add', character.might.skill, { might: 'Skill might' });
        }
        const supportSkills = [character.skills[0], character.skills[1], character.skills[2]].filter(utils_1.isNotNullOrUndefined);
        this.addStat(stats.stats, 'total_mastery_support', supportSkills.reduce((total, skill) => total + skill.skill.level, 0), { character });
        this.addStat(stats.stats, 'mastery_secondary', character.secondarySkill === null ? 0 : character.secondarySkill.level, character.secondarySkill === null ? { character } : { skill: character.secondarySkill });
        const auraSkills = activables.filter(skill => skill.genres.includes(skill_genre_1.SkillGenre.Aura));
        this.addStat(stats.stats, 'active_aura_count', auraSkills.length, { character });
        const equippedActivables = [
            character.activable1,
            character.activable2,
            character.activable3,
            character.activable4,
        ].filter(utils_1.isNotNullOrUndefined);
        const equippedAuraSkills = auraSkills.filter(skill => equippedActivables.some(equipped => equipped.name === skill.name));
        this.addStat(stats.stats, 'equipped_active_aura_count', equippedAuraSkills.length, { character });
        this.addStat(stats.stats, 'activable_1', character.activable1 === null ? 0 : character.activable1.id, { synergy: 'Activable 1 id' });
        this.addStat(stats.stats, 'activable_2', character.activable2 === null ? 0 : character.activable2.id, { synergy: 'Activable 2 id' });
        this.addStat(stats.stats, 'activable_3', character.activable3 === null ? 0 : character.activable3.id, { synergy: 'Activable 3 id' });
        this.addStat(stats.stats, 'activable_4', character.activable4 === null ? 0 : character.activable4.id, { synergy: 'Activable 4 id' });
        if (character.heroClass === hero_class_1.HeroClass.Mage) {
            const maxedUpgrades = typeof config.maxed_upgrades === 'number'
                ? config.maxed_upgrades
                : this.slormancerSkillService.getNumberOfMaxedUpgrades(character);
            this.addStat(stats.stats, 'maxed_upgrades', maxedUpgrades, { synergy: 'Number of maxed upgrades' });
            this.addStat(stats.stats, 'base_attack_speed_per_arcanic_emblem', common_1.ATTACK_SPEED_PER_ARCANIC_EMBLEM, { synergy: 'Arcanic emblem' });
            this.addStat(stats.stats, 'base_cooldown_reduction_per_temporal_emblem', common_1.COOLDOWN_REDUCTION_PER_TEMPORAL_EMBLEM, { synergy: 'Temporal emblem' });
            this.addStat(stats.stats, 'base_damage_per_obliteration_emblem', common_1.DAMAGE_PER_OBLITERATION_EMBLEM, { synergy: 'Obliteration emblem' });
        }
        if (character.heroClass === hero_class_1.HeroClass.Huntress) {
            const serenity = (0, utils_1.minAndMax)(0, config.serenity, common_1.DELIGHTED_VALUE);
            if (serenity > 0) {
                this.addStat(stats.stats, 'attack_speed_percent', serenity * common_1.ATTACK_SPEED_PER_DELIGHTED_STACK, { synergy: 'Serenity' });
            }
            if (common_1.DELIGHTED_VALUE - serenity > 0) {
                this.addStat(stats.stats, 'cooldown_reduction_global_mult', (common_1.DELIGHTED_VALUE - serenity) * common_1.COOLDOWN_REDUCTION_PER_DELIGHTED_STACK, { synergy: 'Serenity' });
            }
        }
        const activeRealms = this.slormancerAncestralLegacyNodeService.getActiveRealms(character)
            .map(realm => realm.realm);
        const shadowRealms = this.slormancerDataService.getAncestralRealmColors(activeRealms)
            .filter(color => color === model_1.SkillElement.Shadow)
            .length;
        this.addStat(stats.stats, 'shadow_stone', shadowRealms * 100, { synergy: 'Active shadow realms * 100' });
        const allCharacterMasteries = character.skills.reduce((total, skill) => total + skill.skill.level, 0);
        this.addStat(stats.stats, 'all_character_masteries', allCharacterMasteries, { synergy: 'Character skill masteries' });
        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'critical_damage', 'brut_damage_percent_from_crit_damage', effect_value_value_type_1.EffectValueValueType.Unknown, undefined, null, true, true, true, true), 0, { synergy: 'Critical strike damage' }, [{ stat: 'ancestral_damage' }], true));
        // has fisherman set
        const hasFishermanSet = legendaryEffects.some(legendaryEffect => legendaryEffect.id === 190)
            && legendaryEffects.some(legendaryEffect => legendaryEffect.id === 191)
            && legendaryEffects.some(legendaryEffect => legendaryEffect.id === 192);
        if (hasFishermanSet) {
            this.addStat(stats.stats, 'has_fisherman_set', 1, { synergy: 'Fisherman set' });
        }
        // jewel set
        const jewels = [114, 115, 116, 117];
        const equippedJewels = legendaryEffects
            .filter(legendaryEffect => jewels.includes(legendaryEffect.id))
            .filter(util_1.isFirst);
        this.addStat(stats.stats, 'jewel_set', equippedJewels.length, { synergy: 'Number of equipped jewels' });
        // necromancy set necromancy_set
        const necromancyItems = [153, 154, 155];
        const equippedNecromancyItems = legendaryEffects
            .filter(legendaryEffect => necromancyItems.includes(legendaryEffect.id))
            .filter(util_1.isFirst);
        this.addStat(stats.stats, 'necromancy_set', equippedNecromancyItems.length * 100, { synergy: 'Number of equipped necromancy items' });
        if (character.ultimatum !== null) {
            this.addStat(stats.stats, 'equipped_ultimatum', character.ultimatum.type, { synergy: 'Equipped ultimatum type' });
            this.addStat(stats.stats, 'ultimatum_' + character.ultimatum.value.stat, character.ultimatum.value.value, { ultimatum: character.ultimatum });
        }
    }
    addConfigValues(character, config, stats) {
        this.addStat(stats.stats, 'all_level', config.all_other_characters_level + character.level, { synergy: 'Summ all other characters level' });
        this.addStat(stats.stats, 'corrupted_slorm', config.elder_slorms, { synergy: 'Total Elder Slorm' });
        this.addStat(stats.stats, 'damage_stored', config.damage_stored, { synergy: 'Damage stored' });
        this.addStat(stats.stats, 'victims_reaper_104', Math.min(config.victims_reaper_104, 99999), { synergy: 'Goldfish reaper kill count' });
        this.addStat(stats.stats, 'slormocide_60', config.slormocide_60, { synergy: 'Slorm found recently' });
        this.addStat(stats.stats, 'goldbane_5', config.goldbane_5, { synergy: 'Gold found recently' });
        this.addStat(stats.stats, 'enemy_percent_missing_health', config.enemy_percent_missing_health, { synergy: 'Enemy percent missing health' });
        this.addStat(stats.stats, 'block_stacks', config.block_stacks, { synergy: 'Block stacks' });
        this.addStat(stats.stats, 'mana_lost_last_second', config.mana_lost_last_second, { synergy: 'Mana lost last second' });
        this.addStat(stats.stats, 'mana_gained_last_second', config.mana_gained_last_second, { synergy: 'Mana gained last second' });
        this.addStat(stats.stats, 'completed_achievements', config.completed_achievements, { synergy: 'Completed achievements' });
        this.addStat(stats.stats, 'knight_other_level', config.knight_other_level, { synergy: 'Maximum level of Huntress or Mage' });
        this.addStat(stats.stats, 'highest_floor', config.highest_slorm_temple_floor, { synergy: 'Highest Slorm Temple floor' });
        this.addStat(stats.stats, 'support_streak', config.support_streak_stacks, { synergy: 'Support streak stacks' });
        this.addStat(stats.stats, 'hero_class', character.heroClass, { synergy: 'Class id' });
        this.addStat(stats.stats, 'victims_combo', Math.max(0, config.victims_combo), { synergy: 'Combo counter' });
        this.addStat(stats.stats, 'victims_combo_100', Math.max(0, config.victims_combo - 100), { synergy: 'Combo counter minus 100' });
        this.addStat(stats.stats, 'current_dps', 0, { synergy: 'Current dps (not supported)' });
        this.addStat(stats.stats, 'absorbed_damage_wrath', config.absorbed_damage_wrath, { synergy: 'Absorbed damage wrath' });
        this.addStat(stats.stats, 'moonlight_stacks', config.moonlight_stacks, { synergy: 'Moonlight stacks' });
        this.addStat(stats.stats, 'sunlight_stacks', config.sunlight_stacks, { synergy: 'Sunlight stacks' });
        this.addStat(stats.stats, 'enlight_10', config.enlightenment_stacks * 100, { synergy: 'Shield globes picked up recently' });
        this.addStat(stats.stats, 'lifebender_stored', config.life_mana_stored, { synergy: 'Mana and life restored by lifebender effects' });
        this.addStat(stats.stats, 'reaper_owned', Math.min(620, config.reaper_owned), { synergy: 'Reaper owned across all characters' });
        this.addStat(stats.stats, 'life_restored', 0, { synergy: 'life restored' });
        this.addStat(stats.stats, 'evasion_chance_wrath', 0, { synergy: 'Evasion at this wrath level' });
        let rune_affinity = config.effect_rune_affinity;
        if (character.runes.effect !== null && character.runes.effect.reapersmith === character.reaper.smith.id) {
            rune_affinity = character.reaper.reaperAffinity;
        }
        this.addStat(stats.stats, 'rune_affinity', rune_affinity, { synergy: 'Effect rune affinity' });
    }
    addMechanicValues(mechanics, stats) {
        for (const mechanic of mechanics) {
            stats.isolatedSynergies.push(...mechanic.values.filter(utils_1.isEffectValueSynergy)
                .map(synergy => (0, synergy_resolver_util_1.synergyResolveData)(synergy, synergy.displaySynergy, { mechanic })));
        }
    }
    addClassMechanicValues(heroClass, stats) {
        const classMechanics = this.slormancerClassMechanicService.getClassMechanics(heroClass);
        for (const classMechanic of classMechanics) {
            stats.isolatedSynergies.push(...classMechanic.values.filter(utils_1.isEffectValueSynergy)
                .map(synergy => (0, synergy_resolver_util_1.synergyResolveData)(synergy, synergy.displaySynergy, { classMechanic })));
        }
    }
    addAncestralLegacyValues(character, stats, mergedStatMapping, config) {
        for (const ancestralLegacy of character.ancestralLegacies.ancestralLegacies) {
            const active = ancestralLegacy.rank > 0 && character.ancestralLegacies.activeAncestralLegacies.indexOf(ancestralLegacy.id) !== -1;
            for (const effectValue of ancestralLegacy.values) {
                if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                    if (active && !(0, utils_1.isDamageType)(effectValue.stat)) {
                        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, { ancestralLegacy }, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                    }
                    else {
                        stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, { ancestralLegacy }));
                    }
                }
                else if (active && !ancestralLegacy.isActivable) {
                    this.addStat(stats.stats, effectValue.stat, effectValue.value, { ancestralLegacy });
                }
            }
            if (active && !ancestralLegacy.isActivable) {
                if (ancestralLegacy.hasManaCost && ancestralLegacy.currentRankCost !== null) {
                    this.addStat(stats.stats, 'mana_cost_add_skill_imbue', ancestralLegacy.currentRankCost, { ancestralLegacy });
                }
                if (ancestralLegacy.hasLifeCost && ancestralLegacy.currentRankCost !== null) {
                    this.addStat(stats.stats, 'life_cost_add_skill_imbue', ancestralLegacy.currentRankCost, { ancestralLegacy });
                }
            }
            this.addMechanicValues(ancestralLegacy.relatedMechanics, stats);
        }
        const equipedImbues = character.ancestralLegacies.ancestralLegacies
            .filter(ancestralLegacy => character.ancestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id) && ancestralLegacy.types.includes(model_1.AncestralLegacyType.Imbue))
            .length;
        this.addStat(stats.stats, 'equipped_imbues', equipedImbues, { reaper: character.reaper });
    }
    addAttributesValues(character, stats, mergedStatMapping, config) {
        const disableGreaterTraits = stats.stats['disable_greater_traits'] !== undefined;
        for (const attribute of attribute_1.ALL_ATTRIBUTES) {
            const attributeTraits = character.attributes.allocated[attribute];
            const source = { attribute: attributeTraits };
            for (const trait of attributeTraits.traits) {
                if (!disableGreaterTraits || trait.traitLevel !== trait_level_1.TraitLevel.Greater) {
                    for (const effectValue of trait.values) {
                        if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                            if (!trait.unlocked || (0, utils_1.isDamageType)(effectValue.stat)) {
                                stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source));
                            }
                            else {
                                stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                            }
                        }
                        else if (trait.unlocked) {
                            this.addStat(stats.stats, effectValue.stat, effectValue.value, source);
                        }
                    }
                }
                for (const effectValue of trait.cumulativeValues) {
                    if (trait.unlocked) {
                        this.addStat(stats.stats, effectValue.stat, effectValue.value, source);
                    }
                }
            }
        }
    }
    getReaperVariableValue(effectValue, level) {
        const value = effectValue.upgrade > 0 ? (0, util_1.round)(effectValue.upgrade * level, 2) : effectValue.value;
        return value;
    }
    addReaperValues(character, stats, mergedStatMapping, config) {
        const source = { reaper: character.reaper };
        this.addStat(stats.stats, 'min_weapon_damage_add', character.reaper.damages.min, source);
        this.addStat(stats.stats, 'max_weapon_damage_add', character.reaper.damages.max - character.reaper.damages.min, source);
        this.addStat(stats.stats, 'victims_current_reaper', character.reaper.kills, { synergy: 'Current reaper victims' });
        this.addStat(stats.stats, 'reaper_affinity', character.reaper.reaperAffinity, { synergy: 'Current reaper affinity' });
        if (character.reaper.id === 30 || character.reaper.id === 31) {
            this.addStat(stats.stats, 'remain_damage', 1000, { synergy: 'Remain damage' });
        }
        if (character.reaper.id === 114) {
            this.addStat(stats.stats, 'victims_114_all', character.reaper.kills + config.victims_114_others, { synergy: 'Reaper victims across all characters' });
            this.addStat(stats.stats, 'victims_114', character.reaper.kills, { synergy: 'Reaper victims' });
        }
        const effectValues = character.reaper.templates.base.map(effect => effect.values).flat();
        if (character.reaper.primordial) {
            effectValues.push(...character.reaper.templates.benediction.map(effect => effect.values).flat());
            effectValues.push(...character.reaper.templates.malediction.map(effect => effect.values).flat());
        }
        for (const effectValue of effectValues) {
            if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                if ((0, utils_1.isDamageType)(effectValue.stat)) {
                    stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, { reaper: character.reaper }));
                }
                else {
                    stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, { reaper: character.reaper }, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                }
            }
            else {
                let value = effectValue.value;
                if ((0, util_1.isEffectValueVariable)(effectValue)) {
                    value = this.getReaperVariableValue(effectValue, character.reaper.level);
                }
                this.addStat(stats.stats, effectValue.stat, value, source);
            }
        }
        if (common_1.UNITY_REAPERS.includes(character.reaper.id)) {
            let totalDamage = { min: 0, max: 0 };
            let totalLevel = 0;
            let legion5And6 = 0;
            for (const reaperId of common_1.UNITY_REAPERS) {
                const reaperData = this.slormancerDataService.getGameDataReaper(reaperId);
                if (reaperData !== null) {
                    const minLevel = this.slormancerReaperService.getReaperMinimumLevel(reaperId);
                    const maxLevel = reaperData.MAX_LVL ?? 100;
                    const levelsMapping = {
                        [hero_class_1.HeroClass.Warrior]: config['unity_level_0_' + reaperId],
                        [hero_class_1.HeroClass.Huntress]: config['unity_level_1_' + reaperId],
                        [hero_class_1.HeroClass.Mage]: config['unity_level_2_' + reaperId],
                    };
                    if (character.reaper.id === reaperId) {
                        if (character.reaper.primordial) {
                            levelsMapping[character.heroClass] = character.reaper.level;
                        }
                        else {
                            levelsMapping[character.heroClass] = character.reaper.level;
                        }
                    }
                    const levels = [
                        levelsMapping[hero_class_1.HeroClass.Warrior],
                        levelsMapping[hero_class_1.HeroClass.Huntress],
                        levelsMapping[hero_class_1.HeroClass.Mage],
                    ].map(level => level === 0 ? 0 : Math.min(maxLevel, Math.max(minLevel, level)));
                    for (const level of levels) {
                        if (level > 0) {
                            totalLevel += level;
                            const reaper = this.slormancerReaperService.getReaperById(reaperId, character.heroClass, false, level, 0, 0, 0, character.reaper.reaperAffinity, character.reaper.effectAffinity, character.reaper.bonusAffinity, character.reaper.masteryLevel);
                            if (reaper !== null) {
                                totalDamage = (0, util_1.add)(totalDamage, reaper.damages);
                            }
                        }
                    }
                    const reaperNumber = reaperId - 46;
                    const reaperCount = levels.filter(level => level > 0).length;
                    if (reaperNumber >= 5) {
                        legion5And6 += reaperCount;
                    }
                    this.addStat(stats.stats, 'legion_' + reaperNumber, reaperCount, { synergy: 'Number of legion ' + (reaperId - 46) + ' reapers' });
                }
            }
            this.addStat(stats.stats, 'legion_5_6', legion5And6, { synergy: 'Number of legion 5 and 6 reapers' });
            this.addStat(stats.stats, 'legion_level_all', totalLevel, { synergy: 'Total level of legion reapers' });
            this.addStat(stats.stats, 'legion_reaper_dmg', (0, util_1.round)((totalDamage.min + totalDamage.max) / 2, 0), { synergy: 'Total damage of legion reapers' });
        }
    }
    addRunesValues(character, stats, mergedStatMapping, config) {
        const runes = [character.runes.activation, character.runes.effect, character.runes.enhancement].filter(utils_1.isNotNullOrUndefined);
        for (const rune of runes) {
            const source = { rune };
            for (const effectValue of rune.values) {
                const applyEffect = rune.type !== rune_type_1.RuneType.Effect || config.is_rune_active;
                if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                    if ((0, utils_1.isDamageType)(effectValue.stat) || !applyEffect) {
                        stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source));
                    }
                    else {
                        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                    }
                }
                else if (applyEffect) {
                    this.addStat(stats.stats, effectValue.stat, effectValue.value, source);
                }
            }
        }
    }
    addInventoryValues(character, stats) {
        const items = [...character.inventory, ...character.sharedInventory.flat()]
            .filter(utils_1.isNotNullOrUndefined);
        for (const item of items) {
            if (item.legendaryEffect !== null) {
                for (const craftedEffect of item.legendaryEffect.effects) {
                    if ((0, utils_1.isEffectValueSynergy)(craftedEffect.effect)) {
                        stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(craftedEffect.effect, craftedEffect.effect.displaySynergy, { item }));
                    }
                }
            }
        }
    }
    addGearValues(character, stats, config, mergedStatMapping) {
        const addChestTwice = stats.stats['add_chest_stats_twice'] !== undefined;
        const ignorePhysicalElementalStats = stats.stats['ignore_physical_elemental_stats'] !== undefined;
        const halfEquipmentDamageStats = stats.stats['half_equipment_damage_stat'] !== undefined;
        const items = gear_slot_1.ALL_GEAR_SLOT_VALUES
            .map(slot => character.gear[slot])
            .filter(utils_1.isNotNullOrUndefined);
        const statsToIgnore = [];
        if (stats.stats['disable_attack_speed_from_gear_stats'] !== undefined) {
            statsToIgnore.push('cooldown_reduction_global_mult');
        }
        const reaperSmithStats = {};
        this.addStat(stats.stats, 'number_equipped_legendaries', items.filter(item => item.legendaryEffect !== null).length, { synergy: 'Number of equipped legendaries' });
        for (const item of items) {
            const affixEffectValues = item.affixes.map(affix => affix.craftedEffect.effect)
                .filter(affix => !statsToIgnore.includes(affix.stat));
            const effectValues = [
                ...affixEffectValues,
                ...(item.legendaryEffect !== null ? item.legendaryEffect.effects.map(c => c.effect) : []),
                ...(item.legendaryEffect !== null && item.legendaryEffect.activable !== null ? item.legendaryEffect.activable.values : [])
                    .filter(effect => (0, utils_1.isEffectValueSynergy)(effect) && (0, utils_1.isDamageType)(effect.stat))
            ]
                .flat();
            if (addChestTwice && item.base === equipable_item_base_1.EquipableItemBase.Body) {
                effectValues.push(...affixEffectValues);
            }
            for (const effectValue of effectValues) {
                if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                    if ((0, utils_1.isDamageType)(effectValue.stat)) {
                        stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, { item }));
                    }
                    else {
                        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, { item }, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                    }
                }
                else {
                    if (this.PHYSICAL_ELEMENTAL_STATS.includes(effectValue.stat)) {
                        if (halfEquipmentDamageStats) {
                            this.addStat(stats.stats, effectValue.stat, Math.floor(effectValue.value / 2), { item });
                        }
                        else if (!ignorePhysicalElementalStats) {
                            this.addStat(stats.stats, effectValue.stat, effectValue.value, { item });
                        }
                    }
                    else {
                        this.addStat(stats.stats, effectValue.stat, effectValue.value, { item });
                    }
                }
            }
            if (item.reaperEnchantment !== null) {
                reaperSmithStats[item.reaperEnchantment.craftedReaperSmith] = item.reaperEnchantment.craftedValue + (0, utils_1.valueOrDefault)(reaperSmithStats[item.reaperEnchantment.craftedReaperSmith], 0);
            }
        }
        let totalSmithBonus = 0;
        for (const reaperSmith of reaper_smith_1.ALL_REAPER_SMITH) {
            const total = (0, utils_1.valueOrDefault)(reaperSmithStats[reaperSmith], 0);
            totalSmithBonus += total;
            this.addStat(stats.stats, 'reapersmith_' + reaperSmith, total, { character });
        }
        this.addStat(stats.stats, 'reaper_bonus', totalSmithBonus, { character });
    }
    addAdditionalItemValues(additionalItem, stats, mergedStatMapping, config) {
        if (additionalItem !== null) {
            const effectValues = [
                ...(additionalItem.legendaryEffect !== null ? additionalItem.legendaryEffect.effects.map(c => c.effect) : []),
                ...(additionalItem.legendaryEffect !== null && additionalItem.legendaryEffect.activable !== null ? additionalItem.legendaryEffect.activable.values : [])
            ]
                .flat()
                .filter(utils_1.isEffectValueSynergy);
            for (const synergy of effectValues) {
                stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(synergy, synergy.displaySynergy, { item: additionalItem }, this.getSynergyStatsItWillUpdate(synergy.stat, mergedStatMapping, config, stats.stats)));
            }
        }
    }
    addAdditionalRuneValues(additionalRunes, stats, mergedStatMapping, config) {
        for (const additionalRune of additionalRunes) {
            const effectValues = [
                ...additionalRune.values,
                ...(additionalRune.activable !== null ? additionalRune.activable.values : [])
            ]
                .filter(utils_1.isEffectValueSynergy);
            for (const synergy of effectValues) {
                stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(synergy, synergy.displaySynergy, { rune: additionalRune }, this.getSynergyStatsItWillUpdate(synergy.stat, mergedStatMapping, config, stats.stats)));
            }
        }
    }
    addSkillPassiveValues(character, config, stats, mergedStatMapping) {
        const useNonEquippedSupportPassives = [12, 13, 14].includes(character.reaper.id) && character.reaper.primordial;
        let poisonUpgrades = 0;
        for (const sau of character.skills) {
            const skillEquiped = (character.supportSkill === sau.skill || character.primarySkill === sau.skill || character.secondarySkill === sau.skill)
                || (useNonEquippedSupportPassives && sau.skill.specialization !== null);
            for (const skillValue of sau.skill.values) {
                if (skillValue.valueType !== effect_value_value_type_1.EffectValueValueType.Upgrade) {
                    if ((0, utils_1.isEffectValueSynergy)(skillValue)) {
                        stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(skillValue, skillValue.displaySynergy, { skill: sau.skill }));
                    }
                    else if (skillEquiped) {
                        this.addStat(stats.stats, skillValue.stat, skillValue.value, { skill: sau.skill });
                    }
                }
            }
            for (const upgrade of sau.upgrades) {
                const upgradeActive = skillEquiped && sau.activeUpgrades.includes(upgrade.id);
                for (const upgradeValue of upgrade.values) {
                    if (upgradeValue.valueType !== effect_value_value_type_1.EffectValueValueType.Upgrade) {
                        if ((0, utils_1.isEffectValueSynergy)(upgradeValue)) {
                            if (upgradeActive && !(0, utils_1.isDamageType)(upgradeValue.stat)) {
                                stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(upgradeValue, upgradeValue.displaySynergy, { upgrade }, this.getSynergyStatsItWillUpdate(upgradeValue.stat, mergedStatMapping, config, stats.stats)));
                            }
                            else {
                                stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(upgradeValue, upgradeValue.displaySynergy, { upgrade }));
                            }
                        }
                        else if (upgradeActive) {
                            this.addStat(stats.stats, upgradeValue.stat, upgradeValue.value, { upgrade });
                        }
                    }
                }
                this.addMechanicValues(upgrade.relatedMechanics, stats);
                if (upgradeActive && upgrade.relatedClassMechanics.some(classMechanic => classMechanic.id === 211)) {
                    poisonUpgrades++;
                }
            }
            this.addStat(stats.stats, 'based_on_mastery_' + sau.skill.id + '_add', sau.skill.level, { skill: sau.skill });
        }
        this.addStat(stats.stats, 'poison_upgrades', poisonUpgrades, { character });
    }
    addActivableValues(character, stats, mergedStatMapping, config) {
        const activables = this.getAllActiveActivables(character);
        for (const ancestralLegacy of character.ancestralLegacies.ancestralLegacies) {
            if (ancestralLegacy.isActivable) {
                const equiped = activables.includes(ancestralLegacy);
                const source = { ancestralLegacy };
                for (const effectValue of ancestralLegacy.values) {
                    if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                        if (!(0, utils_1.isDamageType)(effectValue.stat)) {
                            stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                        }
                    }
                    else if (equiped) {
                        this.addStat(stats.stats, effectValue.stat, effectValue.value, source);
                    }
                }
            }
        }
        const items = gear_slot_1.ALL_GEAR_SLOT_VALUES
            .map(slot => character.gear[slot])
            .filter(utils_1.isNotNullOrUndefined);
        for (const item of items) {
            if (item.legendaryEffect !== null && item.legendaryEffect.activable !== null) {
                const equiped = activables.includes(item.legendaryEffect.activable);
                const source = { item };
                for (const effectValue of item.legendaryEffect.activable.values) {
                    if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                        if (!(0, utils_1.isDamageType)(effectValue.stat)) {
                            stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                        }
                    }
                    else if (equiped) {
                        this.addStat(stats.stats, effectValue.stat, effectValue.value, source);
                    }
                }
            }
        }
        for (const activable of character.reaper.activables) {
            const equiped = activables.includes(activable);
            const source = { activable };
            for (const effectValue of activable.values) {
                if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                    if (!(0, utils_1.isDamageType)(effectValue.stat)) {
                        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source, this.getSynergyStatsItWillUpdate(effectValue.stat, mergedStatMapping, config, stats.stats)));
                    }
                    else {
                        stats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(effectValue, effectValue.displaySynergy, source));
                    }
                }
                else if (equiped) {
                    this.addStat(stats.stats, effectValue.stat, effectValue.value, source);
                }
            }
        }
    }
    getAllActiveActivables(character) {
        const ancestralLegacyActivables = character.ancestralLegacies.ancestralLegacies
            .filter(ancestralLegacy => character.ancestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id) && ancestralLegacy.isActivable && ancestralLegacy.rank > 0);
        const itemActivables = gear_slot_1.ALL_GEAR_SLOT_VALUES
            .map(slot => character.gear[slot]?.legendaryEffect?.activable)
            .filter(utils_1.isNotNullOrUndefined);
        const reaperActivables = character.reaper.activables;
        return [
            ...ancestralLegacyActivables,
            ...itemActivables,
            ...reaperActivables
        ].filter(activable => activable === character.activable1
            || activable === character.activable2
            || activable === character.activable3
            || activable === character.activable4
            || activable.genres.includes(skill_genre_1.SkillGenre.Aura));
    }
    getTotalSkeletonsReservedMana(summonSkeleton, summoned) {
        const increaseManaCostPerSkeleton = summonSkeleton.values[2];
        const baseCost = summonSkeleton.unbuffedCost;
        let reservedMana = 0;
        if (increaseManaCostPerSkeleton && baseCost) {
            for (let i = 0; i < summoned; i++) {
                reservedMana += this.getSkeletonsReservedMana(baseCost, increaseManaCostPerSkeleton.value, i);
            }
        }
        return reservedMana;
    }
    getSkeletonsReservedMana(baseCost, increasePerSummonedSkeleton, summonedSkeletons) {
        return (0, util_1.bankerRound)(baseCost * (100 + increasePerSummonedSkeleton * summonedSkeletons) / 100);
    }
    getMaximumSkeletons(summonSkeleton, availableMana) {
        let remainingMana = availableMana;
        let maximum = 0;
        if (summonSkeleton.unbuffedCost && summonSkeleton.values[2]) {
            const increaseManaCostPerSkeleton = summonSkeleton.values[2].value;
            const baseCost = summonSkeleton.unbuffedCost;
            let cost = baseCost;
            while (remainingMana > cost) {
                remainingMana -= cost;
                maximum++;
                cost = this.getSkeletonsReservedMana(baseCost, increaseManaCostPerSkeleton, maximum);
            }
        }
        return maximum;
    }
    getLockedManaPercent(activables, config, stats, character) {
        let lockedManaPercent = activables.filter(act => act.costType === skill_cost_type_1.SkillCostType.ManaLock)
            .reduce((t, s) => t + (0, utils_1.valueOrDefault)(s.cost, 0), 0);
        const skeletonSquireSkill = activables.find(activable => activable.id === 17);
        if (skeletonSquireSkill !== undefined && skeletonSquireSkill.cost !== null && 'unbuffedCost' in skeletonSquireSkill) {
            const maxMana = this.slormancerStatMappingService.buildMergedStat(stats.stats, data_character_stats_mapping_1.MAX_MANA_MAPPING, config);
            this.slormancerMergedStatUpdaterService.updateStatTotal(maxMana);
            if (maxMana !== undefined) {
                // synergies are not added here, we hack the evasive magic value
                if (character.heroClass === hero_class_1.HeroClass.Huntress) {
                    const architectOfDeath = character.skills[0];
                    if (architectOfDeath && architectOfDeath.activeUpgrades.includes(134)) {
                        const evasiveMagic = architectOfDeath.upgrades.find(upgrade => upgrade.id === 134);
                        if (evasiveMagic) {
                            const manaValue = evasiveMagic.values[0];
                            if (manaValue && (0, utils_1.isEffectValueSynergy)(manaValue)) {
                                maxMana.total += manaValue.synergy;
                            }
                        }
                    }
                }
                const availableMana = Math.max(0, (maxMana.total * (100 - lockedManaPercent) / 100) - config.minimum_unreserved_mana);
                const maximum = this.getMaximumSkeletons(skeletonSquireSkill, availableMana);
                const summonsCount = config.always_summon_maximum_skeleton_squires ? maximum : Math.min(maximum, config.summoned_skeleton_squires);
                const summonsReservedMana = this.getTotalSkeletonsReservedMana(skeletonSquireSkill, summonsCount);
                if (summonsCount > 0) {
                    lockedManaPercent = lockedManaPercent + (summonsReservedMana * 100 / maxMana.total);
                    if (config.add_skeletons_to_controlled_minions) {
                        this.addStat(stats.stats, 'summoned_skeleton_squires', summonsCount, { synergy: 'Skeletons under your control' });
                    }
                }
            }
        }
        return lockedManaPercent;
    }
    getLockedHealthPercent(activables, config, stats) {
        return activables.filter(act => act.costType === skill_cost_type_1.SkillCostType.LifeLock)
            .reduce((t, s) => t + (0, utils_1.valueOrDefault)(s.cost, 0), 0);
    }
    addDynamicValues(character, config, stats) {
        const activables = this.getAllActiveActivables(character);
        const lockedManaPercent = this.getLockedManaPercent(activables, config, stats, character);
        const lockedHealthPercent = this.getLockedHealthPercent(activables, config, stats);
        const percentMissingMana = Math.min(100, lockedManaPercent > config.percent_missing_mana ? lockedManaPercent : config.percent_missing_mana);
        const percentMissingHealth = Math.min(100, lockedHealthPercent > config.percent_missing_health ? lockedHealthPercent : config.percent_missing_health);
        this.addStat(stats.stats, 'mana_lock_percent', lockedManaPercent, { synergy: 'Percent locked mana' });
        this.addStat(stats.stats, 'mana_lock_percent_ungift', lockedManaPercent, { synergy: 'Percent locked mana (ungifted)' });
        this.addStat(stats.stats, 'percent_locked_health', lockedHealthPercent, { synergy: 'Percent locked life' });
        this.addStat(stats.stats, 'percent_missing_mana', percentMissingMana, { synergy: 'Percent missing mana' });
        this.addStat(stats.stats, 'percent_missing_health', percentMissingHealth, { synergy: 'Percent missing health' });
        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100 - percentMissingMana, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_mana', 'current_mana', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true), -1, { synergy: 'Current mana' }, [{ stat: 'current_mana' }], true));
        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(percentMissingMana, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_mana', 'missing_mana', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true), -1, { synergy: 'Missing mana' }, [{ stat: 'missing_mana' }], true));
        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(lockedManaPercent, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_mana', 'mana_lock_flat', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true), -1, { synergy: 'Locked mana' }, [{ stat: 'mana_lock_flat' }], true));
        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(lockedHealthPercent, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_health', 'life_lock_flat', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true), -1, { synergy: 'Locked life' }, [{ stat: 'life_lock_flat' }], true));
        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(percentMissingHealth, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_health', 'missing_health', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true), -1, { synergy: 'Missing health' }, [{ stat: 'missing_health' }], true));
        stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'max_health', 'max_health_shield', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, undefined, undefined, undefined, true), -1, { synergy: 'Max health and shield' }, [{ stat: 'max_health_shield' }], true));
        const increasedMaxStacks = stats.stats['increased_max_stacks'];
        let increasedMax = 0;
        if (increasedMaxStacks) {
            increasedMax = increasedMaxStacks.map(entity => entity.value).reduce((value, total) => value + total, 0);
        }
        const bloodthirstMaxStacksStat = stats.stats['bloodthirst_max_stacks'];
        let bloodthirstStacks = 0;
        if (bloodthirstMaxStacksStat) {
            const bloodthirstMaxstacks = Math.ceil(bloodthirstMaxStacksStat[0].value) + increasedMax;
            bloodthirstStacks = Math.max(0, Math.min(bloodthirstMaxstacks, config.bloodthirst_stacks));
            this.addStat(stats.stats, 'bloodthirst_stacks', bloodthirstStacks, { synergy: 'Bloodthirst stacks' });
        }
        const ancestralWrathMaxStacks = stats.stats['ancestral_wrath_max_stacks'];
        if (ancestralWrathMaxStacks) {
            let max = 0;
            const ancestralWrathMaxStacksStat = ancestralWrathMaxStacks[0];
            if (ancestralWrathMaxStacksStat) {
                max = Math.ceil(ancestralWrathMaxStacksStat.value) + increasedMax;
            }
            this.addStat(stats.stats, 'ancestral_wrath_stacks', Math.max(0, Math.min(max, config.ancestral_wrath_stacks)), { synergy: 'Ancestral wrath stacks' });
        }
        // Adding blood frenzy attack speed manually due to the computing issue
        if (config.has_blood_frenzy_buff) {
            const bloodfrenzy = [character.activable1, character.activable2, character.activable3, character.activable4]
                .filter(utils_1.isNotNullOrUndefined)
                .find(activable => !('element' in activable) && activable.id === 39);
            if (bloodfrenzy) {
                for (let i = 0; i < bloodthirstStacks; i++) {
                    this.addStat(stats.stats, 'cooldown_reduction_global_mult', 1, { activable: bloodfrenzy });
                }
            }
        }
        if (character.reaper.id === 96) {
            stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100 * config.moonlight_stacks, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'health_regeneration', 'health_regeneration_per_moonlight_stack', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, false, undefined, undefined, true), -1, { synergy: 'Health regeneration per moonlight stack' }, [{ stat: 'health_regeneration_per_moonlight_stack' }]));
            stats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)((0, effect_value_util_1.effectValueSynergy)(100 * config.sunlight_stacks, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.None, false, 'life_on_hit', 'life_on_hit_per_sunlight_stack', effect_value_value_type_1.EffectValueValueType.Stat, undefined, 3, false, undefined, undefined, true), -1, { synergy: 'Life on hit per sunlight stack' }, [{ stat: 'life_on_hit_per_sunlight_stack' }]));
        }
    }
    addBaseValues(character, stats) {
        const baseStats = character.baseStats.map(stat => stat.values.map(value => [stat.stat, value])).flat();
        for (const baseStat of baseStats) {
            this.addStat(stats.stats, baseStat[0], baseStat[1], { character });
        }
        this.addStat(stats.stats, 'hero_level', character.level, { character });
    }
    addStat(cache, stat, value, source) {
        if (stat === null) {
            console.log('NULL stat found at ', new Error().stack);
        }
        else {
            let foundStat = cache[stat];
            if (foundStat === undefined) {
                foundStat = [];
                cache[stat] = foundStat;
            }
            foundStat.push({ value, source });
        }
    }
    extractCharacterStats(character, config, additionalItem = null, additionalRunes = [], mergedStatMapping, additionalStats = {}) {
        const result = {
            synergies: [],
            isolatedSynergies: [],
            stats: { ...additionalStats },
        };
        this.addCharacterValues(character, config, result);
        this.addConfigValues(character, config, result);
        this.addSkillPassiveValues(character, config, result, mergedStatMapping);
        this.addReaperValues(character, result, mergedStatMapping, config);
        this.addRunesValues(character, result, mergedStatMapping, config);
        this.addBaseValues(character, result);
        this.addAncestralLegacyValues(character, result, mergedStatMapping, config);
        this.addAttributesValues(character, result, mergedStatMapping, config);
        this.addGearValues(character, result, config, mergedStatMapping);
        this.addAdditionalItemValues(additionalItem, result, mergedStatMapping, config);
        this.addAdditionalRuneValues(additionalRunes, result, mergedStatMapping, config);
        this.addInventoryValues(character, result);
        this.addActivableValues(character, result, mergedStatMapping, config);
        this.addDefaultSynergies(character, config, result, mergedStatMapping);
        this.addDynamicValues(character, config, result);
        this.addClassMechanicValues(character.heroClass, result);
        return result;
    }
    addSkillValues(skillAndUpgrades, extractedStats, mergedStatMapping, config) {
        for (const skillValue of skillAndUpgrades.skill.values) {
            if ((0, utils_1.isEffectValueSynergy)(skillValue)) {
                if (!(0, utils_1.isDamageType)(skillValue.stat) && skillValue.valueType !== effect_value_value_type_1.EffectValueValueType.Upgrade) {
                    extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(skillValue, skillValue.displaySynergy, { skill: skillAndUpgrades.skill }, this.getSynergyStatsItWillUpdate(skillValue.stat, mergedStatMapping, config, extractedStats.stats)));
                }
                else {
                    extractedStats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(skillValue, skillValue.displaySynergy, { skill: skillAndUpgrades.skill }));
                }
            }
            else if (skillValue.valueType === effect_value_value_type_1.EffectValueValueType.Upgrade) {
                this.addStat(extractedStats.stats, skillValue.stat, skillValue.value, { skill: skillAndUpgrades.skill });
            }
        }
    }
    addUpgradeValues(skillAndUpgrades, extractedStats, mergedStatMapping, config) {
        for (const upgrade of skillAndUpgrades.upgrades) {
            const equipped = skillAndUpgrades.selectedUpgrades.includes(upgrade.id);
            for (const upgradeValue of upgrade.values) {
                if (upgradeValue.valueType === effect_value_value_type_1.EffectValueValueType.Upgrade) {
                    if ((0, utils_1.isEffectValueSynergy)(upgradeValue)) {
                        if (equipped && !(0, utils_1.isDamageType)(upgradeValue.stat)) {
                            extractedStats.synergies.push((0, synergy_resolver_util_1.synergyResolveData)(upgradeValue, upgradeValue.displaySynergy, { upgrade }, this.getSynergyStatsItWillUpdate(upgradeValue.stat, mergedStatMapping, config, extractedStats.stats)));
                        }
                        else {
                            extractedStats.isolatedSynergies.push((0, synergy_resolver_util_1.synergyResolveData)(upgradeValue, upgradeValue.displaySynergy, { upgrade }));
                        }
                    }
                    else if (equipped) {
                        this.addStat(extractedStats.stats, upgradeValue.stat, upgradeValue.value, { upgrade });
                    }
                }
            }
            if (equipped && upgrade.cost !== null && upgrade.cost !== 0) {
                this.addStat(extractedStats.stats, 'mana_cost_add_skill', upgrade.cost, { upgrade });
            }
        }
    }
    extractSkillStats(skillAndUpgrades, characterStats, mergedStatMapping, config) {
        const result = {
            synergies: [],
            isolatedSynergies: [],
            stats: {},
        };
        for (const stat in characterStats.extractedStats) {
            result.stats[stat] = characterStats.extractedStats[stat].slice(0);
        }
        const characterSynergies = [...characterStats.resolvedSynergies, ...characterStats.unresolvedSynergies];
        for (const synergy of characterSynergies) {
            synergy.statsItWillUpdate = this.getSynergyStatsItWillUpdate(synergy.effect.stat, mergedStatMapping, config, result.stats);
        }
        result.synergies = characterSynergies;
        this.addSkillValues(skillAndUpgrades, result, mergedStatMapping, config);
        this.addUpgradeValues(skillAndUpgrades, result, mergedStatMapping, config);
        this.addClassMechanicValues(skillAndUpgrades.skill.heroClass, result);
        result.stats['skill_elements'] = skillAndUpgrades.skill.elements.map(element => ({ value: element, source: { skill: skillAndUpgrades.skill } }));
        return result;
    }
    extractSkillInfoStats(character, skillAndUpgrades, extractedStats) {
        if (skillAndUpgrades.skill.type === skill_type_1.SkillType.Support) {
            this.addStat(extractedStats.stats, 'skill_is_support', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.type === skill_type_1.SkillType.Active) {
            this.addStat(extractedStats.stats, 'skill_is_active', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill === character.supportSkill) {
            this.addStat(extractedStats.stats, 'skill_is_equipped_support', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill === character.primarySkill) {
            this.addStat(extractedStats.stats, 'skill_is_equipped_primary', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill === character.secondarySkill) {
            this.addStat(extractedStats.stats, 'skill_is_equipped_secondary', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Melee)) {
            this.addStat(extractedStats.stats, 'skill_is_melee', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Projectile)) {
            this.addStat(extractedStats.stats, 'skill_is_projectile', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.AreaOfEffect)) {
            this.addStat(extractedStats.stats, 'skill_is_aoe', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Temporal)) {
            this.addStat(extractedStats.stats, 'skill_is_temporal', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Arcanic)) {
            this.addStat(extractedStats.stats, 'skill_is_arcanic', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Obliteration)) {
            this.addStat(extractedStats.stats, 'skill_is_obliteration', 1, { skill: skillAndUpgrades.skill });
        }
        if (skillAndUpgrades.skill.genres.includes(skill_genre_1.SkillGenre.Aura)) {
            this.addStat(extractedStats.stats, 'skill_is_aura', 1, { skill: skillAndUpgrades.skill });
        }
        this.addStat(extractedStats.stats, 'skill_id', skillAndUpgrades.skill.id, { skill: skillAndUpgrades.skill });
        if (skillAndUpgrades.skill.initialManaCost !== null) {
            this.addStat(extractedStats.stats, 'mana_cost_add_skill', skillAndUpgrades.skill.initialManaCost, { skill: skillAndUpgrades.skill });
        }
        // todo rajouter life cost type
        this.addStat(extractedStats.stats, 'cost_type', skill_cost_type_1.ALL_SKILL_COST_TYPES.indexOf(skillAndUpgrades.skill.manaCostType), { skill: skillAndUpgrades.skill });
        if (skillAndUpgrades.skill.baseCooldown !== null) {
            this.addStat(extractedStats.stats, 'cooldown_time_add', skillAndUpgrades.skill.baseCooldown, { skill: skillAndUpgrades.skill });
        }
        if (character.supportSkill) {
            this.addStat(extractedStats.stats, 'support_skill', character.supportSkill.id, { skill: skillAndUpgrades.skill });
        }
        if (character.primarySkill) {
            this.addStat(extractedStats.stats, 'primary_skill', character.primarySkill.id, { skill: skillAndUpgrades.skill });
        }
        if (character.secondarySkill) {
            this.addStat(extractedStats.stats, 'secondary_skill', character.secondarySkill.id, { skill: skillAndUpgrades.skill });
        }
    }
};
SlormancerStatsExtractorService = __decorate([
    (0, core_1.Injectable)()
], SlormancerStatsExtractorService);
exports.SlormancerStatsExtractorService = SlormancerStatsExtractorService;
//# sourceMappingURL=slormancer-stats-extractor.service.js.map