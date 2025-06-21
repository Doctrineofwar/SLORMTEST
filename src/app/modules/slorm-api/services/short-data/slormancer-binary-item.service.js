"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerBinaryItemService = void 0;
const core_1 = require("@angular/core");
const rarity_1 = require("../../model/content/enum/rarity");
const util_1 = require("../../util");
const bits_util_1 = require("../../util/bits.util");
let SlormancerBinaryItemService = class SlormancerBinaryItemService {
    constructor(slormancerDataService, slormancerItemAffixService, slormancerLegendaryEffectService, slormancerItemService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerItemAffixService = slormancerItemAffixService;
        this.slormancerLegendaryEffectService = slormancerLegendaryEffectService;
        this.slormancerItemService = slormancerItemService;
    }
    affixToBinary(affix) {
        const result = [];
        result.push(...(0, bits_util_1.numberToBinary)(rarity_1.ALL_RARITIES.indexOf(affix.rarity), 3));
        const affixStat = this.slormancerDataService.getGameDataStatByRef(affix.craftedEffect.effect.stat);
        result.push(...(0, bits_util_1.numberToBinary)(affixStat === null ? 0 : affixStat.REF_NB, 9));
        result.push(...(0, bits_util_1.numberToBinary)(affix.craftedEffect.craftedValue, 9));
        result.push(...(0, bits_util_1.booleanToBinary)(affix.isPure));
        if (affix.isPure) {
            result.push(...(0, bits_util_1.numberToBinary)(affix.pure, 8));
        }
        return result;
    }
    binaryToAffix(binary, level, reinforcement) {
        const rarityValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 3));
        const statValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 9));
        const craftedValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 9));
        const isPure = (0, bits_util_1.binaryToBoolean)((0, bits_util_1.takeBitsChunk)(binary, 1));
        const pure = isPure ? (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 8)) : 100;
        const rarity = rarity_1.ALL_RARITIES[rarityValue];
        const stat = this.slormancerDataService.getGameDataStatByRefId(statValue);
        if (rarity === undefined || stat === null) {
            throw new Error('Failed to parse affix from binary : ' + binary.join());
        }
        const affix = this.slormancerItemAffixService.getAffixFromStat(stat.REF, level, reinforcement, rarity, craftedValue, pure);
        if (affix === null) {
            throw new Error('Failed to parse affix from binary : ' + binary.join());
        }
        return affix;
    }
    itemToBinary(item) {
        let result = [];
        result.push(...(0, bits_util_1.numberToBinary)(item.level, 7));
        result.push(...(0, bits_util_1.numberToBinary)(item.reinforcement, 8));
        if (item.level > 100) {
            result.push(...(0, bits_util_1.numberToBinary)(item.grafts, 4));
        }
        result.push(...(0, bits_util_1.numberToBinary)(item.affixes.length, 4));
        for (const affix of item.affixes) {
            result.push(...this.affixToBinary(affix));
        }
        const attribute = item.attributeEnchantment;
        result.push(...(0, bits_util_1.numberToBinary)(attribute !== null ? attribute.craftedAttribute + 1 : 0, 4));
        result.push(...(0, bits_util_1.numberToBinary)(attribute !== null ? attribute.craftedValue : 0, 2));
        const reaper = item.reaperEnchantment;
        result.push(...(0, bits_util_1.numberToBinary)(reaper !== null ? reaper.craftedReaperSmith + 1 : 0, 4));
        result.push(...(0, bits_util_1.numberToBinary)(reaper !== null ? reaper.craftedValue : 0, 3));
        const skill = item.skillEnchantment;
        result.push(...(0, bits_util_1.numberToBinary)(skill !== null ? skill.craftedSkill + 1 : 0, 4));
        result.push(...(0, bits_util_1.numberToBinary)(skill !== null ? skill.craftedValue : 0, 3));
        const legendary = item.legendaryEffect;
        result.push(...(0, bits_util_1.numberToBinary)(legendary !== null ? legendary.id + 1 : 0, 10));
        result.push(...(0, bits_util_1.numberToBinary)(legendary !== null ? legendary.value : 0, 8));
        return result;
    }
    binaryToItem(binary, base, heroClass, version, report) {
        const has6BitsLevel = (0, util_1.compareVersions)(version, '0.4.1') < 0;
        let level = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, has6BitsLevel ? 6 : 7));
        if (has6BitsLevel && level <= 16) {
            level += 64;
            report.fromCorrupted = true;
        }
        const reinforcement = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 8));
        let grafts = 0;
        if (level > 100) {
            grafts = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        }
        const affixCount = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        const affixes = [];
        for (let i = 0; i < affixCount; i++) {
            affixes.push(this.binaryToAffix(binary, level, reinforcement));
        }
        const attributeType = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        const attributeValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 2));
        let attribute = null;
        if (attributeType > 0) {
            attribute = this.slormancerItemService.getAttributeEnchantment(attributeType - 1, attributeValue);
        }
        const reaperType = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        const reaperValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 3));
        let reaper = null;
        if (reaperType > 0) {
            reaper = this.slormancerItemService.getReaperEnchantment(reaperType - 1, reaperValue);
        }
        const skillType = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 4));
        const skillValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 3));
        let skill = null;
        if (skillType > 0) {
            skill = this.slormancerItemService.getSkillEnchantment(skillType - 1, skillValue);
        }
        const legendaryId = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 10));
        const legendaryValue = (0, bits_util_1.binaryToNumber)((0, bits_util_1.takeBitsChunk)(binary, 8));
        let legendary = null;
        if (legendaryId > 0) {
            legendary = this.slormancerLegendaryEffectService.getLegendaryEffectById(legendaryId - 1, legendaryValue, reinforcement, heroClass);
        }
        return this.slormancerItemService.getEquipableItem(base, heroClass, level, affixes, reinforcement, grafts, legendary, reaper, skill, attribute, 0);
    }
};
SlormancerBinaryItemService = __decorate([
    (0, core_1.Injectable)()
], SlormancerBinaryItemService);
exports.SlormancerBinaryItemService = SlormancerBinaryItemService;
//# sourceMappingURL=slormancer-binary-item.service.js.map