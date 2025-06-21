"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerRuneService = void 0;
const core_1 = require("@angular/core");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const rune_type_1 = require("../../model/content/rune-type");
const effect_value_util_1 = require("../../util/effect-value.util");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerRuneService = class SlormancerRuneService {
    constructor(slormancerDataService, slormancerTemplateService, slormancerTranslateService, slormancerEffectValueService, slormancerActivableService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.slormancerActivableService = slormancerActivableService;
        this.TRIGGER_EFFECT_RUNE_BASE_COOLDOWN = 0;
        this.REAPERSMITH_BY = this.slormancerTranslateService.translate('weapon_reapersmith_light');
        this.RUNE_FLAVOR_ACTIVATION = this.slormancerTranslateService.translate('tt_rune_0_help');
        this.RUNE_FLAVOR_ACTIVATION_POWER = this.slormancerTranslateService.translate('tt_rune_0_help_power');
        this.RUNE_FLAVOR_EFFECT = this.slormancerTranslateService.translate('tt_rune_1_help');
        this.RUNE_FLAVOR_EFFECT_PREVENT = this.slormancerTranslateService.translate('tt_rune_1_prevent_reaper');
        this.RUNE_FLAVOR_ENHANCEMENT = this.slormancerTranslateService.translate('tt_rune_2_help');
        this.CONSTRAINT = this.slormancerTranslateService.translate('rune_power');
        this.DURATION_DESCRIPTION = this.slormancerTranslateService.translate('tt_rune_effect');
    }
    isDamageStat(stat) {
        return stat === 'physical_damage' || stat === 'elemental_damage' || stat === 'bleed_damage';
    }
    parseDurationPerLevelvalue(data) {
        let result = null;
        if (data.DURATION_BASE !== null && data.DURATION_BASE !== 0) {
            result = (0, effect_value_util_1.effectValueVariable)(data.DURATION_BASE, (0, utils_1.valueOrDefault)(data.DURATION_LEVEL, 0), effect_value_upgrade_type_1.EffectValueUpgradeType.RuneLevel, false, 'duration', effect_value_value_type_1.EffectValueValueType.Duration);
        }
        return result;
    }
    parseEffectValues(data, upgradeType) {
        const valueBases = (0, utils_1.splitFloatData)(data.VALUE_BASE);
        const valuePerLevels = (0, utils_1.splitFloatData)(data.VALUE_PER_LEVEL);
        const valueTypes = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.VALUE_TYPE));
        const valueLevels = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.VALUE_LEVEL));
        const valueReals = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.VALUE_REAL));
        const stats = (0, utils_1.emptyStringToNull)((0, utils_1.splitData)(data.VALUE_STAT));
        const max = Math.max(valueBases.length, valuePerLevels.length, valueTypes.length);
        let result = [];
        for (let i of (0, math_util_1.list)(max)) {
            const real = (0, utils_1.valueOrNull)(valueReals[i]);
            const level = (0, utils_1.valueOrNull)(valueLevels[i]);
            const percent = (0, utils_1.valueOrNull)(valueTypes[i]) === '%';
            const value = (0, utils_1.valueOrDefault)(valueBases[i], 0);
            const upgrade = (0, utils_1.valueOrDefault)(valuePerLevels[i], 0);
            const stat = (0, utils_1.valueOrDefault)(stats[i], null);
            if (level === 'rl3') {
                upgradeType = effect_value_upgrade_type_1.EffectValueUpgradeType.Every3RuneLevel;
            }
            if (level === 'rl5') {
                upgradeType = effect_value_upgrade_type_1.EffectValueUpgradeType.Every5RuneLevel;
            }
            if (stat !== null && this.isDamageStat(stat)) {
                result.push((0, effect_value_util_1.effectValueSynergy)(value, upgrade, upgradeType, false, stat, effect_value_value_type_1.EffectValueValueType.Damage));
            }
            else if (real === null) {
                result.push((0, effect_value_util_1.effectValueVariable)(value, upgrade, upgradeType, percent, stat, effect_value_value_type_1.EffectValueValueType.Stat));
            }
            else {
                const realValues = (0, utils_1.splitData)(real, ':');
                const source = realValues[1];
                if (realValues[0] === 'based_on_mastery') {
                    result.push((0, effect_value_util_1.effectValueSynergy)(value * 100, 0, upgradeType, false, 'based_on_mastery_' + source, stat));
                }
                else {
                    result.push((0, effect_value_util_1.effectValueSynergy)(value, upgrade, upgradeType, false, source, stat));
                }
            }
        }
        return result;
    }
    idToType(id) {
        let type = rune_type_1.RuneType.Effect;
        if (id <= 6) {
            type = rune_type_1.RuneType.Activation;
        }
        else if (id >= 21) {
            type = rune_type_1.RuneType.Enhancement;
        }
        return type;
    }
    getActivableById(id, heroClass) {
        let activable = null;
        if (id === 4) {
            activable = this.slormancerActivableService.getRuneActivable(26, heroClass);
        }
        else if (id === 26) {
            activable = this.slormancerActivableService.getRuneActivable(27, heroClass);
        }
        return activable;
    }
    getRuneById(id, heroClass, level, reaperId = null) {
        const data = this.slormancerDataService.getGameDataRune(id);
        let result = null;
        if (data !== null) {
            result = this.getRune(data, heroClass, level, reaperId);
        }
        return result;
    }
    getRunes(heroClass, level, reaperId) {
        return this.slormancerDataService.getGameDataRunes()
            .map(data => this.getRune(data, heroClass, level, reaperId));
    }
    getRune(data, heroClass, level, reaperId = null) {
        const rune = {
            id: data.REF,
            heroClass,
            level,
            type: this.idToType(data.REF),
            activable: this.getActivableById(data.REF, heroClass),
            baseConstraint: data.POWER,
            constraint: data.POWER,
            constraintLabel: null,
            description: '',
            enabled: true,
            flavor: null,
            levelBorder: '',
            levelIcon: '',
            name: data.EN_NAME,
            reaper: data.REAPER,
            reapersmith: data.BLACKSMITH,
            runeIcon: '',
            smithLabel: '',
            template: this.slormancerTemplateService.getRuneDescriptionTemplate(data),
            typeLabel: '',
            values: this.parseEffectValues(data, effect_value_upgrade_type_1.EffectValueUpgradeType.RuneLevel),
            duration: this.parseDurationPerLevelvalue(data)
        };
        if (data.REF === 4 && rune.activable !== null && rune.activable.baseCooldown !== null) {
            this.TRIGGER_EFFECT_RUNE_BASE_COOLDOWN = rune.activable.baseCooldown;
        }
        const dataRune = this.slormancerDataService.getDataRune(data.REF);
        if (dataRune !== null) {
            dataRune.override(rune);
        }
        this.updateRuneModel(rune, reaperId);
        this.updateRuneView(rune);
        return rune;
    }
    getRuneClone(rune) {
        return {
            ...rune,
            activable: rune.activable === null ? null : this.slormancerActivableService.getActivableClone(rune.activable),
            values: rune.values.map(value => this.slormancerEffectValueService.getEffectValueClone(value))
        };
    }
    getRunesCombinationClone(runes) {
        return {
            activation: runes.activation === null ? null : this.getRuneClone(runes.activation),
            effect: runes.effect === null ? null : this.getRuneClone(runes.effect),
            enhancement: runes.enhancement === null ? null : this.getRuneClone(runes.enhancement),
        };
    }
    updateRunesModel(runes, reaperId) {
        if (runes.activation !== null) {
            this.updateRuneModel(runes.activation, reaperId);
        }
        if (runes.effect !== null) {
            this.updateRuneModel(runes.effect, reaperId);
        }
        if (runes.enhancement !== null) {
            this.updateRuneModel(runes.enhancement, reaperId);
        }
    }
    updateRuneModel(rune, reaperId) {
        rune.enabled = rune.reaper === null || rune.reaper !== reaperId;
        rune.constraint = rune.baseConstraint;
        if (rune.duration !== null) {
            this.slormancerEffectValueService.updateEffectValue(rune.duration, rune.level);
        }
        for (const effectValue of rune.values) {
            if ((0, utils_1.isEffectValueSynergy)(effectValue) || (0, utils_1.isEffectValueVariable)(effectValue)) {
                effectValue.upgrade = effectValue.baseUpgrade;
            }
            this.slormancerEffectValueService.updateEffectValue(effectValue, rune.level);
        }
        if (rune.activable !== null) {
            if (rune.id === 4) {
                rune.activable.baseCooldown = this.TRIGGER_EFFECT_RUNE_BASE_COOLDOWN;
            }
            rune.activable.level = rune.level;
            this.slormancerActivableService.updateActivableModel(rune.activable);
        }
    }
    updateRunesView(runes) {
        if (runes.activation !== null) {
            this.updateRuneView(runes.activation);
        }
        if (runes.effect !== null) {
            this.updateRuneView(runes.effect);
        }
        if (runes.enhancement !== null) {
            this.updateRuneView(runes.enhancement);
        }
    }
    updateRuneView(rune) {
        rune.runeIcon = 'assets/img/icon/rune/' + rune.id + '.png';
        rune.levelBorder = 'assets/img/icon/level/rune/' + rune.level + '.png';
        rune.levelIcon = 'assets/img/icon/level/' + rune.level + '.png';
        rune.description = this.slormancerTemplateService.formatRuneDescription(rune.template, rune.values)
            .replace(/\[([a-zA-Z ]+)\/([a-zA-Z ]+)\/([a-zA-Z ]+)\]/g, '$' + (rune.heroClass + 1));
        rune.smithLabel = this.REAPERSMITH_BY.replace('$', this.slormancerTranslateService.translate('weapon_reapersmith_' + rune.reapersmith));
        rune.typeLabel = this.slormancerTranslateService.translate('rune_' + rune.type);
        rune.constraintLabel = rune.constraint === null ? null : this.CONSTRAINT + ' : ' + this.slormancerTemplateService.asSpan(rune.constraint.toString(), 'power value') + ' %';
        if (rune.duration !== null) {
            rune.description += '<br/><br/>' + this.slormancerTemplateService.formatRuneDescription(this.DURATION_DESCRIPTION, [rune.duration]);
        }
        const flavorTexts = [];
        if (rune.type === rune_type_1.RuneType.Activation) {
            flavorTexts.push(this.RUNE_FLAVOR_ACTIVATION);
            flavorTexts.push(this.RUNE_FLAVOR_ACTIVATION_POWER);
        }
        else if (rune.type === rune_type_1.RuneType.Effect) {
            flavorTexts.push(this.RUNE_FLAVOR_EFFECT);
            if (rune.enabled) {
                flavorTexts.push(this.RUNE_FLAVOR_EFFECT_PREVENT);
            }
            else {
                flavorTexts.push(this.slormancerTemplateService.asSpan(this.RUNE_FLAVOR_EFFECT_PREVENT, 'disabled'));
            }
        }
        else {
            flavorTexts.push(this.RUNE_FLAVOR_ENHANCEMENT);
        }
        rune.flavor = flavorTexts.join('<br/><br/>');
        if (rune.activable !== null) {
            this.slormancerActivableService.updateActivableView(rune.activable);
        }
    }
};
SlormancerRuneService = __decorate([
    (0, core_1.Injectable)()
], SlormancerRuneService);
exports.SlormancerRuneService = SlormancerRuneService;
//# sourceMappingURL=slormancer-rune.service.js.map