"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerLegendaryEffectService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const effect_value_util_1 = require("../../util/effect-value.util");
const math_util_1 = require("../../util/math.util");
const parse_util_1 = require("../../util/parse.util");
const utils_1 = require("../../util/utils");
let SlormancerLegendaryEffectService = class SlormancerLegendaryEffectService {
    constructor(slormancerDataService, slormanderActivableService, slormancerTemplateService, slormancerTranslateService, slormancerItemValueService, slormancerReaperService) {
        this.slormancerDataService = slormancerDataService;
        this.slormanderActivableService = slormanderActivableService;
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerItemValueService = slormancerItemValueService;
        this.slormancerReaperService = slormancerReaperService;
        this.LEGENDARY_TITLE = this.slormancerTranslateService.translate('tt_l_roll');
    }
    parseLegendaryEffectValue(type, score, upgrade, range, stat, craftedValue) {
        let effect;
        if (type === null || type === '%') {
            effect = (0, effect_value_util_1.effectValueVariable)(0, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement, type === '%', stat);
        }
        else {
            const typeValues = (0, utils_1.splitData)(type, ':');
            const source = typeValues[1];
            effect = (0, effect_value_util_1.effectValueSynergy)(0, upgrade, effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement, type === '%', source, stat);
        }
        return {
            score,
            craftedValue: range ? craftedValue : 100,
            possibleCraftedValues: [],
            basePossibleCraftedValues: [],
            maxPossibleCraftedValue: 100,
            minPossibleCraftedValue: range ? 75 : 100,
            effect,
        };
    }
    applyEffectOverride(effect, legendaryId) {
        const data = this.slormancerDataService.getDataLegendary(legendaryId);
        if (data !== null) {
            data.override(effect);
        }
        return effect;
    }
    getEffectValues(gameData, craftedValue) {
        const ranges = (0, utils_1.splitFloatData)(gameData.RANGE);
        const types = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(gameData.TYPE));
        const stats = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(gameData.STAT));
        const upgrades = (0, utils_1.splitFloatData)(gameData.UPGRADABLE);
        const values = (0, utils_1.splitFloatData)(gameData.VALUE);
        const nb = Math.max(types.length, values.length);
        const result = [];
        for (let i of (0, math_util_1.list)(nb)) {
            const stat = (0, utils_1.valueOrNull)(stats[i]);
            const type = (0, utils_1.valueOrNull)(types[i]);
            const value = (0, utils_1.valueOrDefault)(values[i], 0);
            const upgrade = (0, utils_1.valueOrDefault)(upgrades[i], 0);
            const range = ranges[i] === 1;
            result.push(this.parseLegendaryEffectValue(type, value, upgrade, range, stat, craftedValue));
        }
        return result;
    }
    getIcon(hero, skill) {
        let icon = null;
        if (hero !== -1) {
            let skillValue = null;
            const skills = skill.length > 0 ? (0, utils_1.valueOrNull)(skill.split('|')) : null;
            if (skills !== null) {
                skillValue = (0, parse_util_1.strictParseInt)(skills[skills.length - 1]);
            }
            if (skillValue !== null) {
                if (hero === 99) {
                    icon = 'assets/img/icon/legacy/' + skillValue + '.png';
                }
                else {
                    icon = 'assets/img/icon/skill/' + hero + '/' + skillValue + '.png';
                }
            }
        }
        return icon;
    }
    getLegendaryEffectById(id, value, reinforcement, heroClass) {
        const gameData = this.slormancerDataService.getGameDataLegendary(id);
        let legendaryEffect = null;
        if (gameData !== null) {
            const base = this.slormancerDataService.getBaseFromLegendaryId(gameData.REF);
            let reaperName = null;
            if (gameData.HERO === 999) {
                const reaper = this.slormancerDataService.getGameDataReaper(parseInt(gameData.SKILL));
                if (reaper !== null) {
                    reaperName = this.slormancerReaperService.getReaperName(reaper.EN_NAME, false, heroClass);
                }
            }
            legendaryEffect = {
                id: gameData.REF,
                name: gameData.EN_NAME,
                classSpecific: [0, 1, 2].includes(gameData.HERO) ? gameData.HERO : null,
                reinforcement,
                itemIcon: 'assets/img/icon/item/' + gameData.ITEM + '/' + base + '.png',
                value,
                activable: this.slormanderActivableService.getLegendaryActivable(gameData.REF, heroClass),
                onlyStat: gameData.STAT_ONLY === true,
                skillIcon: this.getIcon(gameData.HERO, gameData.SKILL),
                effects: this.getEffectValues(gameData, value),
                reaperName,
                title: this.LEGENDARY_TITLE,
                description: '',
                template: this.slormancerTemplateService.getLegendaryDescriptionTemplate(gameData),
            };
            legendaryEffect = this.applyEffectOverride(legendaryEffect, gameData.REF);
            this.updateLegendaryEffectModel(legendaryEffect);
            this.updateLegendaryEffectView(legendaryEffect);
        }
        return legendaryEffect;
    }
    getLegendaryEffect(affix, reinforcement, heroClass) {
        return this.getLegendaryEffectById(affix.type, affix.value, reinforcement, heroClass);
    }
    updateLegendaryEffectModel(legendaryEffect) {
        for (const craftedEffect of legendaryEffect.effects) {
            if ((0, utils_1.isEffectValueVariable)(craftedEffect.effect) || (0, utils_1.isEffectValueSynergy)(craftedEffect.effect)) {
                craftedEffect.craftedValue = Math.min(craftedEffect.maxPossibleCraftedValue, Math.max(craftedEffect.minPossibleCraftedValue, legendaryEffect.value));
                const upgrade = 100 * craftedEffect.effect.upgrade * Math.min(constants_1.MAX_REINFORCEMENT_UPGRADE, legendaryEffect.reinforcement) / 100;
                if (craftedEffect.effect.upgrade === 0 && craftedEffect.minPossibleCraftedValue === 100 && craftedEffect.maxPossibleCraftedValue === 100) {
                    craftedEffect.possibleCraftedValues = [
                        { craft: 100, value: craftedEffect.score }
                    ];
                    craftedEffect.basePossibleCraftedValues = [
                        { craft: 100, value: craftedEffect.score }
                    ];
                }
                else {
                    const precision = craftedEffect.score === 2.5 || craftedEffect.score === 0.6;
                    craftedEffect.basePossibleCraftedValues = this.slormancerItemValueService.computeEffectRange(craftedEffect.score, craftedEffect.minPossibleCraftedValue, craftedEffect.maxPossibleCraftedValue, 0, precision);
                    craftedEffect.possibleCraftedValues = this.slormancerItemValueService.computeEffectRange(craftedEffect.score, craftedEffect.minPossibleCraftedValue, craftedEffect.maxPossibleCraftedValue, upgrade, precision);
                }
                craftedEffect.effect.baseValue = (0, utils_1.getBaseCraftValue)(craftedEffect, craftedEffect.craftedValue);
                craftedEffect.effect.value = (0, utils_1.getCraftValue)(craftedEffect, craftedEffect.craftedValue);
                craftedEffect.effect.displayValue = craftedEffect.effect.value;
            }
        }
        if (legendaryEffect.activable !== null) {
            legendaryEffect.activable.level = Math.min(constants_1.MAX_REINFORCEMENT_UPGRADE, legendaryEffect.reinforcement);
            this.slormanderActivableService.updateActivableModel(legendaryEffect.activable);
        }
    }
    updateLegendaryEffectView(legendaryEffect) {
        legendaryEffect.description = this.slormancerTemplateService.formatLegendaryDescription(legendaryEffect.template, legendaryEffect.effects);
        if (legendaryEffect.activable !== null) {
            this.slormanderActivableService.updateActivableView(legendaryEffect.activable);
        }
    }
    getLegendaryEffectClone(legendaryEffect) {
        return {
            ...legendaryEffect,
            activable: legendaryEffect.activable === null ? null : this.slormanderActivableService.getActivableClone(legendaryEffect.activable),
            effects: legendaryEffect.effects
                .map(craftedEffect => ({ ...craftedEffect, effect: { ...craftedEffect.effect } }))
        };
    }
};
SlormancerLegendaryEffectService = __decorate([
    (0, core_1.Injectable)()
], SlormancerLegendaryEffectService);
exports.SlormancerLegendaryEffectService = SlormancerLegendaryEffectService;
//# sourceMappingURL=slormancer-legendary-effect.service.js.map