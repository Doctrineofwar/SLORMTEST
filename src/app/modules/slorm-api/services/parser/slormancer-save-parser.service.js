"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerSaveParserService = void 0;
const core_1 = require("@angular/core");
const common_1 = require("../../constants/common");
const save_attributes_1 = require("../../constants/parser/save-attributes");
const hero_class_1 = require("../../model/content/enum/hero-class");
const reaper_smith_1 = require("../../model/content/enum/reaper-smith");
const bytes_util_1 = require("../../util/bytes.util");
const parse_util_1 = require("../../util/parse.util");
const utils_1 = require("../../util/utils");
let SlormancerSaveParserService = class SlormancerSaveParserService {
    constructor(slormancerItemService) {
        this.slormancerItemService = slormancerItemService;
        this.KEYWORDS = [
            save_attributes_1.QUEST_LIST,
            save_attributes_1.TEMPLE_DATA,
            save_attributes_1.WEAPON_EQUIP,
            save_attributes_1.STATS_FETCHED,
            save_attributes_1.VERSION,
            save_attributes_1.TEMPLE_UPGRADES,
            save_attributes_1.SLORMITE_LIST,
            save_attributes_1.SHARED_INVENTORY,
            save_attributes_1.ULTIMATUMS,
            save_attributes_1.CORRUPTED_SLORM,
            save_attributes_1.MISSION_MATCH,
            save_attributes_1.LEVEL_CAP_PREVIOUS,
            save_attributes_1.FIRST_HERO,
            save_attributes_1.WEAPON_DATA,
            save_attributes_1.GAMEMODE,
            save_attributes_1.SKILL_EQUIP,
            save_attributes_1.HERO,
            save_attributes_1.MISSIONS,
            save_attributes_1.TEMPLE_BLESSING,
            save_attributes_1.DATE,
            save_attributes_1.STORE_REFRESH_LIST,
            save_attributes_1.TRAITS,
            save_attributes_1.REPUTATION,
            save_attributes_1.WRATH,
            save_attributes_1.SKILL_RANK,
            save_attributes_1.REAPER_PITY,
            save_attributes_1.GOLD,
            save_attributes_1.XP,
            save_attributes_1.INVENTORY,
            save_attributes_1.SLORM,
            save_attributes_1.INFLUENCE,
            save_attributes_1.ELEMENT_EQUIP,
            save_attributes_1.TUTORIALS,
            save_attributes_1.EQUIPMENT_LIST,
            save_attributes_1.ELEMENT_RANK,
            save_attributes_1.ENEMY_MATCH,
            save_attributes_1.AURAS,
            save_attributes_1.PROFILE,
            save_attributes_1.ENEMY_LEVEL,
            save_attributes_1.PURE_SLORM,
            save_attributes_1.REAPER_AFFINITY,
            save_attributes_1.REAPER_RUNES
        ];
    }
    parseStatsFetched(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), v => (0, parse_util_1.toNumberArray)(v)));
    }
    parseVersion(data) {
        return data;
    }
    parseSlormiteList(data) {
        return data;
    }
    parseSharedInventory(data) {
        const items = data.split(';').map(item => this.slormancerItemService.parseItem(item));
        return {
            materials: items.splice(0, 38),
            items
        };
    }
    parseFirstHero(data) {
        return data;
    }
    parseWeaponData(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), v => v.split(',').map((data, index) => (0, parse_util_1.toWeapon)(data, index))));
    }
    parseGameMode(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), v => v === '0' ? ['0'] : (0, parse_util_1.strictSplit)(v, ',', 71)));
    }
    parseSkillEquip(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toNumberArray));
    }
    parseHero(data) {
        return data;
    }
    parseMissions(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toNumberArray));
    }
    parseStoreRefreshList(data) {
        return data;
    }
    parseTraits(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toNumberArray));
    }
    parseReputation(data) {
        return data;
    }
    parseWrath(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.strictParseInt));
    }
    parseSkillRank(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toFloatArray));
    }
    parseReaperPity(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.strictParseInt));
    }
    parseGold(data) {
        return data;
    }
    parseXp(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.strictParseInt));
    }
    parseHeroInventory(items) {
        const parsedItems = items.map(item => this.slormancerItemService.parseItem(item));
        const equipment = parsedItems.splice(0, 11);
        return {
            helm: equipment[0],
            body: equipment[1],
            shoulder: equipment[2],
            bracer: equipment[3],
            glove: equipment[4],
            boot: equipment[5],
            ring_l: equipment[6],
            ring_r: equipment[7],
            amulet: equipment[8],
            belt: equipment[9],
            cape: equipment[10],
            bag: parsedItems
        };
    }
    parseUltimatum(ultimatum) {
        const [unlocked, level, equippedWarrior, equippedHuntress, equippedMage] = (0, parse_util_1.toNumberArray)(ultimatum, ',', 5);
        return {
            unlocked: unlocked === 1,
            level,
            equipped: {
                [hero_class_1.HeroClass.Warrior]: equippedWarrior === 1,
                [hero_class_1.HeroClass.Huntress]: equippedHuntress === 1,
                [hero_class_1.HeroClass.Mage]: equippedMage === 1
            }
        };
    }
    parseReaperRune(reaperRune) {
        const [obtained, level, equippedWarrior, equippedHuntress, equippedMage] = (0, parse_util_1.toNumberArray)(reaperRune, ',', 5);
        return {
            obtained: obtained === 1,
            level,
            equipped: {
                [hero_class_1.HeroClass.Warrior]: equippedWarrior === 1,
                [hero_class_1.HeroClass.Huntress]: equippedHuntress === 1,
                [hero_class_1.HeroClass.Mage]: equippedMage === 1
            }
        };
    }
    parseInventory(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), v => this.parseHeroInventory(v.split(';'))));
    }
    parseSlorm(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parseInt));
    }
    parseInfluence(data) {
        return data.split('|').map(parse_util_1.strictParseFloat);
    }
    parseElementEquip(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toNumberArray));
    }
    parseTutorials(data) {
        return data.split('|').map(parse_util_1.strictParseInt);
    }
    parseEquipmentList(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), v => v.split(';')));
    }
    parseElementRank(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toNumberArray));
    }
    parseEnemyMatch(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.strictParseInt));
    }
    parseAuras(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toNumberArray));
    }
    parseProfile(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.toFloatArray));
    }
    parseEnemyLevel(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.strictParseInt));
    }
    parseWeaponEquipped(data) {
        return (0, parse_util_1.toHeroes)((0, parse_util_1.mapHeroesArray)((0, parse_util_1.splitHeroesData)(data), parse_util_1.strictParseInt));
    }
    parseUltimatums(data) {
        return (0, utils_1.splitData)(data, '|').map(v => this.parseUltimatum(v));
    }
    parseReaperAffinities(data) {
        const affinities = (0, parse_util_1.strictSplit)(data, '|', 7).map(parse_util_1.strictParseInt);
        return {
            [reaper_smith_1.ReaperSmith.Astorias]: affinities[reaper_smith_1.ReaperSmith.Astorias],
            [reaper_smith_1.ReaperSmith.Adrianne]: affinities[reaper_smith_1.ReaperSmith.Adrianne],
            [reaper_smith_1.ReaperSmith.Beigarth]: affinities[reaper_smith_1.ReaperSmith.Beigarth],
            [reaper_smith_1.ReaperSmith.CoryIronbender]: affinities[reaper_smith_1.ReaperSmith.CoryIronbender],
            [reaper_smith_1.ReaperSmith.Smaloron]: affinities[reaper_smith_1.ReaperSmith.Smaloron],
            [reaper_smith_1.ReaperSmith.Fulgurorn]: affinities[reaper_smith_1.ReaperSmith.Fulgurorn],
            [reaper_smith_1.ReaperSmith.Hagan]: affinities[reaper_smith_1.ReaperSmith.Hagan],
            [reaper_smith_1.ReaperSmith.OhmAgad]: 0,
            [reaper_smith_1.ReaperSmith.ReapersmithBrotherhood]: 0,
        };
    }
    parseReaperRunes(data) {
        return (0, utils_1.splitData)(data, '|').map(v => this.parseReaperRune(v));
    }
    parseKeys(bytes) {
        let data = {};
        let keys = (0, bytes_util_1.bytesFindPositions)(bytes, this.KEYWORDS).map((pos, i) => ({ key: this.KEYWORDS[i], pos }))
            .filter(v => v.pos !== -1)
            .sort((a, b) => a.pos > b.pos ? 1 : (a.pos < b.pos ? -1 : 0));
        keys.forEach((key, index) => {
            const next = (0, utils_1.valueOrNull)(keys[index + 1]);
            let value = null;
            const min = key.pos + key.key.length;
            value = (0, bytes_util_1.slice)(bytes, min, next === null ? bytes.length - min : next.pos - min);
            data[(0, bytes_util_1.bytesToString)(key.key)] = (0, bytes_util_1.bytesToString)(value);
        });
        return data;
    }
    getOrFail(data, key) {
        const found = data[key];
        if (found === undefined) {
            throw new Error('No data found for key "' + key + '"');
        }
        return found;
    }
    getBytes(content) {
        const [data] = content.split('#', 2);
        return (0, bytes_util_1.toBytes)(data);
    }
    normalizeSave(data) {
        const version = this.parseVersion(this.getOrFail(data, 'version'));
        if (version === '0.2.152') {
            data['level_cap_previous'] = '';
            data['mission_match'] = '';
            data['ultimatums'] = new Array(15).fill([0, 0, 0, 0, 0].join(',')).join('|');
        }
    }
    parseSaveFile(content) {
        const [data, hash] = content.split('#', 2);
        const bytes = (0, bytes_util_1.toBytes)(data);
        const parsedData = this.parseKeys(bytes);
        this.normalizeSave(parsedData);
        console.log(parsedData);
        return {
            stats_fetched: this.parseStatsFetched(this.getOrFail(parsedData, 'stats_fetched')),
            original_version: this.parseVersion(this.getOrFail(parsedData, 'version')),
            version: common_1.GAME_VERSION,
            slormite_list: this.parseSlormiteList(this.getOrFail(parsedData, 'slormite_list')),
            shared_inventory: this.parseSharedInventory(this.getOrFail(parsedData, 'shared_inventory')),
            first_hero: this.parseFirstHero(this.getOrFail(parsedData, 'first_hero')),
            weapon_data: this.parseWeaponData(this.getOrFail(parsedData, 'weapon_data')),
            gamemode: this.parseGameMode(this.getOrFail(parsedData, 'gamemode')),
            skill_equip: this.parseSkillEquip(this.getOrFail(parsedData, 'skill_equip')),
            hero: this.parseHero(this.getOrFail(parsedData, 'hero')),
            missions: this.parseMissions(this.getOrFail(parsedData, 'missions')),
            store_refresh_list: this.parseStoreRefreshList(this.getOrFail(parsedData, 'store_refresh_list')),
            traits: this.parseTraits(this.getOrFail(parsedData, 'traits')),
            reputation: this.parseReputation(this.getOrFail(parsedData, 'reputation')),
            wrath: this.parseWrath(this.getOrFail(parsedData, 'wrath')),
            skill_rank: this.parseSkillRank(this.getOrFail(parsedData, 'skill_rank')),
            ultimatums: this.parseUltimatums(this.getOrFail(parsedData, 'ultimatums')),
            reaper_pity: this.parseReaperPity(this.getOrFail(parsedData, 'reaper_pity')),
            reaper_affinity: this.parseReaperAffinities(this.getOrFail(parsedData, 'reaper_affinity')),
            reaper_runes: this.parseReaperRunes(this.getOrFail(parsedData, 'reaper_runes')),
            gold: this.parseGold(this.getOrFail(parsedData, 'gold')),
            xp: this.parseXp(this.getOrFail(parsedData, 'xp')),
            inventory: this.parseInventory(this.getOrFail(parsedData, 'inventory')),
            slorm: this.parseSlorm(this.getOrFail(parsedData, 'slorm')),
            influence: this.parseInfluence(this.getOrFail(parsedData, 'influence')),
            element_equip: this.parseElementEquip(this.getOrFail(parsedData, 'element_equip')),
            tutorials: this.parseTutorials(this.getOrFail(parsedData, 'tutorials')),
            equipment_list: this.parseEquipmentList(this.getOrFail(parsedData, 'equipment_list')),
            element_rank: this.parseElementRank(this.getOrFail(parsedData, 'element_rank')),
            enemy_match: this.parseEnemyMatch(this.getOrFail(parsedData, 'enemy_match')),
            auras: this.parseAuras(this.getOrFail(parsedData, 'auras')),
            profile: this.parseProfile(this.getOrFail(parsedData, 'profile')),
            enemy_level: this.parseEnemyLevel(this.getOrFail(parsedData, 'enemy_level')),
            weapon_equip: this.parseWeaponEquipped(this.getOrFail(parsedData, 'weapon_equip')),
            hash: hash
        };
    }
};
SlormancerSaveParserService = __decorate([
    (0, core_1.Injectable)()
], SlormancerSaveParserService);
exports.SlormancerSaveParserService = SlormancerSaveParserService;
//# sourceMappingURL=slormancer-save-parser.service.js.map