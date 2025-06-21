"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerActivableService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const hero_class_1 = require("../../model/content/enum/hero-class");
const skill_cost_type_1 = require("../../model/content/enum/skill-cost-type");
const effect_value_util_1 = require("../../util/effect-value.util");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerActivableService = class SlormancerActivableService {
    constructor(slormancerTemplateService, slormancerTranslateService, slormancerDataService, slormancerEffectValueService) {
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerDataService = slormancerDataService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.PRIME_TOTEM_SKILL_NAME = {
            [hero_class_1.HeroClass.Huntress]: this.slormancerDataService.getGameDataSkill(hero_class_1.HeroClass.Huntress, constants_1.PRIME_TOTEM_SKILL[hero_class_1.HeroClass.Huntress])?.EN_NAME ?? '',
            [hero_class_1.HeroClass.Mage]: this.slormancerDataService.getGameDataSkill(hero_class_1.HeroClass.Mage, constants_1.PRIME_TOTEM_SKILL[hero_class_1.HeroClass.Mage])?.EN_NAME ?? '',
            [hero_class_1.HeroClass.Warrior]: this.slormancerDataService.getGameDataSkill(hero_class_1.HeroClass.Warrior, constants_1.PRIME_TOTEM_SKILL[hero_class_1.HeroClass.Warrior])?.EN_NAME ?? '',
        };
        this.COST_LABEL = this.slormancerTranslateService.translate('tt_cost');
        this.COOLDOWN_LABEL = this.slormancerTranslateService.translate('tt_cooldown');
        this.SECONDS_LABEL = this.slormancerTranslateService.translate('tt_seconds');
    }
    parseEffectValues(data, upgradeType) {
        const valueBases = (0, utils_1.splitFloatData)(data.DESC_VALUE_BASE);
        const valuePerLevels = (0, utils_1.splitFloatData)(data.DESC_VALUE_LEVEL);
        const valueTypes = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE_TYPE));
        const valueReals = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.DESC_VALUE_REAL));
        const max = Math.max(valueBases.length, valuePerLevels.length, valueTypes.length);
        let result = [];
        for (let i of (0, math_util_1.list)(max)) {
            const type = (0, utils_1.valueOrNull)(valueReals[i]);
            const percent = (0, utils_1.valueOrNull)(valueTypes[i]) === '%';
            const baseValue = (0, utils_1.valueOrDefault)(valueBases[i], 0);
            const upgrade = (0, utils_1.valueOrDefault)(valuePerLevels[i], 0);
            if (type === null) {
                result.push((0, effect_value_util_1.effectValueVariable)(baseValue, upgrade, upgradeType, percent));
            }
            else {
                const typeValues = (0, utils_1.splitData)(type, ':');
                const source = typeValues[1];
                result.push((0, effect_value_util_1.effectValueSynergy)(baseValue, upgrade, upgradeType, percent, source));
            }
        }
        return result;
    }
    applyActivableOverride(activable, dataActivable) {
        if (dataActivable !== null) {
            dataActivable.override(activable.values);
        }
    }
    buildActivable(data, upgradeType, level, heroClass) {
        const dataActivable = this.slormancerDataService.getDataActivable(data.REF);
        const activable = {
            id: data.REF,
            name: data.EN_NAME,
            icon: 'assets/img/icon/skill/activable/' + data.REF + '.png',
            description: '',
            baseCooldown: data.COOLDOWN,
            cooldown: 0,
            baseCost: data.COST,
            cost: 0,
            baseCostType: data.COST_TYPE,
            costType: data.COST_TYPE,
            hasLifeCost: false,
            hasManaCost: false,
            hasNoCost: false,
            genres: (0, utils_1.splitData)(data.GENRE, ','),
            damageTypes: (0, utils_1.splitData)(data.DMG_TYPE, ','),
            level,
            heroClass,
            genresLabel: null,
            costLabel: null,
            cooldownLabel: null,
            template: this.slormancerTemplateService.getActivableDescriptionTemplate(data),
            values: this.parseEffectValues(data, upgradeType)
        };
        this.applyActivableOverride(activable, dataActivable);
        this.updateActivableModel(activable);
        this.updateActivableView(activable);
        return activable;
    }
    getActivableClone(activable) {
        const result = {
            ...activable,
            genres: [...activable.genres],
            values: activable.values.map(value => this.slormancerEffectValueService.getEffectValueClone(value))
        };
        return result;
    }
    getReaperActivable(reaperId, level, heroClass) {
        const gameDataActivables = this.slormancerDataService.getGameDataReaperActivableBasedOn(reaperId, false);
        return gameDataActivables.map(data => this.buildActivable(data, effect_value_upgrade_type_1.EffectValueUpgradeType.ReaperLevel, level, heroClass));
    }
    getPrimordialReaperActivable(reaperId, level, heroClass) {
        const gameDataActivables = this.slormancerDataService.getGameDataReaperActivableBasedOn(reaperId, true);
        return gameDataActivables.map(data => this.buildActivable(data, effect_value_upgrade_type_1.EffectValueUpgradeType.ReaperLevel, level, heroClass));
    }
    getLegendaryActivable(legendaryId, heroClass) {
        const gameDataActivable = this.slormancerDataService.getGameDataLegendaryActivableBasedOn(legendaryId);
        return gameDataActivable === null ? null : this.buildActivable(gameDataActivable, effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement, 0, heroClass);
    }
    getRuneActivable(id, heroClass) {
        const gameDataActivable = this.slormancerDataService.getGameDataActivable(id);
        return gameDataActivable === null ? null : this.buildActivable(gameDataActivable, effect_value_upgrade_type_1.EffectValueUpgradeType.RuneLevel, 0, heroClass);
    }
    updateActivableModel(activable, context = {}) {
        activable.cooldown = activable.baseCooldown === null ? 0 : (0, math_util_1.round)(activable.baseCooldown, 2);
        this.updateActivableCost(activable);
        for (const effectValue of activable.values) {
            this.slormancerEffectValueService.updateEffectValue(effectValue, activable.level, context);
        }
    }
    updateActivableCost(activable) {
        activable.cost = activable.baseCost;
        activable.costType = activable.baseCostType;
        this.updateActivableCostType(activable);
    }
    updateActivableCostType(activable) {
        activable.hasLifeCost = activable.costType === skill_cost_type_1.SkillCostType.LifeSecond || activable.costType === skill_cost_type_1.SkillCostType.LifeLockFlat || activable.costType === skill_cost_type_1.SkillCostType.LifeLock || activable.costType === skill_cost_type_1.SkillCostType.Life || activable.costType === skill_cost_type_1.SkillCostType.LifePercent;
        activable.hasManaCost = activable.costType === skill_cost_type_1.SkillCostType.ManaSecond || activable.costType === skill_cost_type_1.SkillCostType.ManaLockFlat || activable.costType === skill_cost_type_1.SkillCostType.ManaLock || activable.costType === skill_cost_type_1.SkillCostType.Mana || activable.costType === skill_cost_type_1.SkillCostType.ManaPercent;
        activable.hasNoCost = activable.costType === skill_cost_type_1.SkillCostType.None;
    }
    updateActivableView(activable) {
        activable.genresLabel = null;
        if (activable.genres.length > 0) {
            activable.genresLabel = activable.genres
                .map(genre => this.slormancerTranslateService.translate('atk_' + genre))
                .join(' ');
        }
        activable.costLabel = null;
        if (!activable.hasNoCost) {
            activable.costLabel = this.COST_LABEL
                + ': ' + this.slormancerTemplateService.asSpan(activable.cost.toString(), activable.hasManaCost ? 'value mana' : 'value life')
                + ' ' + this.slormancerTranslateService.translateCostType(activable.costType);
        }
        activable.cooldownLabel = null;
        if (activable.cooldown > 0) {
            activable.cooldownLabel = this.COOLDOWN_LABEL
                + ': ' + this.slormancerTemplateService.asSpan(activable.cooldown.toString(), 'value')
                + ' ' + this.SECONDS_LABEL;
        }
        activable.description = this.slormancerTemplateService.formatActivableDescription(activable.template, activable.values)
            .replace(/\{weaponClass\}/g, this.slormancerTranslateService.translate('weapon_' + activable.heroClass))
            .replace(/\[([a-zA-Z ]+)\/([a-zA-Z ]+)\/([a-zA-Z ]+)\]/g, '$' + (activable.heroClass + 1))
            .replace('[class_skill_3]', this.PRIME_TOTEM_SKILL_NAME[activable.heroClass]);
    }
};
SlormancerActivableService = __decorate([
    (0, core_1.Injectable)()
], SlormancerActivableService);
exports.SlormancerActivableService = SlormancerActivableService;
//# sourceMappingURL=slormancer-activable.service.js.map