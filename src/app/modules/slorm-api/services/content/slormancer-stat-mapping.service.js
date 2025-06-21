"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerStatMappingService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const math_util_1 = require("../../util/math.util");
const utils_1 = require("../../util/utils");
let SlormancerStatMappingService = class SlormancerStatMappingService {
    constructor() { }
    getMappingValues(sources, stats, config) {
        return sources
            .filter(source => source.condition === undefined || source.condition(config, stats))
            .map(source => {
            let result = stats[source.stat];
            if (result && source.multiplier) {
                const mult = source.multiplier(config, stats);
                result = result.map(entry => ({ source: entry.source, value: entry.value * mult }));
            }
            if (result && source.duplicate) {
                const length = source.duplicate(config, stats);
                result = result.flatMap(entry => Array.from({ length }).fill({ source: entry.source, value: entry.value }));
            }
            return result ? result.map(data => ({ ...data, extra: source.extra === true, synergy: false })) : [];
        })
            .flat();
    }
    buildMergedStat(stats, mapping, config) {
        return {
            stat: mapping.stat,
            total: 0,
            precision: mapping.precision,
            displayPrecision: mapping.displayPrecision,
            allowMinMax: mapping.allowMinMax,
            suffix: mapping.suffix,
            maximum: mapping.maximum,
            values: {
                flat: this.getMappingValues(mapping.source.flat, stats, config),
                max: this.getMappingValues(mapping.source.max, stats, config),
                percent: this.getMappingValues(mapping.source.percent, stats, config),
                maxPercent: this.getMappingValues(mapping.source.maxPercent, stats, config),
                multiplier: this.getMappingValues(mapping.source.multiplier, stats, config),
                maxMultiplier: this.getMappingValues(mapping.source.maxMultiplier, stats, config),
            }
        };
    }
    buildMergedStats(stats, mappings, config) {
        return mappings.map(mapping => this.buildMergedStat(stats, mapping, config));
    }
    applyUltimatum(stats, mappings, ultimatum, config, extractedStats) {
        let stat = stats.find(stat => stat.stat === ultimatum.value.stat);
        if (stat === undefined) {
            const mapping = mappings.find(mapping => mapping.stat === ultimatum.value.stat);
            if (mapping) {
                stat = {
                    stat: mapping.stat,
                    total: 0,
                    totalWithoutSynergy: 0,
                    totalDisplayed: 0,
                    precision: mapping.precision,
                    displayPrecision: mapping.displayPrecision,
                    allowMinMax: mapping.allowMinMax,
                    readonly: false,
                    suffix: mapping.suffix,
                    values: {
                        flat: [],
                        max: [],
                        percent: [],
                        maxPercent: [],
                        multiplier: [],
                        maxMultiplier: [],
                    }
                };
                stats.push(stat);
            }
        }
        if (stat) {
            stat.readonly = stat.stat !== 'inner_fire_damage';
            const multipliers = [];
            multipliers.push(...(0, utils_1.valueOrDefault)(extractedStats['ultimatum_increased_effect'], []));
            if (config.ultima_momentum_buff) {
                multipliers.push(...(0, utils_1.valueOrDefault)(extractedStats['ultimatum_increased_effect_momentum_buff'], []));
            }
            const totalMultipliers = multipliers.reduce((total, entity) => total + entity.value, 0);
            const value = (0, math_util_1.round)(ultimatum.value.value * (100 + totalMultipliers) / 100, stat.precision);
            if (stat.stat === 'inner_fire_damage') {
                stat.values.percent.push({ value: value - 100, extra: false, source: { ultimatum }, synergy: false });
            }
            else if (stat.stat === 'aoe_increased_size') { // testing a new way to apply ultimatums
                stat.values.flat.push({ value, extra: false, source: { ultimatum }, synergy: false });
            }
            else {
                const mappingMultipliers = multipliers
                    .map(mult => ({ ...mult, extra: true, synergy: false }));
                // Ultima momentum bug on movement speed
                stat.values.flat = [];
                if (stat.stat === 'movement_speed') {
                    stat.values.flat.push({ value: (0, math_util_1.round)(ultimatum.value.value - constants_1.BASE_MOVEMENT_SPEED, 2), extra: false, source: { ultimatum }, synergy: false });
                    stat.values.flat.push({ value: constants_1.BASE_MOVEMENT_SPEED, extra: true, source: { ultimatum }, synergy: false });
                    stat.precision = 2;
                }
                else {
                    stat.values.flat.push({ value: ultimatum.value.value, extra: false, source: { ultimatum }, synergy: false });
                }
                stat.values.max = [];
                stat.values.percent = mappingMultipliers;
                stat.values.maxPercent = [];
                stat.values.multiplier = [];
                stat.values.maxMultiplier = [];
            }
        }
    }
    addUniqueValueToStat(stat, value, mergedStat, mapping, config, extractedStats, source, synergy) {
        let mappingSource;
        let array = null;
        if (!mergedStat.readonly) {
            if (mappingSource = mapping.source.flat.find(v => v.stat === stat)) {
                array = mergedStat.values.flat;
                synergy = 'addAsNonConvertion' in mappingSource ? !mappingSource.addAsNonConvertion : synergy;
            }
            else if (mappingSource = mapping.source.max.find(v => v.stat === stat)) {
                array = mergedStat.values.max;
            }
            else if (mappingSource = mapping.source.percent.find(v => v.stat === stat)) {
                array = mergedStat.values.percent;
                synergy = false;
            }
            else if (mappingSource = mapping.source.maxPercent.find(v => v.stat === stat)) {
                array = mergedStat.values.maxPercent;
                synergy = false;
            }
            else if (mappingSource = mapping.source.multiplier.find(v => v.stat === stat)) {
                array = mergedStat.values.multiplier;
                synergy = false;
            }
            else if (mappingSource = mapping.source.maxMultiplier.find(v => v.stat === stat)) {
                array = mergedStat.values.maxMultiplier;
                synergy = false;
            }
            if (mappingSource && array !== null && (mappingSource.condition === undefined || mappingSource.condition(config, extractedStats))) {
                if (mappingSource.multiplier) {
                    const mult = mappingSource.multiplier(config, extractedStats);
                    value = typeof value === 'number' ? value * mult : { min: value.min * mult, max: value.max * mult };
                }
                array.push({ value, extra: mappingSource.extra === true, source, synergy });
            }
        }
    }
};
SlormancerStatMappingService = __decorate([
    (0, core_1.Injectable)()
], SlormancerStatMappingService);
exports.SlormancerStatMappingService = SlormancerStatMappingService;
//# sourceMappingURL=slormancer-stat-mapping.service.js.map