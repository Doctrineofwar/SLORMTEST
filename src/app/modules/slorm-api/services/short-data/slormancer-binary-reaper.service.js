"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerBinaryReaperService = void 0;
const core_1 = require("@angular/core");
const common_1 = require("../../constants/common");
const bits_util_1 = require("../../util/bits.util");
const utils_1 = require("../../util/utils");
let SlormancerBinaryReaperService = class SlormancerBinaryReaperService {
    constructor(slormancerReaperService) {
        this.slormancerReaperService = slormancerReaperService;
    }
    reaperToBinary(reaper) {
        let result = [];
        result.push(...(0, bits_util_1.numberToBinary)(reaper.id, 10));
        result.push(...(0, bits_util_1.booleanToBinary)(reaper.primordial));
        result.push(...(0, bits_util_1.numberToBinary)(reaper.baseLevel, 7));
        result.push(...(0, bits_util_1.numberToBinary)(reaper.baseReaperAffinity, 7));
        // Havoc reaper
        if (reaper.id === 90 && reaper.primordial) {
            result.push(...(0, bits_util_1.numberToBinary)(reaper.baseEffectAffinity, 10));
        }
        if (reaper.id === 114) {
            result.push(...(0, bits_util_1.numberToBinary)(reaper.kills, 25));
        }
        result.push(...(0, bits_util_1.numberToBinary)(reaper.masteryLevel, 7));
        return result;
    }
    binaryToReaper(binary, heroClass, version) {
        const reaperId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const primordial = (0, bits_util_1.binaryToBoolean)((0, bits_util_1.takeBitsChunk)(binary, 1));
        const baseLevel = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 7));
        let kills = 0;
        const hasAffinityData = (0, utils_1.compareVersions)(version, '0.2.0') >= 0;
        const hasReaperMasteryData = (0, utils_1.compareVersions)(version, '0.7.0') >= 0;
        const reaperAffinity = hasAffinityData ? (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 7)) : common_1.MAX_REAPER_AFFINITY_BASE;
        let effectAffinity = reaperAffinity;
        if (reaperId === 90 && primordial) {
            effectAffinity = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        }
        if (reaperId === 114) {
            kills = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 25));
        }
        const reaperMastery = hasReaperMasteryData ? (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 7)) : 0;
        const reaper = this.slormancerReaperService.getReaperById(reaperId, heroClass, primordial, baseLevel, 0, kills, kills, reaperAffinity, effectAffinity, 0, reaperMastery);
        if (reaper === null) {
            throw new Error('Failed to parse reaper from binary : ' + binary.join());
        }
        return reaper;
    }
};
SlormancerBinaryReaperService = __decorate([
    (0, core_1.Injectable)()
], SlormancerBinaryReaperService);
exports.SlormancerBinaryReaperService = SlormancerBinaryReaperService;
//# sourceMappingURL=slormancer-binary-reaper.service.js.map