"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerBinaryUltimatumService = void 0;
const core_1 = require("@angular/core");
const bits_util_1 = require("../../util/bits.util");
let SlormancerBinaryUltimatumService = class SlormancerBinaryUltimatumService {
    constructor(slormancerUltimatumService) {
        this.slormancerUltimatumService = slormancerUltimatumService;
    }
    ultimatumToBinary(ultimatum) {
        let result = [];
        result.push(...(0, bits_util_1.numberToBinary)(ultimatum === null ? 0 : ultimatum.type + 1, 5));
        result.push(...(0, bits_util_1.numberToBinary)(ultimatum === null ? 0 : ultimatum.baseLevel, 5));
        return result;
    }
    binaryToUltimatum(binary, bonusLevel) {
        const type = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 5));
        const level = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 5));
        return type === 0 ? null : this.slormancerUltimatumService.getUltimatum(type - 1, level, bonusLevel);
    }
};
SlormancerBinaryUltimatumService = __decorate([
    (0, core_1.Injectable)()
], SlormancerBinaryUltimatumService);
exports.SlormancerBinaryUltimatumService = SlormancerBinaryUltimatumService;
//# sourceMappingURL=slormancer-binary-ultimatum.service.js.map