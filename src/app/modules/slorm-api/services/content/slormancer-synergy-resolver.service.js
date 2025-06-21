"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerSynergyResolverService = void 0;
const core_1 = require("@angular/core");
const character_stats_1 = require("../../model/content/character-stats");
const math_util_1 = require("../../util/math.util");
const synergy_resolver_util_1 = require("../../util/synergy-resolver.util");
let SlormancerSynergyResolverService = class SlormancerSynergyResolverService {
    constructor(slormancerStatUpdaterService, slormancerStatMappingService) {
        this.slormancerStatUpdaterService = slormancerStatUpdaterService;
        this.slormancerStatMappingService = slormancerStatMappingService;
    }
    applyCascadingChanges(synergies) {
        // const externalSynergies = synergies.filter(isExternalSynergyResolveData);
        const localSynergies = synergies.filter(synergy_resolver_util_1.isSynergyResolveData);
        // Armor of Illusion + Indomitable Mountain
        const indomitableMountain = localSynergies.find(resolveData => resolveData.effect.source === 'dodge' && resolveData.effect.stat === 'res_phy_add');
        const armorOfIllusion = localSynergies.find(resolveData => resolveData.effect.source === 'armor' && resolveData.effect.stat === 'dodge_add');
        if (indomitableMountain && armorOfIllusion) {
            indomitableMountain.cascadeSynergy = false;
            //console.log('Cascading changes : Armor of Illusion + Indomitable Mountain');
        }
        // Evase Magic + Untouchable One Reaper
        const untouchableOne = localSynergies.find(resolveData => resolveData.effect.source === 'elemental_damage' && resolveData.effect.stat === 'dodge_add');
        const evasiveMagic = localSynergies.find(resolveData => resolveData.effect.source === 'dodge' && resolveData.effect.stat === 'the_max_mana_add');
        if (untouchableOne && evasiveMagic) {
            untouchableOne.cascadeSynergy = false;
            //console.log('Cascading changes : Evase Magic + Untouchable One Reaper');
        }
    }
    resolveSynergy(synergy, resolved, characterStats, extractedStats, config) {
        this.updateSynergyValue(synergy, characterStats, extractedStats);
        this.applySynergyToStats(synergy, characterStats, extractedStats, config);
        if ('originalValue' in synergy) {
            resolved.push(synergy);
        }
    }
    resolveSynergies(synergies, characterStats, extractedStats, config) {
        const remainingSynergies = [...synergies];
        const resolved = [];
        this.addExternalSynergies(remainingSynergies);
        this.applyCascadingChanges(remainingSynergies);
        let next;
        while (remainingSynergies.length > 0 && (next = this.takeNextSynergy(remainingSynergies)) !== null) {
            this.resolveSynergy(next, resolved, characterStats, extractedStats, config);
        }
        /*if (remainingSynergies.filter(isSynergyResolveData).length > 0) {
            const synergyes = remainingSynergies.filter(isSynergyResolveData);
            console.log('### There are ' + synergyes.length + ' unresolved synergies');
            for (const synergy of synergyes) {
                console.log(synergy.effect.source + ' => ' + synergy.effect.stat + (synergy.cascadeSynergy ? '(cascading)' : ''), synergy);
            }
        }*/
        return { unresolved: remainingSynergies.filter(synergy_resolver_util_1.isSynergyResolveData), resolved };
    }
    resolveIsolatedSynergies(synergies, characterStats, extractedStats) {
        for (const synergy of synergies) {
            this.updateSynergyValue(synergy, characterStats, extractedStats);
        }
    }
    addExternalSynergies(resolveDatas) {
        resolveDatas.push({
            type: character_stats_1.ResolveDataType.ExternalSynergy,
            value: 0,
            precision: 3,
            method: (basic, elemental) => {
                const basicMin = typeof basic === 'number' ? basic : basic.min;
                const elementalMin = typeof elemental === 'number' ? elemental : elemental.min;
                return Math.abs(basicMin - elementalMin);
            },
            objectSource: { synergy: 'Difference raw and elemental damage' },
            sources: ['basic_damage', 'elemental_damage'],
            stat: 'raw_elem_diff',
            statsItWillUpdate: [{ stat: 'raw_elem_diff' }],
            cascadeSynergy: true,
            allowMinMax: true,
        });
        resolveDatas.push({
            type: character_stats_1.ResolveDataType.ExternalSynergy,
            value: 0,
            precision: 3,
            method: (innerFire, overdrive) => {
                return Math.min(innerFire, overdrive);
            },
            objectSource: { synergy: 'Lowest value between inner fire chances and overdrive chances' },
            sources: ['inner_fire_chance', 'overdrive_chance'],
            stat: 'inner_or_overdrive_chance_low',
            statsItWillUpdate: [{ stat: 'inner_or_overdrive_chance_low' }],
            cascadeSynergy: true,
            allowMinMax: false,
        });
    }
    sourceWontBeChanged(sources, ignoreCascading, resolveDatas) {
        // a non cascading synergy can ignore another non cascading synergy that modify it's source
        return !resolveDatas
            .filter(s => s.cascadeSynergy)
            .some(s => s.statsItWillUpdate.some(statItWillUpdate => sources.includes(statItWillUpdate.stat)));
    }
    takeNextSynergy(resolveDatas) {
        // Take the first synergy with no stat used by another synergy
        //let indexFound = resolveDatas.findIndex(resolveData => this.sourceHasNoDependency(resolveData, resolveDatas));
        let indexFound = resolveDatas.findIndex(resolveData => this.sourceWontBeChanged('sources' in resolveData ? resolveData.sources : [resolveData.effect.source], true, resolveDatas));
        // TODO check if it could be moved to applyCascadingChanges
        if (indexFound === -1) {
            const critDamageToAncestramDamage = resolveDatas.find(resolveData => resolveData.type === character_stats_1.ResolveDataType.Synergy && resolveData.effect.stat === 'brut_damage_percent' && resolveData.effect.source === 'critical_damage');
            const isoperimetry = resolveDatas.findIndex(resolveData => resolveData.type === character_stats_1.ResolveDataType.Synergy && resolveData.effect.stat === 'isoperimetry_crit_damage_percent_extra');
            if (critDamageToAncestramDamage && isoperimetry !== -1) {
                indexFound = isoperimetry;
            }
        }
        // if all cascading synergies are resolved, take the first non cascading synergy
        if (indexFound === -1 && !resolveDatas.some(s => s.cascadeSynergy)) {
            indexFound = 0;
        }
        let result = null;
        if (indexFound !== -1) {
            const extracted = resolveDatas.splice(indexFound, 1)[0];
            if (extracted) {
                result = extracted;
            }
        }
        /*if (result === null) {
            resolveDatas.findIndex(resolveData => this.sourceHasNoDependency(resolveData, resolveDatas, true))
        }*/
        return result;
    }
    resolveSyngleSynergy(effect, characterStats, extractedStats, source) {
        const resolveData = (0, synergy_resolver_util_1.synergyResolveData)(effect, -1, source);
        this.updateSynergyValue(resolveData, characterStats, extractedStats);
    }
    updateSynergyValue(resolveData, characterStats, extractedStats) {
        if ((0, synergy_resolver_util_1.isSynergyResolveData)(resolveData)) {
            const source = characterStats.find(stat => stat.stat === resolveData.effect.source);
            const cascadeSynergies = 'effect' in resolveData ? resolveData.cascadeSynergy : false;
            let precision = resolveData.effect.precision;
            if (precision === null) {
                const precisions = resolveData.statsItWillUpdate.map(stat => stat.mapping ? stat.mapping.precision : 0);
                precision = Math.max(resolveData.effect.percent ? 1 : 0, precisions.length > 0 ? Math.min(...precisions) : 0);
            }
            let sourceValue = 0;
            if (source) {
                sourceValue = cascadeSynergies ? source.total : source.totalWithoutSynergy;
            }
            else {
                const stat = extractedStats[resolveData.effect.source];
                if (stat) {
                    sourceValue = stat.reduce((t, v) => t + v.value, 0);
                }
                else {
                    console.log('no source (' + resolveData.effect.source + ') found for ', resolveData);
                }
            }
            if (typeof sourceValue !== 'number') {
                const allowMinMax = resolveData.statsItWillUpdate.reduce((t, c) => (c.mapping === undefined || c.mapping.allowMinMax) && t, resolveData.effect.allowMinMax);
                const useMaxOnly = 'effect' in resolveData ? resolveData.effect.useOnlyMaxSource === true : false;
                if (useMaxOnly) {
                    sourceValue = sourceValue.max;
                }
                else if (!allowMinMax) {
                    sourceValue = (sourceValue.min + sourceValue.max) / 2;
                }
            }
            const newValue = typeof sourceValue === 'number'
                ? resolveData.effect.value * sourceValue / 100
                : { min: resolveData.effect.value * sourceValue.min / 100,
                    max: resolveData.effect.value * sourceValue.max / 100 };
            resolveData.effect.synergy = newValue;
            /*
            const debugStat = resolveData.statsItWillUpdate.map(s => s.stat).join(', ');
            // if (['armor', 'res_mag_add'].includes(resolveData.effect.stat) || ['armor', 'res_mag_add'].includes(resolveData.effect.source) )
            console.log((typeof newValue === 'number' ? newValue : newValue.min + '-' + newValue.max) + ' ' + (debugStat.length === 0 ? '#' + resolveData.effect.stat : debugStat)
                + ' from ' + (typeof sourceValue === 'number' ? sourceValue : sourceValue.min + '-' + sourceValue.max) + ' ' + resolveData.effect.source + (resolveData.cascadeSynergy ? ' (cascading)' : ''), source);
            //*/
            resolveData.effect.displaySynergy = typeof newValue === 'number'
                ? (0, math_util_1.bankerRound)(newValue, precision)
                : { min: (0, math_util_1.bankerRound)(newValue.min, precision),
                    max: (0, math_util_1.bankerRound)(newValue.max, precision) };
        }
        else {
            const sources = resolveData.sources.map(source => {
                const stat = characterStats.find(stat => stat.stat === source);
                return stat ? stat.total : 0;
            });
            resolveData.value = resolveData.method(...sources);
        }
    }
    applySynergyToStats(synergyResolveData, stats, extractedStats, config) {
        for (const statToUpdate of synergyResolveData.statsItWillUpdate) {
            let foundStat = stats.find(stat => stat.stat === statToUpdate.stat);
            let addAsSynergy = true;
            if (foundStat === undefined) {
                let precision = 0;
                let displayPrecision = undefined;
                if ('effect' in synergyResolveData && synergyResolveData.effect.precision !== null) {
                    precision = synergyResolveData.effect.precision;
                }
                else if ('precision' in synergyResolveData && synergyResolveData.precision !== null) {
                    precision = synergyResolveData.precision;
                }
                else if (statToUpdate.mapping) {
                    precision = statToUpdate.mapping.precision;
                    displayPrecision = statToUpdate.mapping.displayPrecision;
                }
                foundStat = {
                    precision,
                    displayPrecision,
                    stat: statToUpdate.stat,
                    total: 0,
                    totalWithoutSynergy: 0,
                    totalDisplayed: 0,
                    allowMinMax: 'allowMinMax' in synergyResolveData ? synergyResolveData.allowMinMax : true,
                    readonly: false,
                    suffix: '',
                    values: {
                        flat: [],
                        max: [],
                        percent: [],
                        maxPercent: [],
                        multiplier: [],
                        maxMultiplier: [],
                    }
                };
                stats.push(foundStat);
            }
            let synergy;
            let stat;
            if ((0, synergy_resolver_util_1.isSynergyResolveData)(synergyResolveData)) {
                synergy = synergyResolveData.effect.synergy;
                stat = synergyResolveData.effect.stat;
                if (synergyResolveData.addAsFlat) {
                    addAsSynergy = false;
                }
            }
            else {
                synergy = synergyResolveData.value;
                stat = synergyResolveData.stat;
            }
            if (statToUpdate.mapping === undefined) {
                foundStat.values.flat.push({ value: synergy, extra: false, source: synergyResolveData.objectSource, synergy: addAsSynergy });
            }
            else {
                this.slormancerStatMappingService.addUniqueValueToStat(stat, synergy, foundStat, statToUpdate.mapping, config, extractedStats, synergyResolveData.objectSource, addAsSynergy);
            }
            this.slormancerStatUpdaterService.updateStatTotal(foundStat);
        }
    }
};
SlormancerSynergyResolverService = __decorate([
    (0, core_1.Injectable)()
], SlormancerSynergyResolverService);
exports.SlormancerSynergyResolverService = SlormancerSynergyResolverService;
//# sourceMappingURL=slormancer-synergy-resolver.service.js.map