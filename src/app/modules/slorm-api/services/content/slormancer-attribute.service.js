"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerAttributeService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const data_attribute_1 = require("../../constants/content/data/data-attribute");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const trait_level_1 = require("../../model/content/enum/trait-level");
const effect_value_util_1 = require("../../util/effect-value.util");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerAttributeService = class SlormancerAttributeService {
    constructor(slormancerTemplateService, slormancerTranslateService, slormancerEffectValueService, slormancerDataService) {
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.slormancerDataService = slormancerDataService;
        this.TRAIT_LEVEL_LABEL = this.slormancerTranslateService.translate('trait_level');
        this.TRAIT_LOCKED_LABEL = this.slormancerTranslateService.translate('trait_locked');
        this.TRAIT_DEFAULT_LABEL = this.slormancerTranslateService.translate('trait_default');
        this.TRAIT_RECAP_ALL_LABEL = this.slormancerTranslateService.translate('trait_recap_all');
        this.TRAIT_RECAP_LABEL = this.slormancerTranslateService.translate('trait_recap');
    }
    isDamageStat(stat) {
        return stat === 'physical_damage' || stat === 'elemental_damage' || stat === 'bleed_damage';
    }
    parseEffectValues(data) {
        const valueBases = (0, utils_1.splitFloatData)(data.VALUE);
        const valueTypes = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.TYPE));
        const stats = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.STAT));
        const max = Math.max(valueBases.length, valueTypes.length);
        const firstIsUpgradable = data.ADDITIVE === 2;
        let result = [];
        for (let i of (0, math_util_1.list)(max)) {
            const type = (0, utils_1.valueOrNull)(valueTypes[i]);
            const percent = type === '%';
            const value = (0, utils_1.valueOrDefault)(valueBases[i], 0);
            const stat = (0, utils_1.valueOrDefault)(stats[i], null);
            const upgrade = i === 0 && firstIsUpgradable ? value : 0;
            if (stat !== null && type !== null && type.startsWith('synergy:')) {
                const valueType = this.isDamageStat(stat) ? effect_value_value_type_1.EffectValueValueType.Damage : effect_value_value_type_1.EffectValueValueType.Stat;
                result.push((0, effect_value_util_1.effectValueSynergy)(value, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.RanksAfterInThisTrait, percent, type.substring(8), stat, valueType));
            }
            else {
                result.push((0, effect_value_util_1.effectValueVariable)(value, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.RanksAfterInThisTrait, percent, stat, effect_value_value_type_1.EffectValueValueType.Stat));
            }
        }
        return result;
    }
    getTrait(gameData, attribute, rank, additive, requiredRank, cumulativeValues) {
        const trait = {
            id: gameData !== null ? gameData.REF : -1,
            attribute,
            requiredRank,
            traitLevel: requiredRank % 15 === 0 ? trait_level_1.TraitLevel.Greater : requiredRank % 5 === 0 ? trait_level_1.TraitLevel.Major : trait_level_1.TraitLevel.Minor,
            rank,
            unlocked: false,
            additive,
            attributeName: '',
            description: null,
            cumulativeStats: null,
            rankLabel: '',
            traitLevelLabel: '',
            unlockLabel: null,
            template: gameData === null ? null : (0, utils_1.notEmptyOrNull)(this.slormancerTemplateService.getAttributeTemplate(gameData)),
            values: gameData === null ? [] : this.parseEffectValues(gameData),
            cumulativeValues
        };
        if (gameData !== null) {
            const data = data_attribute_1.DATA_ATTRIBUTE[gameData.REF];
            if (data) {
                data.override(trait);
            }
        }
        return trait;
    }
    getTraitClone(trait) {
        return {
            id: trait.id,
            attribute: trait.attribute,
            requiredRank: trait.requiredRank,
            traitLevel: trait.traitLevel,
            rank: trait.rank,
            unlocked: trait.unlocked,
            additive: trait.additive,
            attributeName: trait.attributeName,
            description: trait.description,
            cumulativeStats: trait.cumulativeStats,
            rankLabel: trait.rankLabel,
            traitLevelLabel: trait.traitLevelLabel,
            unlockLabel: trait.unlockLabel,
            template: trait.template,
            values: trait.values.map(value => this.slormancerEffectValueService.getEffectValueClone(value)),
            cumulativeValues: trait.cumulativeValues.map(value => this.slormancerEffectValueService.getEffectValueClone(value))
        };
    }
    getDefaultVariableDescription(value) {
        const template = this.slormancerTemplateService.prepareAttributeCumulativeTraitTemplate(this.TRAIT_DEFAULT_LABEL, value.stat);
        return this.slormancerTemplateService.formatTraitDescription(template, [value]);
    }
    updateTrait(trait) {
        const ranksAfterThisOne = this.ranksAfter(trait, trait.rank);
        trait.attributeName = this.slormancerTranslateService.translate('character_trait_' + trait.attribute);
        trait.rankLabel = this.slormancerTemplateService.replaceAnchor(this.TRAIT_LEVEL_LABEL, trait.requiredRank, this.slormancerTemplateService.VALUE_ANCHOR);
        trait.traitLevelLabel = this.slormancerTranslateService.translate(trait.traitLevel);
        trait.unlocked = trait.requiredRank <= trait.rank;
        trait.unlockLabel = trait.unlocked ? null : this.slormancerTemplateService.replaceAnchor(this.TRAIT_LOCKED_LABEL, trait.requiredRank - trait.rank, this.slormancerTemplateService.VALUE_ANCHOR);
        for (const effectValue of trait.values) {
            this.slormancerEffectValueService.updateEffectValue(effectValue, ranksAfterThisOne);
        }
        const cumulativeStats = [];
        if (trait.cumulativeValues.length > 0) {
            cumulativeStats.push(...trait.cumulativeValues
                .map(value => this.getDefaultVariableDescription(value)));
        }
        if (trait.template !== null) {
            trait.description = this.slormancerTemplateService.formatTraitDescription(trait.template, trait.values);
        }
        else if (trait.values.length > 0) {
            cumulativeStats.push(...trait.values
                .filter(utils_1.isEffectValueVariable)
                .map(value => this.getDefaultVariableDescription(value)));
        }
        trait.cumulativeStats = cumulativeStats.join('<br/>');
    }
    buildTraits(gameDatas, attribute) {
        const cumulativeValues = [];
        const traits = [];
        for (const rank of (0, math_util_1.list)(1, constants_1.MAX_ATTRIBUTE_RANK)) {
            const data = (0, utils_1.valueOrNull)(gameDatas.find(data => data.LEVEL === rank));
            if (data !== null && data.ADDITIVE === 1) {
                this.parseEffectValues(data)
                    .filter(utils_1.isEffectValueVariable)
                    .forEach(value => cumulativeValues.push(value));
            }
            const additive = data !== null && data.ADDITIVE !== null;
            if (data !== null && data.ADDITIVE !== 1) {
                traits.push(this.getTrait(data, attribute, 0, additive, rank, cumulativeValues.map(constant => ({ ...constant }))));
            }
            else {
                traits.push(this.getTrait(null, attribute, 0, additive, rank, cumulativeValues.map(constant => ({ ...constant }))));
            }
        }
        return traits;
    }
    getAttributeTraitsClone(traits) {
        const clone = {
            attribute: traits.attribute,
            rank: traits.rank,
            baseRank: traits.baseRank,
            bonusRank: traits.bonusRank,
            traits: traits.traits.map(trait => this.getTraitClone(trait)),
            recapLabel: traits.recapLabel,
            attributeName: traits.attributeName,
            title: traits.title,
            icon: traits.icon,
            summary: traits.summary,
            values: [],
            template: traits.template
        };
        this.updateAttributeTraits(clone);
        return clone;
    }
    getAttributeTraits(attribute, baseRank, bonusRank = 0) {
        const traits = this.slormancerDataService.getGameDataAttributes(attribute);
        const attributeTraits = {
            attribute,
            rank: 0,
            baseRank,
            bonusRank,
            traits: this.buildTraits(traits, attribute),
            recapLabel: this.TRAIT_RECAP_ALL_LABEL,
            attributeName: this.slormancerTranslateService.translate('character_trait_' + attribute),
            title: this.TRAIT_RECAP_LABEL,
            icon: 'assets/img/icon/attribute/' + attribute + '.png',
            summary: '',
            values: [],
            template: '',
        };
        this.updateAttributeTraits(attributeTraits);
        return attributeTraits;
    }
    sameValue(a, b) {
        return a.stat === b.stat && a.type === b.type && a.valueType === b.valueType;
    }
    joinValues(values) {
        const result = [];
        for (const value of values) {
            const found = (0, utils_1.valueOrNull)(result.find(v => this.sameValue(v, value)));
            if (found !== null) {
                if ((0, utils_1.isEffectValueVariable)(value) && (0, utils_1.isEffectValueVariable)(found)) {
                    found.value += value.value;
                }
                else if ((0, utils_1.isEffectValueConstant)(value) && (0, utils_1.isEffectValueConstant)(found)) {
                    found.value += value.value;
                }
                else if ((0, utils_1.isEffectValueSynergy)(value) && (0, utils_1.isEffectValueSynergy)(found)) {
                    found.value += value.value;
                }
            }
            else {
                result.push({ ...value });
            }
        }
        return result;
    }
    ranksAfter(trait, rank) {
        return Math.max(0, rank - trait.requiredRank);
    }
    updateAttributeTraits(attributeTraits) {
        let cumulativeUnlockedAttributes = [];
        let cumulativeAttributes = [];
        const allDescriptions = [];
        for (const trait of attributeTraits.traits) {
            attributeTraits.baseRank = Math.min(constants_1.MAX_ATTRIBUTE_RANK, attributeTraits.baseRank);
            attributeTraits.rank = Math.min(constants_1.MAX_ATTRIBUTE_RANK, attributeTraits.baseRank + attributeTraits.bonusRank);
            trait.rank = attributeTraits.rank;
            this.updateTrait(trait);
            if (trait.template !== null) {
                const description = this.slormancerTemplateService.formatTraitDescription(trait.template, trait.values);
                allDescriptions.push(this.slormancerTemplateService.asSpan(description, trait.unlocked ? 'unlocked' : 'locked'));
            }
            else {
                const variables = trait.values.filter(utils_1.isEffectValueVariable);
                cumulativeAttributes.push(...variables);
                if (trait.unlocked) {
                    cumulativeUnlockedAttributes.push(...variables);
                }
            }
            if (trait.cumulativeValues.length > 0) {
                cumulativeAttributes.push(...trait.cumulativeValues);
                if (trait.unlocked) {
                    cumulativeUnlockedAttributes.push(...trait.cumulativeValues);
                }
            }
        }
        const joinedCumulativeUnlockedAttributes = this.joinValues(cumulativeUnlockedAttributes);
        cumulativeAttributes = this.joinValues(cumulativeAttributes);
        const cumulativeAttributeLabels = [];
        for (const value of cumulativeAttributes) {
            const found = (0, utils_1.valueOrNull)(joinedCumulativeUnlockedAttributes.find(v => this.sameValue(v, value)));
            if (found !== null) {
                if (value.value !== found.value) {
                    value.max = value.value;
                }
                value.value = found.value;
            }
            value.displayValue = (0, math_util_1.round)(value.value, 3);
            const label = this.getDefaultVariableDescription(value);
            cumulativeAttributeLabels.push(this.slormancerTemplateService.asSpan(label, found !== null ? 'unlocked' : 'locked'));
        }
        allDescriptions.unshift(cumulativeAttributeLabels.join('<br/>'));
        attributeTraits.values = cumulativeUnlockedAttributes;
        attributeTraits.summary = allDescriptions.join('<br/></br>');
    }
};
SlormancerAttributeService = __decorate([
    (0, core_1.Injectable)()
], SlormancerAttributeService);
exports.SlormancerAttributeService = SlormancerAttributeService;
//# sourceMappingURL=slormancer-attribute.service.js.map