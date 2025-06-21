"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerDataService = void 0;
const core_1 = require("@angular/core");
const data_activable_1 = require("../../constants/content/data/data-activable");
const data_ancestral_legacy_1 = require("../../constants/content/data/data-ancestral-legacy");
const data_attribute_mechanic_1 = require("../../constants/content/data/data-attribute-mechanic");
const data_base_max_basic_stat_1 = require("../../constants/content/data/data-base-max-basic-stat");
const data_equipable_item_1 = require("../../constants/content/data/data-equipable-item");
const data_hero_xp_1 = require("../../constants/content/data/data-hero-xp");
const data_keyword_name_1 = require("../../constants/content/data/data-keyword-name");
const data_legendary_1 = require("../../constants/content/data/data-legendary");
const data_legendary_base_1 = require("../../constants/content/data/data-legendary-base");
const data_reaper_1 = require("../../constants/content/data/data-reaper");
const data_rune_1 = require("../../constants/content/data/data-rune");
const data_skill_1 = require("../../constants/content/data/data-skill");
const data_skill_buff_1 = require("../../constants/content/data/data-skill-buff");
const data_skill_class_mechanic_id_1 = require("../../constants/content/data/data-skill-class-mechanic-id");
const data_template_mechanic_1 = require("../../constants/content/data/data-template-mechanic");
const data_translate_1 = require("../../constants/content/data/data-translate");
const game_data_1 = require("../../constants/content/game/game-data");
const equipable_item_base_1 = require("../../model/content/enum/equipable-item-base");
const rarity_1 = require("../../model/content/enum/rarity");
const skill_type_1 = require("../../model/content/skill-type");
const utils_1 = require("../../util/utils");
let SlormancerDataService = class SlormancerDataService {
    getGameDataStat(affix) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.STAT.find(stat => stat.REF_NB === affix.type));
    }
    getGameDataStatByRef(statValue) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.STAT.find(stat => stat.REF === statValue));
    }
    getGameDataStatByRefId(refId) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.STAT.find(stat => stat.REF_NB === refId));
    }
    getGameDataStats() {
        return game_data_1.GAME_DATA.STAT;
    }
    getGameDataAvailableReaper() {
        return game_data_1.GAME_DATA.REAPER.filter(stat => stat.EN_NAME !== '');
    }
    getGameDataAvailableLegendaries() {
        return game_data_1.GAME_DATA.LEGENDARY;
    }
    getGameDataReaper(id) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.REAPER.find(stat => stat.EN_NAME !== '' && stat.REF === id));
    }
    getGameDataReaperCount() {
        return game_data_1.GAME_DATA.REAPER.length;
    }
    getGameDataBuff(ref) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.BUFF.find(stat => stat.REF === ref));
    }
    getGameDataAttribute(ref) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.ATTRIBUTES.find(attribute => attribute.REF === ref));
    }
    getGameDataAttributes(attribute) {
        return game_data_1.GAME_DATA.ATTRIBUTES.filter(attr => attr.TRAIT === attribute);
    }
    getParentsGameDataReaper(id) {
        return game_data_1.GAME_DATA.REAPER.filter(stat => stat.EN_NAME !== '' && stat.EVOLVE_IN === id);
    }
    getGameDataSkill(heroClass, id) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.SKILL[heroClass].find(skill => skill.REF === id));
    }
    getGameDataSkills(heroClass) {
        return game_data_1.GAME_DATA.SKILL[heroClass];
    }
    getGameDataActiveSkills(heroClass) {
        return game_data_1.GAME_DATA.SKILL[heroClass]
            .filter(skill => skill.TYPE === skill_type_1.SkillType.Active || skill.TYPE === skill_type_1.SkillType.Support);
    }
    getGameDataSpecializationSkill(heroClass, id) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.SKILL[heroClass].find(skill => skill.TYPE === skill_type_1.SkillType.Spec && skill.REF === id));
    }
    getGameDataUpgradeIdsForSkill(skillId, heroClass) {
        return game_data_1.GAME_DATA.SKILL[heroClass]
            .filter(skill => skill.TYPE !== skill_type_1.SkillType.Active && skill.TYPE !== skill_type_1.SkillType.Support && skill.ACTIVE_BOX === skillId)
            .map(skill => skill.REF);
    }
    getDataSkillClassMechanicIdByName(heroClass, mechanicName) {
        return (0, utils_1.valueOrNull)(data_skill_class_mechanic_id_1.DATA_SKILL_CLASS_MECHANIC_ID[heroClass][mechanicName.toLowerCase()]);
    }
    getDataAttributeMechanic(attributeName) {
        return (0, utils_1.valueOrNull)(data_attribute_mechanic_1.DATA_ATTRIBUTE_MECHANIC[attributeName]);
    }
    getDataTemplateMechanic(templateName) {
        return (0, utils_1.valueOrNull)(data_template_mechanic_1.DATA_TEMPLATE_MECHANIC[templateName.toLowerCase()]);
    }
    getDataSkillBuff(buffName) {
        return (0, utils_1.valueOrNull)(data_skill_buff_1.DATA_SKILL_BUFF[buffName.toLowerCase()]);
    }
    getDataEquipableItem(type, base) {
        let result = null;
        const typeData = data_equipable_item_1.DATA_EQUIPABLE_ITEM[type];
        if (typeData !== undefined) {
            const data = typeData[base];
            if (data !== undefined) {
                result = data;
            }
        }
        return result;
    }
    getGameDataLegendary(id) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.LEGENDARY.find(leg => leg.REF === id));
    }
    getGameDataLegendaries() {
        return game_data_1.GAME_DATA.LEGENDARY;
    }
    getGameDataRune(id) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.RUNE.find(rune => rune.REF === id));
    }
    getGameDataRunes() {
        return game_data_1.GAME_DATA.RUNE;
    }
    getAncestralRealmColor(realm) {
        const gameData = (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.ANCESTRAL_LEGACY
            .find(ancestralLegacy => ancestralLegacy.REALM === realm));
        return gameData === null ? 0 : gameData.REALM_COLOR;
    }
    getAncestralRealmColors(realms) {
        const colors = game_data_1.GAME_DATA.ANCESTRAL_LEGACY
            .filter(ancestralLegacy => realms.includes(ancestralLegacy.REALM))
            .map(realm => realm.REALM_COLOR);
        return colors;
    }
    getAncestralLegacies() {
        return game_data_1.GAME_DATA.ANCESTRAL_LEGACY;
    }
    getGameDataAncestralLegacy(id) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.ANCESTRAL_LEGACY.find(ancestralLegacu => ancestralLegacu.REF === id));
    }
    getGameDataAncestralLegacyIds() {
        return game_data_1.GAME_DATA.ANCESTRAL_LEGACY.map(data => data.REF);
    }
    getTranslation(key) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.TRANSLATION.find(translation => translation.REF === key));
    }
    getDataLegendary(id) {
        return (0, utils_1.valueOrNull)(data_legendary_1.DATA_LEGENDARY[id]);
    }
    getDataReaper(id) {
        return (0, utils_1.valueOrNull)(data_reaper_1.DATA_REAPER[id]);
    }
    getDataRune(id) {
        return (0, utils_1.valueOrNull)(data_rune_1.DATA_RUNE[id]);
    }
    getDataSkill(heroClass, id) {
        return (0, utils_1.valueOrNull)(data_skill_1.DATA_SKILL[heroClass][id]);
    }
    getDataAncestralLegacy(ref) {
        return (0, utils_1.valueOrNull)(data_ancestral_legacy_1.DATA_ANCESTRAL_LEGACY[ref]);
    }
    getGameDataLegendaryActivableBasedOn(id) {
        const activable = game_data_1.GAME_DATA.ACTIVABLE
            .filter(activable => activable.BASED_ON === 'legendary')
            .find(activable => activable.ID_BASED_ON === id);
        return (0, utils_1.valueOrNull)(activable);
    }
    getGameDataReaperActivableBasedOn(id, primordial) {
        return game_data_1.GAME_DATA.ACTIVABLE
            .filter(activable => activable.BASED_ON === 'reaper' && activable.ID_BASED_ON === id && activable.ON_REAPER_PRIMORDIAL === primordial);
    }
    getGameDataActivable(id) {
        return (0, utils_1.valueOrNull)(game_data_1.GAME_DATA.ACTIVABLE.find(activable => activable.REF === id));
    }
    getDataActivable(id) {
        return (0, utils_1.valueOrNull)(data_activable_1.DATA_ACTIVABLE[id]);
    }
    getBaseFromLegendaryId(id) {
        return (0, utils_1.valueOrNull)(data_legendary_base_1.DATA_LEGENDARY_BASE[id]);
    }
    getKeywordName(keyword) {
        return (0, utils_1.valueOrNull)(data_keyword_name_1.DATA_KEYWORD_NAME[keyword]);
    }
    getDataTranslate(key) {
        return (0, utils_1.valueOrNull)(data_translate_1.DATA_TRANSLATE[key]);
    }
    getDataHeroNextLevelExperience() {
        return data_hero_xp_1.DATA_HERO_XP_NEXT_LEVEL;
    }
    getBaseMaxBasicStat(base) {
        return (0, utils_1.valueOrDefault)(data_base_max_basic_stat_1.DATA_BASE_MAX_BASIC_STATS[base], 0);
    }
    getAffixPossibleStats(base, rarity) {
        let stats = [];
        const key = base === equipable_item_base_1.EquipableItemBase.Body ? 'ARMOR' : base.toUpperCase();
        if (rarity === rarity_1.Rarity.Normal) {
            stats = game_data_1.GAME_DATA.STAT.filter(stat => stat[key] === 'P').map(stat => stat.REF);
        }
        else if (rarity === rarity_1.Rarity.Defensive) {
            stats = game_data_1.GAME_DATA.STAT.filter(stat => stat.CATEGORY === 'defensive').map(stat => stat.REF);
        }
        else if (rarity === rarity_1.Rarity.Magic || rarity === rarity_1.Rarity.Rare) {
            stats = game_data_1.GAME_DATA.STAT.filter(stat => stat[key] === 'S').map(stat => stat.REF);
        }
        else if (rarity === rarity_1.Rarity.Epic) {
            stats = game_data_1.GAME_DATA.STAT.map(stat => stat.REF);
        }
        return stats;
    }
};
SlormancerDataService = __decorate([
    (0, core_1.Injectable)()
], SlormancerDataService);
exports.SlormancerDataService = SlormancerDataService;
//# sourceMappingURL=slormancer-data.service.js.map