"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormOptionsService = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let FormOptionsService = class FormOptionsService {
    constructor(slormancerDataService, slormancerTranslateService, slormancerReaperService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerReaperService = slormancerReaperService;
        this.DEFENSIVE_STATS = [
            'reduced_damage_from_all_percent',
            'reduced_damage_from_area_percent',
            'reduced_damage_from_melee_percent',
            'reduced_damage_from_projectile_percent',
            'reduced_damage_on_elite_percent',
            'res_phy_add',
            'res_phy_percent',
            'res_mag_add',
            'res_mag_percent',
            'dodge_add',
            'dodge_percent',
            'the_max_health_add',
            'the_max_health_percent',
            'tenacity_percent',
        ];
        this.STATS_LABELS = {};
        this.STATS_OPTIONS_CACHE = {};
        this.LEGENDARY_OPTIONS_CACHE = {};
        this.ALL_LEGENDARY_OPTIONS_CACHE = { 0: [], 1: [], 2: [] };
        this.ALL_STATS_OPTIONS_CACHE = [];
        this.ALL_RARITIES_OPTIONS_CACHE = [];
        this.ALL_REAPER_BUFF_OPTIONS_CACHE = [];
        this.ALL_SKILL_BUFF_OPTIONS_CACHE = { 0: [], 1: [], 2: [] };
        this.ALL_ATTRIBUTE_BUFF_OPTIONS_CACHE = [];
        this.ALL_REAPER_OPTIONS_CACHE = {
            p: { 0: [], 1: [], 2: [] },
            b: { 0: [], 1: [], 2: [] }
        };
        this.ULTIMATUM_OPTIONS_CACHE = [];
        this.initRarityOptionsCache();
        this.initStatOptionsCache();
        this.initLegendaryOptionsCache();
        this.initReaperBuffOptions();
        this.initSkillBuffOptions();
        this.initAttributeBuffOptions();
        this.initReaperOptions();
        this.initUltimatumOptions();
    }
    getReaperOptions(heroClass, primordial) {
        return this.ALL_REAPER_OPTIONS_CACHE[primordial ? 'p' : 'b'][heroClass];
    }
    getAllStatsOptions() {
        return this.ALL_STATS_OPTIONS_CACHE;
    }
    getAllRaritiesOptions() {
        return this.ALL_RARITIES_OPTIONS_CACHE;
    }
    getStatsOptions(base, rarity) {
        let result = this.ALL_STATS_OPTIONS_CACHE;
        const statKey = this.getBaseKey(base);
        const baseStats = this.STATS_OPTIONS_CACHE[statKey];
        if (baseStats) {
            if (rarity === _slorm_api_1.Rarity.Normal) {
                result = (0, _slorm_api_1.valueOrDefault)(baseStats['P'], []);
            }
            else if (rarity === _slorm_api_1.Rarity.Magic || rarity === _slorm_api_1.Rarity.Rare) {
                result = (0, _slorm_api_1.valueOrDefault)(baseStats['S'], []);
            }
            else if (rarity === _slorm_api_1.Rarity.Epic) {
                result = (0, _slorm_api_1.valueOrDefault)(baseStats['E'], []);
            }
            else if (rarity === _slorm_api_1.Rarity.Defensive) {
                result = (0, _slorm_api_1.valueOrDefault)(baseStats['D'], []);
            }
        }
        return result;
    }
    getLegendaryOptions(base, heroClass) {
        let result = [];
        const baseLegendaries = this.LEGENDARY_OPTIONS_CACHE[base];
        if (baseLegendaries) {
            result = baseLegendaries[heroClass];
        }
        return result;
    }
    getAllLegendaryOptions(heroClass) {
        return this.ALL_LEGENDARY_OPTIONS_CACHE[heroClass];
    }
    getReaperBuffOptions() {
        return this.ALL_REAPER_BUFF_OPTIONS_CACHE;
    }
    getSkillBuffOptions(heroClass) {
        return this.ALL_SKILL_BUFF_OPTIONS_CACHE[heroClass];
    }
    getAttributeBuffOptions() {
        return this.ALL_ATTRIBUTE_BUFF_OPTIONS_CACHE;
    }
    getUltimatumOptions() {
        return this.ULTIMATUM_OPTIONS_CACHE;
    }
    getStatsLabels() {
        return this.STATS_LABELS;
    }
    getBaseKey(base) {
        return (base === _slorm_api_1.EquipableItemBase.Body ? 'ARMOR' : base.toUpperCase());
    }
    initRarityOptionsCache() {
        this.ALL_RARITIES_OPTIONS_CACHE = _slorm_api_1.ALL_RARITIES.map(rarity => ({
            label: this.slormancerTranslateService.translate('RAR_loot_' + rarity),
            value: rarity
        }));
    }
    initStatOptionsCache() {
        const stats = this.slormancerDataService.getGameDataStats().filter(stat => stat.PERCENT !== 'X');
        /*
         * P : normal / magic / rare
         * S : magic / rare / epic
         */
        this.STATS_OPTIONS_CACHE = {};
        this.ALL_STATS_OPTIONS_CACHE = [];
        for (const stat of stats) {
            const label = this.slormancerTranslateService.translate(stat.REF) + (stat.PERCENT === '%' ? ' (%)' : '');
            const option = { label, value: stat.REF };
            this.STATS_LABELS[stat.REF] = label;
            this.ALL_STATS_OPTIONS_CACHE.push(option);
            for (const base of _slorm_api_1.EQUIPABLE_ITEM_BASE_VALUES) {
                const statKey = this.getBaseKey(base);
                const rarity = stat[statKey];
                if (rarity !== '') {
                    let statBase = this.STATS_OPTIONS_CACHE[statKey];
                    if (statBase === undefined) {
                        statBase = {
                            P: [],
                            S: [],
                            E: [],
                            D: [],
                        };
                        this.STATS_OPTIONS_CACHE[statKey] = statBase;
                    }
                    if (rarity === 'P') {
                        statBase.P.push(option);
                        statBase.S.push(option);
                        if (this.DEFENSIVE_STATS.includes(stat.REF)) {
                            statBase.D.push(option);
                        }
                    }
                    if (rarity === 'S') {
                        statBase.S.push(option);
                        statBase.E.push(option);
                        if (this.DEFENSIVE_STATS.includes(stat.REF)) {
                            statBase.D.push(option);
                        }
                    }
                    if (rarity === 'E') {
                        statBase.E.push(option);
                    }
                }
            }
        }
        for (const base of _slorm_api_1.EQUIPABLE_ITEM_BASE_VALUES) {
            const statKey = this.getBaseKey(base);
            const baseOptions = this.STATS_OPTIONS_CACHE[statKey];
            if (baseOptions) {
                baseOptions.P.sort((a, b) => (0, _slorm_api_1.compareString)(a.label, b.label));
                baseOptions.S.sort((a, b) => (0, _slorm_api_1.compareString)(a.label, b.label));
                baseOptions.E.sort((a, b) => (0, _slorm_api_1.compareString)(a.label, b.label));
            }
        }
        this.ALL_STATS_OPTIONS_CACHE.sort((a, b) => (0, _slorm_api_1.compareString)(a.label, b.label));
    }
    initLegendaryOptionsCache() {
        const legendaries = this.slormancerDataService.getGameDataLegendaries().filter(legendary => legendary.LOOTABLE);
        this.LEGENDARY_OPTIONS_CACHE = {};
        for (const legendary of legendaries) {
            const option = { value: legendary.REF, label: legendary.EN_NAME };
            let data = this.LEGENDARY_OPTIONS_CACHE[legendary.ITEM];
            if (data === undefined) {
                data = { 0: [], 1: [], 2: [] };
                this.LEGENDARY_OPTIONS_CACHE[legendary.ITEM] = data;
            }
            if (legendary.HERO === -1 || legendary.HERO === 99 || legendary.HERO === 999) {
                data[0].push(option);
                this.ALL_LEGENDARY_OPTIONS_CACHE[0].push(option);
                data[1].push(option);
                this.ALL_LEGENDARY_OPTIONS_CACHE[1].push(option);
                data[2].push(option);
                this.ALL_LEGENDARY_OPTIONS_CACHE[2].push(option);
            }
            else {
                data[legendary.HERO].push(option);
                this.ALL_LEGENDARY_OPTIONS_CACHE[legendary.HERO].push(option);
            }
        }
    }
    initReaperBuffOptions() {
        this.ALL_REAPER_BUFF_OPTIONS_CACHE = _slorm_api_1.ALL_REAPER_SMITH
            .filter(smith => smith !== _slorm_api_1.ReaperSmith.OhmAgad && smith !== _slorm_api_1.ReaperSmith.ReapersmithBrotherhood)
            .map(smith => ({ value: smith, label: this.slormancerTranslateService.translate('weapon_reapersmith_' + smith) }));
    }
    initSkillBuffOptions() {
        this.ALL_SKILL_BUFF_OPTIONS_CACHE = {
            [_slorm_api_1.HeroClass.Warrior]: this.slormancerDataService.getGameDataActiveSkills(_slorm_api_1.HeroClass.Warrior)
                .map(skill => ({ value: skill.REF, label: skill.EN_NAME })),
            [_slorm_api_1.HeroClass.Huntress]: this.slormancerDataService.getGameDataActiveSkills(_slorm_api_1.HeroClass.Huntress)
                .map(skill => ({ value: skill.REF, label: skill.EN_NAME })),
            [_slorm_api_1.HeroClass.Mage]: this.slormancerDataService.getGameDataActiveSkills(_slorm_api_1.HeroClass.Mage)
                .map(skill => ({ value: skill.REF, label: skill.EN_NAME }))
        };
    }
    initAttributeBuffOptions() {
        this.ALL_ATTRIBUTE_BUFF_OPTIONS_CACHE = _slorm_api_1.ALL_ATTRIBUTES
            .map(attribute => ({ value: attribute, label: this.slormancerTranslateService.translate('character_trait_' + attribute) }));
    }
    initReaperOptions() {
        this.ALL_REAPER_OPTIONS_CACHE = {
            p: { 0: [], 1: [], 2: [] },
            b: { 0: [], 1: [], 2: [] }
        };
        const reapers = this.slormancerDataService.getGameDataAvailableReaper();
        for (const reaper of reapers) {
            this.ALL_REAPER_OPTIONS_CACHE.p[_slorm_api_1.HeroClass.Warrior].push({ value: reaper.REF, label: this.slormancerReaperService.getReaperName(reaper.EN_NAME, true, _slorm_api_1.HeroClass.Warrior) });
            this.ALL_REAPER_OPTIONS_CACHE.p[_slorm_api_1.HeroClass.Huntress].push({ value: reaper.REF, label: this.slormancerReaperService.getReaperName(reaper.EN_NAME, true, _slorm_api_1.HeroClass.Huntress) });
            this.ALL_REAPER_OPTIONS_CACHE.p[_slorm_api_1.HeroClass.Mage].push({ value: reaper.REF, label: this.slormancerReaperService.getReaperName(reaper.EN_NAME, true, _slorm_api_1.HeroClass.Mage) });
            this.ALL_REAPER_OPTIONS_CACHE.b[_slorm_api_1.HeroClass.Warrior].push({ value: reaper.REF, label: this.slormancerReaperService.getReaperName(reaper.EN_NAME, false, _slorm_api_1.HeroClass.Warrior) });
            this.ALL_REAPER_OPTIONS_CACHE.b[_slorm_api_1.HeroClass.Huntress].push({ value: reaper.REF, label: this.slormancerReaperService.getReaperName(reaper.EN_NAME, false, _slorm_api_1.HeroClass.Huntress) });
            this.ALL_REAPER_OPTIONS_CACHE.b[_slorm_api_1.HeroClass.Mage].push({ value: reaper.REF, label: this.slormancerReaperService.getReaperName(reaper.EN_NAME, false, _slorm_api_1.HeroClass.Mage) });
        }
    }
    initUltimatumOptions() {
        this.ULTIMATUM_OPTIONS_CACHE = _slorm_api_1.ALL_ULTIMATUM_TYPES.map(type => ({ value: type, label: this.slormancerTranslateService.translate('ultimatum_' + type) }));
    }
};
FormOptionsService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], FormOptionsService);
exports.FormOptionsService = FormOptionsService;
//# sourceMappingURL=form-options.service.js.map