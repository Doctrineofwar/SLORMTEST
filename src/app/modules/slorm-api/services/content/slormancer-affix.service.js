"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerAffixService = void 0;
const core_1 = require("@angular/core");
const effect_value_type_1 = require("../../model/content/enum/effect-value-type");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const rarity_1 = require("../../model/content/enum/rarity");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerAffixService = class SlormancerAffixService {
    constructor(slormancerTemplateService, slormancerTranslateService, slormancerItemValueService, slormancerDataService) {
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerItemValueService = slormancerItemValueService;
        this.slormancerDataService = slormancerDataService;
    }
    getRarity(rarity) {
        let result;
        if (rarity === 'N') {
            result = rarity_1.Rarity.Normal;
        }
        else if (rarity === 'M') {
            result = rarity_1.Rarity.Magic;
        }
        else if (rarity === 'R') {
            result = rarity_1.Rarity.Rare;
        }
        else if (rarity === 'E') {
            result = rarity_1.Rarity.Epic;
        }
        else if (rarity === 'D') {
            result = rarity_1.Rarity.Defensive;
        }
        else {
            result = rarity_1.Rarity.Legendary;
        }
        return result;
    }
    isEquipableItem(item) {
        return item !== null && item.hasOwnProperty('slot');
    }
    isRessourceItem(item) {
        return item !== null && item.hasOwnProperty('quantity');
    }
    buildAffix(stat, itemLevel, reinforcement, rarity, locked, pure, value) {
        return {
            primaryNameType: stat.PRIMARY_NAME_TYPE,
            rarity: rarity,
            itemLevel,
            reinforcement,
            locked,
            pure,
            isPure: false,
            pureMarks: 0,
            minLevel: stat.MIN_LEVEL,
            craftedEffect: {
                score: stat.SCORE,
                possibleCraftedValues: [],
                basePossibleCraftedValues: [],
                minPossibleCraftedValue: value,
                craftedValue: value,
                maxPossibleCraftedValue: value,
                effect: {
                    type: effect_value_type_1.EffectValueType.Constant,
                    baseValue: 0,
                    value: 0,
                    displayValue: 0,
                    percent: stat.PERCENT === '%',
                    valueType: effect_value_value_type_1.EffectValueValueType.Stat,
                    stat: stat.REF
                },
            },
            valueLabel: '',
            statLabel: '',
        };
    }
    getAffixFromStat(statName, itemLevel, reinforcement, rarity, value = Number.MAX_VALUE, pure = 100) {
        let result = null;
        const stat = this.slormancerDataService.getGameDataStatByRef(statName);
        if (stat !== null) {
            result = this.buildAffix(stat, itemLevel, reinforcement, rarity, false, pure, value);
        }
        return result;
    }
    getAffix(affix, itemLevel, reinforcement) {
        let result = null;
        const stat = this.slormancerDataService.getGameDataStat(affix);
        if (stat !== null) {
            result = this.buildAffix(stat, itemLevel, reinforcement, this.getRarity(affix.rarity), affix.locked, affix.pure === null || affix.pure === 0 ? 100 : affix.pure, affix.value);
        }
        return result;
    }
    updateAffix(itemAffix, multiplier = 0) {
        itemAffix.isPure = itemAffix.pure > 100;
        itemAffix.pureMarks = itemAffix.isPure ? (itemAffix.pure <= 150 ? 1 : (itemAffix.pure <= 190 ? 2 : 3)) : 0;
        if (itemAffix.isPure) {
            itemAffix.craftedEffect.craftedValue = itemAffix.craftedEffect.maxPossibleCraftedValue;
        }
        itemAffix.craftedEffect.possibleCraftedValues = this.slormancerItemValueService
            .getAffixValues(itemAffix.itemLevel, itemAffix.craftedEffect.effect.stat, itemAffix.reinforcement, itemAffix.craftedEffect.score, itemAffix.craftedEffect.effect.percent, itemAffix.rarity, itemAffix.pure, multiplier);
        itemAffix.craftedEffect.basePossibleCraftedValues = itemAffix.craftedEffect.possibleCraftedValues;
        const minValue = itemAffix.craftedEffect.possibleCraftedValues[0];
        const maxValue = itemAffix.craftedEffect.possibleCraftedValues[Math.max(0, itemAffix.craftedEffect.possibleCraftedValues.length - 1)];
        itemAffix.craftedEffect.minPossibleCraftedValue = minValue ? minValue.craft : itemAffix.craftedEffect.craftedValue;
        itemAffix.craftedEffect.maxPossibleCraftedValue = maxValue ? maxValue.craft : itemAffix.craftedEffect.craftedValue;
        if (itemAffix.craftedEffect.craftedValue < itemAffix.craftedEffect.minPossibleCraftedValue) {
            itemAffix.craftedEffect.craftedValue = itemAffix.craftedEffect.minPossibleCraftedValue;
        }
        else if (itemAffix.craftedEffect.craftedValue > itemAffix.craftedEffect.maxPossibleCraftedValue) {
            itemAffix.craftedEffect.craftedValue = itemAffix.craftedEffect.maxPossibleCraftedValue;
        }
        itemAffix.craftedEffect.effect.value = (0, utils_1.getCraftValue)(itemAffix.craftedEffect, itemAffix.craftedEffect.craftedValue);
        itemAffix.craftedEffect.effect.displayValue = (0, math_util_1.round)(itemAffix.craftedEffect.effect.value, 3);
        itemAffix.valueLabel = this.slormancerTemplateService.formatItemAffixValue(itemAffix);
        itemAffix.statLabel = itemAffix.craftedEffect.effect.stat === null ? '' : this.slormancerTranslateService.translate(itemAffix.craftedEffect.effect.stat);
    }
    getAffixClone(itemAffix) {
        return {
            ...itemAffix,
            craftedEffect: {
                ...itemAffix.craftedEffect,
                effect: { ...itemAffix.craftedEffect.effect }
            }
        };
    }
};
SlormancerAffixService = __decorate([
    (0, core_1.Injectable)()
], SlormancerAffixService);
exports.SlormancerAffixService = SlormancerAffixService;
//# sourceMappingURL=slormancer-affix.service.js.map