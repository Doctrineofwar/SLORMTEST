"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerReaperService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const data_reaper_level_1 = require("../../constants/content/data/data-reaper-level");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const reaper_smith_1 = require("../../model/content/enum/reaper-smith");
const effect_value_util_1 = require("../../util/effect-value.util");
const math_util_1 = require("../../util/math.util");
const parse_util_1 = require("../../util/parse.util");
const utils_1 = require("../../util/utils");
let SlormancerReaperService = class SlormancerReaperService {
    constructor(slormancerDataService, slormancerTemplateService, slormancerTranslateService, slormancerEffectValueService, slormancerActivableService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerEffectValueService = slormancerEffectValueService;
        this.slormancerActivableService = slormancerActivableService;
        this.DESCRIPTION_SKILL_REGEXP = /act:[0-9]+/g;
        this.BENEDICTION_LABEL = this.slormancerTranslateService.translate('tt_ancient_bonus');
        this.MALEDICTION_LABEL = this.slormancerTranslateService.translate('tt_ancient_malus');
        this.ACTIVABLES_LABEL = this.slormancerTranslateService.translate('tt_unlocked_actives');
        this.VICTIMS_LABEL = this.slormancerTranslateService.translate('tt_victims');
        this.LEVEL_LABEL = this.slormancerTranslateService.translate('level');
        this.REAPERSMITH_LABEL = this.slormancerTranslateService.translate('weapon_reapersmith_light');
        this.PRIMORDIAL_REAPER_LABEL = this.slormancerTranslateService.translate('tt_reaper_corrupted').split('/')[0];
        this.GRANTED_BY_MASTERY_LABEL = this.slormancerTranslateService.translate('reaper_mastery_tt_from');
    }
    getReaperMastery(gameWeapons) {
        const remainingWeapons = [...gameWeapons].filter(gameWeapon => gameWeapon.id !== 114);
        let level = 0;
        let xp = 0;
        for (let data of data_reaper_level_1.DATA_REAPER_MASTERY_LEVEL) {
            level = data.level;
            if (data.next !== null) {
                xp += data.next;
            }
            // summing all xp is too much for a javascript number, we have to find a smarter way
            while (xp > 0 && remainingWeapons.length > 0) {
                const weapon = remainingWeapons.splice(0, 1)[0];
                xp -= weapon.basic.experience + weapon.primordial.experience;
            }
            if (xp > 0) {
                break;
            }
        }
        return level;
    }
    getReaperLevel(xp) {
        let level = 1;
        for (let data of data_reaper_level_1.DATA_REAPER_LEVEL) {
            level = data.level;
            if (data.next !== null) {
                xp -= data.next;
            }
            if (data.next === null || xp < 0) {
                break;
            }
        }
        return level;
    }
    getAffinityMultiplier(affinity) {
        return 1 + affinity / 200;
    }
    getDamages(level, base, perLevel, multiplier, affinity) {
        const weapon_mult = multiplier;
        const bminr = base.min;
        const lminr = perLevel.min;
        const bmaxr = base.max;
        const lmaxr = perLevel.max;
        let mult = 0;
        switch (weapon_mult) {
            case 0:
                mult = 0;
                break;
            case 1:
                mult = 0.007;
                break;
            case 2:
                mult = 0.01;
                break;
            case 3:
                mult = 0.016;
                break;
            case 4:
                mult = 0.019;
                break;
            case 5:
                mult = 0.023;
                break;
        }
        let prev = bminr;
        let max_prev = bmaxr;
        let cminr = bminr;
        let cmaxr = bmaxr;
        for (let i = 2; i <= level; i++) {
            let basic_total = ((prev + lminr) + (mult * prev));
            let max_basic_total = ((max_prev + lmaxr) + (mult * max_prev));
            if (i == level) {
                cminr = basic_total;
                cmaxr = max_basic_total;
            }
            prev = Math.ceil(basic_total);
            max_prev = Math.ceil(max_basic_total);
        }
        const affinityMultiplier = this.getAffinityMultiplier(affinity);
        return { min: (0, math_util_1.bankerRound)(cminr * affinityMultiplier), max: (0, math_util_1.bankerRound)(cmaxr * affinityMultiplier) };
    }
    getReaperName(template, primordial, heroClass) {
        const weaponName = this.slormancerTranslateService.translate('weapon_' + heroClass);
        return this.buildReaperName(weaponName, template, primordial);
    }
    buildReaperName(weaponName, nameTemplate, primordial) {
        if (primordial) {
            weaponName = this.slormancerTemplateService.replaceAnchor(this.PRIMORDIAL_REAPER_LABEL, weaponName, this.slormancerTemplateService.VALUE_ANCHOR);
        }
        return this.slormancerTemplateService.replaceAnchor(nameTemplate, weaponName, this.slormancerTemplateService.TYPE_ANCHOR);
    }
    getReaperMinimumLevel(reaperId) {
        let result = 1;
        if (!constants_1.UNITY_REAPERS.includes(reaperId)) {
            const parentsMinLevel = this.slormancerDataService.getParentsGameDataReaper(reaperId)
                .map(parent => parent.MAX_LVL)
                .filter(utils_1.isNotNullOrUndefined);
            result = Math.max(...parentsMinLevel, 1);
        }
        return result;
    }
    getReaperParentIds(id) {
        const gameData = this.slormancerDataService.getGameDataReaper(id);
        let result = [id];
        if (gameData !== null) {
            result = this.getReaperParents(gameData).map(r => r.REF);
        }
        return result;
    }
    getReaperParents(gameData) {
        let result = [];
        let current = [gameData];
        let i = 0;
        while (result.length !== current.length && i <= 5) {
            result = current;
            const parents = result.map(data => this.slormancerDataService.getParentsGameDataReaper(data.REF))
                .reduce((a, b) => a.concat(b), []);
            i++;
            current = Array.from(new Set([...result, ...parents]));
        }
        return result.sort((a, b) => (0, utils_1.compare)(a.REF, b.REF));
    }
    parseUpgradeType(upgradeType) {
        let result = effect_value_upgrade_type_1.EffectValueUpgradeType.ReaperLevel;
        if (upgradeType === 'rl') {
            result = effect_value_upgrade_type_1.EffectValueUpgradeType.ReaperLevel;
        }
        else if (upgradeType === 'rln') {
            result = effect_value_upgrade_type_1.EffectValueUpgradeType.NonPrimordialReaperLevel;
        }
        return result;
    }
    parseReaperEffectVariableValue(base, level, type, stat) {
        let result;
        if (level === null) {
            result = (0, effect_value_util_1.effectValueVariable)(base, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.ReaperLevel, type === '%', stat);
        }
        else {
            result = (0, effect_value_util_1.effectValueVariable)(0, base, this.parseUpgradeType(level), type === '%', stat);
        }
        return result;
    }
    parseReaperEffectSynergyValue(real, stat) {
        let result;
        const typeValues = (0, utils_1.splitData)(real, ':');
        const source = typeValues[1];
        const brutValue = typeValues[2];
        const isVariable = brutValue.indexOf('*') !== -1;
        const [upgradeValue, upgradeType] = (0, utils_1.splitData)(brutValue, '*');
        const value = isVariable ? 0 : (0, parse_util_1.strictParseFloat)(brutValue);
        const upgrade = isVariable ? (0, parse_util_1.strictParseFloat)(upgradeValue) : 0;
        result = (0, effect_value_util_1.effectValueSynergy)(value, upgrade, this.parseUpgradeType((0, utils_1.valueOrNull)(upgradeType)), false, source, stat);
        return result;
    }
    getReaperValues(bases, types, levels, reals, stats) {
        const result = [];
        let synergyCursor = 0;
        const baseAndReal = [...(0, utils_1.emptyStringToNull)(bases), ...(0, utils_1.emptyStringToNull)(reals)].filter(utils_1.isNotNullOrUndefined).length;
        const nb = Math.max(types.length, baseAndReal, levels.length, stats.length);
        for (let i of (0, math_util_1.list)(nb)) {
            const base = (0, utils_1.notEmptyOrNull)(bases[i]);
            const level = (0, utils_1.notEmptyOrNull)(levels[i]);
            const type = (0, utils_1.notEmptyOrNull)(types[i]);
            const stat = (0, utils_1.notEmptyOrNull)(stats[i]);
            const parsedBase = base === null ? null : (0, parse_util_1.strictParseFloat)(base);
            if (parsedBase != null) {
                result.push(this.parseReaperEffectVariableValue(parsedBase, level, type, stat));
            }
            else {
                const real = (0, utils_1.notEmptyOrNull)(reals[synergyCursor++]);
                if (real !== null) {
                    result.push(this.parseReaperEffectSynergyValue(real, stat));
                }
            }
        }
        return result;
    }
    getReaperEffect(template, base, type, level, real, stat) {
        let result = {
            template: template !== null && template !== '|' ? template : null,
            values: []
        };
        const parsedBase = base === null ? [] : (0, utils_1.splitData)(base, '|');
        const parsedType = type === null ? [] : (0, utils_1.splitData)(type, '|');
        const parsedLevel = level === null ? [] : (0, utils_1.splitData)(level, '|');
        const parsedStat = stat === null ? [] : (0, utils_1.splitData)(stat, '|');
        const parsedReal = real === null ? [] : (0, utils_1.splitData)(real, '|');
        result.values = this.getReaperValues(parsedBase, parsedType, parsedLevel, parsedReal, parsedStat);
        return result;
    }
    getReaperTemplates(gameData, heroClass) {
        const gameDatas = this.getReaperParents(gameData);
        const base = [];
        const benediction = [];
        const malediction = [];
        let skills = [];
        let primordialSkills = [];
        for (const data of gameDatas) {
            const stats = (0, utils_1.splitData)(data.VALUE_STAT, '\n')
                .map(stats => (0, utils_1.splitData)(stats, '|'))
                .reduce((stats, total) => [...stats, ...total], [])
                .filter(utils_1.notEmptyOrNull);
            const template = data.EN_DESC.replace(this.DESCRIPTION_SKILL_REGEXP, '');
            const [baseTemplate, benedictionTemplate, maledictionTemplate] = this.slormancerTemplateService.prepareReaperDescriptionTemplate(template, stats);
            const [statStat, benedictionStat, maledictionStat] = (0, utils_1.splitData)(data.VALUE_STAT, '\n');
            const [descBase, benedictionBase, maledictionBase] = (0, utils_1.splitData)(data.VALUE_BASE, '\n');
            const [descType, benedictionType, maledictionType] = (0, utils_1.splitData)(data.VALUE_TYPE, '\n');
            const [descLevel, benedictionLevel, maledictionLevel] = (0, utils_1.splitData)(data.VALUE_LEVEL, '\n');
            const [descReal, benedictionReal, maledictionReal] = (0, utils_1.splitData)(data.VALUE_REAL, '\n');
            const reaperData = this.slormancerDataService.getDataReaper(data.REF);
            const baseEffect = this.getReaperEffect((0, utils_1.valueOrNull)(baseTemplate), (0, utils_1.valueOrNull)(descBase), (0, utils_1.valueOrNull)(descType), (0, utils_1.valueOrNull)(descLevel), (0, utils_1.valueOrNull)(descReal), (0, utils_1.valueOrNull)(statStat));
            const benedictionEffect = this.getReaperEffect((0, utils_1.valueOrNull)(benedictionTemplate), (0, utils_1.valueOrNull)(benedictionBase), (0, utils_1.valueOrNull)(benedictionType), (0, utils_1.valueOrNull)(benedictionLevel), (0, utils_1.valueOrNull)(benedictionReal), (0, utils_1.valueOrNull)(benedictionStat));
            const maledictionEffect = this.getReaperEffect((0, utils_1.valueOrNull)(maledictionTemplate), (0, utils_1.valueOrNull)(maledictionBase), (0, utils_1.valueOrNull)(maledictionType), (0, utils_1.valueOrNull)(maledictionLevel), (0, utils_1.valueOrNull)(maledictionReal), (0, utils_1.valueOrNull)(maledictionStat));
            if (reaperData !== null) {
                reaperData.override(baseEffect, benedictionEffect, maledictionEffect, gameData.REF);
            }
            base.push(baseEffect);
            benediction.push(benedictionEffect);
            malediction.push(maledictionEffect);
            skills = [...skills, ...this.slormancerActivableService.getReaperActivable(data.REF, 0, heroClass)];
            primordialSkills = [...primordialSkills, ...this.slormancerActivableService.getPrimordialReaperActivable(data.REF, 0, heroClass)];
        }
        return {
            name: gameData.EN_NAME,
            base: base.filter(utils_1.isNotNullOrUndefined),
            benediction: benediction.filter(utils_1.isNotNullOrUndefined),
            malediction: malediction.filter(utils_1.isNotNullOrUndefined),
            activables: skills,
            primordialSkills
        };
    }
    formatTemplate(reaperEffects) {
        let contents = [];
        let stats = [];
        let effects = [];
        for (let reaperEffect of reaperEffects) {
            if (reaperEffect.template !== null) {
                const template = this.slormancerTemplateService.formatReaperTemplate(reaperEffect.template, reaperEffect.values);
                const [stat, effect] = (0, utils_1.splitData)(template);
                stats.push(stat);
                effects.push(effect);
            }
        }
        contents.push((0, utils_1.removeEmptyValues)(stats).join('<br/>'));
        contents.push((0, utils_1.removeEmptyValues)(effects).join('<br/><br/>'));
        return (0, utils_1.removeEmptyValues)(contents).join('<br/><br/>');
    }
    getReaperFromGameWeapon(data, weaponClass, primordial, reaperMastery) {
        const level = this.getReaperLevel(data.basic.experience + data.primordial.experience);
        return this.getReaperById(data.id, weaponClass, primordial, level, 0, data.basic.kills, data.primordial.kills, 0, 0, 0, reaperMastery);
    }
    getReaperEffectClone(reaperEffect) {
        return {
            ...reaperEffect,
            values: reaperEffect.values.map(value => this.slormancerEffectValueService.getEffectValueClone(value))
        };
    }
    getReaperClone(reaper) {
        const result = {
            ...reaper,
            smith: { ...reaper.smith },
            templates: {
                ...reaper.templates,
                base: reaper.templates.base.map(effect => this.getReaperEffectClone(effect)),
                benediction: reaper.templates.benediction.map(effect => this.getReaperEffectClone(effect)),
                malediction: reaper.templates.malediction.map(effect => this.getReaperEffectClone(effect)),
                activables: reaper.templates.activables.map(activable => this.slormancerActivableService.getActivableClone(activable)),
                primordialSkills: reaper.templates.primordialSkills.map(activable => this.slormancerActivableService.getActivableClone(activable))
            }
        };
        return result;
    }
    getDefaultReaper(weaponClass) {
        const defaultGameData = this.slormancerDataService.getGameDataAvailableReaper()[0];
        return this.getReaper(defaultGameData, weaponClass, false, 1, 0, 0, 0, 0);
    }
    getReaper(gameData, weaponClass, primordial, baseLevel, bonusLevel, baseKills, primordialKills, baseReaperAffinity = 0, baseEffectAffinity = 0, bonusAffinity = 0, masteryLevel = 0) {
        const maxLevel = gameData.MAX_LVL ?? 100;
        let result = {
            id: gameData.REF,
            weaponClass,
            type: this.slormancerTranslateService.translate('weapon_' + weaponClass),
            icon: '',
            primordial,
            level: 0,
            masteryLevel,
            baseLevel,
            bonusLevel,
            baseReaperAffinity,
            baseEffectAffinity,
            bonusAffinity,
            reaperAffinity: 0,
            effectAffinity: 0,
            kills: 0,
            baseKills,
            primordialKills,
            name: '',
            description: '',
            benediction: null,
            malediction: null,
            activables: [],
            lore: this.slormancerTemplateService.getReaperLoreTemplate(gameData.EN_LORE),
            templates: this.getReaperTemplates(gameData, weaponClass),
            smith: { id: gameData.BLACKSMITH ?? reaper_smith_1.ReaperSmith.Adrianne, name: '' },
            damageType: 'weapon_damage',
            minLevel: this.getReaperMinimumLevel(gameData.REF),
            maxLevel: maxLevel,
            damages: { min: 0, max: 0 },
            damagesLabel: '',
            maxDamages: { min: 0, max: 0 },
            maxDamagesLabel: '',
            damagesBase: { min: gameData.BASE_DMG_MIN ?? 0, max: gameData.BASE_DMG_MAX ?? 0 },
            damagesLevel: { min: gameData.MIN_DMG_LVL ?? 0, max: gameData.MAX_DMG_LVL ?? 0 },
            damagesMultiplier: gameData.DMG_MULTIPLIER ?? 1,
            evolveInto: gameData.EVOLVE_IN,
            benedictionTitleLabel: '',
            maledictionTitleLabel: '',
            activablesTitleLabel: '',
            affinityLabel: '',
            smithLabel: '',
            victimsLabel: '',
            levelLabel: '',
            bonusLevelLabel: '',
            damageTypeLabel: '',
            masteryLabel: null,
        };
        this.updateReaperModel(result);
        this.updateReaperView(result);
        return result;
    }
    getReaperById(id, weaponClass, primordial, baseLevel, bonusLevel, kills, killsPrimordial, reaperAffinity = 0, effectAffinity = 0, bonusAffinity = 0, masteryLevel = 0) {
        const gameData = this.slormancerDataService.getGameDataReaper(id);
        let result = null;
        if (gameData !== null) {
            result = this.getReaper(gameData, weaponClass, primordial, baseLevel, bonusLevel, kills, killsPrimordial, reaperAffinity, effectAffinity, bonusAffinity, masteryLevel);
        }
        return result;
    }
    updateEffectValue(value, reaper, affinityMultiplier) {
        const context = { globalMultiplier: 5, affinityMultiplier };
        let upgradeValue = reaper.level;
        /*
        // It's probably a good idea to keep it here in case of
        if ((isEffectValueVariable(value) || isEffectValueSynergy(value)) && value.upgradeType === EffectValueUpgradeType.NonPrimordialReaperLevel) {
            upgradeValue = reaper.baseInfo.level;
        }
        */
        const statsUsingRealValues = [
            'summon_skeleton_squire_cost_lock_reduction',
            'aura_equipped_per_aura_active_add',
            'sun_effect_health_regen_global_mult',
            'moon_effect_health_on_hit_global_mult',
            'righteous_sunlight_damage',
            'butterfly_elemental_damage',
            'overdriving_overdrive_damage_percent',
            'minion_increased_damage_global_mult',
        ];
        if (statsUsingRealValues.includes(value.stat)) {
            context.useOldAffinityFormula = true;
        }
        this.slormancerEffectValueService.updateEffectValue(value, upgradeValue, context);
        const statsRounded = [
            'overdriving_overdrive_damage_percent'
        ];
        if (statsRounded.includes(value.stat)) {
            value.value = (0, math_util_1.round)(value.value);
        }
    }
    useDifferentAffinityForEffects(reaper) {
        return reaper.id === 90 && reaper.primordial;
    }
    updateReaperModel(reaper) {
        reaper.baseLevel = Math.min(reaper.maxLevel, Math.max(reaper.baseLevel, reaper.minLevel));
        reaper.kills = reaper.primordial ? reaper.primordialKills : reaper.baseKills;
        reaper.level = reaper.baseLevel + reaper.bonusLevel;
        reaper.baseReaperAffinity = Math.min(constants_1.MAX_REAPER_AFFINITY_BASE, Math.max(0, reaper.baseReaperAffinity));
        reaper.baseEffectAffinity = Math.min(constants_1.MAX_EFFECT_AFFINITY_BASE, Math.max(0, reaper.baseEffectAffinity));
        reaper.bonusAffinity = Math.max(0, reaper.bonusAffinity);
        reaper.reaperAffinity = reaper.baseReaperAffinity + reaper.bonusAffinity;
        reaper.effectAffinity = reaper.baseEffectAffinity + reaper.bonusAffinity;
        reaper.maxDamages = this.getDamages(100, reaper.damagesBase, reaper.damagesLevel, reaper.damagesMultiplier, reaper.reaperAffinity);
        reaper.activables = reaper.templates.activables;
        let damageLevel = reaper.level;
        if (reaper.masteryLevel > damageLevel) {
            damageLevel = reaper.masteryLevel;
            reaper.masteryLabel = this.GRANTED_BY_MASTERY_LABEL.replace('@', damageLevel.toString());
        }
        else {
            reaper.masteryLabel = null;
        }
        reaper.damages = this.getDamages(damageLevel, reaper.damagesBase, reaper.damagesLevel, reaper.damagesMultiplier, reaper.reaperAffinity);
        const effectAffinityMultiplier = this.getAffinityMultiplier(reaper.effectAffinity);
        for (const reaperEffect of reaper.templates.base) {
            for (const value of reaperEffect.values) {
                this.updateEffectValue(value, reaper, effectAffinityMultiplier);
            }
        }
        for (const reaperEffect of reaper.templates.benediction) {
            for (const value of reaperEffect.values) {
                this.updateEffectValue(value, reaper, effectAffinityMultiplier);
            }
        }
        for (const reaperEffect of reaper.templates.malediction) {
            for (const value of reaperEffect.values) {
                this.updateEffectValue(value, reaper, effectAffinityMultiplier);
            }
        }
        if (reaper.primordial) {
            reaper.activables = [...reaper.activables, ...reaper.templates.primordialSkills];
        }
        for (const activable of reaper.activables) {
            activable.level = reaper.level;
            this.slormancerActivableService.updateActivableModel(activable, { affinityMultiplier: effectAffinityMultiplier });
        }
    }
    updateReaperView(reaper) {
        reaper.icon = 'assets/img/reaper/' + reaper.weaponClass + '/' + reaper.id + (reaper.primordial ? '_p' : '') + '.png';
        reaper.name = this.buildReaperName(reaper.type, reaper.templates.name, reaper.primordial);
        reaper.damagesLabel = reaper.damages.min + '-' + reaper.damages.max;
        reaper.maxDamagesLabel = reaper.maxDamages.min + '-' + reaper.maxDamages.max + ' at level ' + Math.max(reaper.maxLevel, constants_1.MAX_REAPER_LEVEL);
        reaper.description = this.formatTemplate(reaper.templates.base);
        if (reaper.primordial) {
            reaper.benediction = this.formatTemplate(reaper.templates.benediction);
            reaper.malediction = this.formatTemplate(reaper.templates.malediction);
        }
        else {
            reaper.benediction = null;
            reaper.malediction = null;
        }
        for (const activable of reaper.activables) {
            this.slormancerActivableService.updateActivableView(activable);
        }
        reaper.smith.name = this.slormancerTranslateService.translate('weapon_reapersmith_' + (reaper.smith.id === reaper_smith_1.ReaperSmith.ReapersmithBrotherhood ? 'all' : reaper.smith.id));
        reaper.smithLabel = this.slormancerTemplateService.replaceAnchor(this.REAPERSMITH_LABEL, reaper.smith.name, this.slormancerTemplateService.TYPE_ANCHOR);
        reaper.victimsLabel = reaper.kills + ' ' + this.VICTIMS_LABEL;
        reaper.levelLabel = this.LEVEL_LABEL + ' : '
            + (reaper.maxLevel === reaper.baseLevel ? 'Max(' + reaper.baseLevel + ')' : reaper.baseLevel);
        reaper.bonusLevelLabel = reaper.bonusLevel === 0 ? null : '+' + reaper.bonusLevel;
        reaper.damageTypeLabel = this.slormancerTranslateService.translate(reaper.damageType);
        reaper.affinityLabel = reaper.effectAffinity === 0 ? (reaper.reaperAffinity === 0 ? null : reaper.reaperAffinity.toString()) : reaper.effectAffinity.toString();
        reaper.benedictionTitleLabel = this.BENEDICTION_LABEL;
        reaper.maledictionTitleLabel = this.MALEDICTION_LABEL;
        reaper.activablesTitleLabel = this.ACTIVABLES_LABEL;
    }
};
SlormancerReaperService = __decorate([
    (0, core_1.Injectable)()
], SlormancerReaperService);
exports.SlormancerReaperService = SlormancerReaperService;
//# sourceMappingURL=slormancer-reaper.service.js.map