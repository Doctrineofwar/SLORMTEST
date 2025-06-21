"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synergyResolveData = exports.isExternalSynergyResolveData = exports.isSynergyResolveData = void 0;
const character_stats_1 = require("../model/content/character-stats");
function isSynergyResolveData(resolveData) {
    return resolveData.type === character_stats_1.ResolveDataType.Synergy;
}
exports.isSynergyResolveData = isSynergyResolveData;
function isExternalSynergyResolveData(resolveData) {
    return resolveData.type === character_stats_1.ResolveDataType.ExternalSynergy;
}
exports.isExternalSynergyResolveData = isExternalSynergyResolveData;
function synergyResolveData(effect, originalValue, objectSource, statsItWillUpdate = [], addAsFlat = false) {
    return { type: character_stats_1.ResolveDataType.Synergy, effect, originalValue, objectSource, statsItWillUpdate, cascadeSynergy: effect.cascadeSynergy, addAsFlat };
}
exports.synergyResolveData = synergyResolveData;
//# sourceMappingURL=synergy-resolver.util.js.map