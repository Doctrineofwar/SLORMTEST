"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerTemplateService = void 0;
const core_1 = require("@angular/core");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerTemplateService = class SlormancerTemplateService {
    constructor(slormancerTranslateService) {
        this.slormancerTranslateService = slormancerTranslateService;
        this.STAT_ANCHOR = '£';
        this.TYPE_ANCHOR = '$';
        this.VALUE_ANCHOR = '@';
        this.SPECLAL_DAMAGE_ANCHOR = 'µ';
        this.CONSTANT_ANCHORS = ['¤', '~', '§', '¥'];
        this.SYNERGY_ANCHOR = '_';
        this.MINMAX_ANCHOR = '_';
        this.SYNERGY_PREFIX = 'synergy:';
        this.DAMAGE_PREFIX = 'damage:';
        this.RETURN_REGEXP = /#/g;
        this.MAX_LABEL = this.slormancerTranslateService.translate('max');
    }
    asSpan(content, className) {
        return '<span class="' + className + '">' + content + '</span>';
    }
    replaceAnchor(template, value, anchor) {
        return template.replace(anchor, typeof value === 'number' ? (0, utils_1.numberToString)(value) : value);
    }
    getCraftedEffectDetails(craftedEffect) {
        const percent = craftedEffect.effect.percent || (0, utils_1.isEffectValueSynergy)(craftedEffect.effect) ? '%' : '';
        let result = [];
        if (craftedEffect.minPossibleCraftedValue < craftedEffect.maxPossibleCraftedValue) {
            const min = (0, utils_1.getBaseCraftValue)(craftedEffect, craftedEffect.minPossibleCraftedValue);
            const max = (0, utils_1.getBaseCraftValue)(craftedEffect, craftedEffect.maxPossibleCraftedValue);
            if (min !== max) {
                result.push(min + percent + '-' + max + percent);
            }
            else {
                result.push(min + percent);
            }
        }
        if (((0, utils_1.isEffectValueSynergy)(craftedEffect.effect) || (0, utils_1.isEffectValueVariable)(craftedEffect.effect)) && craftedEffect.effect.upgrade !== 0) {
            if (result.length === 0) {
                result.push(craftedEffect.effect.baseValue + percent);
            }
            result.push((craftedEffect.effect.upgrade > 0 ? '+ ' : '- ') + Math.abs(craftedEffect.effect.upgrade) + percent + ' per reinforcement');
        }
        return result.length === 0 ? '' : this.asSpan(' (' + result.join(' ') + ')', 'details');
    }
    formatLegendaryDescription(template, craftedEffects) {
        for (let craftedEffect of craftedEffects) {
            const percent = craftedEffect.effect.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(craftedEffect.effect)) {
                const value = this.asSpan(craftedEffect.effect.displayValue + percent, 'value');
                const details = this.getCraftedEffectDetails(craftedEffect);
                template = this.replaceAnchor(template, value + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(craftedEffect.effect)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan(craftedEffect.effect.displayValue + percent, 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(craftedEffect.effect)) {
                const percent = craftedEffect.effect.source !== 'enlight_10';
                const value = this.asSpan(this.formatValue(craftedEffect.effect.displayValue, percent), 'value');
                const details = this.getCraftedEffectDetails(craftedEffect);
                const synergy = this.asSpan(this.formatValue(craftedEffect.effect.displaySynergy, craftedEffect.effect.percent), 'value');
                if (craftedEffect.effect.showValue) {
                    template = this.replaceAnchor(template, value + details, this.VALUE_ANCHOR);
                }
                template = this.replaceAnchor(template, synergy, this.SYNERGY_ANCHOR);
            }
        }
        return template;
    }
    getEffectValueDetails(effectValue, hideBase = false) {
        let result = '';
        const percent = (effectValue.percent || (0, utils_1.isEffectValueSynergy)(effectValue)) ? '%' : '';
        if (effectValue.max) {
            if (effectValue.value > 0 && effectValue.value < effectValue.max) {
                result = this.asSpan('(+' + (0, utils_1.numberToString)(effectValue.max) + percent + ' ' + this.MAX_LABEL + ')', 'details');
            }
        }
        else {
            const showUpgrade = effectValue.upgrade !== 0;
            // 
            let showBase = (effectValue.upgrade !== 0)
                && !hideBase
                && effectValue.value !== 0
                && effectValue.upgradeType !== effect_value_upgrade_type_1.EffectValueUpgradeType.RanksAfterInThisTrait;
            const hasDetails = showUpgrade || showBase;
            if (hasDetails) {
                const addUpgradeToBaseValue = effectValue.upgradeType !== effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement
                    && effectValue.upgradeType !== effect_value_upgrade_type_1.EffectValueUpgradeType.Every3
                    && effectValue.upgradeType !== effect_value_upgrade_type_1.EffectValueUpgradeType.Every3RuneLevel
                    && effectValue.upgradeType !== effect_value_upgrade_type_1.EffectValueUpgradeType.Every5RuneLevel;
                const sign = showBase ? effectValue.upgrade < 0 ? '- ' : '+ ' : effectValue.upgrade < 0 ? '-' : '+';
                const base = showBase ? (0, utils_1.numberToString)(effectValue.baseValue + (addUpgradeToBaseValue ? effectValue.upgrade : 0)) + percent + ' ' : '';
                const upgrade = showUpgrade ? sign + (0, utils_1.numberToString)((0, math_util_1.bankerRound)(Math.abs(effectValue.upgrade), 2)) + percent : '';
                result = base;
                if (showUpgrade) {
                    if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Mastery) {
                        result += upgrade + ' per mastery level';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.UpgradeRank) {
                        result += upgrade + ' per rank';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.AncestralRank) {
                        result += upgrade + ' per rank';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3) {
                        result += upgrade + ' every third mastery level';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every3RuneLevel) {
                        result += upgrade + ' every 3 levels';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Every5RuneLevel) {
                        result += upgrade + ' every 5 levels';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.ReaperLevel) {
                        result += upgrade + ' per Level';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.NonPrimordialReaperLevel) {
                        result += upgrade + ' per Non-Primordial Level';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.RanksAfterInThisTrait) {
                        result += upgrade + ' for every point after this one in this Trait';
                    }
                    else if (effectValue.upgradeType === effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement) {
                        result += upgrade + ' per reinforcement';
                    }
                }
                else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                    result += this.slormancerTranslateService.translate(effectValue.source);
                }
                result = this.asSpan(' (' + result + ')', 'details');
            }
        }
        return result;
    }
    formatValue(value, percent, roundValues = false) {
        return typeof value === 'number'
            ? (0, utils_1.numberToString)(roundValues ? (0, math_util_1.round)(value) : value) + (percent ? '%' : '')
            : ((0, utils_1.numberToString)(roundValues ? (0, math_util_1.round)(value.min) : value.min) + ' - ' + (0, utils_1.numberToString)(roundValues ? (0, math_util_1.round)(value.max) : value.max));
    }
    formatRuneDescription(template, effectValues) {
        for (let effectValue of effectValues) {
            const percent = effectValue.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                const value = this.asSpan((0, utils_1.numberToString)(effectValue.displayValue), 'value') + percent;
                const details = this.getEffectValueDetails(effectValue);
                template = this.replaceAnchor(template, value + ' ' + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan((0, utils_1.numberToString)(effectValue.displayValue), 'value') + percent;
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                const details = this.getEffectValueDetails(effectValue);
                const synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                const value = this.asSpan(this.formatValue(effectValue.value, true), 'value');
                if (typeof effectValue.synergy === 'number' && !(0, utils_1.isDamageType)(effectValue.source)) {
                    template = this.replaceAnchor(template, synergy, (0, utils_1.valueOrDefault)(effectValue.anchor, this.SYNERGY_ANCHOR));
                    template = this.replaceAnchor(template, value + details, this.VALUE_ANCHOR);
                }
                else {
                    template = this.replaceAnchor(template, synergy + details, this.SYNERGY_ANCHOR);
                }
                if ((0, utils_1.isDamageType)(effectValue.stat)) { // à retirer une fois les synergies fix probablement
                    template = this.replaceAnchor(template, this.slormancerTranslateService.translate(effectValue.stat), '{damageType}');
                }
            }
        }
        return template;
    }
    formatActivableDescription(template, effectValues) {
        for (let effectValue of effectValues) {
            const percent = effectValue.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                const value = this.asSpan((0, utils_1.numberToString)(effectValue.displayValue) + percent, 'value');
                const details = this.getEffectValueDetails(effectValue);
                template = this.replaceAnchor(template, value + ' ' + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan((0, utils_1.numberToString)(effectValue.displayValue) + percent, 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                const details = this.getEffectValueDetails(effectValue);
                const synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                const value = this.asSpan(this.formatValue(effectValue.value, true), 'value');
                if (typeof effectValue.synergy === 'number' && !(0, utils_1.isDamageType)(effectValue.stat)) {
                    template = this.replaceAnchor(template, synergy, (0, utils_1.valueOrDefault)(effectValue.anchor, this.VALUE_ANCHOR));
                    if (effectValue.showValue) {
                        template = this.replaceAnchor(template, value + details, this.SYNERGY_ANCHOR);
                    }
                }
                else {
                    template = this.replaceAnchor(template, synergy + details, this.SYNERGY_ANCHOR);
                }
            }
        }
        return template;
    }
    formatSkillDescription(template, effectValues) {
        for (let effectValue of effectValues) {
            const percent = effectValue.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                const value = this.asSpan(effectValue.displayValue + percent, 'value');
                const details = this.getEffectValueDetails(effectValue);
                template = this.replaceAnchor(template, value + ' ' + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan(effectValue.displayValue + percent, 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                const details = ' ' + this.getEffectValueDetails(effectValue);
                const synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                const value = this.asSpan(this.formatValue(effectValue.displayValue, true), 'value');
                template = this.replaceAnchor(template, synergy + details, this.VALUE_ANCHOR);
                if (effectValue.showValue) {
                    template = this.replaceAnchor(template, value, this.SYNERGY_ANCHOR);
                }
                template = this.replaceAnchor(template, this.slormancerTranslateService.translate(effectValue.stat), '{damageType}');
            }
        }
        return template;
    }
    formatTraitDescription(template, effectValues) {
        for (let effectValue of effectValues) {
            const percent = effectValue.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                const value = this.asSpan(effectValue.displayValue + percent, 'value');
                const details = this.getEffectValueDetails(effectValue);
                template = this.replaceAnchor(template, value + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan(effectValue.displayValue + percent, 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                const details = this.getEffectValueDetails(effectValue);
                const value = this.asSpan(this.formatValue(effectValue.displayValue, effectValue.percent), 'value');
                const synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                template = this.replaceAnchor(template, value + details, this.VALUE_ANCHOR);
                template = this.replaceAnchor(template, synergy, this.SYNERGY_ANCHOR);
            }
        }
        return template;
    }
    formatUpgradeDescription(template, effectValues) {
        for (let effectValue of effectValues) {
            const percent = effectValue.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                const value = this.asSpan(effectValue.displayValue + percent, 'value');
                const details = this.getEffectValueDetails(effectValue);
                template = this.replaceAnchor(template, value + ' ' + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan(effectValue.displayValue + percent, 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                const details = this.getEffectValueDetails(effectValue);
                let synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                let value = this.asSpan(this.formatValue(effectValue.value, true), 'value');
                if ((0, utils_1.isDamageType)(effectValue.stat) || effectValue.stat === 'training_lance_additional_damage_add') {
                    synergy += ' ' + details;
                }
                else {
                    value += ' ' + details;
                }
                template = this.replaceAnchor(template, synergy, this.VALUE_ANCHOR);
                template = this.replaceAnchor(template, value, this.SYNERGY_ANCHOR);
                template = this.replaceAnchor(template, this.slormancerTranslateService.translate(effectValue.stat), '{damageType}');
            }
        }
        return template;
    }
    formatAncestralLegacyDescription(template, effectValues) {
        const stats = effectValues.map(value => value.stat);
        template = this.injectStatsToTemplates(template, stats);
        for (let effectValue of effectValues) {
            const percent = effectValue.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                const value = this.asSpan(effectValue.displayValue + percent, 'value');
                const details = this.getEffectValueDetails(effectValue);
                template = this.replaceAnchor(template, value + ' ' + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan(effectValue.displayValue + percent, 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                const details = this.getEffectValueDetails(effectValue);
                const synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                const value = this.asSpan(this.formatValue(effectValue.value, true), 'value');
                template = this.replaceAnchor(template, synergy + ' ' + details, this.VALUE_ANCHOR);
                template = this.replaceAnchor(template, value, this.SYNERGY_ANCHOR);
            }
        }
        return template;
    }
    formatReaperTemplate(template, effectValues) {
        for (let effectValue of effectValues) {
            const percent = effectValue.percent ? '%' : '';
            if ((0, utils_1.isEffectValueVariable)(effectValue)) {
                const value = this.asSpan((0, utils_1.numberToString)(effectValue.displayValue) + percent, 'value');
                const details = this.getEffectValueDetails(effectValue, true);
                template = this.replaceAnchor(template, value + ' ' + details, this.VALUE_ANCHOR);
            }
            else if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, this.CONSTANT_ANCHORS);
                if (anchor !== null) {
                    const value = this.asSpan((0, utils_1.numberToString)(effectValue.displayValue) + percent, 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                let synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                if (effectValue.detailOnSynergy) {
                    synergy += this.getEffectValueDetails(effectValue, true);
                }
                template = this.replaceAnchor(template, synergy, this.SYNERGY_ANCHOR);
                template = this.replaceAnchor(template, this.slormancerTranslateService.translate(effectValue.source), this.TYPE_ANCHOR);
            }
        }
        return template;
    }
    formatUltimatumTemplate(template, effectValue) {
        const percent = effectValue.percent ? '%' : '';
        const value = this.asSpan(effectValue.displayValue + percent, 'value');
        const details = this.getEffectValueDetails(effectValue);
        return this.replaceAnchor(template, value + ' ' + details, this.TYPE_ANCHOR);
    }
    formatMechanicTemplate(template, effectValues) {
        for (let effectValue of effectValues) {
            if ((0, utils_1.isEffectValueConstant)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, [this.TYPE_ANCHOR, this.VALUE_ANCHOR, ...this.CONSTANT_ANCHORS, this.SPECLAL_DAMAGE_ANCHOR]);
                if (anchor !== null) {
                    const value = this.asSpan(this.formatValue(effectValue.displayValue, effectValue.percent), 'value');
                    template = this.replaceAnchor(template, value, anchor);
                }
            }
            else if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
                const anchor = (0, utils_1.findFirst)(template, [this.TYPE_ANCHOR, this.VALUE_ANCHOR, this.SPECLAL_DAMAGE_ANCHOR]);
                if (anchor !== null) {
                    const synergy = this.asSpan(this.formatValue(effectValue.displaySynergy, effectValue.percent), 'value');
                    template = this.replaceAnchor(template, synergy, anchor);
                }
                const value = this.asSpan(this.formatValue(effectValue.displayValue, false), 'value');
                template = this.replaceAnchor(template, value, this.SYNERGY_ANCHOR);
            }
        }
        return template;
    }
    getLegendaryDescriptionTemplate(data) {
        const stats = (0, utils_1.splitData)(data.STAT);
        const types = (0, utils_1.splitData)(data.TYPE);
        return this.parseTemplate(data.EN_DESC, stats, types);
    }
    getActivableDescriptionTemplate(data) {
        const stats = (0, utils_1.splitData)(data.DESC_VALUE);
        const types = (0, utils_1.splitData)(data.DESC_VALUE_REAL);
        return this.parseTemplate(data.EN_DESCRIPTION, stats, types);
    }
    getSkillDescriptionTemplate(data) {
        const stats = (0, utils_1.splitData)(data.DESC_VALUE).filter(value => !value.startsWith('*'))
            .map(stat => (0, utils_1.isDamageType)(stat) ? '{damageType}' : stat);
        const types = (0, utils_1.splitData)(data.DESC_VALUE_REAL);
        const template = data.EN_DESCRIPTION.replace(/ \([^\)]*?(%|\+|\-)[^\)]*?\)/g, '');
        return this.parseTemplate(template, stats, types);
    }
    getRuneDescriptionTemplate(data) {
        const stats = (0, utils_1.splitData)(data.VALUE_STAT).filter(value => !value.startsWith('*'))
            .map(stat => (0, utils_1.isDamageType)(stat) ? '{damageType}' : stat);
        const types = (0, utils_1.splitData)(data.VALUE_REAL);
        const template = data.EN_DESCRIPTION.replace(/ \([^\)]*?(%|\+|\-)[^\)]*?\)/g, '');
        return this.parseTemplate(template, stats, types);
    }
    prepareAncestralLegacyDescriptionTemplate(data) {
        const stats = (0, utils_1.splitData)(data.DESC_VALUE)
            .filter(value => !value.startsWith('*'));
        const types = (0, utils_1.splitData)(data.DESC_VALUE_REAL);
        const template = data.EN_DESCRIPTION.replace(/ \([^\)]*?(%|\+|\-)[^\)]*?\)/g, '');
        return this.parseAncestralLegacyTemplate(template, stats, types);
    }
    getAttributeTemplate(data) {
        const stats = (0, utils_1.splitData)(data.STAT).filter(value => !value.startsWith('*'));
        const types = (0, utils_1.splitData)(data.TYPE);
        const template = data.EN_TEXT.replace(/ \([^\)]*?(%|\+|\-)[^\)]*?\)/g, '');
        return this.parseTemplate(template, stats, types);
    }
    prepareAttributeCumulativeTraitTemplate(template, stat) {
        template = template.replace(/ \([^\)]*?(%|\+|\-)[^\)]*?\)/g, '');
        return this.parseTemplate(template, stat === null ? [] : [stat]);
    }
    prepareNextRankDescriptionTemplate(template, effectValue) {
        return this.parseTemplate(template, [effectValue.stat]);
    }
    prepareUltimatumTemplate(template, stat) {
        const translatedStat = this.slormancerTranslateService.translate(stat);
        return this.parseTemplate(template)
            .replace(this.VALUE_ANCHOR, translatedStat)
            .replace(this.VALUE_ANCHOR, translatedStat);
    }
    prepareMechanicTemplate(template, stats) {
        return this.parseTemplate(template, stats);
    }
    prepareBuffTemplate(template) {
        return this.parseTemplate(template);
    }
    formatNextRankDescription(template, effectValue) {
        let value = '';
        let details = '';
        if ((0, utils_1.isEffectValueSynergy)(effectValue)) {
            value = this.formatValue(effectValue.displaySynergy, effectValue.percent);
            details = this.asSpan(' (' + this.formatValue(effectValue.value, true) + ' ' + this.slormancerTranslateService.translate(effectValue.source) + ')', 'details');
        }
        else {
            value = this.formatValue(effectValue.value, effectValue.percent);
        }
        return this.replaceAnchor(template, this.asSpan(value, 'value') + details, this.VALUE_ANCHOR);
    }
    prepareReaperDescriptionTemplate(template, stats = []) {
        template = this.injectStatsToTemplates(template, stats);
        if (template.startsWith('*')) {
            template = template.substr(1);
        }
        template = template
            .replace(/\/\n/g, '/')
            .replace(/\/\*/g, '/')
            .replace(/\|\*/g, '|');
        return (0, utils_1.splitData)(template, '/')
            .map(t => this.normalizeTemplate(t))
            .map(t => this.replaceAll(t, /\.\*(.+)/g, '.<br/><br/>$1'))
            .map(t => this.replaceAll(t, /\*(.+?)/g, '<br/>$1'))
            .map(t => this.replaceAll(t, /\*/, ''));
    }
    replaceAll(test, pattern, replace) {
        const result = test.replace(pattern, replace);
        return result === test ? result : this.replaceAll(result, pattern, replace);
    }
    getReaperLoreTemplate(template) {
        return this.normalizeTemplate(template);
    }
    injectStatsToTemplates(template, stats = []) {
        for (const stat of stats) {
            template = template.replace(this.STAT_ANCHOR, this.slormancerTranslateService.translate(stat));
        }
        return template;
    }
    injectSynergyTypesToTemplates(template, synergies = []) {
        synergies = synergies
            .map(synergy => (0, utils_1.splitData)(synergy, ':')[1])
            .filter(utils_1.isNotNullOrUndefined);
        for (const synergy of synergies) {
            let translated = this.slormancerTranslateService.translate(synergy);
            if (synergy.startsWith('victims_reaper_')) {
                translated = translated.replace('$', '{weaponClass}');
            }
            template = template.replace(this.TYPE_ANCHOR, translated);
        }
        return template;
    }
    normalizeTemplate(template) {
        return template
            .replace(/<|>/g, '')
            .replace(/\(/g, '<span class="formula">(')
            .replace(/\)/g, ')</span>')
            .replace(this.RETURN_REGEXP, '</br>');
    }
    parseTemplate(template, stats = [], types = []) {
        template = this.injectStatsToTemplates(template, stats);
        template = this.injectSynergyTypesToTemplates(template, types);
        template = this.normalizeTemplate(template);
        return template;
    }
    parseAncestralLegacyTemplate(template, stats = [], types = []) {
        //template = this.injectStatsToTemplates(template, stats)
        template = this.injectSynergyTypesToTemplates(template, types);
        template = this.normalizeTemplate(template);
        return template;
    }
    getReaperEnchantmentLabel(template, value, min, max, reaperSmith) {
        const textValue = this.asSpan((0, utils_1.numberToString)(value), 'value')
            + this.asSpan(' (' + (0, utils_1.numberToString)(min) + ' - ' + (0, utils_1.numberToString)(max) + ')', 'details');
        template = this.replaceAnchor(template, textValue, this.VALUE_ANCHOR);
        template = this.replaceAnchor(template, reaperSmith, this.TYPE_ANCHOR);
        return template;
    }
    getSkillEnchantmentLabel(template, value, min, max, skill) {
        const textValue = this.asSpan((0, utils_1.numberToString)(value), 'value')
            + this.asSpan(' (' + (0, utils_1.numberToString)(min) + ' - ' + (0, utils_1.numberToString)(max) + ')', 'details');
        template = this.replaceAnchor(template, textValue, this.VALUE_ANCHOR);
        template = this.replaceAnchor(template, skill, this.TYPE_ANCHOR);
        return template;
    }
    getAttributeEnchantmentLabel(template, value, min, max, attribute) {
        const textValue = this.asSpan((0, utils_1.numberToString)(value), 'value')
            + this.asSpan(' (' + (0, utils_1.numberToString)(min) + ' - ' + (0, utils_1.numberToString)(max) + ')', 'details');
        template = this.replaceAnchor(template, textValue, this.VALUE_ANCHOR);
        template = this.replaceAnchor(template, attribute, this.TYPE_ANCHOR);
        return template;
    }
    formatItemAffixValue(itemAffix) {
        const percent = itemAffix.craftedEffect.effect.percent ? '%' : '';
        let result = '+' + this.asSpan((0, utils_1.numberToString)(itemAffix.craftedEffect.effect.displayValue), 'value') + percent;
        if (itemAffix.isPure) {
            result += this.asSpan(' (' + (itemAffix.pure - 100) + '% pure)', 'details pure');
        }
        else {
            const percent = itemAffix.craftedEffect.effect.percent ? '%' : '';
            result += this.asSpan(' (' + (0, utils_1.numberToString)((0, utils_1.getCraftValue)(itemAffix.craftedEffect, itemAffix.craftedEffect.minPossibleCraftedValue)) + percent
                + '-' + (0, utils_1.numberToString)((0, utils_1.getCraftValue)(itemAffix.craftedEffect, itemAffix.craftedEffect.maxPossibleCraftedValue)) + percent + ')', 'details range');
        }
        return result;
    }
};
SlormancerTemplateService = __decorate([
    (0, core_1.Injectable)()
], SlormancerTemplateService);
exports.SlormancerTemplateService = SlormancerTemplateService;
//# sourceMappingURL=slormancer-template.service.js.map