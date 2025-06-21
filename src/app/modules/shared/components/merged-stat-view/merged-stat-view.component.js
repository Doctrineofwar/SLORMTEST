"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergedStatViewComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let MergedStatViewComponent = class MergedStatViewComponent {
    constructor(slormancerTranslateService, slormancerStatUpdaterService) {
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerStatUpdaterService = slormancerStatUpdaterService;
        this.mergedStat = null;
        this.percent = false;
    }
    translate(key) {
        return this.slormancerTranslateService.translate(key);
    }
    getSource(entity) {
        let result = '';
        if ('synergy' in entity) {
            result = 'Synergy';
        }
        else if ('character' in entity) {
            result = 'Character';
        }
        else if ('skill' in entity) {
            result = 'Skill';
        }
        else if ('upgrade' in entity) {
            result = 'Upgrade';
        }
        else if ('item' in entity) {
            result = 'Item';
        }
        else if ('ancestralLegacy' in entity) {
            result = 'Ancestral Legacy';
        }
        else if ('attribute' in entity) {
            result = 'Attribute';
        }
        else if ('reaper' in entity) {
            result = 'Reaper';
        }
        else if ('activable' in entity) {
            result = 'Activable';
        }
        else if ('mechanic' in entity) {
            result = 'Mechanic';
        }
        else if ('classMechanic' in entity) {
            result = 'Class Mechanic';
        }
        else if ('ultimatum' in entity) {
            result = 'Ultimatum';
        }
        else if ('rune' in entity) {
            result = 'Rune';
        }
        else if ('might' in entity) {
            result = 'Might';
        }
        return result;
    }
    getSourceName(entity) {
        let result = '';
        if ('synergy' in entity) {
            result = entity.synergy;
        }
        else if ('skill' in entity) {
            result = entity.skill.nameLabel;
        }
        else if ('upgrade' in entity) {
            result = entity.upgrade.name;
        }
        else if ('item' in entity) {
            result = entity.item.name;
        }
        else if ('ancestralLegacy' in entity) {
            result = entity.ancestralLegacy.name;
        }
        else if ('attribute' in entity) {
            result = entity.attribute.attributeName;
        }
        else if ('reaper' in entity) {
            result = entity.reaper.name;
        }
        else if ('activable' in entity) {
            result = entity.activable.name;
        }
        else if ('mechanic' in entity) {
            result = entity.mechanic.name;
        }
        else if ('classMechanic' in entity) {
            result = entity.classMechanic.name;
        }
        else if ('ultimatum' in entity) {
            result = entity.ultimatum.title;
        }
        else if ('rune' in entity) {
            result = entity.rune.name;
        }
        else if ('might' in entity) {
            result = entity.might;
        }
        return result;
    }
    valueToString(value, suffix) {
        return typeof value === 'number' ? (0, _slorm_api_1.numberToString)((0, _slorm_api_1.round)(value, 5)) + suffix : (0, _slorm_api_1.numberToString)((0, _slorm_api_1.round)(value.min, 5)) + suffix + '-' + (0, _slorm_api_1.numberToString)((0, _slorm_api_1.round)(value.max, 5)) + suffix;
    }
    minValueToString(value, suffix, showSign = false) {
        const result = (0, _slorm_api_1.round)(typeof value === 'number' ? value : value.min, 5);
        return (result >= 0 && showSign ? '+' : '') + (0, _slorm_api_1.numberToString)(result) + suffix;
    }
    maxValueToString(value, suffix, showSign = false) {
        const result = (0, _slorm_api_1.round)(typeof value === 'number' ? value : value.max, 5);
        return (result >= 0 && showSign ? '+' : '') + (0, _slorm_api_1.numberToString)(result) + suffix;
    }
    getTotalFlat(mergedStat) {
        return this.slormancerStatUpdaterService.getTotalFlat(mergedStat);
    }
    getTotalFlatExtra(mergedStat) {
        return this.slormancerStatUpdaterService.getTotalFlatExtra(mergedStat);
    }
    getTotalFlatSynergy(mergedStat) {
        return this.slormancerStatUpdaterService.getTotalFlatSynergy(mergedStat);
    }
    getTotalPercent(mergedStat) {
        const total = this.slormancerStatUpdaterService.addNumberValues(mergedStat.values.percent.map(v => v.value));
        const totalMax = total + this.slormancerStatUpdaterService.addNumberValues(mergedStat.values.maxPercent.map(v => v.value));
        return total !== totalMax ? { min: total, max: totalMax } : total;
    }
    getTotalFlatPercent(mergedStat) {
        const total = this.slormancerStatUpdaterService.getTotalFlatAndPercent(mergedStat);
        return this.valueToString(total, mergedStat.suffix);
    }
    getTotal(mergedStat) {
        const total = this.slormancerStatUpdaterService.getTotal(mergedStat, true);
        return this.valueToString(total, mergedStat.suffix);
    }
    hasFlatValues(mergedStat) {
        return mergedStat.values.flat.filter(v => !v.extra && !v.synergy).length > 0 || mergedStat.values.max.filter(v => !v.extra).length > 0;
    }
    hasFlatExtraValues(mergedStat) {
        return mergedStat.values.flat.filter(v => v.extra).length > 0 || mergedStat.values.max.filter(v => v.extra).length > 0;
    }
    hasFlatSynergyValues(mergedStat) {
        return mergedStat.values.flat.filter(v => v.synergy).length > 0;
    }
    hasMultiplierValues(mergedStat) {
        return mergedStat.values.multiplier.filter(v => !v.extra).length > 0 || mergedStat.values.maxMultiplier.filter(v => !v.extra).length > 0;
    }
    hasMultipliersExtraValues(mergedStat) {
        return mergedStat.values.multiplier.filter(v => v.extra).length > 0 || mergedStat.values.maxMultiplier.filter(v => v.extra).length > 0;
    }
    hasPercentValues(mergedStat) {
        return mergedStat.values.percent.length > 0 || mergedStat.values.maxPercent.length > 0;
    }
    showFormula(mergedStat) {
        return (this.hasFlatValues(mergedStat) ? 1 : 0)
            + (this.hasFlatExtraValues(mergedStat) ? 1 : 0)
            + (this.hasFlatSynergyValues(mergedStat) ? 1 : 0)
            + (this.hasPercentValues(mergedStat) ? 1 : 0)
            + (this.hasMultiplierValues(mergedStat) ? 1 : 0)
            + (this.hasMultipliersExtraValues(mergedStat) ? 1 : 0)
            + (this.slormancerStatUpdaterService.hasDiminishingResult(mergedStat.stat) ? 1 : 0) >= 2;
    }
    totalHasMinMax(mergedStat) {
        return typeof mergedStat.total !== 'number';
    }
    toMultipliersFormula(multipliers) {
        return multipliers
            .filter(v => v !== 0)
            .map(p => ' * ' + ((p + 100) / 100))
            .join('');
    }
    getMinFormula(mergedStat) {
        let total = this.slormancerStatUpdaterService.getTotal(mergedStat, false);
        let flat = this.slormancerStatUpdaterService.getTotalFlat(mergedStat);
        let percent = this.slormancerStatUpdaterService.getTotalPercent(mergedStat);
        let multipliers = mergedStat.values.multiplier.filter(mult => !mult.extra).map(mult => mult.value);
        let extraMultipliers = mergedStat.values.multiplier.filter(mult => mult.extra).map(mult => mult.value);
        let extra = this.slormancerStatUpdaterService.getTotalFlatExtra(mergedStat);
        let synergy = this.slormancerStatUpdaterService.getTotalFlatSynergy(mergedStat);
        flat = typeof flat === 'number' ? flat : flat.min;
        percent = typeof percent === 'number' ? percent : percent.min;
        extra = typeof extra === 'number' ? extra : extra.min;
        synergy = typeof synergy === 'number' ? synergy : synergy.min;
        let formula;
        if (this.slormancerStatUpdaterService.hasDiminishingResult(mergedStat.stat)) {
            formula = '( 1 - ' + [flat, percent, ...multipliers, ...extraMultipliers]
                .filter(v => v !== 0)
                .map(p => (0, _slorm_api_1.round)(Math.max(0, 100 - p) / 100, 4))
                .join(' * ')
                + ') * 100';
        }
        else {
            formula = this.valueToString(flat, mergedStat.suffix) + this.toMultipliersFormula([percent, ...multipliers]);
            if (extra !== 0) {
                formula = '(' + formula + ') ' + (extra > 0 ? ('+ ' + extra) : ('- ' + Math.abs(extra)));
            }
            if (extraMultipliers.length > 0) {
                formula = '(' + formula + ')' + this.toMultipliersFormula(extraMultipliers);
            }
            if (synergy !== 0) {
                formula = '(' + formula + ') ' + (synergy > 0 ? ('+ ' + synergy) : ('- ' + Math.abs(synergy)));
            }
            formula = 'round(' + formula + ')';
        }
        let result = (0, _slorm_api_1.round)(typeof total === 'number' ? total : total.min, 5) + ' = ' + this.suroundWitMmax(mergedStat, formula);
        return result;
    }
    getMaxFormula(mergedStat) {
        let total = this.slormancerStatUpdaterService.getTotal(mergedStat, true);
        let flat = this.slormancerStatUpdaterService.getTotalFlat(mergedStat);
        let percent = this.slormancerStatUpdaterService.getTotalPercent(mergedStat);
        let extra = this.slormancerStatUpdaterService.getTotalFlatExtra(mergedStat);
        let synergy = this.slormancerStatUpdaterService.getTotalFlatSynergy(mergedStat);
        const multipliers = mergedStat.values.multiplier.filter(mult => !mult.extra).map(mult => mult.value);
        let extraMultipliers = mergedStat.values.multiplier.filter(mult => mult.extra).map(mult => mult.value);
        flat = typeof flat === 'number' ? flat : flat.max;
        percent = typeof percent === 'number' ? percent : percent.max;
        extra = typeof extra === 'number' ? extra : extra.max;
        synergy = typeof synergy === 'number' ? synergy : synergy.max;
        let result = (0, _slorm_api_1.round)(typeof total === 'number' ? total : total.max, 5) + ' = ';
        let formula = this.valueToString(flat, mergedStat.suffix) + this.toMultipliersFormula([percent, ...multipliers]);
        if (extra !== 0) {
            formula = '(' + formula + ') ' + (extra > 0 ? ('+ ' + extra) : ('- ' + Math.abs(extra)));
        }
        if (extraMultipliers.length > 0) {
            formula = '(' + formula + ')' + this.toMultipliersFormula(extraMultipliers);
        }
        if (synergy !== 0) {
            formula = '(' + formula + ') ' + (synergy > 0 ? ('+ ' + synergy) : ('- ' + Math.abs(synergy)));
        }
        result += this.suroundWitMmax(mergedStat, 'round(' + formula + ')');
        return result;
    }
    hasDisplayPrecision(mergedStat) {
        return mergedStat.totalDisplayed !== mergedStat.total;
    }
    suroundWitMmax(mergedStat, value) {
        if (typeof mergedStat.maximum === 'number') {
            value = 'min(' + mergedStat.maximum + ', ' + value + ')';
        }
        return value;
    }
};
__decorate([
    (0, core_1.Input)()
], MergedStatViewComponent.prototype, "mergedStat", void 0);
__decorate([
    (0, core_1.Input)()
], MergedStatViewComponent.prototype, "percent", void 0);
MergedStatViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-merged-stat-view',
        templateUrl: './merged-stat-view.component.html',
        styleUrls: ['./merged-stat-view.component.scss']
    })
], MergedStatViewComponent);
exports.MergedStatViewComponent = MergedStatViewComponent;
//# sourceMappingURL=merged-stat-view.component.js.map