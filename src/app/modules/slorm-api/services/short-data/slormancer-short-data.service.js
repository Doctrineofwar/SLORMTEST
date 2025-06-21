"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerShortDataService = void 0;
const core_1 = require("@angular/core");
const common_1 = require("../../constants/common");
const bits_util_1 = require("../../util/bits.util");
let SlormancerShortDataService = class SlormancerShortDataService {
    constructor(slormancerBinaryCharacterService, slormancerCompressorService, slormancerBinaryConfigurationService) {
        this.slormancerBinaryCharacterService = slormancerBinaryCharacterService;
        this.slormancerCompressorService = slormancerCompressorService;
        this.slormancerBinaryConfigurationService = slormancerBinaryConfigurationService;
    }
    versionToBinary(version) {
        const [major, minor, fix] = version.split('.');
        return [
            ...(0, bits_util_1.numberToBinary)(major ? parseInt(major, 10) : 0, 4),
            ...(0, bits_util_1.numberToBinary)(minor ? parseInt(minor, 10) : 0, 4),
            ...(0, bits_util_1.numberToBinary)(fix ? parseInt(fix, 10) : 0, 6)
        ];
    }
    binaryToVersion(bits) {
        return [
            (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 4)),
            (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 4)),
            (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 6))
        ].join('.');
    }
    characterToShortData(character, config) {
        const bits = [
            ...this.versionToBinary(common_1.API_VERSION),
            ...this.slormancerBinaryCharacterService.characterToBinary(character),
            ...this.slormancerBinaryConfigurationService.configurationToBinary(config, character, common_1.API_VERSION),
        ];
        return this.slormancerCompressorService.compressBinary(bits);
    }
    shortDataToCharacter(data) {
        let result = {
            character: null,
            configuration: null
        };
        try {
            const bits = this.slormancerCompressorService.decompressBinary(data);
            const version = this.binaryToVersion(bits);
            result.character = this.slormancerBinaryCharacterService.binaryToCharacter(bits, version);
            if (result.character !== null) {
                result.configuration = this.slormancerBinaryConfigurationService.binaryToConfiguration(bits, result.character, version);
            }
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }
};
SlormancerShortDataService = __decorate([
    (0, core_1.Injectable)()
], SlormancerShortDataService);
exports.SlormancerShortDataService = SlormancerShortDataService;
//# sourceMappingURL=slormancer-short-data.service.js.map