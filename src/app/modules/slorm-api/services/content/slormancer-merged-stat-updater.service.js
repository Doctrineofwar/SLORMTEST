"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerMergedStatUpdaterService = void 0;
const core_1 = require("@angular/core");
const math_util_1 = require("../../util/math.util");
let SlormancerMergedStatUpdaterService = class SlormancerMergedStatUpdaterService {
    addValues(values, forceMinMax) {
        let result = forceMinMax ? { min: 0, max: 0 } : 0;
        let resultIsMinMax = forceMinMax;
        for (const value of values) {
            if (typeof value !== 'number' && !resultIsMinMax) {
                resultIsMinMax = true;
                result = { min: result, max: result };
            }
            if (resultIsMinMax && typeof result) {
                result.min += typeof value == 'number' ? value : value.min;
                result.max += typeof value == 'number' ? value : value.max;
            }
            else {
                result += value;
            }
        }
        return result;
    }
    addNumberValues(values) {
        let result = 0;
        for (const value of values) {
            result += typeof value === 'number' ? value : (0, math_util_1.round)((value.min + value.max) / 2);
        }
        return result;
    }
    getTotalFlat(stat) {
        const minMax = stat.values.max.length > 0 || stat.values.maxPercent.length > 0 || stat.values.maxMultiplier.length > 0;
        const flat = this.addValues(stat.values.flat.filter(v => v.extra === false && v.synergy === false).map(v => v.value), minMax);
        if (minMax) {
            flat.max += this.addNumberValues(stat.values.max.filter(v => !v.extra && v.synergy === false).map(v => v.value));
        }
        return flat;
    }
    getTotalPercent(stat) {
        const minMax = stat.values.max.length > 0 || stat.values.maxPercent.length > 0 || stat.values.maxMultiplier.length > 0;
        const percent = this.addValues(stat.values.percent.map(v => v.value), minMax);
        if (minMax) {
            percent.max += this.addNumberValues(stat.values.maxPercent.map(v => v.value));
        }
        return percent;
    }
    getTotalFlatExtra(mergedStat) {
        const minMax = mergedStat.values.max.length > 0 || mergedStat.values.maxPercent.length > 0 || mergedStat.values.maxMultiplier.length > 0;
        let total = this.addValues(mergedStat.values.flat.filter(v => v.extra).map(v => v.value), minMax);
        const max = this.addValues(mergedStat.values.max.filter(v => v.extra).map(v => v.value), false);
        if (typeof total !== 'number') {
            total.max += max;
        }
        return total;
    }
    getTotalFlatSynergy(mergedStat) {
        const minMax = mergedStat.values.max.length > 0 || mergedStat.values.maxPercent.length > 0 || mergedStat.values.maxMultiplier.length > 0;
        const totalSynergyFlatValues = mergedStat.values.flat.filter(v => v.synergy === true).map(v => v.value);
        const totalSynergyMaxValues = mergedStat.values.max.filter(v => v.synergy === true).map(v => ({ min: 0, max: v.value }));
        return this.addValues([...totalSynergyFlatValues, ...totalSynergyMaxValues], minMax);
    }
    getTotalFlatAndPercent(mergedStat) {
        const percent = this.getTotalPercent(mergedStat);
        let total = this.getTotalFlat(mergedStat);
        if (typeof total === 'number') {
            total = total * (100 + percent) / 100;
        }
        else {
            if (typeof percent === 'number') {
                total.min = total.min * (100 + percent) / 100;
                total.max = total.max * (100 + percent) / 100;
            }
            else {
                total.min = total.min * (100 + percent.min) / 100;
                total.max = total.max * (100 + percent.max) / 100;
            }
        }
        return total;
    }
    hasDiminishingResult(stat) {
        return stat === 'attack_speed' || stat === 'enemy_attack_speed' || stat === 'cooldown_reduction';
    }
    getTotalWithoutExtraAndSynergy(mergedStat) {
        let total = this.getTotalFlatAndPercent(mergedStat);
        const nonExtraMultiplier = mergedStat.values.multiplier.filter(m => !m.extra);
        const nonExtraMaxMultiplier = mergedStat.values.maxMultiplier.filter(m => !m.extra);
        if (typeof total === 'number') {
            if (this.hasDiminishingResult(mergedStat.stat)) {
                total = 100 - nonExtraMultiplier.map(mult => Math.max(0, 100 - mult.value) / 100).reduce((total, value) => total * value, 1 - (total / 100)) * 100;
            }
            else {
                for (const multiplier of nonExtraMultiplier) {
                    total = total * (100 + multiplier.value) / 100;
                }
            }
        }
        else {
            for (const multiplier of nonExtraMultiplier) {
                const mult = (100 + multiplier.value);
                total.min = total.min * mult / 100;
                total.max = total.max * mult / 100;
            }
            for (const multiplier of nonExtraMaxMultiplier) {
                total.max = total.max * (100 + multiplier.value) / 100;
            }
        }
        return total;
    }
    applyExtraToTotal(total, stat) {
        let extra = this.getTotalFlatExtra(stat);
        if (typeof total === 'number' && stat.allowMinMax && typeof extra !== 'number') {
            total = { min: total, max: total };
        }
        if (typeof total === 'number') {
            total = total + extra;
        }
        else {
            total.min = total.min + (typeof extra === 'number' ? extra : extra.min);
            total.max = total.max + (typeof extra === 'number' ? extra : extra.max);
        }
        const extraMultiplier = stat.values.multiplier.filter(m => m.extra);
        const extraMaxMultiplier = stat.values.maxMultiplier.filter(m => m.extra);
        if (typeof total === 'number') {
            if (this.hasDiminishingResult(stat.stat)) {
                total = 100 - extraMultiplier.map(mult => Math.max(0, 100 - mult.value) / 100).reduce((total, value) => total * value, 1 - (total / 100)) * 100;
            }
            else {
                for (const multiplier of extraMultiplier) {
                    total = total * (100 + multiplier.value) / 100;
                }
            }
        }
        else {
            for (const multiplier of extraMultiplier) {
                const mult = (100 + multiplier.value);
                total.min = total.min * mult / 100;
                total.max = total.max * mult / 100;
            }
            for (const multiplier of extraMaxMultiplier) {
                total.max = total.max * (100 + multiplier.value) / 100;
            }
        }
        return total;
    }
    applySynergyToTotal(total, stat) {
        let synergy = this.getTotalFlatSynergy(stat);
        return (0, math_util_1.add)(total, synergy, stat.allowMinMax);
    }
    getTotal(stat, synergy) {
        let total = this.getTotalWithoutExtraAndSynergy(stat);
        total = this.applyExtraToTotal(total, stat);
        if (synergy) {
            total = this.applySynergyToTotal(total, stat);
        }
        if (typeof stat.maximum === 'number') {
            total = typeof total === 'number' ? Math.min(stat.maximum, total) : { min: Math.min(stat.maximum, total.min), max: Math.min(stat.maximum, total.max) };
        }
        return (0, math_util_1.bankerRound)(total, stat.precision);
    }
    updateStatTotal(stat, roundTotal = true) {
        stat.total = this.getTotal(stat, true);
        stat.totalWithoutSynergy = this.hasSynergy(stat) ? this.getTotal(stat, false) : stat.total;
        stat.totalDisplayed = stat.total;
        if (stat.displayPrecision !== undefined && roundTotal) {
            stat.totalDisplayed = (0, math_util_1.bankerRound)(stat.totalDisplayed, stat.displayPrecision);
        }
    }
    applyMergedStatToValue(value, stat) {
        const newStat = {
            ...stat,
            values: {
                ...stat.values,
                flat: [
                    ...stat.values.flat,
                    { value, extra: false, source: { synergy: 'custom' }, synergy: false }
                ]
            }
        };
        this.updateStatTotal(newStat, false);
        return newStat.total;
    }
    hasSynergy(stat) {
        return stat.values.flat.some(value => value.synergy === true);
    }
};
SlormancerMergedStatUpdaterService = __decorate([
    (0, core_1.Injectable)()
], SlormancerMergedStatUpdaterService);
exports.SlormancerMergedStatUpdaterService = SlormancerMergedStatUpdaterService;
//# sourceMappingURL=slormancer-merged-stat-updater.service.js.map