"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerBinaryConfigurationService = void 0;
const core_1 = require("@angular/core");
const constants_1 = require("../../constants");
const model_1 = require("../../model");
const util_1 = require("../../util");
const bits_util_1 = require("../../util/bits.util");
let SlormancerBinaryConfigurationService = class SlormancerBinaryConfigurationService {
    constructor(slormancerSkillService) {
        this.slormancerSkillService = slormancerSkillService;
    }
    requireNumberOfMaxedUpgrades(character, version) {
        let result = false;
        if (character.heroClass === model_1.HeroClass.Mage && (0, util_1.compareVersions)(version, '0.7.0') >= 0) {
            const bookSmashSkill = character.skills.find(skill => skill.skill.id === 5);
            result = bookSmashSkill !== undefined
                && (character.primarySkill === bookSmashSkill.skill || character.secondarySkill === bookSmashSkill.skill)
                && (bookSmashSkill.selectedUpgrades.includes(44) || bookSmashSkill.activeUpgrades.includes(44));
        }
        return result;
    }
    requireNumberOfAchievements(character, version) {
        let result = false;
        if (character.heroClass === model_1.HeroClass.Mage && (0, util_1.compareVersions)(version, '0.7.0') >= 0) {
            const bookSmashSkill = character.skills.find(skill => skill.skill.id === 5);
            result = bookSmashSkill !== undefined
                && (character.primarySkill === bookSmashSkill.skill || character.secondarySkill === bookSmashSkill.skill)
                && (bookSmashSkill.selectedUpgrades.includes(43) || bookSmashSkill.activeUpgrades.includes(43));
        }
        return result;
    }
    hasLegionPrimordialLevels(character, version) {
        return (0, util_1.compareVersions)(version, '0.7.0') < 0;
    }
    configurationToBinary(config, character, version) {
        let result = [];
        if (constants_1.UNITY_REAPERS.includes(character.reaper.id)) {
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_0_47, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_0_48, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_0_49, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_0_50, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_0_51, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_0_52, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_1_47, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_1_48, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_1_49, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_1_50, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_1_51, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_1_52, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_2_47, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_2_48, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_2_49, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_2_50, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_2_51, 7));
            result.push(...(0, bits_util_1.numberToBinary)(config.unity_level_2_52, 7));
        }
        if (this.requireNumberOfMaxedUpgrades(character, version)) {
            const maxed_upgrades = this.slormancerSkillService.getNumberOfMaxedUpgrades(character);
            result.push(...(0, bits_util_1.numberToBinary)(maxed_upgrades, 8));
        }
        if (this.requireNumberOfAchievements(character, version)) {
            result.push(...(0, bits_util_1.numberToBinary)(config.completed_achievements, 7));
        }
        if (character.reaper.id === 99) {
            result.push(...(0, bits_util_1.numberToBinary)(Math.min(620, config.reaper_owned), 10));
        }
        if (character.reaper.id === 114) {
            result.push(...(0, bits_util_1.numberToBinary)(config.victims_114_others, 25));
        }
        return result;
    }
    binaryToConfiguration(bits, character, version) {
        const config = {};
        if (constants_1.UNITY_REAPERS.includes(character.reaper.id)) {
            config.unity_level_0_47 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_0_48 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_0_49 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_0_50 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_0_51 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_0_52 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_1_47 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_1_48 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_1_49 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_1_50 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_1_51 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_1_52 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_2_47 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_2_48 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_2_49 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_2_50 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_2_51 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            config.unity_level_2_52 = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
            if (this.hasLegionPrimordialLevels(character, version)) {
                (0, bits_util_1.takeBitsChunk)(bits, 7 * 18);
            }
        }
        if (this.requireNumberOfMaxedUpgrades(character, version)) {
            config.maxed_upgrades = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 8));
        }
        if (this.requireNumberOfAchievements(character, version)) {
            config.completed_achievements = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 7));
        }
        if (character.reaper.id === 99) {
            config.reaper_owned = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 10));
        }
        if (character.reaper.id === 114) {
            config.victims_114_others = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(bits, 25));
        }
        return config;
    }
};
SlormancerBinaryConfigurationService = __decorate([
    (0, core_1.Injectable)()
], SlormancerBinaryConfigurationService);
exports.SlormancerBinaryConfigurationService = SlormancerBinaryConfigurationService;
//# sourceMappingURL=slormancer-binary-configuration.service.js.map