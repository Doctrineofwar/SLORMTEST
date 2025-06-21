"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerCharacterBuilderService = void 0;
const core_1 = require("@angular/core");
const hero_class_1 = require("..//model/content/enum/hero-class");
const common_1 = require("../constants/common");
const attribute_1 = require("../model/content/enum/attribute");
const reaper_smith_1 = require("../model/content/enum/reaper-smith");
const rune_type_1 = require("../model/content/rune-type");
const math_util_1 = require("../util/math.util");
const utils_1 = require("../util/utils");
let SlormancerCharacterBuilderService = class SlormancerCharacterBuilderService {
    constructor(slormancerItemservice, slormancerReaperService, slormancerDataService, slormancerRuneService, slormancerSkillService, slormancerAttributeService, slormancerAncestralLegacyService, slormancerUltimatumService, slormancerAncestralLegacyNodesService) {
        this.slormancerItemservice = slormancerItemservice;
        this.slormancerReaperService = slormancerReaperService;
        this.slormancerDataService = slormancerDataService;
        this.slormancerRuneService = slormancerRuneService;
        this.slormancerSkillService = slormancerSkillService;
        this.slormancerAttributeService = slormancerAttributeService;
        this.slormancerAncestralLegacyService = slormancerAncestralLegacyService;
        this.slormancerUltimatumService = slormancerUltimatumService;
        this.slormancerAncestralLegacyNodesService = slormancerAncestralLegacyNodesService;
    }
    getSkills(heroClass, equipped = [], ranks = []) {
        return this.slormancerDataService.getGameDataActiveSkills(heroClass).map(gameData => {
            const skill = this.slormancerSkillService.getHeroSkill(gameData.REF, heroClass, Math.min(15, (0, utils_1.valueOrDefault)(ranks[gameData.REF], 0)));
            const upgrades = this.slormancerDataService.getGameDataUpgradeIdsForSkill(gameData.REF, heroClass)
                .map(upgradeId => this.slormancerSkillService.getUpgrade(upgradeId, heroClass, (0, utils_1.valueOrDefault)(ranks[upgradeId], 0)))
                .filter(utils_1.isNotNullOrUndefined);
            return skill === null ? null : {
                skill,
                upgrades,
                selectedUpgrades: upgrades.map(passive => passive.id).filter(id => equipped[id] === 1),
                activeUpgrades: [],
                stats: [],
                investedSlorm: 0,
            };
        }).filter(utils_1.isNotNullOrUndefined);
    }
    getSkillsClone(skillAndUpgrades) {
        return {
            skill: this.slormancerSkillService.getHeroSkillClone(skillAndUpgrades.skill),
            selectedUpgrades: [...skillAndUpgrades.selectedUpgrades],
            activeUpgrades: [...skillAndUpgrades.activeUpgrades],
            upgrades: skillAndUpgrades.upgrades.map(upgrade => this.slormancerSkillService.getUpgradeClone(upgrade)),
            stats: [...skillAndUpgrades.stats],
        };
    }
    getItem(item, heroClass) {
        let result = null;
        if (this.slormancerItemservice.isEquipableItem(item)) {
            result = this.slormancerItemservice.getEquipableItemFromGame(item, heroClass, 0);
        }
        return result;
    }
    getEquippedReaper(save, heroClass) {
        const reaperCount = this.slormancerDataService.getGameDataReaperCount();
        let reaper = null;
        const weaponEquip = save.weapon_equip[heroClass];
        const primordial = weaponEquip >= reaperCount;
        const reaperId = weaponEquip % reaperCount;
        const reaperData = (0, utils_1.valueOrNull)(save.weapon_data[heroClass][reaperId]);
        const reaperMastery = this.slormancerReaperService.getReaperMastery(save.weapon_data[heroClass]);
        if (reaperData !== null) {
            reaper = this.slormancerReaperService.getReaperFromGameWeapon(reaperData, heroClass, primordial, reaperMastery);
        }
        if (reaper === null) {
            throw new Error('failed to parse reaper');
        }
        if (reaper.smith.id === reaper_smith_1.ReaperSmith.ReapersmithBrotherhood || reaper.id === 90) {
            reaper.baseReaperAffinity = Math.max(save.reaper_affinity[reaper_smith_1.ReaperSmith.Adrianne], save.reaper_affinity[reaper_smith_1.ReaperSmith.Astorias], save.reaper_affinity[reaper_smith_1.ReaperSmith.Beigarth], save.reaper_affinity[reaper_smith_1.ReaperSmith.CoryIronbender], save.reaper_affinity[reaper_smith_1.ReaperSmith.Fulgurorn], save.reaper_affinity[reaper_smith_1.ReaperSmith.Hagan], save.reaper_affinity[reaper_smith_1.ReaperSmith.Smaloron]);
        }
        else {
            reaper.baseReaperAffinity = save.reaper_affinity[reaper.smith.id];
        }
        if (reaper.id === 90 && reaper.primordial) {
            reaper.baseEffectAffinity = save.reaper_affinity[reaper_smith_1.ReaperSmith.Adrianne]
                + save.reaper_affinity[reaper_smith_1.ReaperSmith.Astorias]
                + save.reaper_affinity[reaper_smith_1.ReaperSmith.Beigarth]
                + save.reaper_affinity[reaper_smith_1.ReaperSmith.CoryIronbender]
                + save.reaper_affinity[reaper_smith_1.ReaperSmith.Fulgurorn]
                + save.reaper_affinity[reaper_smith_1.ReaperSmith.Hagan]
                + save.reaper_affinity[reaper_smith_1.ReaperSmith.Smaloron];
        }
        else {
            reaper.baseEffectAffinity = reaper.baseReaperAffinity;
        }
        this.slormancerReaperService.updateReaperModel(reaper);
        this.slormancerReaperService.updateReaperView(reaper);
        return reaper;
    }
    getRunesCombination(save, heroClass, reaperId) {
        let result = { activation: null, effect: null, enhancement: null };
        for (let i = 0; i < save.reaper_runes.length; i++) {
            const saveRune = save.reaper_runes[i];
            if (saveRune && saveRune.obtained && saveRune.equipped[heroClass]) {
                const rune = this.slormancerRuneService.getRuneById(i, heroClass, saveRune.level, reaperId);
                if (rune !== null) {
                    if (rune.type === rune_type_1.RuneType.Activation) {
                        result.activation = rune;
                    }
                    else if (rune.type === rune_type_1.RuneType.Effect) {
                        result.effect = rune;
                    }
                    else if (rune.type === rune_type_1.RuneType.Enhancement) {
                        result.enhancement = rune;
                    }
                }
            }
        }
        return result;
    }
    getEquippedUltimatum(save, heroClass, bonusLevel) {
        let result = null;
        const equippedIndex = save.ultimatums.findIndex(ultimatum => ultimatum.equipped[heroClass]);
        if (equippedIndex !== -1) {
            result = this.slormancerUltimatumService.getUltimatum(equippedIndex, save.ultimatums[equippedIndex].level, bonusLevel);
        }
        return result;
    }
    getAncestralLegacies(ranks = []) {
        return this.slormancerDataService.getGameDataAncestralLegacyIds()
            .map(id => this.slormancerAncestralLegacyService.getAncestralLegacy(id, (0, utils_1.valueOrDefault)(ranks[id], 0)))
            .filter(utils_1.isNotNullOrUndefined);
    }
    getActiveNodes(equipped = []) {
        return Object.entries(equipped)
            .filter(([key, equiped]) => equiped === 1)
            .map(([key, equiped]) => parseInt(key));
    }
    getFirstNode(equipped = []) {
        const firstNode = equipped.findIndex(equiped => equiped === 2);
        return firstNode === -1 ? null : firstNode;
    }
    getCharacterGear(character) {
        return [
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
            character.gear.shoulder
        ].filter(utils_1.isNotNullOrUndefined);
    }
    getSkill(skillId, skills) {
        let result = null;
        if (skillId !== -1) {
            const skill = skills.map(skill => skill.skill).find(skill => skill.id === skillId);
            if (skill) {
                result = skill;
            }
        }
        return result;
    }
    getActivableFromActivable(activable, character) {
        let result = null;
        if (activable !== null) {
            const id = activable['isActivable'] !== undefined ? activable.id : activable.id + 200;
            result = this.getActivable(id, character);
        }
        return result;
    }
    getActivable(activableId, character) {
        let result = null;
        if (activableId !== -1) {
            if (activableId >= 200) {
                const realId = activableId - 200;
                let activable = this.getCharacterGear(character)
                    .map(item => item.legendaryEffect !== null ? item.legendaryEffect.activable : null)
                    .find(activable => activable !== null && activable.id === realId);
                if (activable) {
                    result = activable;
                }
                else {
                    const otherActivables = [
                        character.runes.activation?.activable,
                        character.runes.effect?.activable,
                        character.runes.enhancement?.activable,
                        ...character.reaper.activables
                    ]
                        .filter(utils_1.isNotNullOrUndefined);
                    const foundActivable = otherActivables.find(activable => activable.id === realId);
                    if (foundActivable) {
                        result = foundActivable;
                    }
                }
            }
            else if (character.ancestralLegacies.activeAncestralLegacies.indexOf(activableId) !== -1) {
                const activable = character.ancestralLegacies.ancestralLegacies
                    .find(ancestralLegacy => ancestralLegacy.id === activableId);
                if (activable) {
                    result = activable;
                }
            }
        }
        return result;
    }
    getHeroLevel(experience) {
        const xpPerLevel = this.slormancerDataService.getDataHeroNextLevelExperience();
        let level = 1;
        for (const nextLevel of xpPerLevel) {
            if (experience >= nextLevel) {
                level++;
                experience = experience - nextLevel;
            }
        }
        return level;
    }
    getSharedInventory(sharedInventory, heroClass) {
        const result = [];
        const items = sharedInventory.items.map(item => this.getItem(item, heroClass));
        for (let i = 0, length = items.length; i < length; i += common_1.STASH_SIZE) {
            const stash = items.slice(i, i + common_1.STASH_SIZE);
            if (stash.length === common_1.STASH_SIZE) {
                result.push(stash);
            }
        }
        return result;
    }
    getCharacterClone(character) {
        const result = {
            ...character,
            reaper: this.slormancerReaperService.getReaperClone(character.reaper),
            runes: {
                activation: character.runes.activation === null ? null : this.slormancerRuneService.getRuneClone(character.runes.activation),
                effect: character.runes.effect === null ? null : this.slormancerRuneService.getRuneClone(character.runes.effect),
                enhancement: character.runes.enhancement === null ? null : this.slormancerRuneService.getRuneClone(character.runes.enhancement),
            },
            ancestralLegacies: {
                ancestralLegacies: character.ancestralLegacies.ancestralLegacies.map(ancestralLegacy => this.slormancerAncestralLegacyService.getAncestralLegacyClone(ancestralLegacy)),
                activeNodes: [...character.ancestralLegacies.activeNodes],
                activeFirstNode: character.ancestralLegacies.activeFirstNode,
                activeAncestralLegacies: [...character.ancestralLegacies.activeAncestralLegacies],
                investedSlorm: character.ancestralLegacies.investedSlorm,
            },
            skills: character.skills.map(skill => this.getSkillsClone(skill)),
            gear: {
                helm: character.gear.helm === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.helm),
                body: character.gear.body === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.body),
                shoulder: character.gear.shoulder === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.shoulder),
                bracer: character.gear.bracer === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.bracer),
                glove: character.gear.glove === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.glove),
                boot: character.gear.boot === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.boot),
                ring_l: character.gear.ring_l === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.ring_l),
                ring_r: character.gear.ring_r === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.ring_r),
                amulet: character.gear.amulet === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.amulet),
                belt: character.gear.belt === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.belt),
                cape: character.gear.cape === null ? null : this.slormancerItemservice.getEquipableItemClone(character.gear.cape),
            },
            inventory: character.inventory.map(item => item === null ? null : this.slormancerItemservice.getEquipableItemClone(item)),
            sharedInventory: character.sharedInventory.map(items => items.map(item => item === null ? null : this.slormancerItemservice.getEquipableItemClone(item))),
            attributes: {
                remainingPoints: 0,
                maxPoints: 0,
                allocated: {
                    [attribute_1.Attribute.Toughness]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Toughness, character.attributes.allocated[attribute_1.Attribute.Toughness].baseRank),
                    [attribute_1.Attribute.Savagery]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Savagery, character.attributes.allocated[attribute_1.Attribute.Savagery].baseRank),
                    [attribute_1.Attribute.Fury]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Fury, character.attributes.allocated[attribute_1.Attribute.Fury].baseRank),
                    [attribute_1.Attribute.Determination]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Determination, character.attributes.allocated[attribute_1.Attribute.Determination].baseRank),
                    [attribute_1.Attribute.Zeal]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Zeal, character.attributes.allocated[attribute_1.Attribute.Zeal].baseRank),
                    [attribute_1.Attribute.Willpower]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Willpower, character.attributes.allocated[attribute_1.Attribute.Willpower].baseRank),
                    [attribute_1.Attribute.Dexterity]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Dexterity, character.attributes.allocated[attribute_1.Attribute.Dexterity].baseRank),
                    [attribute_1.Attribute.Bravery]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Bravery, character.attributes.allocated[attribute_1.Attribute.Bravery].baseRank),
                }
            },
            primarySkill: null,
            secondarySkill: null,
            supportSkill: null,
            activable1: null,
            activable2: null,
            activable3: null,
            activable4: null
        };
        result.primarySkill = (0, utils_1.valueOrNull)(result.skills.map(skill => skill.skill).find(skill => character.primarySkill !== null && skill.id === character.primarySkill.id));
        result.secondarySkill = (0, utils_1.valueOrNull)(result.skills.map(skill => skill.skill).find(skill => character.secondarySkill !== null && skill.id === character.secondarySkill.id));
        result.supportSkill = (0, utils_1.valueOrNull)(result.skills.map(skill => skill.skill).find(skill => character.supportSkill !== null && skill.id === character.supportSkill.id));
        result.activable1 = this.getActivableFromActivable(character.activable1, result);
        result.activable2 = this.getActivableFromActivable(character.activable2, result);
        result.activable3 = this.getActivableFromActivable(character.activable3, result);
        result.activable4 = this.getActivableFromActivable(character.activable4, result);
        return result;
    }
    getCharacterFromSave(save, heroClass) {
        const start = new Date().getTime();
        const inventory = save.inventory[heroClass];
        const element_rank = save.element_rank[heroClass];
        const skill_equip = save.skill_equip[heroClass];
        const skill_rank = save.skill_rank[heroClass];
        const traits = save.traits[heroClass];
        const auras = save.auras[heroClass];
        const xp = save.xp[heroClass];
        const reaper = this.getEquippedReaper(save, heroClass);
        const gear = {
            helm: this.getItem((0, utils_1.valueOrNull)(inventory.helm), heroClass),
            body: this.getItem((0, utils_1.valueOrNull)(inventory.body), heroClass),
            shoulder: this.getItem((0, utils_1.valueOrNull)(inventory.shoulder), heroClass),
            bracer: this.getItem((0, utils_1.valueOrNull)(inventory.bracer), heroClass),
            glove: this.getItem((0, utils_1.valueOrNull)(inventory.glove), heroClass),
            boot: this.getItem((0, utils_1.valueOrNull)(inventory.boot), heroClass),
            ring_l: this.getItem((0, utils_1.valueOrNull)(inventory.ring_l), heroClass),
            ring_r: this.getItem((0, utils_1.valueOrNull)(inventory.ring_r), heroClass),
            amulet: this.getItem((0, utils_1.valueOrNull)(inventory.amulet), heroClass),
            belt: this.getItem((0, utils_1.valueOrNull)(inventory.belt), heroClass),
            cape: this.getItem((0, utils_1.valueOrNull)(inventory.cape), heroClass)
        };
        const ultimatumBonusLevel = (0, utils_1.getOlorinUltimatumBonusLevel)(gear);
        const character = this.getCharacter(heroClass, this.getHeroLevel(xp), save.version, save.original_version, null, reaper, this.getRunesCombination(save, heroClass, reaper.id), this.getEquippedUltimatum(save, heroClass, ultimatumBonusLevel), this.getActiveNodes(save.element_equip[heroClass]), this.getFirstNode(save.element_equip[heroClass]), element_rank, skill_equip, skill_rank, gear.helm, gear.body, gear.shoulder, gear.bracer, gear.glove, gear.boot, gear.ring_l, gear.ring_r, gear.amulet, gear.belt, gear.cape, inventory.bag.map(item => this.getItem(item, heroClass)), this.getSharedInventory(save.shared_inventory, heroClass), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Toughness], 0)), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Savagery], 0)), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Fury], 0)), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Determination], 0)), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Zeal], 0)), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Willpower], 0)), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Dexterity], 0)), Math.max(0, (0, utils_1.valueOrDefault)(traits[attribute_1.Attribute.Bravery], 0)), skill_equip.indexOf(2), skill_equip.indexOf(3), skill_equip.indexOf(4), (0, utils_1.valueOrDefault)(auras[0], -1), (0, utils_1.valueOrDefault)(auras[1], -1), (0, utils_1.valueOrDefault)(auras[2], -1), (0, utils_1.valueOrDefault)(auras[3], -1), false);
        const time = new Date().getTime() - start;
        console.log('Character built from save in ' + time + ' milliseconds');
        return character;
    }
    getReaperLevelFromSave(save, heroClass, reaperId, primordial) {
        const reaperData = (0, utils_1.valueOrNull)(save.weapon_data[heroClass][reaperId]);
        let level = 0;
        if (reaperData !== null) {
            const experience = reaperData.primordial.experience + reaperData.basic.experience;
            level = this.slormancerReaperService.getReaperLevel(experience);
        }
        return level;
    }
    isReaperObtained(save, heroClass, reaperId, primordial) {
        const reaperData = (0, utils_1.valueOrNull)(save.weapon_data[heroClass][reaperId]);
        let obtained = false;
        if (reaperData !== null) {
            obtained = primordial ? reaperData.primordial.obtained : reaperData.basic.obtained;
        }
        return obtained;
    }
    getConfigFromSave(save) {
        const config = {};
        for (const heroClass of [hero_class_1.HeroClass.Warrior, hero_class_1.HeroClass.Huntress, hero_class_1.HeroClass.Mage]) {
            for (const reaperId of common_1.UNITY_REAPERS) {
                config['unity_level_' + heroClass + '_' + reaperId] = this.isReaperObtained(save, heroClass, reaperId, false) ? this.getReaperLevelFromSave(save, heroClass, reaperId, false) : 0;
                config['unity_level_' + heroClass + '_' + reaperId + '_p'] = this.isReaperObtained(save, heroClass, reaperId, true) ? this.getReaperLevelFromSave(save, heroClass, reaperId, true) : 0;
            }
        }
        return config;
    }
    getCharacter(heroClass, level = common_1.MAX_HERO_LEVEL, version = common_1.GAME_VERSION, originalVersion = common_1.GAME_VERSION, importVersion = null, reaper = null, runes = { activation: null, effect: null, enhancement: null }, ultimatum = null, activeNodes = [], activeFirstNode = null, ancestralRanks = [], skillEquipped = [], skillRanks = [], helm = null, body = null, shoulder = null, bracer = null, glove = null, boot = null, ring_l = null, ring_r = null, amulet = null, belt = null, cape = null, inventory = null, sharedInventory = null, toughtness = 0, savagery = 0, fury = 0, determination = 0, zeal = 0, willpower = 0, dexterity = 0, bravery = 0, primarySkill = null, secondarySkill = null, supportSkill = null, activable1 = null, activable2 = null, activable3 = null, activable4 = null, fromCorrupted = false) {
        const skills = this.getSkills(heroClass, skillEquipped, skillRanks);
        if (reaper === null) {
            reaper = this.slormancerReaperService.getDefaultReaper(heroClass);
        }
        const character = {
            heroClass,
            version,
            originalVersion,
            importVersion,
            level,
            name: '',
            fullName: '',
            fromCorrupted,
            issues: [],
            reaper,
            runes,
            ancestralLegacies: {
                activeFirstNode,
                ancestralLegacies: this.getAncestralLegacies(ancestralRanks),
                activeNodes,
                activeAncestralLegacies: this.slormancerAncestralLegacyNodesService.getAncestralLegacyIds({ ancestralLegacies: { activeNodes, activeFirstNode } }),
                investedSlorm: 0,
            },
            skills,
            skillInvestedSlorm: 0,
            might: {
                ancestral: 0,
                skill: 0,
                investedAncestralLegacySlorm: null,
                investedSkillSlorm: null,
            },
            gear: {
                helm,
                body,
                shoulder,
                bracer,
                glove,
                boot,
                ring_l,
                ring_r,
                amulet,
                belt,
                cape
            },
            inventory: inventory === null ? (0, math_util_1.list)(common_1.INVENTORY_SIZE).map(() => null) : inventory,
            sharedInventory: sharedInventory === null ? (0, math_util_1.list)(common_1.STASH_TABS_COUNT).map(() => (0, math_util_1.list)(common_1.STASH_SIZE).map(() => null)) : sharedInventory,
            ultimatum,
            attributes: {
                remainingPoints: Math.max(0, level - toughtness - savagery - fury - determination - zeal - willpower - dexterity - bravery),
                maxPoints: level,
                allocated: {
                    [attribute_1.Attribute.Toughness]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Toughness, toughtness),
                    [attribute_1.Attribute.Savagery]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Savagery, savagery),
                    [attribute_1.Attribute.Fury]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Fury, fury),
                    [attribute_1.Attribute.Determination]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Determination, determination),
                    [attribute_1.Attribute.Zeal]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Zeal, zeal),
                    [attribute_1.Attribute.Willpower]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Willpower, willpower),
                    [attribute_1.Attribute.Dexterity]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Dexterity, dexterity),
                    [attribute_1.Attribute.Bravery]: this.slormancerAttributeService.getAttributeTraits(attribute_1.Attribute.Bravery, bravery),
                }
            },
            mechanics: [],
            classMechanics: [],
            primarySkill: null,
            secondarySkill: null,
            supportSkill: null,
            activable1: null,
            activable2: null,
            activable3: null,
            activable4: null,
            baseStats: [],
            stats: [],
        };
        character.primarySkill = primarySkill === null ? null : this.getSkill(primarySkill, skills);
        character.secondarySkill = secondarySkill === null ? null : this.getSkill(secondarySkill, skills);
        character.supportSkill = supportSkill === null ? null : this.getSkill(supportSkill, skills);
        character.activable1 = activable1 === null ? null : this.getActivable(activable1, character);
        character.activable2 = activable2 === null ? null : this.getActivable(activable2, character);
        character.activable3 = activable3 === null ? null : this.getActivable(activable3, character);
        character.activable4 = activable4 === null ? null : this.getActivable(activable4, character);
        return character;
    }
};
SlormancerCharacterBuilderService = __decorate([
    (0, core_1.Injectable)()
], SlormancerCharacterBuilderService);
exports.SlormancerCharacterBuilderService = SlormancerCharacterBuilderService;
//# sourceMappingURL=slormancer-character-builder.service.js.map