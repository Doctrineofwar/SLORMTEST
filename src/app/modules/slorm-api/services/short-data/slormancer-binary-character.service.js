"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerBinaryCharacterService = void 0;
const core_1 = require("@angular/core");
const common_1 = require("../../constants/common");
const attribute_1 = require("../../model/content/enum/attribute");
const gear_slot_1 = require("../../model/content/enum/gear-slot");
const util_1 = require("../../util");
const bits_util_1 = require("../../util/bits.util");
let SlormancerBinaryCharacterService = class SlormancerBinaryCharacterService {
    constructor(slormancerBinaryItemService, slormancerBinaryReaperService, slormancerBinaryUltimatumService, slormancerCharacterBuilderService, slormancerBinaryRuneService, slormancerMightService) {
        this.slormancerBinaryItemService = slormancerBinaryItemService;
        this.slormancerBinaryReaperService = slormancerBinaryReaperService;
        this.slormancerBinaryUltimatumService = slormancerBinaryUltimatumService;
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.slormancerBinaryRuneService = slormancerBinaryRuneService;
        this.slormancerMightService = slormancerMightService;
    }
    ancestralLegaciesToBinary(characterAncestralLegacies) {
        let result = [];
        result.push(...(0, bits_util_1.booleanToBinary)((characterAncestralLegacies.activeFirstNode !== null)));
        if (characterAncestralLegacies.activeFirstNode !== null) {
            result.push(...(0, bits_util_1.numberToBinary)(characterAncestralLegacies.activeFirstNode, 10));
        }
        result.push(...(0, bits_util_1.numberToBinary)(characterAncestralLegacies.activeNodes.length, 4));
        for (const node of characterAncestralLegacies.activeNodes) {
            result.push(...(0, bits_util_1.numberToBinary)(node, 10));
        }
        const ancestralLegacies = characterAncestralLegacies.ancestralLegacies
            .filter(ancestralLegacy => characterAncestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id));
        result.push(...(0, bits_util_1.numberToBinary)(ancestralLegacies.length, 4));
        for (const ancestralLegacy of ancestralLegacies) {
            result.push(...(0, bits_util_1.numberToBinary)(ancestralLegacy.id, 10));
            result.push(...(0, bits_util_1.numberToBinary)(ancestralLegacy.baseRank, 4));
        }
        return result;
    }
    binaryToAncestralLegacies(binary, version) {
        const hasFirstStoneData = (0, util_1.compareVersions)(version, '0.5.0') >= 0;
        let result = { nodes: [], ancestralLegacyLevels: [], firstNode: null };
        if (hasFirstStoneData) {
            if ((0, bits_util_1.binaryToBoolean)((0, bits_util_1.takeBitsChunk)(binary, 1))) {
                result.firstNode = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
            }
        }
        const nodesCount = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        for (let i = 0; i < nodesCount; i++) {
            result.nodes.push((0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10)));
        }
        const ancestralCount = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        for (let i = 0; i < ancestralCount; i++) {
            const ancestralId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
            const ancestralRank = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
            result.ancestralLegacyLevels[ancestralId] = ancestralRank;
        }
        return result;
    }
    skillsToBinary(characterSkillAndUpgrades, support, primary, secondary) {
        let result = [];
        result.push(...(0, bits_util_1.numberToBinary)(characterSkillAndUpgrades.length, 4));
        for (const skillInfo of characterSkillAndUpgrades) {
            result.push(...(0, bits_util_1.numberToBinary)(skillInfo.skill.id, 10));
            result.push(...(0, bits_util_1.numberToBinary)(skillInfo.skill.baseLevel, 5));
            const hasPassives = skillInfo.selectedUpgrades.length > 0
                || skillInfo.skill.id === support
                || skillInfo.skill.id === primary
                || skillInfo.skill.id === secondary;
            result.push(...(0, bits_util_1.booleanToBinary)(hasPassives));
            if (hasPassives) {
                const upgrades = skillInfo.upgrades.filter(upgrade => skillInfo.selectedUpgrades.includes(upgrade.id));
                result.push(...(0, bits_util_1.numberToBinary)(upgrades.length, 4));
                for (const upgrade of upgrades) {
                    result.push(...(0, bits_util_1.numberToBinary)(upgrade.id, 10));
                    result.push(...(0, bits_util_1.numberToBinary)(upgrade.baseRank, 4));
                }
            }
        }
        return result;
    }
    binaryToSkills(binary) {
        const result = { equiped: [], ranks: [] };
        const skillsCount = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        for (let i = 0; i < skillsCount; i++) {
            const skillId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
            const skillLevel = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 5));
            result.ranks[skillId] = skillLevel;
            const hasPassives = (0, bits_util_1.binaryToBoolean)((0, bits_util_1.takeBitsChunk)(binary, 1));
            if (hasPassives) {
                const upgradesCount = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
                for (let j = 0; j < upgradesCount; j++) {
                    const upgradeId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
                    const upgradeRank = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
                    result.equiped[upgradeId] = 1;
                    result.ranks[upgradeId] = upgradeRank;
                }
            }
        }
        return result;
    }
    binaryToGear(binary, heroClass, version, report) {
        const result = {
            [gear_slot_1.GearSlot.Helm]: null,
            [gear_slot_1.GearSlot.Body]: null,
            [gear_slot_1.GearSlot.Shoulder]: null,
            [gear_slot_1.GearSlot.Bracer]: null,
            [gear_slot_1.GearSlot.Glove]: null,
            [gear_slot_1.GearSlot.Boot]: null,
            [gear_slot_1.GearSlot.LeftRing]: null,
            [gear_slot_1.GearSlot.RightRing]: null,
            [gear_slot_1.GearSlot.Amulet]: null,
            [gear_slot_1.GearSlot.Belt]: null,
            [gear_slot_1.GearSlot.Cape]: null
        };
        const itemsCount = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        for (let i = 0; i < itemsCount; i++) {
            const gearSlotValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 5));
            const gearSlot = gear_slot_1.ALL_GEAR_SLOT_VALUES[gearSlotValue];
            if (!gearSlot) {
                throw new Error('failed to parse gear slot from binary : ' + binary.join());
            }
            result[gearSlot] = this.slormancerBinaryItemService.binaryToItem(binary, (0, gear_slot_1.gearSlotToBase)(gearSlot), heroClass, version, report);
        }
        return result;
    }
    gearToBinary(gear) {
        let result = [];
        const gearSlots = gear_slot_1.ALL_GEAR_SLOT_VALUES.filter(slot => gear[slot] !== null);
        result.push(...(0, bits_util_1.numberToBinary)(gearSlots.length, 4));
        for (const gearSlot of gearSlots) {
            const item = gear[gearSlot];
            if (item !== null) {
                result.push(...(0, bits_util_1.numberToBinary)(gear_slot_1.ALL_GEAR_SLOT_VALUES.indexOf(gearSlot), 5));
                result.push(...this.slormancerBinaryItemService.itemToBinary(item));
            }
        }
        return result;
    }
    characterToBinary(character) {
        let result = [];
        result.push(...(0, bits_util_1.numberToBinary)(character.heroClass, 2));
        result.push(...(0, bits_util_1.numberToBinary)(character.level, 7));
        result.push(...this.slormancerBinaryReaperService.reaperToBinary(character.reaper));
        result.push(...this.slormancerBinaryRuneService.runesCombinationToBinary(character.runes));
        result.push(...this.ancestralLegaciesToBinary(character.ancestralLegacies));
        result.push(...this.skillsToBinary(character.skills, character.supportSkill ? character.supportSkill.id : null, character.primarySkill ? character.primarySkill.id : null, character.secondarySkill ? character.secondarySkill.id : null));
        result.push(...this.gearToBinary(character.gear));
        result.push(...this.slormancerBinaryUltimatumService.ultimatumToBinary(character.ultimatum));
        for (const attribute of attribute_1.ALL_ATTRIBUTES) {
            result.push(...(0, bits_util_1.numberToBinary)(character.attributes.allocated[attribute].baseRank, 7));
        }
        result.push(...(0, bits_util_1.numberToBinary)(character.supportSkill === null ? 0 : character.supportSkill.id + 1, 10));
        result.push(...(0, bits_util_1.numberToBinary)(character.primarySkill === null ? 0 : character.primarySkill.id + 1, 10));
        result.push(...(0, bits_util_1.numberToBinary)(character.secondarySkill === null ? 0 : character.secondarySkill.id + 1, 10));
        const activable1Id = character.activable1 === null ? 0
            : (1 + ('isActivable' in character.activable1 ? character.activable1.id : character.activable1.id + 200));
        result.push(...(0, bits_util_1.numberToBinary)(activable1Id, 10));
        const activable2Id = character.activable2 === null ? 0
            : (1 + ('isActivable' in character.activable2 ? character.activable2.id : character.activable2.id + 200));
        result.push(...(0, bits_util_1.numberToBinary)(activable2Id, 10));
        const activable3Id = character.activable3 === null ? 0
            : (1 + ('isActivable' in character.activable3 ? character.activable3.id : character.activable3.id + 200));
        result.push(...(0, bits_util_1.numberToBinary)(activable3Id, 10));
        const activable4Id = character.activable4 === null ? 0
            : (1 + ('isActivable' in character.activable4 ? character.activable4.id : character.activable4.id + 200));
        result.push(...(0, bits_util_1.numberToBinary)(activable4Id, 10));
        const investedSkillSlorm = this.slormancerMightService.getInvestedSkillSlorm(character);
        result.push(...(0, bits_util_1.numberToBinary)(investedSkillSlorm, 25));
        const investedAncestralSlorm = this.slormancerMightService.getInvestedAncestralSlorm(character);
        result.push(...(0, bits_util_1.numberToBinary)(investedAncestralSlorm, 25));
        return result;
    }
    smartGuessMissingAttributes(attributes, points, report) {
        let remainingPoints = points;
        for (const attribute of attribute_1.ALL_ATTRIBUTES) {
            remainingPoints -= attributes[attribute];
        }
        if (remainingPoints >= 64) {
            let validAttribute = attribute_1.ALL_ATTRIBUTES.find(attribute => attributes[attribute] === 11);
            if (validAttribute === undefined) {
                validAttribute = attribute_1.ALL_ATTRIBUTES.find(attribute => attributes[attribute] > 0 && attributes[attribute] < 11);
            }
            if (validAttribute !== undefined) {
                attributes[validAttribute] += 64;
                report.fromCorrupted = true;
            }
        }
    }
    binaryToCharacter(binary, version) {
        const originalGameVersion = common_1.API_TO_GAME_VERSION_MAPPER[version];
        const importVersion = originalGameVersion ? originalGameVersion : common_1.GAME_VERSION;
        const heroClass = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 2));
        const report = { fromCorrupted: false };
        const has6BitsLevel = (0, util_1.compareVersions)(version, '0.4.0') < 0;
        let level = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, has6BitsLevel ? 6 : 7));
        if (has6BitsLevel && level <= 6) {
            level += 64;
            report.fromCorrupted = true;
        }
        const reaper = this.slormancerBinaryReaperService.binaryToReaper(binary, heroClass, version);
        const runes = this.slormancerBinaryRuneService.binaryToRunesCombination(binary, heroClass, version, reaper.id);
        const ancestralData = this.binaryToAncestralLegacies(binary, version);
        const skillsData = this.binaryToSkills(binary);
        const gearData = this.binaryToGear(binary, heroClass, version, report);
        const ultimatumBonusLevel = (0, util_1.getOlorinUltimatumBonusLevel)(gearData);
        const ultimatum = this.slormancerBinaryUltimatumService.binaryToUltimatum(binary, ultimatumBonusLevel);
        const has6BitsRank = (0, util_1.compareVersions)(version, '0.4.1') < 0;
        const attributes = {
            [attribute_1.Attribute.Toughness]: 0,
            [attribute_1.Attribute.Savagery]: 0,
            [attribute_1.Attribute.Fury]: 0,
            [attribute_1.Attribute.Determination]: 0,
            [attribute_1.Attribute.Zeal]: 0,
            [attribute_1.Attribute.Willpower]: 0,
            [attribute_1.Attribute.Dexterity]: 0,
            [attribute_1.Attribute.Bravery]: 0,
        };
        for (const attribute of attribute_1.ALL_ATTRIBUTES) {
            let value = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, has6BitsRank ? 6 : 7));
            attributes[attribute] = value;
        }
        if (has6BitsRank) {
            // i used to save ranks with 6 bits which was a mistake when the maximum level increased
            this.smartGuessMissingAttributes(attributes, level, report);
        }
        const supportSkillValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const primarySkillValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const secondarySkillValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const activable1Value = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const activable2Value = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const activable3Value = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const activable4Value = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const hasInvestedSlorm = (0, util_1.compareVersions)(version, '0.7.0') >= 0;
        let investedSkillSlorm = null;
        let investedAncestralSlorm = null;
        if (hasInvestedSlorm) {
            investedSkillSlorm = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 25));
            investedAncestralSlorm = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 25));
        }
        const character = this.slormancerCharacterBuilderService.getCharacter(heroClass, level, common_1.GAME_VERSION, importVersion, importVersion, reaper, runes, ultimatum, ancestralData.nodes, ancestralData.firstNode, ancestralData.ancestralLegacyLevels, skillsData.equiped, skillsData.ranks, gearData[gear_slot_1.GearSlot.Helm], gearData[gear_slot_1.GearSlot.Body], gearData[gear_slot_1.GearSlot.Shoulder], gearData[gear_slot_1.GearSlot.Bracer], gearData[gear_slot_1.GearSlot.Glove], gearData[gear_slot_1.GearSlot.Boot], gearData[gear_slot_1.GearSlot.LeftRing], gearData[gear_slot_1.GearSlot.RightRing], gearData[gear_slot_1.GearSlot.Amulet], gearData[gear_slot_1.GearSlot.Belt], gearData[gear_slot_1.GearSlot.Cape], null, null, attributes[attribute_1.Attribute.Toughness], attributes[attribute_1.Attribute.Savagery], attributes[attribute_1.Attribute.Fury], attributes[attribute_1.Attribute.Determination], attributes[attribute_1.Attribute.Zeal], attributes[attribute_1.Attribute.Willpower], attributes[attribute_1.Attribute.Dexterity], attributes[attribute_1.Attribute.Bravery], primarySkillValue === 0 ? null : (primarySkillValue - 1), secondarySkillValue === 0 ? null : (secondarySkillValue - 1), supportSkillValue === 0 ? null : (supportSkillValue - 1), activable1Value === 0 ? null : (activable1Value - 1), activable2Value === 0 ? null : (activable2Value - 1), activable3Value === 0 ? null : (activable3Value - 1), activable4Value === 0 ? null : (activable4Value - 1), report.fromCorrupted);
        if (character !== null) {
            character.might.investedAncestralLegacySlorm = investedAncestralSlorm;
            character.might.investedSkillSlorm = investedSkillSlorm;
        }
        return character;
    }
};
SlormancerBinaryCharacterService = __decorate([
    (0, core_1.Injectable)()
], SlormancerBinaryCharacterService);
exports.SlormancerBinaryCharacterService = SlormancerBinaryCharacterService;
//# sourceMappingURL=slormancer-binary-character.service.js.map