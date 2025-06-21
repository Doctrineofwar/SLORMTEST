"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConverterService = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let JsonConverterService = class JsonConverterService {
    constructor(slormancerDataService, slormancerCharacterBuilderService, slormancerItemService, slormancerLegendaryService, slormancerAffixService, slormancerReaperService, slormancerRunesService, slormancerUltimatumService) {
        this.slormancerDataService = slormancerDataService;
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.slormancerItemService = slormancerItemService;
        this.slormancerLegendaryService = slormancerLegendaryService;
        this.slormancerAffixService = slormancerAffixService;
        this.slormancerReaperService = slormancerReaperService;
        this.slormancerRunesService = slormancerRunesService;
        this.slormancerUltimatumService = slormancerUltimatumService;
        this.RARITY_MAPPING = [
            { rarity: _slorm_api_1.Rarity.Normal, mapping: 0 },
            { rarity: _slorm_api_1.Rarity.Magic, mapping: 1 },
            { rarity: _slorm_api_1.Rarity.Rare, mapping: 2 },
            { rarity: _slorm_api_1.Rarity.Epic, mapping: 3 },
            { rarity: _slorm_api_1.Rarity.Legendary, mapping: 4 },
            { rarity: _slorm_api_1.Rarity.Defensive, mapping: 5 }
        ];
        this.STAT_MAPPING = {};
        this.REVERSE_STAT_MAPPING = {};
        for (const stat of slormancerDataService.getGameDataStats()) {
            this.STAT_MAPPING[stat.REF_NB] = stat.REF;
            this.REVERSE_STAT_MAPPING[stat.REF] = stat.REF_NB;
        }
    }
    rarityToNumber(rarity) {
        const result = this.RARITY_MAPPING.find(m => m.rarity === rarity);
        return result ? result.mapping : 0;
    }
    numberToRarity(rarity) {
        const result = this.RARITY_MAPPING.find(m => m.mapping === rarity);
        return result ? result.rarity : _slorm_api_1.Rarity.Normal;
    }
    itemToJson(item, requireBase) {
        return item === null ? null : {
            base: requireBase ? item.base : null,
            level: item.level,
            reinforcement: item.reinforcement,
            grafts: item.grafts,
            affixes: item.affixes.map(aff => ({ rarity: this.rarityToNumber(aff.rarity), pure: aff.pure === 100 ? 0 : aff.pure, stat: (0, _slorm_api_1.valueOrDefault)(this.REVERSE_STAT_MAPPING[aff.craftedEffect.effect.stat], 0), craftedValue: aff.craftedEffect.craftedValue })),
            legendaryEffect: item.legendaryEffect === null ? null : { craftedValue: item.legendaryEffect.value, id: item.legendaryEffect.id },
            reaperEnchantment: item.reaperEnchantment === null ? null : { craftedValue: item.reaperEnchantment.craftedValue, reaperSmith: item.reaperEnchantment.craftedReaperSmith },
            skillEnchantment: item.skillEnchantment === null ? null : { craftedValue: item.skillEnchantment.craftedValue, skill: item.skillEnchantment.craftedSkill },
            attributeEnchantment: item.attributeEnchantment === null ? null : { craftedValue: item.attributeEnchantment.craftedValue, attribute: item.attributeEnchantment.craftedAttribute }
        };
    }
    ancestralLegacyToJson(ancestralLegacy) {
        return {
            id: ancestralLegacy.id,
            rank: ancestralLegacy.baseRank
        };
    }
    reaperToJson(reaper) {
        return {
            id: reaper.id,
            level: reaper.baseLevel,
            affinity: reaper.baseReaperAffinity,
            effectAffinity: reaper.baseEffectAffinity,
            kills: reaper.baseKills,
            primordialKills: reaper.primordialKills,
            primordial: reaper.primordial ? 1 : 0,
            mastery: reaper.masteryLevel,
        };
    }
    runesToJson(runes) {
        return {
            activationId: runes.activation === null ? null : runes.activation.id,
            activationLevel: runes.activation === null ? 0 : runes.activation.level,
            effectId: runes.effect === null ? null : runes.effect.id,
            effectLevel: runes.effect === null ? 0 : runes.effect.level,
            enhancementId: runes.enhancement === null ? null : runes.enhancement.id,
            enhancementLevel: runes.enhancement === null ? 0 : runes.enhancement.level,
        };
    }
    jsonToRunes(runes, heroClass, reaperId) {
        let result = {
            activation: null,
            effect: null,
            enhancement: null,
        };
        if (runes !== undefined) {
            if (runes.activationId !== null) {
                result.activation = this.slormancerRunesService.getRuneById(runes.activationId, heroClass, runes.activationLevel, reaperId);
            }
            if (runes.effectId !== null) {
                result.effect = this.slormancerRunesService.getRuneById(runes.effectId, heroClass, runes.effectLevel, reaperId);
            }
            if (runes.enhancementId !== null) {
                result.enhancement = this.slormancerRunesService.getRuneById(runes.enhancementId, heroClass, runes.enhancementLevel, reaperId);
            }
        }
        return result;
    }
    ultimatumToJson(ultimatum) {
        let result = null;
        if (ultimatum !== null) {
            result = {
                level: ultimatum.baseLevel,
                type: ultimatum.type
            };
        }
        return result;
    }
    skillToJson(skill, onlyEquipped = false) {
        return {
            id: skill.skill.id,
            rank: skill.skill.baseLevel,
            upgrades: skill.upgrades
                .map(upgrade => ({ id: upgrade.id, rank: upgrade.baseRank, selected: skill.selectedUpgrades.indexOf(upgrade.id) !== -1 ? 1 : 0 }))
                .filter(upgrade => !onlyEquipped || upgrade.selected),
        };
    }
    getActivableId(activable) {
        let result = null;
        if (activable !== null) {
            if ('isActivable' in activable) {
                result = activable.id;
            }
            else {
                result = 200 + activable.id;
            }
        }
        return result;
    }
    characterToJson(character) {
        return {
            type: 'c',
            level: character.level,
            version: character.version,
            originalVersion: character.originalVersion,
            heroClass: character.heroClass,
            gear: {
                helm: this.itemToJson(character.gear.helm, false),
                body: this.itemToJson(character.gear.body, false),
                shoulder: this.itemToJson(character.gear.shoulder, false),
                bracer: this.itemToJson(character.gear.bracer, false),
                glove: this.itemToJson(character.gear.glove, false),
                boot: this.itemToJson(character.gear.boot, false),
                ring_l: this.itemToJson(character.gear.ring_l, false),
                ring_r: this.itemToJson(character.gear.ring_r, false),
                amulet: this.itemToJson(character.gear.amulet, false),
                belt: this.itemToJson(character.gear.belt, false),
                cape: this.itemToJson(character.gear.cape, false)
            },
            inventory: character.inventory.map(item => this.itemToJson(item, true)),
            sharedInventory: character.sharedInventory.map(inv => inv.map(item => this.itemToJson(item, true))),
            ultimatum: this.ultimatumToJson(character.ultimatum),
            ancestralLegacies: {
                ancestralLegacies: character.ancestralLegacies.ancestralLegacies.map(ancestralLegacy => this.ancestralLegacyToJson(ancestralLegacy)),
                nodes: character.ancestralLegacies.activeNodes,
                firstNode: character.ancestralLegacies.activeFirstNode
            },
            reaper: this.reaperToJson(character.reaper),
            runes: this.runesToJson(character.runes),
            skills: character.skills.map(skill => this.skillToJson(skill)),
            attributes: {
                [_slorm_api_1.Attribute.Toughness]: character.attributes.allocated[_slorm_api_1.Attribute.Toughness].baseRank,
                [_slorm_api_1.Attribute.Savagery]: character.attributes.allocated[_slorm_api_1.Attribute.Savagery].baseRank,
                [_slorm_api_1.Attribute.Fury]: character.attributes.allocated[_slorm_api_1.Attribute.Fury].baseRank,
                [_slorm_api_1.Attribute.Determination]: character.attributes.allocated[_slorm_api_1.Attribute.Determination].baseRank,
                [_slorm_api_1.Attribute.Zeal]: character.attributes.allocated[_slorm_api_1.Attribute.Zeal].baseRank,
                [_slorm_api_1.Attribute.Willpower]: character.attributes.allocated[_slorm_api_1.Attribute.Willpower].baseRank,
                [_slorm_api_1.Attribute.Dexterity]: character.attributes.allocated[_slorm_api_1.Attribute.Dexterity].baseRank,
                [_slorm_api_1.Attribute.Bravery]: character.attributes.allocated[_slorm_api_1.Attribute.Bravery].baseRank,
            },
            support: character.supportSkill === null ? null : character.supportSkill.id,
            primary: character.primarySkill === null ? null : character.primarySkill.id,
            secondary: character.secondarySkill === null ? null : character.secondarySkill.id,
            activable1: this.getActivableId(character.activable1),
            activable2: this.getActivableId(character.activable2),
            activable3: this.getActivableId(character.activable3),
            activable4: this.getActivableId(character.activable4)
        };
    }
    characterToMinimalJson(character) {
        return {
            type: 'c',
            level: character.level,
            version: character.version,
            originalVersion: character.originalVersion,
            heroClass: character.heroClass,
            gear: {
                helm: this.itemToJson(character.gear.helm, false),
                body: this.itemToJson(character.gear.body, false),
                shoulder: this.itemToJson(character.gear.shoulder, false),
                bracer: this.itemToJson(character.gear.bracer, false),
                glove: this.itemToJson(character.gear.glove, false),
                boot: this.itemToJson(character.gear.boot, false),
                ring_l: this.itemToJson(character.gear.ring_l, false),
                ring_r: this.itemToJson(character.gear.ring_r, false),
                amulet: this.itemToJson(character.gear.amulet, false),
                belt: this.itemToJson(character.gear.belt, false),
                cape: this.itemToJson(character.gear.cape, false)
            },
            inventory: null,
            sharedInventory: null,
            ultimatum: this.ultimatumToJson(character.ultimatum),
            ancestralLegacies: {
                ancestralLegacies: character.ancestralLegacies.ancestralLegacies
                    .filter(ancestralLegacy => character.ancestralLegacies.activeAncestralLegacies.indexOf(ancestralLegacy.id) !== -1)
                    .map(ancestralLegacy => this.ancestralLegacyToJson(ancestralLegacy)),
                nodes: character.ancestralLegacies.activeNodes,
                firstNode: character.ancestralLegacies.activeFirstNode,
            },
            reaper: this.reaperToJson(character.reaper),
            runes: this.runesToJson(character.runes),
            skills: character.skills
                .filter(skill => skill.skill === character.supportSkill || skill.skill === character.primarySkill || skill.skill === character.secondarySkill)
                .map(skill => this.skillToJson(skill, true)),
            attributes: {
                [_slorm_api_1.Attribute.Toughness]: character.attributes.allocated[_slorm_api_1.Attribute.Toughness].baseRank,
                [_slorm_api_1.Attribute.Savagery]: character.attributes.allocated[_slorm_api_1.Attribute.Savagery].baseRank,
                [_slorm_api_1.Attribute.Fury]: character.attributes.allocated[_slorm_api_1.Attribute.Fury].baseRank,
                [_slorm_api_1.Attribute.Determination]: character.attributes.allocated[_slorm_api_1.Attribute.Determination].baseRank,
                [_slorm_api_1.Attribute.Zeal]: character.attributes.allocated[_slorm_api_1.Attribute.Zeal].baseRank,
                [_slorm_api_1.Attribute.Willpower]: character.attributes.allocated[_slorm_api_1.Attribute.Willpower].baseRank,
                [_slorm_api_1.Attribute.Dexterity]: character.attributes.allocated[_slorm_api_1.Attribute.Dexterity].baseRank,
                [_slorm_api_1.Attribute.Bravery]: character.attributes.allocated[_slorm_api_1.Attribute.Bravery].baseRank,
            },
            support: character.supportSkill === null ? null : character.supportSkill.id,
            primary: character.primarySkill === null ? null : character.primarySkill.id,
            secondary: character.secondarySkill === null ? null : character.secondarySkill.id,
            activable1: this.getActivableId(character.activable1),
            activable2: this.getActivableId(character.activable2),
            activable3: this.getActivableId(character.activable3),
            activable4: this.getActivableId(character.activable4)
        };
    }
    layerToJson(layer) {
        return {
            type: 'l',
            character: this.characterToJson(layer.character),
            name: layer.name
        };
    }
    buildToJson(build) {
        return {
            type: 'p',
            version: build.version,
            heroClass: build.heroClass,
            name: build.name,
            layers: build.layers.map(layer => this.layerToJson(layer)),
            configuration: { ...build.configuration }
        };
    }
    jsonToItem(item, heroClass, forcedBase = null) {
        let result = null;
        if (item !== null) {
            const affixes = item.affixes
                .map(affix => this.slormancerAffixService.getAffixFromStat(this.STAT_MAPPING[affix.stat], item.level, item.reinforcement, this.numberToRarity(affix.rarity), affix.craftedValue, affix.pure))
                .filter(_slorm_api_1.isNotNullOrUndefined);
            let base = forcedBase;
            if (base === null) {
                base = item.base === null ? _slorm_api_1.EquipableItemBase.Amulet : item.base;
            }
            let legendaryEffect = item.legendaryEffect === null ? null : this.slormancerLegendaryService.getLegendaryEffectById(item.legendaryEffect.id, item.legendaryEffect.craftedValue, item.reinforcement, heroClass);
            let reaperEnchantment = item.reaperEnchantment === null ? null : this.slormancerItemService.getReaperEnchantment(item.reaperEnchantment.reaperSmith, item.reaperEnchantment.craftedValue);
            let skillEnchantment = item.skillEnchantment === null ? null : this.slormancerItemService.getSkillEnchantment(item.skillEnchantment.skill, item.skillEnchantment.craftedValue);
            let attributeEnchantment = item.attributeEnchantment === null ? null : this.slormancerItemService.getAttributeEnchantment(item.attributeEnchantment.attribute, item.attributeEnchantment.craftedValue);
            result = this.slormancerItemService.getEquipableItem(base, heroClass, item.level, affixes, item.reinforcement, item.grafts, legendaryEffect, reaperEnchantment, skillEnchantment, attributeEnchantment, 0);
        }
        return result;
    }
    normalizeJsonCharacter(character) {
        if (character.version === '0.2.152') {
            character.originalVersion = character.version;
            character.ultimatum = null;
        }
        if ((0, _slorm_api_1.compareVersions)(character.version, '0.2.0') < 0) {
            character.reaper.affinity = _slorm_api_1.MAX_REAPER_AFFINITY_BASE;
        }
        if ((0, _slorm_api_1.compareVersions)(character.version, '0.5.0') < 0) {
            character.ancestralLegacies.firstNode = null;
        }
        if ((0, _slorm_api_1.compareVersions)(character.version, '0.7.0') < 0) {
            character.reaper.mastery = 0;
        }
        if ((0, _slorm_api_1.compareVersions)(character.version, '0.7.0') <= 0) {
            const items = [
                character.gear.amulet,
                character.gear.belt,
                character.gear.body,
                character.gear.boot,
                character.gear.bracer,
                character.gear.cape,
                character.gear.glove,
                character.gear.helm,
                character.gear.ring_l,
                character.gear.ring_r,
                character.gear.shoulder,
                ...(character.inventory === null ? [] : character.inventory),
                ...(character.sharedInventory === null ? [] : character.sharedInventory.flat())
            ].filter(_slorm_api_1.isNotNullOrUndefined);
            for (const item of items) {
                item.grafts = 0;
            }
        }
        if ((0, _slorm_api_1.compareVersions)(character.version, '0.8.2') <= 0) {
            const items = [
                character.gear.amulet,
                character.gear.belt,
                character.gear.body,
                character.gear.boot,
                character.gear.bracer,
                character.gear.cape,
                character.gear.glove,
                character.gear.helm,
                character.gear.ring_l,
                character.gear.ring_r,
                character.gear.shoulder,
                ...(character.inventory === null ? [] : character.inventory),
                ...(character.sharedInventory === null ? [] : character.sharedInventory.flat())
            ].filter(_slorm_api_1.isNotNullOrUndefined);
            for (const item of items) {
                item.reinforcement = item.reinforcement ?? item.reinforcment ?? 0;
            }
        }
    }
    jsonToCharacter(character) {
        this.normalizeJsonCharacter(character);
        const reaper = this.slormancerReaperService.getReaperById(character.reaper.id, character.heroClass, character.reaper.primordial === 1, character.reaper.level, 0, character.reaper.kills, character.reaper.primordialKills, character.reaper.affinity, character.reaper.effectAffinity, 0, character.reaper.mastery);
        const gear = {
            helm: this.jsonToItem(character.gear.helm, character.heroClass, _slorm_api_1.EquipableItemBase.Helm),
            body: this.jsonToItem(character.gear.body, character.heroClass, _slorm_api_1.EquipableItemBase.Body),
            shoulder: this.jsonToItem(character.gear.shoulder, character.heroClass, _slorm_api_1.EquipableItemBase.Shoulder),
            bracer: this.jsonToItem(character.gear.bracer, character.heroClass, _slorm_api_1.EquipableItemBase.Bracer),
            glove: this.jsonToItem(character.gear.glove, character.heroClass, _slorm_api_1.EquipableItemBase.Glove),
            boot: this.jsonToItem(character.gear.boot, character.heroClass, _slorm_api_1.EquipableItemBase.Boot),
            ring_l: this.jsonToItem(character.gear.ring_l, character.heroClass, _slorm_api_1.EquipableItemBase.Ring),
            ring_r: this.jsonToItem(character.gear.ring_r, character.heroClass, _slorm_api_1.EquipableItemBase.Ring),
            amulet: this.jsonToItem(character.gear.amulet, character.heroClass, _slorm_api_1.EquipableItemBase.Amulet),
            belt: this.jsonToItem(character.gear.belt, character.heroClass, _slorm_api_1.EquipableItemBase.Belt),
            cape: this.jsonToItem(character.gear.cape, character.heroClass, _slorm_api_1.EquipableItemBase.Cape),
        };
        const ultimatumBonusLevel = (0, _slorm_api_1.getOlorinUltimatumBonusLevel)(gear);
        const ultimatum = character.ultimatum === null
            ? null
            : this.slormancerUltimatumService.getUltimatum(character.ultimatum.type, character.ultimatum.level, ultimatumBonusLevel);
        const ancestralRanks = this.slormancerDataService.getGameDataAncestralLegacyIds()
            .map((_, index) => character.ancestralLegacies.ancestralLegacies.find(a => a.id === index))
            .map(a => a ? a.rank : 0);
        const skillRanks = this.slormancerDataService.getGameDataSkills(character.heroClass)
            .map((_, index) => {
            let rank = 0;
            const skill = character.skills.find(skill => skill.id === index);
            if (skill) {
                rank = (0, _slorm_api_1.round)(skill.rank);
            }
            else {
                const upgrade = character.skills.map(skill => skill.upgrades).flat()
                    .find(upgrade => upgrade.id === index);
                if (upgrade) {
                    rank = upgrade.rank;
                }
            }
            return rank;
        });
        const skillEquipped = this.slormancerDataService.getGameDataSkills(character.heroClass)
            .map((_, index) => {
            const upgrade = character.skills.map(skill => skill.upgrades).flat()
                .find(upgrade => upgrade.id === index);
            return upgrade ? upgrade.selected : 0;
        });
        const result = this.slormancerCharacterBuilderService.getCharacter(character.heroClass, character.level, character.version, character.originalVersion, null, reaper, this.jsonToRunes(character.runes, character.heroClass, reaper === null ? null : reaper.id), ultimatum, character.ancestralLegacies.nodes, character.ancestralLegacies.firstNode, ancestralRanks, skillEquipped, skillRanks, gear.helm, gear.body, gear.shoulder, gear.bracer, gear.glove, gear.boot, gear.ring_l, gear.ring_r, gear.amulet, gear.belt, gear.cape, character.inventory === null ? null : character.inventory.map(item => this.jsonToItem(item, character.heroClass, null)), character.sharedInventory === null ? null : character.sharedInventory.map(items => items.map(item => this.jsonToItem(item, character.heroClass, null))), character.attributes[_slorm_api_1.Attribute.Toughness], character.attributes[_slorm_api_1.Attribute.Savagery], character.attributes[_slorm_api_1.Attribute.Fury], character.attributes[_slorm_api_1.Attribute.Determination], character.attributes[_slorm_api_1.Attribute.Zeal], character.attributes[_slorm_api_1.Attribute.Willpower], character.attributes[_slorm_api_1.Attribute.Dexterity], character.attributes[_slorm_api_1.Attribute.Bravery], character.primary, character.secondary, character.support, character.activable1, character.activable2, character.activable3, character.activable4);
        return result;
    }
    jsonToLayer(layer) {
        return {
            name: layer.name,
            character: this.jsonToCharacter(layer.character)
        };
    }
    jsonToBuild(build) {
        return {
            version: build.version,
            heroClass: build.heroClass,
            name: build.name ? build.name : 'Default name',
            layers: build.layers.map(layer => this.jsonToLayer(layer)),
            configuration: { ...build.configuration }
        };
    }
    jsonToSharedData(json) {
        return {
            character: json.type === 'c' ? this.jsonToCharacter(json) : null,
            configuration: null,
            layer: json.type === 'l' ? this.jsonToLayer(json) : null,
            planner: json.type === 'p' ? this.jsonToBuild(json) : null
        };
    }
};
JsonConverterService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], JsonConverterService);
exports.JsonConverterService = JsonConverterService;
//# sourceMappingURL=json-converter.service.js.map