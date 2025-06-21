"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerItemService = void 0;
const core_1 = require("@angular/core");
const effect_value_upgrade_type_1 = require("../../model/content/enum/effect-value-upgrade-type");
const effect_value_value_type_1 = require("../../model/content/enum/effect-value-value-type");
const equipable_item_base_1 = require("../../model/content/enum/equipable-item-base");
const rarity_1 = require("../../model/content/enum/rarity");
const effect_value_util_1 = require("../../util/effect-value.util");
const utils_1 = require("../../util/utils");
let SlormancerItemService = class SlormancerItemService {
    constructor(slormancerTemplateService, slormancerTranslateService, slormancerItemValueService, slormancerLegendaryEffectService, slormancerItemAffixService, slormancerDataService) {
        this.slormancerTemplateService = slormancerTemplateService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.slormancerItemValueService = slormancerItemValueService;
        this.slormancerLegendaryEffectService = slormancerLegendaryEffectService;
        this.slormancerItemAffixService = slormancerItemAffixService;
        this.slormancerDataService = slormancerDataService;
        this.AFFIX_ORDER = ['life', 'mana', 'ret', 'cdr', 'crit', 'minion', 'atk_phy', 'atk_mag', 'def_dodge', 'def_mag', 'def_phy', 'adventure'];
        this.AFFIX_DEF_POSSIBLE = ['crit', 'ret', 'mana', 'cdr', 'life'];
        this.REAPER_ENCHANTMENT_LABEL = this.slormancerTranslateService.translate('tt_RP_roll_item');
        this.SKILL_ENCHANTMENT_LABEL = this.slormancerTranslateService.translate('tt_MA_roll_item');
        this.RARE_PREFIX = this.slormancerTranslateService.translate('RAR_loot_epic');
        this.GRAFTS_LABEL = this.slormancerTranslateService.translate('nether_grafts');
    }
    getEquipableItemBase(item) {
        let slot = equipable_item_base_1.EquipableItemBase.Helm;
        if (item !== null) {
            switch (item.slot) {
                case 0:
                    slot = equipable_item_base_1.EquipableItemBase.Helm;
                    break;
                case 1:
                    slot = equipable_item_base_1.EquipableItemBase.Body;
                    break;
                case 2:
                    slot = equipable_item_base_1.EquipableItemBase.Shoulder;
                    break;
                case 3:
                    slot = equipable_item_base_1.EquipableItemBase.Bracer;
                    break;
                case 4:
                    slot = equipable_item_base_1.EquipableItemBase.Glove;
                    break;
                case 5:
                    slot = equipable_item_base_1.EquipableItemBase.Boot;
                    break;
                case 6:
                    slot = equipable_item_base_1.EquipableItemBase.Ring;
                    break;
                case 7:
                    slot = equipable_item_base_1.EquipableItemBase.Amulet;
                    break;
                case 8:
                    slot = equipable_item_base_1.EquipableItemBase.Belt;
                    break;
                case 9:
                    slot = equipable_item_base_1.EquipableItemBase.Cape;
                    break;
                default:
                    console.error('Unexpected item slot ' + item.slot);
                    break;
            }
        }
        return slot;
    }
    isEquipableItem(item) {
        return item !== null && item.hasOwnProperty('slot');
    }
    isRessourceItem(item) {
        return item !== null && item.hasOwnProperty('quantity');
    }
    getItemName(item) {
        const resultFragments = [];
        if (item.legendaryEffect !== null) {
            resultFragments.push(item.legendaryEffect.name);
        }
        else {
            let genre = 'MS';
            const normalAffixes = item.affixes.filter(affix => affix.rarity === rarity_1.Rarity.Normal);
            if (normalAffixes.length > 0) {
                const baseAffixes = [
                    normalAffixes[0],
                    (0, utils_1.valueOrDefault)(normalAffixes[1], normalAffixes[0])
                ]
                    .map(data => data.primaryNameType)
                    .sort((a, b) => (0, utils_1.compare)(this.AFFIX_ORDER.indexOf(a), this.AFFIX_ORDER.indexOf(b)));
                const onDef = baseAffixes[1].startsWith('def') && this.AFFIX_DEF_POSSIBLE.indexOf(baseAffixes[0]) !== -1;
                const baseName = this.slormancerTranslateService.translate('PIECE_loot_' + item.base.toUpperCase() + '_' + baseAffixes[1]);
                const textAndGenre = this.slormancerTranslateService.splitTextAndGenre(baseName);
                resultFragments.push(textAndGenre.text);
                genre = textAndGenre.genre;
                const baseAdj = this.slormancerTranslateService.translate('NAME_loot_adj_' + baseAffixes[0] + (onDef ? '_ON_DEF' : ''), genre);
                resultFragments.unshift(baseAdj);
            }
            const magicAffixes = item.affixes.filter(affix => affix.rarity === rarity_1.Rarity.Magic);
            if (magicAffixes[0]) {
                resultFragments.push(this.slormancerTranslateService.translate('SUF_loot_suf_' + magicAffixes[0].craftedEffect.effect.stat));
            }
            const rareAffixes = item.affixes.filter(affix => affix.rarity === rarity_1.Rarity.Rare);
            if (rareAffixes[0]) {
                resultFragments.unshift(this.slormancerTranslateService.translate('PRE_loot_pre_' + rareAffixes[0].craftedEffect.effect.stat));
            }
            if (item.rarity === rarity_1.Rarity.Epic) {
                resultFragments.unshift(this.RARE_PREFIX);
            }
        }
        if (item.reinforcement > 0) {
            resultFragments.push('+' + item.reinforcement);
        }
        return resultFragments.join(' ');
    }
    getItemRarity(item) {
        const rarities = item.affixes.map(affix => affix.rarity);
        let rarity = rarity_1.Rarity.Normal;
        if (item.level > 100) {
            rarity = rarity_1.Rarity.Neither;
        }
        else if (item.legendaryEffect !== null) {
            rarity = rarity_1.Rarity.Legendary;
        }
        else if (rarities.indexOf(rarity_1.Rarity.Epic) !== -1) {
            rarity = rarity_1.Rarity.Epic;
        }
        else if (rarities.indexOf(rarity_1.Rarity.Rare) !== -1) {
            rarity = rarity_1.Rarity.Rare;
        }
        else if (rarities.indexOf(rarity_1.Rarity.Magic) !== -1) {
            rarity = rarity_1.Rarity.Magic;
        }
        return rarity;
    }
    getItemIcon(item) {
        let base = null;
        if (item.rarity === rarity_1.Rarity.Neither) {
            base = 'assets/img/icon/item/' + item.base + '/neither.png';
        }
        else if (item.legendaryEffect !== null) {
            base = item.legendaryEffect.itemIcon;
        }
        else {
            const affixes = item.affixes
                .filter(affix => affix.rarity === rarity_1.Rarity.Normal)
                .map(affix => affix.primaryNameType)
                .sort()
                .join('-');
            base = 'assets/img/icon/item/' + item.base + '/' + affixes + '.png';
        }
        return base;
    }
    getReaperEnchantmentByGameEnchantment(gameEnchantment) {
        return this.getReaperEnchantment(gameEnchantment.type, gameEnchantment.value);
    }
    getSkillEnchantmentByGameEnchantment(gameEnchantment) {
        return this.getSkillEnchantment(gameEnchantment.type, gameEnchantment.value);
    }
    getAttributeEnchantmentByGameEnchantment(gameEnchantment) {
        return this.getAttributeEnchantment(gameEnchantment.type, gameEnchantment.value);
    }
    getReaperEnchantmentClone(reaperEnchantment) {
        return { ...reaperEnchantment };
    }
    getReaperEnchantment(smith, value) {
        return {
            craftedReaperSmith: smith,
            craftableValues: this.slormancerItemValueService.computeReaperEnchantmentValues(),
            craftedValue: value,
            effect: (0, effect_value_util_1.effectValueVariable)(0, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement, false, '', effect_value_value_type_1.EffectValueValueType.Stat),
            label: '',
            icon: 'assets/img/icon/enchantment/reaper.png'
        };
    }
    getSkillEnchantmentClone(skillEnchantment) {
        return { ...skillEnchantment };
    }
    getSkillEnchantment(skillId, value) {
        return {
            craftedSkill: skillId,
            craftableValues: this.slormancerItemValueService.computeSkillEnchantmentValues(),
            craftedValue: value,
            effect: (0, effect_value_util_1.effectValueVariable)(0, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement, false, '', effect_value_value_type_1.EffectValueValueType.Stat),
            label: '',
            icon: ''
        };
    }
    getAttributeEnchantmentClone(attributeEnchantment) {
        return { ...attributeEnchantment };
    }
    getAttributeEnchantment(attribute, value) {
        return {
            craftedAttribute: attribute,
            craftableValues: this.slormancerItemValueService.computeAttributeEnchantmentValues(),
            craftedValue: value,
            effect: (0, effect_value_util_1.effectValueVariable)(0, 0, effect_value_upgrade_type_1.EffectValueUpgradeType.Reinforcement, false, '', effect_value_value_type_1.EffectValueValueType.Stat),
            label: '',
            icon: ''
        };
    }
    getEquipableItem(base, heroClass, level, affixes, reinforcement = 0, grafts = 0, legendaryEffect, reaperEnchantment, skillEnchantment, attributeEnchantment, defensivestatsMultiplier) {
        if (legendaryEffect !== null) {
            legendaryEffect.reinforcement = reinforcement;
        }
        const result = {
            base,
            affixes,
            legendaryEffect,
            level,
            reinforcement,
            grafts,
            reaperEnchantment,
            skillEnchantment,
            attributeEnchantment,
            heroClass,
            rarity: rarity_1.Rarity.Normal,
            name: '',
            baseLabel: '',
            rarityLabel: '',
            graftLabel: null,
            levelLabel: '',
            icon: '',
            itemIconBackground: ''
        };
        this.updateEquipableItemModel(result, defensivestatsMultiplier);
        this.updateEquipableItemView(result, defensivestatsMultiplier);
        return result;
    }
    getEmptyEquipableItem(base, heroClass, level, defensivestatsMultiplier) {
        const numberBasicstats = this.slormancerDataService.getBaseMaxBasicStat(base);
        const baseKey = (base === equipable_item_base_1.EquipableItemBase.Body ? 'ARMOR' : base.toUpperCase());
        const affixes = this.slormancerDataService.getGameDataStats()
            .filter(gameData => gameData.MIN_LEVEL < level && gameData[baseKey] === 'P')
            .slice(0, numberBasicstats)
            .map(gameData => this.slormancerItemAffixService.getAffixFromStat(gameData.REF, level, 0, rarity_1.Rarity.Normal, 1000))
            .filter(utils_1.isNotNullOrUndefined);
        const result = {
            base,
            affixes,
            legendaryEffect: null,
            level,
            reinforcement: 0,
            grafts: 0,
            reaperEnchantment: null,
            skillEnchantment: null,
            attributeEnchantment: null,
            heroClass,
            rarity: rarity_1.Rarity.Normal,
            name: '',
            baseLabel: '',
            rarityLabel: '',
            levelLabel: '',
            graftLabel: null,
            icon: '',
            itemIconBackground: ''
        };
        this.updateEquipableItemModel(result, defensivestatsMultiplier);
        this.updateEquipableItemView(result, defensivestatsMultiplier);
        return result;
    }
    getEquipableItemFromGame(item, heroClass, defensivestatsMultiplier) {
        const base = this.getEquipableItemBase(item);
        const affixes = item.affixes
            .filter(affix => affix.rarity !== 'L')
            .map(affix => this.slormancerItemAffixService.getAffix(affix, item.level, item.reinforcement))
            .filter(utils_1.isNotNullOrUndefined);
        const legendaryAffix = item.affixes.find(affix => affix.rarity === 'L');
        const reaperEnchantment = item.enchantments.find(c => c.target === 'RP');
        const skillEnchantment = item.enchantments.find(c => c.target === 'MA');
        const attributeEnchantment = item.enchantments.find(c => c.target === 'AT');
        const result = {
            base,
            affixes,
            legendaryEffect: legendaryAffix === undefined ? null : this.slormancerLegendaryEffectService.getLegendaryEffect(legendaryAffix, item.reinforcement, heroClass),
            level: item.level,
            reinforcement: item.reinforcement,
            grafts: item.grafts,
            reaperEnchantment: reaperEnchantment ? this.getReaperEnchantmentByGameEnchantment(reaperEnchantment) : null,
            skillEnchantment: skillEnchantment ? this.getSkillEnchantmentByGameEnchantment(skillEnchantment) : null,
            attributeEnchantment: attributeEnchantment ? this.getAttributeEnchantmentByGameEnchantment(attributeEnchantment) : null,
            heroClass,
            rarity: rarity_1.Rarity.Normal,
            name: '',
            baseLabel: '',
            rarityLabel: '',
            levelLabel: '',
            graftLabel: null,
            icon: '',
            itemIconBackground: ''
        };
        this.updateEquipableItemModel(result, defensivestatsMultiplier);
        this.updateEquipableItemView(result, defensivestatsMultiplier);
        return result;
    }
    updateEquipableItemModel(item, defensivestatsMultiplier) {
        item.rarity = this.getItemRarity(item);
        defensivestatsMultiplier = item.base === equipable_item_base_1.EquipableItemBase.Ring ? defensivestatsMultiplier : 0;
        for (const affix of item.affixes) {
            affix.itemLevel = item.level;
            affix.reinforcement = item.reinforcement;
            this.slormancerItemAffixService.updateAffix(affix, affix.rarity === rarity_1.Rarity.Defensive ? defensivestatsMultiplier : 0);
        }
        if (item.legendaryEffect !== null) {
            item.legendaryEffect.reinforcement = item.reinforcement;
            this.slormancerLegendaryEffectService.updateLegendaryEffectModel(item.legendaryEffect);
        }
        if (item.reaperEnchantment !== null) {
            const value = (0, utils_1.valueOrDefault)(item.reaperEnchantment.craftableValues[item.reaperEnchantment.craftedValue], 0);
            item.reaperEnchantment.effect.value = value;
        }
        if (item.skillEnchantment !== null) {
            const value = (0, utils_1.valueOrDefault)(item.skillEnchantment.craftableValues[item.skillEnchantment.craftedValue], 0);
            item.skillEnchantment.effect.value = value;
        }
        if (item.attributeEnchantment !== null) {
            const value = (0, utils_1.valueOrDefault)(item.attributeEnchantment.craftableValues[item.attributeEnchantment.craftedValue], 0);
            item.attributeEnchantment.effect.value = value;
        }
    }
    updateEquipableItemView(item, defensivestatsMultiplier) {
        item.name = this.getItemName(item);
        item.baseLabel = this.slormancerTranslateService.removeGenre(this.slormancerTranslateService.translate('PIECE_' + item.base));
        item.rarityLabel = this.slormancerTranslateService.translate('RAR_loot_' + item.rarity);
        item.icon = this.getItemIcon(item);
        item.levelLabel = this.slormancerTranslateService.translate('lvl') + '. ' + item.level;
        item.itemIconBackground = 'assets/img/background/bg-' + item.rarity + '.png';
        defensivestatsMultiplier = item.base === equipable_item_base_1.EquipableItemBase.Ring ? defensivestatsMultiplier : 0;
        for (const affix of item.affixes) {
            this.slormancerItemAffixService.updateAffix(affix, affix.rarity === rarity_1.Rarity.Defensive ? defensivestatsMultiplier : 0);
        }
        item.affixes.sort((a, b) => {
            const rarity = (0, utils_1.compareRarities)(a.rarity, b.rarity);
            return rarity === 0 ? (0, utils_1.compareString)(a.statLabel, b.statLabel) : rarity;
        });
        item.graftLabel = null;
        if (item.rarity === rarity_1.Rarity.Neither) {
            item.graftLabel = this.GRAFTS_LABEL + ' : ' + item.grafts;
        }
        if (item.legendaryEffect !== null) {
            this.slormancerLegendaryEffectService.updateLegendaryEffectView(item.legendaryEffect);
        }
        if (item.reaperEnchantment !== null) {
            item.reaperEnchantment.effect.stat = 'increased_reapersmith_' + item.reaperEnchantment.craftedReaperSmith + '_level';
            const smith = this.slormancerTranslateService.translate('weapon_reapersmith_' + item.reaperEnchantment.craftedReaperSmith);
            const min = (0, utils_1.valueOrDefault)((0, utils_1.firstValue)(item.reaperEnchantment.craftableValues), 0);
            const max = (0, utils_1.valueOrDefault)((0, utils_1.lastValue)(item.reaperEnchantment.craftableValues), 0);
            item.reaperEnchantment.label = this.slormancerTemplateService.getReaperEnchantmentLabel(this.REAPER_ENCHANTMENT_LABEL, item.reaperEnchantment.effect.value, min, max, smith);
        }
        if (item.skillEnchantment !== null) {
            item.skillEnchantment.effect.stat = 'increased_skill_' + item.skillEnchantment.craftedSkill + '_level';
            const skill = this.slormancerDataService.getGameDataSkill(item.heroClass, item.skillEnchantment.craftedSkill);
            const min = (0, utils_1.valueOrDefault)((0, utils_1.firstValue)(item.skillEnchantment.craftableValues), 0);
            const max = (0, utils_1.valueOrDefault)((0, utils_1.lastValue)(item.skillEnchantment.craftableValues), 0);
            item.skillEnchantment.label = this.slormancerTemplateService.getReaperEnchantmentLabel(this.SKILL_ENCHANTMENT_LABEL, item.skillEnchantment.effect.value, min, max, skill === null ? '??' : skill.EN_NAME);
            item.skillEnchantment.icon = 'assets/img/icon/enchantment/skill/' + item.heroClass + '/' + item.skillEnchantment.craftedSkill + '.png';
        }
        if (item.attributeEnchantment !== null) {
            item.attributeEnchantment.effect.stat = 'increased_attribute_' + item.attributeEnchantment.craftedAttribute + '_level';
            const attributeName = this.slormancerTranslateService.translate('character_trait_' + item.attributeEnchantment.craftedAttribute);
            const min = (0, utils_1.valueOrDefault)((0, utils_1.firstValue)(item.attributeEnchantment.craftableValues), 0);
            const max = (0, utils_1.valueOrDefault)((0, utils_1.lastValue)(item.attributeEnchantment.craftableValues), 0);
            item.attributeEnchantment.label = this.slormancerTemplateService.getReaperEnchantmentLabel(this.SKILL_ENCHANTMENT_LABEL, item.attributeEnchantment.effect.value, min, max, attributeName);
            item.attributeEnchantment.icon = 'assets/img/icon/enchantment/attribute/' + item.attributeEnchantment.craftedAttribute + '.png';
        }
    }
    getEquipableItemClone(item) {
        return {
            ...item,
            affixes: item.affixes.map(affix => this.slormancerItemAffixService.getAffixClone(affix)),
            reaperEnchantment: item.reaperEnchantment === null ? null : { ...item.reaperEnchantment },
            skillEnchantment: item.skillEnchantment === null ? null : { ...item.skillEnchantment },
            attributeEnchantment: item.attributeEnchantment === null ? null : { ...item.attributeEnchantment },
            legendaryEffect: item.legendaryEffect === null ? null : this.slormancerLegendaryEffectService.getLegendaryEffectClone(item.legendaryEffect)
        };
    }
    getDefensiveStatMultiplier(legendaryEffects) {
        let result = 0;
        const defendersTwin = legendaryEffects.find(legendaryEffect => legendaryEffect.id === 151);
        if (defendersTwin) {
            result = defendersTwin.effects[0]?.effect.displayValue;
        }
        return result;
    }
};
SlormancerItemService = __decorate([
    (0, core_1.Injectable)()
], SlormancerItemService);
exports.SlormancerItemService = SlormancerItemService;
//# sourceMappingURL=slormancer-item.service.js.map