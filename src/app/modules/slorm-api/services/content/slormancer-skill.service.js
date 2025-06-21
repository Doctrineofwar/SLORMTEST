"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerSkillService = void 0;
const core_1 = require("@angular/core");
const data_slorm_cost_1 = require("../../constants/content/data/data-slorm-cost");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const skill_cost_type_1 = require("../../model/content/enum/skill-cost-type");
const skill_genre_1 = require("../../model/content/enum/skill-genre");
const skill_type_1 = require("../../model/content/skill-type");
const effect_value_util_1 = require("../../util/effect-value.util");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerSkillService = class SlormancerSkillService {
    constructor(slormancerTemplateService, slormancerTranslateService, slormancerMechanicService, slormancerClassMechanicService, slormancerDataService, slormancerBuffService, slormancerEffectValueService) {
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerMechanicService = slormancerMechanicService;
        this.slormancerClassMechanicService = slormancerClassMechanicService;
        this.slormancerDataService = slormancerDataService;
        this.slormancerBuffService = slormancerBuffService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.RANK_LABEL = this.slormancerTranslateService.translate('tt_rank');
        this.MASTERY_LABEL = this.slormancerTranslateService.translate('tt_mastery');
        this.COST_LABEL = this.slormancerTranslateService.translate('tt_cost');
        this.COOLDOWN_LABEL = this.slormancerTranslateService.translate('tt_cooldown');
        this.SECONDS_LABEL = this.slormancerTranslateService.translate('tt_seconds');
    }
    getSkillLevelFromXp(heroClass, skill, experience) {
        // TODO
        return 15;
    }
    getSlormUpgradeCosts(upgrade) {
        const tier = upgrade.slormTier.length > 0 ? parseInt(upgrade.slormTier) : null;
        let result = [];
        if (tier !== null) {
            const tierCosts = data_slorm_cost_1.DATA_SLORM_COST.passive[tier];
            if (tierCosts) {
                const lineCosts = tierCosts[upgrade.line];
                if (lineCosts) {
                    const maxRankCosts = lineCosts[upgrade.maxRank];
                    if (maxRankCosts !== undefined) {
                        result = maxRankCosts;
                    }
                }
            }
        }
        return result;
    }
    isDamageStat(stat) {
        return stat === 'physical_damage' || stat === 'elemental_damage' || stat === 'bleed_damage';
    }
    parseEffectValues(data, upgradeType) {
        const valueBases = (0, utils_1.splitFloatData)(data.DESC_VALUE_BASE);
        const valuePerLevels = (0, utils_1.splitFloatData)(data.DESC_VALUE_PER_LVL);
        const valueTypes = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE_TYPE));
        const valueReals = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE_REAL));
        const stats = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE));
        const cascadeSynergy = [skill_type_1.SkillType.Support, skill_type_1.SkillType.Active, skill_type_1.SkillType.Upgrade].includes(data.TYPE);
        const max = Math.max(valueBases.length, valuePerLevels.length, valueTypes.length);
        let result = [];
        for (let i of (0, math_util_1.list)(max)) {
            const type = (0, utils_1.valueOrNull)(valueReals[i]);
            const percent = (0, utils_1.valueOrNull)(valueTypes[i]) === '%';
            const value = (0, utils_1.valueOrDefault)(valueBases[i], 0);
            const upgrade = (0, utils_1.valueOrDefault)(valuePerLevels[i], 0);
            const stat = (0, utils_1.valueOrDefault)(stats[i], null);
            if (stat !== null && this.isDamageStat(stat)) {
                result.push((0, effect_value_util_1.effectValueSynergy)(value, upgrade, upgradeType, false, stat, effect_value_value_type_1.EffectValueValueType.Damage, undefined, undefined, undefined, undefined, undefined, undefined, cascadeSynergy));
            }
            else if (type === null) {
                result.push((0, effect_value_util_1.effectValueVariable)(value, upgrade, upgradeType, percent, stat, effect_value_value_type_1.EffectValueValueType.Stat));
            }
            else if (type === 'negative') {
                result.push((0, effect_value_util_1.effectValueVariable)(value, -upgrade, upgradeType, percent, stat, effect_value_value_type_1.EffectValueValueType.Stat));
            }
            else if (type === 'every_3') {
                result.push((0, effect_value_util_1.effectValueVariable)(value, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.Every3, percent, stat, effect_value_value_type_1.EffectValueValueType.Stat));
            }
            else {
                const typeValues = (0, utils_1.splitData)(type, ':');
                const source = typeValues[1];
                if (typeValues[0] === 'based_on_mastery') {
                    result.push((0, effect_value_util_1.effectValueSynergy)(value * 100, 0, upgradeType, percent, 'based_on_mastery_' + source, stat, undefined, undefined, undefined, undefined, undefined, undefined, cascadeSynergy));
                }
                else {
                    result.push((0, effect_value_util_1.effectValueSynergy)(value, upgrade, upgradeType, percent, source, stat, undefined, undefined, undefined, undefined, undefined, undefined, cascadeSynergy));
                }
            }
        }
        return result;
    }
    applyOverride(skill, overrideData) {
        if (overrideData !== null) {
            if (overrideData.override) {
                overrideData.override(skill.values);
            }
            if (overrideData.costTypeOverride) {
                if ('costType' in skill) {
                    skill.costType = overrideData.costTypeOverride;
                }
                else if ('manaCostType' in skill) {
                    skill.manaCostType = overrideData.costTypeOverride;
                }
            }
            if (overrideData.additionalGenres && 'genres' in skill) {
                skill.genres.push(...overrideData.additionalGenres);
            }
            if (overrideData.additionalGenres && 'baseGenres' in skill) {
                skill.baseGenres.push(...overrideData.additionalGenres);
            }
            if (overrideData.order !== undefined && 'order' in skill) {
                skill.order = overrideData.order;
            }
            if (overrideData.line !== undefined && 'line' in skill) {
                skill.line = overrideData.line;
            }
        }
    }
    getHeroSkill(skillId, heroClass, baseLevel = 15, bonusLevel = 0) {
        const gameDataSkill = this.slormancerDataService.getGameDataSkill(heroClass, skillId);
        const dataSkill = this.slormancerDataService.getDataSkill(heroClass, skillId);
        let skill = null;
        if (gameDataSkill !== null && (gameDataSkill.TYPE == skill_type_1.SkillType.Support || gameDataSkill.TYPE === skill_type_1.SkillType.Active)) {
            const maxLevel = gameDataSkill.UPGRADE_NUMBER ?? 0;
            const genres = (0, utils_1.splitData)(gameDataSkill.GENRE, ',');
            if (gameDataSkill.AUTO_CD === 1) {
                genres.push(skill_genre_1.SkillGenre.Fast);
            }
            skill = {
                id: gameDataSkill.REF,
                type: gameDataSkill.TYPE,
                heroClass,
                level: 0,
                unlockLevel: gameDataSkill.UNLOCK_LEVEL,
                maxLevel,
                baseLevel,
                bonusLevel,
                name: gameDataSkill.EN_NAME,
                specialization: null,
                specializationName: null,
                icon: 'skill/' + heroClass + '/' + gameDataSkill.REF,
                levelIcon: '',
                iconLarge: 'skill/' + heroClass + '/' + gameDataSkill.REF + '_large',
                description: '',
                baseCooldown: gameDataSkill.COOLDOWN === null ? null : (0, math_util_1.round)(gameDataSkill.COOLDOWN / 60, 2),
                cooldown: 0,
                precastTime: gameDataSkill.PRECAST_TIME,
                castTime: gameDataSkill.CAST_TIME,
                initialManaCost: gameDataSkill.COST,
                perLevelManaCost: gameDataSkill.COST_LEVEL,
                baseManaCost: 0,
                manaCost: 0,
                baseLifeCost: 0,
                lifeCost: 0,
                baseCostType: gameDataSkill.COST_TYPE,
                manaCostType: gameDataSkill.COST_TYPE,
                lifeCostType: skill_cost_type_1.SkillCostType.None,
                hasLifeCost: false,
                hasManaCost: false,
                hasNoCost: false,
                baseGenres: genres.splice(0),
                genres: genres.splice(0),
                damageTypes: (0, utils_1.splitData)(gameDataSkill.DMG_TYPE, ','),
                locked: false,
                elements: [],
                nameLabel: '',
                genresLabel: null,
                fastLabel: null,
                costLabel: null,
                cooldownLabel: null,
                cooldownDetailsLabel: null,
                template: this.slormancerTemplateService.getSkillDescriptionTemplate(gameDataSkill),
                values: this.parseEffectValues(gameDataSkill, effect_value_upgrade_type_1.EffectValueUpgradeType.Mastery)
            };
            this.applyOverride(skill, dataSkill);
            skill.specialization = dataSkill === null ? null : (0, utils_1.valueOrNull)(dataSkill.specialization);
            this.updateSkillModel(skill);
            this.updateSkillView(skill);
        }
        return skill;
    }
    getHeroSkillClone(skill) {
        return { ...skill,
            genres: [...skill.genres],
            damageTypes: [...skill.damageTypes],
            values: skill.values.map(value => this.slormancerEffectValueService.getEffectValueClone(value))
        };
    }
    updateSkillModel(skill) {
        skill.level = Math.min(skill.maxLevel, skill.baseLevel) + skill.bonusLevel;
        skill.cooldown = skill.baseCooldown;
        skill.genres = skill.baseGenres.slice(0);
        this.updateSkillCost(skill);
        for (const effectValue of skill.values) {
            this.slormancerEffectValueService.updateEffectValue(effectValue, skill.level);
        }
    }
    updateSkillCost(skill) {
        skill.baseManaCost = null;
        if (skill.initialManaCost !== null) {
            skill.baseManaCost = skill.initialManaCost;
            if (skill.perLevelManaCost !== null) {
                skill.baseManaCost += skill.perLevelManaCost * skill.level;
            }
        }
        skill.manaCostType = skill.baseCostType;
        skill.lifeCostType = skill_cost_type_1.SkillCostType.None;
        this.updateSkillCostType(skill);
    }
    updateSkillCostType(skill) {
        skill.hasLifeCost = skill.lifeCostType === skill_cost_type_1.SkillCostType.LifeSecond || skill.lifeCostType === skill_cost_type_1.SkillCostType.LifeLockFlat || skill.lifeCostType === skill_cost_type_1.SkillCostType.Life;
        skill.hasManaCost = skill.manaCostType === skill_cost_type_1.SkillCostType.ManaSecond || skill.manaCostType === skill_cost_type_1.SkillCostType.ManaLockFlat || skill.manaCostType === skill_cost_type_1.SkillCostType.Mana;
        skill.hasNoCost = !skill.hasLifeCost && !skill.hasManaCost;
    }
    updateSkillView(skill) {
        if (skill.specialization !== null) {
            const specialization = this.slormancerDataService.getGameDataSpecializationSkill(skill.heroClass, skill.specialization);
            if (specialization !== null) {
                skill.specializationName = specialization.EN_NAME;
            }
        }
        skill.nameLabel = [skill.specializationName, skill.name].filter(utils_1.isNotNullOrUndefined).join('<br/>');
        skill.genresLabel = null;
        if (skill.genres.length > 0) {
            skill.genresLabel = skill.genres
                .filter(genre => genre !== skill_genre_1.SkillGenre.Fast)
                .map(genre => this.slormancerTranslateService.translate('atk_' + genre))
                .join(' ');
        }
        skill.fastLabel = null;
        if (skill.genres.includes(skill_genre_1.SkillGenre.Fast)) {
            skill.fastLabel = this.slormancerTranslateService.translate('tt_auto_attack');
        }
        skill.costLabel = null;
        if (!skill.hasNoCost) {
            const costs = [];
            if (skill.hasManaCost && skill.manaCost !== null) {
                costs.push(this.slormancerTemplateService.asSpan(skill.manaCost.toString(), 'value mana')
                    + ' ' + this.slormancerTranslateService.translateCostType(skill.manaCostType));
            }
            if (skill.hasLifeCost) {
                costs.push(this.slormancerTemplateService.asSpan(skill.lifeCost.toString(), 'value life')
                    + ' ' + this.slormancerTranslateService.translateCostType(skill.lifeCostType));
            }
            if (costs.length > 0) {
                skill.costLabel = this.COST_LABEL + ': <div>' + costs.join('<br/>') + '</div>';
            }
        }
        skill.cooldownLabel = null;
        if (skill.cooldown !== null && skill.baseCooldown !== null && skill.baseCooldown > 0) {
            skill.cooldownLabel = this.COOLDOWN_LABEL
                + ': ' + this.slormancerTemplateService.asSpan(skill.cooldown.toString(), 'value')
                + ' ' + this.SECONDS_LABEL;
        }
        skill.description = this.slormancerTemplateService.formatSkillDescription(skill.template, skill.values);
        skill.levelIcon = 'level/' + Math.max(1, skill.baseLevel);
    }
    updateSkillCooldownDetails(skill, attackSpeed = 0) {
        const cooldown = skill.cooldown !== null ? skill.cooldown : 0;
        const precastSeconds = skill.precastTime === null ? 0 : skill.precastTime / 60;
        const castSeconds = skill.castTime === null ? 0 : skill.castTime / 60;
        const estimatedRealCooldown = (0, math_util_1.round)(precastSeconds + (castSeconds * (100 - attackSpeed) / 100) + cooldown, 3);
        const formula = 'round(' + skill.precastTime + '/60 + ' + skill.castTime + '/60 * (100 - ' + attackSpeed + ') / 100 + ' + cooldown + ')';
        skill.cooldownDetailsLabel = 'Precast frames : ' + skill.precastTime + ' (' + (0, math_util_1.round)(precastSeconds, 3) + 's)'
            + "\n" + 'Cast frames : ' + skill.castTime + ' (' + (0, math_util_1.round)(castSeconds, 3) + 's)'
            + "\n" + 'Attack speed : ' + attackSpeed + '%'
            + "\n" + 'Estimated time between casts : ' + estimatedRealCooldown + 's'
            + "\n" + 'Formula : ' + formula;
    }
    getMechanicClone(mechanic) {
        return { ...mechanic };
    }
    getBuffClone(buff) {
        return { ...buff };
    }
    getUpgradeClone(upgrade) {
        return {
            ...upgrade,
            genres: [...upgrade.genres],
            damageTypes: [...upgrade.damageTypes],
            relatedClassMechanics: [...upgrade.relatedClassMechanics],
            relatedMechanics: upgrade.relatedMechanics.map(mechanic => this.slormancerMechanicService.getMechanicClone(mechanic)),
            relatedBuffs: upgrade.relatedBuffs.map(buff => this.getBuffClone(buff)),
            template: upgrade.template,
            values: upgrade.values.map(value => this.slormancerEffectValueService.getEffectValueClone(value))
        };
    }
    getUpgrade(upgradeId, heroClass, baseRank) {
        const gameDataSkill = this.slormancerDataService.getGameDataSkill(heroClass, upgradeId);
        const dataSkill = this.slormancerDataService.getDataSkill(heroClass, upgradeId);
        let upgrade = null;
        if (gameDataSkill !== null && (gameDataSkill.TYPE == skill_type_1.SkillType.Passive || gameDataSkill.TYPE === skill_type_1.SkillType.Upgrade)) {
            const parentSkill = this.slormancerDataService.getGameDataSkill(heroClass, gameDataSkill.ACTIVE_BOX);
            const values = this.parseEffectValues(gameDataSkill, effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank);
            const masteryRequired = dataSkill === null ? 0 : (0, utils_1.valueOrDefault)(dataSkill.masteryRequired, 0);
            const line = ((parentSkill !== null && parentSkill.TYPE === skill_type_1.SkillType.Support) ? masteryRequired : Math.ceil(masteryRequired / 2));
            const maxRank = gameDataSkill.UPGRADE_NUMBER ?? 0;
            upgrade = {
                id: gameDataSkill.REF,
                order: gameDataSkill.REF,
                skillId: gameDataSkill.ACTIVE_BOX,
                masteryRequired,
                line,
                type: gameDataSkill.TYPE,
                rank: 0,
                upgradeLevel: gameDataSkill.UNLOCK_LEVEL,
                maxRank,
                baseRank: Math.min(maxRank, baseRank),
                name: gameDataSkill.EN_NAME,
                icon: 'assets/img/icon/skill/' + heroClass + '/' + gameDataSkill.REF + '.png',
                description: '',
                initialCost: gameDataSkill.COST,
                perLevelCost: gameDataSkill.COST_LEVEL,
                baseCost: 0,
                cost: 0,
                costType: gameDataSkill.COST_TYPE,
                hasLifeCost: false,
                hasManaCost: false,
                hasNoCost: false,
                genres: (0, utils_1.splitData)(gameDataSkill.GENRE, ','),
                damageTypes: (0, utils_1.splitData)(gameDataSkill.DMG_TYPE, ','),
                slormTier: parentSkill === null ? "" : parentSkill.SLORM_TIER,
                upgradeSlormCost: null,
                totalSlormCost: 0,
                investedSlorm: 0,
                masteryLabel: null,
                rankLabel: null,
                genresLabel: null,
                costLabel: null,
                relatedClassMechanics: this.extractSkillMechanics(gameDataSkill.EN_DESCRIPTION, heroClass, dataSkill === null || dataSkill.additionalClassMechanics === undefined ? [] : dataSkill.additionalClassMechanics, gameDataSkill.REF),
                relatedMechanics: [],
                relatedBuffs: this.extractBuffs(gameDataSkill.EN_DESCRIPTION),
                template: this.slormancerTemplateService.getSkillDescriptionTemplate(gameDataSkill),
                values
            };
            this.applyOverride(upgrade, dataSkill);
            upgrade.relatedMechanics = this.extractMechanics(gameDataSkill.EN_DESCRIPTION, values, dataSkill !== null && dataSkill.additionalMechanics ? dataSkill.additionalMechanics : []);
            this.updateUpgradeModel(upgrade);
            this.updateUpgradeView(upgrade);
        }
        return upgrade;
    }
    extractBuffs(template) {
        return (0, utils_1.valueOrDefault)(template.match(/<(.*?)>/g), [])
            .map(m => this.slormancerDataService.getDataSkillBuff(m))
            .filter(utils_1.isNotNullOrUndefined)
            .filter(utils_1.isFirst)
            .map(ref => this.slormancerBuffService.getBuff(ref))
            .filter(utils_1.isNotNullOrUndefined);
    }
    extractSkillMechanics(template, heroClass, additionalSkillMechanics, id) {
        const ids = (0, utils_1.valueOrDefault)(template.match(/<(.*?)>/g), [])
            .map(m => this.slormancerDataService.getDataSkillClassMechanicIdByName(heroClass, m));
        if (ids.some(id => id !== null && additionalSkillMechanics.includes(id))) {
            console.warn('useless added class mechanics for ' + id + ' : ', template, ids, additionalSkillMechanics);
        }
        return [...ids, ...additionalSkillMechanics]
            .filter(utils_1.isNotNullOrUndefined)
            .filter(utils_1.isFirst)
            .map(id => this.slormancerClassMechanicService.getClassMechanic(heroClass, id))
            .filter(utils_1.isNotNullOrUndefined);
    }
    extractMechanics(template, values, additional) {
        const templateMechanics = (0, utils_1.valueOrDefault)(template.match(/<(.*?)>/g), [])
            .map(m => this.slormancerDataService.getDataTemplateMechanic(m));
        const attributeMechanics = values.map(value => value.stat)
            .filter(utils_1.isNotNullOrUndefined)
            .map(stat => this.slormancerDataService.getDataAttributeMechanic(stat));
        const synergyMechanics = values
            .filter(utils_1.isEffectValueSynergy)
            .map(value => this.slormancerDataService.getDataAttributeMechanic(value.source));
        if ([...attributeMechanics, ...synergyMechanics, ...templateMechanics].some(mechanic => mechanic !== null && additional.includes(mechanic))) {
            console.warn('Useless additional mechanic found for ', template, additional);
        }
        return [...attributeMechanics, ...synergyMechanics, ...templateMechanics, ...additional]
            .filter(utils_1.isNotNullOrUndefined)
            .filter(utils_1.isFirst)
            .map(type => this.slormancerMechanicService.getMechanic(type));
    }
    updateUpgradeModel(upgrade) {
        upgrade.rank = Math.min(upgrade.maxRank, upgrade.baseRank);
        upgrade.baseCost = null;
        if (upgrade.initialCost !== null) {
            upgrade.baseCost = upgrade.initialCost;
            if (upgrade.perLevelCost !== null) {
                upgrade.baseCost += upgrade.perLevelCost * Math.max(upgrade.rank, 1);
            }
        }
        upgrade.cost = upgrade.baseCost;
        upgrade.hasLifeCost = upgrade.costType === skill_cost_type_1.SkillCostType.LifeSecond || upgrade.costType === skill_cost_type_1.SkillCostType.LifeLockFlat || upgrade.costType === skill_cost_type_1.SkillCostType.Life;
        upgrade.hasManaCost = upgrade.costType === skill_cost_type_1.SkillCostType.ManaSecond || upgrade.costType === skill_cost_type_1.SkillCostType.ManaLockFlat || upgrade.costType === skill_cost_type_1.SkillCostType.Mana;
        upgrade.hasNoCost = upgrade.costType === skill_cost_type_1.SkillCostType.None || upgrade.baseCost === 0;
        const upgradeCosts = this.getSlormUpgradeCosts(upgrade);
        upgrade.investedSlorm = upgradeCosts.reduce((total, current, index) => index < upgrade.rank ? current + total : total, 0);
        upgrade.totalSlormCost = upgradeCosts.reduce((total, current) => current + total, 0);
        upgrade.upgradeSlormCost = upgradeCosts[upgrade.rank] ?? null;
        for (const effectValue of upgrade.values) {
            this.slormancerEffectValueService.updateEffectValue(effectValue, upgrade.rank);
        }
    }
    updateUpgradeView(upgrade) {
        upgrade.masteryLabel = this.MASTERY_LABEL + ' ' + upgrade.masteryRequired;
        upgrade.rankLabel = this.RANK_LABEL + ': ' + this.slormancerTemplateService.asSpan(upgrade.rank.toString(), 'current') + '/' + upgrade.maxRank;
        upgrade.genresLabel = null;
        if (upgrade.genres.length > 0) {
            upgrade.genresLabel = upgrade.genres
                .map(genre => this.slormancerTranslateService.translate('atk_' + genre))
                .join(' ');
        }
        upgrade.costLabel = null;
        if (!upgrade.hasNoCost && upgrade.cost !== null) {
            upgrade.costLabel = this.COST_LABEL
                + ': ' + this.slormancerTemplateService.asSpan(upgrade.cost.toString(), upgrade.hasManaCost ? 'value mana' : 'value life')
                + ' ' + this.slormancerTranslateService.translate('tt_' + upgrade.costType);
        }
        upgrade.description = this.slormancerTemplateService.formatUpgradeDescription(upgrade.template, upgrade.values);
    }
    getNumberOfMaxedUpgrades(character) {
        return character.skills.map(skill => skill.upgrades).flat().filter(upgrade => upgrade.rank === upgrade.maxRank).length;
    }
};
SlormancerSkillService = __decorate([
    (0, core_1.Injectable)()
], SlormancerSkillService);
exports.SlormancerSkillService = SlormancerSkillService;
//# sourceMappingURL=slormancer-skill.service.js.map