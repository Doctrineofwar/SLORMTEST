"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerBinaryRuneService = void 0;
const core_1 = require("@angular/core");
const bits_util_1 = require("../../util/bits.util");
const utils_1 = require("../../util/utils");
let SlormancerBinaryRuneService = class SlormancerBinaryRuneService {
    constructor(slormancerRuneService) {
        this.slormancerRuneService = slormancerRuneService;
    }
    runesCombinationToBinary(runes) {
        let result = [];
        result.push(...(0, bits_util_1.booleanToBinary)(runes.activation !== null));
        if (runes.activation !== null) {
            result.push(...(0, bits_util_1.numberToBinary)(runes.activation.id, 6));
            result.push(...(0, bits_util_1.numberToBinary)(runes.activation.level, 5));
        }
        result.push(...(0, bits_util_1.booleanToBinary)(runes.effect !== null));
        if (runes.effect !== null) {
            result.push(...(0, bits_util_1.numberToBinary)(runes.effect.id, 6));
            result.push(...(0, bits_util_1.numberToBinary)(runes.effect.level, 5));
        }
        result.push(...(0, bits_util_1.booleanToBinary)(runes.enhancement !== null));
        if (runes.enhancement !== null) {
            result.push(...(0, bits_util_1.numberToBinary)(runes.enhancement.id, 6));
            result.push(...(0, bits_util_1.numberToBinary)(runes.enhancement.level, 5));
        }
        return result;
    }
    binaryToRunesCombination(binary, heroClass, version, reaperId) {
        const result = { activation: null, effect: null, enhancement: null };
        if ((0, utils_1.compareVersions)(version, '0.2.0') >= 0) {
            if ((0, bits_util_1.binaryToBoolean)((0, bits_util_1.takeBitsChunk)(binary, 1))) {
                const runeId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 6));
                const runeLevel = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 5));
                result.activation = this.slormancerRuneService.getRuneById(runeId, heroClass, runeLevel, reaperId);
            }
            if ((0, bits_util_1.binaryToBoolean)((0, bits_util_1.takeBitsChunk)(binary, 1))) {
                const runeId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 6));
                const runeLevel = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 5));
                result.effect = this.slormancerRuneService.getRuneById(runeId, heroClass, runeLevel, reaperId);
            }
            if ((0, bits_util_1.binaryToBoolean)((0, bits_util_1.takeBitsChunk)(binary, 1))) {
                const runeId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 6));
                const runeLevel = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 5));
                result.enhancement = this.slormancerRuneService.getRuneById(runeId, heroClass, runeLevel, reaperId);
            }
        }
        return result;
    }
};
SlormancerBinaryRuneService = __decorate([
    (0, core_1.Injectable)()
], SlormancerBinaryRuneService);
exports.SlormancerBinaryRuneService = SlormancerBinaryRuneService;
//# sourceMappingURL=slormancer-binary-rune.service.js.map