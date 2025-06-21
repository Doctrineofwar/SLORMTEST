"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerAncestralLegacyService = void 0;
const core_1 = require("@angular/core");
const data_slorm_cost_1 = require("../../constants/content/data/data-slorm-cost");
const ancestral_legacy_type_1 = require("../../model/content/ancestral-legacy-type");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const skill_cost_type_1 = require("../../model/content/enum/skill-cost-type");
const skill_genre_1 = require("../../model/content/enum/skill-genre");
const effect_value_util_1 = require("../../util/effect-value.util");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerAncestralLegacyService = class SlormancerAncestralLegacyService {
    constructor(slormancerDataService, slormancerBuffService, slormancerEffectValueService, slormancerTranslateService, slormancerTemplateService, slormancerMechanicService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerBuffService = slormancerBuffService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerMechanicService = slormancerMechanicService;
        this.ACTIVE_PREFIX = 'active_skill_add';
        this.TIER_ID = {
            1: [15, 24, 32, 53, 80, 96, 101, 126, 127, 148],
            2: [0, 16, 57, 81, 94, 102, 125, 128, 129, 143],
            3: [19, 35, 55, 72, 85, 93, 97, 98, 100, 119, 121, 149],
            4: [6, 41, 82, 89, 90, 106, 122, 132, 140, 142],
            5: [34, 139, 17, 104, 138, 112, 2, 7, 5, 146, 71, 114, 120, 64, 47, 46, 48, 52, 36, 33],
            6: [99, 77, 29, 25, 76, 12, 103, 65, 108, 69, 73, 79, 144, 107, 56, 78, 42],
            7: [30, 87, 18, 130, 137, 134, 4, 124, 67, 83, 110, 92, 131, 136, 37],
            8: [117, 38, 39, 49, 50, 61, 62, 8, 115, 9, 21, 116, 22, 123, 20, 147, 44, 109, 58, 118, 74, 66, 145, 14, 133, 11],
            9: [43, 45, 111, 27, 28, 26, 141, 13, 1, 3, 75, 70, 105, 68, 135, 54, 59, 60, 91, 31],
            10: [40, 113, 23, 86, 10, 95, 63, 84, 51, 88],
        };
        this.COST_LABEL = this.slormancerTranslateService.translate('tt_cost');
        this.COOLDOWN_LABEL = this.slormancerTranslateService.translate('tt_cooldown');
        this.SECONDS_LABEL = this.slormancerTranslateService.translate('tt_seconds');
        this.RANK_LABEL = this.slormancerTranslateService.translate('tt_rank');
    }
    isActivable(types) {
        return types.indexOf(ancestral_legacy_type_1.AncestralLegacyType.Active) !== -1;
    }
    isDamageStat(stat) {
        return stat === 'physical_damage' || stat === 'elemental_damage' || stat === 'bleed_damage';
    }
    getSlormTier(id) {
        let tier = null;
        for (let i = 1; i <= 10; i++) {
            const tierIds = this.TIER_ID[i] ?? [];
            if (tierIds.includes(id)) {
                tier = i;
                break;
            }
        }
        return tier;
    }
    getAncestralLegacySlormCosts(ancestralLegacy) {
        let result = [];
        if (ancestralLegacy.slormTier !== null) {
            const tierCosts = data_slorm_cost_1.DATA_SLORM_COST.ancestral[ancestralLegacy.slormTier];
            if (tierCosts) {
                const maxRankCosts = tierCosts[ancestralLegacy.maxRank];
                if (maxRankCosts !== undefined) {
                    result = maxRankCosts;
                }
            }
        }
        return result;
    }
    parseEffectValues(data) {
        const valueBases = (0, utils_1.splitFloatData)(data.DESC_VALUE_BASE);
        const valuePerLevels = (0, utils_1.splitFloatData)(data.DESC_VALUE_PER_LVL);
        const valueTypes = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE_TYPE));
        const valueReals = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE_REAL));
        const stats = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE));
        const damageTypes = (0, utils_1.removeEmptyValues)((0, utils_1.splitData)(data.DMG_TYPE));
        const max = Math.max(valueBases.length, valuePerLevels.length, valueTypes.length);
        let result = [];
        for (let i of (0, math_util_1.list)(max)) {
            const type = (0, utils_1.valueOrNull)(valueReals[i]);
            const percent = (0, utils_1.valueOrNull)(valueTypes[i]) === '%';
            const baseValue = (0, utils_1.valueOrDefault)(valueBases[i], 0);
            const upgrade = (0, utils_1.valueOrDefault)(valuePerLevels[i], 0);
            const stat = (0, utils_1.valueOrDefault)(stats[i], null);
            if (stat !== null && this.isDamageStat(stat)) {
                const damageType = (0, utils_1.valueOrDefault)(damageTypes.splice(0, 1)[0], 'phy');
                const source = damageType === 'phy' ? 'physical_damage' : 'elemental_damage';
                result.push((0, effect_value_util_1.effectValueSynergy)(baseValue, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.AncestralRank, false, source, effect_value_value_type_1.EffectValueValueType.Damage));
            }
            else if (type === null) {
                result.push((0, effect_value_util_1.effectValueVariable)(baseValue, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.AncestralRank, percent, stat));
            }
            else if (type === 'negative') {
                result.push((0, effect_value_util_1.effectValueVariable)(baseValue, -upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.AncestralRank, percent, stat));
            }
            else {
                const typeValues = (0, utils_1.splitData)(type, ':');
                const source = typeValues[1];
                result.push((0, effect_value_util_1.effectValueSynergy)(baseValue, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.AncestralRank, percent, source, stat));
            }
        }
        return result;
    }
    extractBuffs(template, additional) {
        const extractedBuffs = (0, utils_1.valueOrDefault)(template.match(/<(.*?)>/g), [])
            .map(m => this.slormancerDataService.getDataSkillBuff(m))
            .filter(utils_1.isNotNullOrUndefined);
        return [...extractedBuffs, ...additional]
            .filter(utils_1.isFirst)
            .map(ref => this.slormancerBuffService.getBuff(ref))
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
        return [...attributeMechanics, ...synergyMechanics, ...templateMechanics, ...additional]
            .filter(utils_1.isNotNullOrUndefined)
            .filter(utils_1.isFirst)
            .map(mechanic => this.slormancerMechanicService.getMechanic(mechanic));
    }
    isAvailable(ref) {
        return this.slormancerDataService.getGameDataAncestralLegacyIds().indexOf(ref) !== -1;
    }
    getAncestralLegacyClone(ancestralLegacy) {
        return {
            ...ancestralLegacy,
            types: [...ancestralLegacy.types],
            damageTypes: [...ancestralLegacy.damageTypes],
            genres: [...ancestralLegacy.genres],
            relatedBuffs: [...ancestralLegacy.relatedBuffs],
            relatedMechanics: ancestralLegacy.relatedMechanics.map(mechanic => this.slormancerMechanicService.getMechanicClone(mechanic)),
            values: ancestralLegacy.values.map(value => this.slormancerEffectValueService.getEffectValueClone(value))
        };
    }
    getAncestralLegacy(ref, baseRank, bonusRank = 0) {
        const gameData = this.slormancerDataService.getGameDataAncestralLegacy(ref);
        let ancestralLegacy = null;
        if (gameData !== null) {
            const data = this.slormancerDataService.getDataAncestralLegacy(ref);
            const values = this.parseEffectValues(gameData);
            ancestralLegacy = {
                id: ref,
                name: gameData.EN_NAME,
                icon: 'assets/img/icon/legacy/' + ref + '.png',
                description: '',
                types: (0, utils_1.splitData)(gameData.TYPE, ','),
                element: gameData.REALM_COLOR,
                damageTypes: (0, utils_1.splitData)(gameData.DMG_TYPE, ','),
                sealMerge: gameData.SEAL_MERGE,
                cooldown: null,
                baseCooldown: gameData.COOLDOWN,
                auraBuff: gameData.AURA_BUFF_NAME === null ? null : this.slormancerBuffService.getBuff(gameData.AURA_BUFF_NAME),
                genres: (0, utils_1.splitData)(gameData.GENRE, ","),
                cost: null,
                currentRankCost: null,
                baseCost: gameData.COST,
                costPerRank: gameData.COST_LEVEL,
                baseCostType: gameData.COST_TYPE,
                costType: gameData.COST_TYPE,
                rank: 0,
                forcedRank: null,
                baseRank: baseRank,
                bonusRank: bonusRank,
                baseMaxRank: gameData.UPGRADE_NUMBER,
                maxRank: 0,
                hasLifeCost: false,
                hasManaCost: false,
                hasNoCost: false,
                realm: gameData.REALM,
                isActivable: false,
                slormTier: this.getSlormTier(gameData.REF),
                upgradeSlormCost: null,
                investedSlorm: 0,
                totalSlormCost: 0,
                relatedBuffs: this.extractBuffs(gameData.EN_DESCRIPTION, data !== null && data.additionalBuffs ? data.additionalBuffs : []),
                relatedMechanics: this.extractMechanics(gameData.EN_DESCRIPTION, values, data !== null && data.additionalMechanics ? data.additionalMechanics : []),
                typeLabel: '',
                costLabel: null,
                cooldownLabel: null,
                genresLabel: null,
                rankLabel: '',
                template: this.slormancerTemplateService.prepareAncestralLegacyDescriptionTemplate(gameData),
                values
            };
            if (data !== null && data.override) {
                data.override(ancestralLegacy.values, ancestralLegacy);
            }
            this.updateAncestralLegacyModel(ancestralLegacy, baseRank, bonusRank);
            this.updateAncestralLegacyView(ancestralLegacy);
        }
        return ancestralLegacy;
    }
    updateAncestralLegacyModel(ancestralLegacy, baseRank = ancestralLegacy.baseRank, bonusRank = ancestralLegacy.bonusRank, forcedRank = ancestralLegacy.forcedRank) {
        ancestralLegacy.forcedRank = forcedRank;
        ancestralLegacy.baseRank = Math.min(ancestralLegacy.baseMaxRank, Math.max(0, baseRank));
        ancestralLegacy.bonusRank = Math.max(0, bonusRank);
        ancestralLegacy.rank = ancestralLegacy.forcedRank !== null ? ancestralLegacy.forcedRank : ancestralLegacy.baseRank + ancestralLegacy.bonusRank;
        ancestralLegacy.maxRank = ancestralLegacy.baseMaxRank;
        for (const effectValue of ancestralLegacy.values) {
            this.slormancerEffectValueService.updateEffectValue(effectValue, Math.max(1, ancestralLegacy.rank));
        }
        ancestralLegacy.cooldown = ancestralLegacy.baseCooldown;
        this.updateAncestralLegacyCost(ancestralLegacy);
        ancestralLegacy.isActivable = ancestralLegacy.baseCooldown !== null || ancestralLegacy.genres.includes(skill_genre_1.SkillGenre.Aura);
        const upgradeCosts = this.getAncestralLegacySlormCosts(ancestralLegacy);
        ancestralLegacy.investedSlorm = upgradeCosts.reduce((total, current, index) => index < ancestralLegacy.baseRank ? current + total : total, 0);
        ancestralLegacy.totalSlormCost = upgradeCosts.reduce((total, current) => current + total, 0);
        ancestralLegacy.upgradeSlormCost = upgradeCosts[ancestralLegacy.rank] ?? null;
    }
    updateAncestralLegacyCost(ancestralLegacy) {
        ancestralLegacy.costType = ancestralLegacy.baseCostType;
        ancestralLegacy.cost = null;
        if (ancestralLegacy.baseCost !== null) {
            ancestralLegacy.currentRankCost = ancestralLegacy.baseCost + (ancestralLegacy.costPerRank === null ? 0 : ancestralLegacy.costPerRank * Math.max(1, ancestralLegacy.rank));
            ancestralLegacy.cost = ancestralLegacy.currentRankCost;
        }
        this.updateAncestralLegacyCostType(ancestralLegacy);
    }
    updateAncestralLegacyCostType(ancestralLegacy) {
        ancestralLegacy.hasLifeCost = ancestralLegacy.costType === skill_cost_type_1.SkillCostType.LifeSecond || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.LifeLockFlat || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.LifeLock || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.Life || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.LifePercent;
        ancestralLegacy.hasManaCost = ancestralLegacy.costType === skill_cost_type_1.SkillCostType.ManaSecond || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.ManaLockFlat || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.ManaLock || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.Mana || ancestralLegacy.costType === skill_cost_type_1.SkillCostType.ManaPercent;
        ancestralLegacy.hasNoCost = ancestralLegacy.costType === skill_cost_type_1.SkillCostType.None;
    }
    updateAncestralLegacyView(ancestralLegacy) {
        ancestralLegacy.genresLabel = null;
        if (ancestralLegacy.genres.length > 0) {
            ancestralLegacy.genresLabel = ancestralLegacy.genres
                .map(genre => this.slormancerTranslateService.translate('atk_' + genre))
                .join(' ');
        }
        ancestralLegacy.costLabel = null;
        if (!ancestralLegacy.hasNoCost && ancestralLegacy.cost !== null) {
            ancestralLegacy.costLabel = this.COST_LABEL
                + ': ' + this.slormancerTemplateService.asSpan(ancestralLegacy.cost.toString(), ancestralLegacy.hasManaCost ? 'value mana' : 'value life')
                + ' ' + this.slormancerTranslateService.translate('tt_' + ancestralLegacy.costType);
        }
        ancestralLegacy.cooldownLabel = null;
        if (ancestralLegacy.cooldown !== null && ancestralLegacy.cooldown > 0) {
            ancestralLegacy.cooldownLabel = this.COOLDOWN_LABEL
                + ': ' + this.slormancerTemplateService.asSpan(ancestralLegacy.cooldown.toString(), 'value')
                + ' ' + this.SECONDS_LABEL;
        }
        ancestralLegacy.typeLabel = this.slormancerTranslateService.translate('element_' + ancestralLegacy.element) + ' - '
            + ancestralLegacy.types.map(type => this.slormancerTranslateService.translate('tt_' + type)).join(', ');
        ancestralLegacy.rankLabel = this.RANK_LABEL + ': ' + this.slormancerTemplateService.asSpan(ancestralLegacy.rank.toString(), 'current') + '/' + ancestralLegacy.baseMaxRank;
        const descriptionPrefix = this.isActivable(ancestralLegacy.types) ? this.slormancerTranslateService.translate(this.ACTIVE_PREFIX) + '<br/>' : '';
        ancestralLegacy.description = descriptionPrefix + this.slormancerTemplateService.formatAncestralLegacyDescription(ancestralLegacy.template, ancestralLegacy.values);
    }
};
SlormancerAncestralLegacyService = __decorate([
    (0, core_1.Injectable)()
], SlormancerAncestralLegacyService);
exports.SlormancerAncestralLegacyService = SlormancerAncestralLegacyService;
//# sourceMappingURL=slormancer-ancestral-legacy.service.js.map