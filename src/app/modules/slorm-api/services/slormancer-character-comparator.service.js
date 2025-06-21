"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlormancerCharacterComparatorService = void 0;
const core_1 = require("@angular/core");
const gear_slot_1 = require("../model/content/enum/gear-slot");
const hero_class_1 = require("../model/content/enum/hero-class");
const math_util_1 = require("../util/math.util");
const utils_1 = require("../util/utils");
let SlormancerCharacterComparatorService = class SlormancerCharacterComparatorService {
    constructor(slormancerTranslateService) {
        this.slormancerTranslateService = slormancerTranslateService;
    }
    buildCharacterStatDifference(left, right, name) {
        const leftAverageValue = typeof left === 'number' ? left : ((left.min + left.max) / 2);
        const rightAverageValue = typeof right === 'number' ? right : ((right.min + right.max) / 2);
        let difference = 0;
        if (leftAverageValue === 0) {
            difference = rightAverageValue > 0 ? Number.POSITIVE_INFINITY : rightAverageValue < 0 ? Number.NEGATIVE_INFINITY : 0;
        }
        else {
            difference = (0, math_util_1.round)(((rightAverageValue / leftAverageValue) - 1) * 100, 2);
        }
        return { name, left, difference, right };
    }
    addCharacterStatDifference(differences, left, right, stat) {
        const leftStat = left.stats.find(mergedStat => mergedStat.stat === stat);
        const rightStat = right.stats.find(mergedStat => mergedStat.stat === stat);
        const leftValue = leftStat ? leftStat.total : 0;
        const rightValue = rightStat ? rightStat.total : 0;
        differences.push(this.buildCharacterStatDifference(leftValue, rightValue, this.slormancerTranslateService.translate(stat)));
    }
    addSkillDps(differences, left, right) {
        if (left && right && left.skill.heroClass === right.skill.heroClass && left.skill.id === right.skill.id) {
            let leftDamages = left.skill.values.filter(value => (0, utils_1.isDamageType)(value.stat)).filter(utils_1.isEffectValueSynergy);
            let rightDamages = right.skill.values.filter(value => (0, utils_1.isDamageType)(value.stat)).filter(utils_1.isEffectValueSynergy);
            // Throwing sword
            if (left.skill.heroClass === hero_class_1.HeroClass.Warrior && left.skill.id === 5) {
                leftDamages = [left.skill.values[0]];
                rightDamages = [right.skill.values[0]];
                const leftBleedDamages = left.skill.values[1].displaySynergy;
                const rightBleedDamages = right.skill.values[1].displaySynergy;
                differences.push(this.buildCharacterStatDifference(leftBleedDamages, rightBleedDamages, this.slormancerTranslateService.translate('bleed_damage')));
            }
            // Cadence
            if (left.skill.heroClass === hero_class_1.HeroClass.Warrior && left.skill.id === 6) {
                leftDamages = [left.skill.values[0]];
                rightDamages = [right.skill.values[0]];
                const leftBleedDamages = left.skill.values[1].displaySynergy;
                const rightBleedDamages = right.skill.values[1].displaySynergy;
                differences.push(this.buildCharacterStatDifference(leftBleedDamages, rightBleedDamages, 'Magnified ' + left.skill.name));
            }
            // The Elder Lance
            if (left.skill.heroClass === hero_class_1.HeroClass.Warrior && left.skill.id === 10) {
                leftDamages = [left.skill.values[1]];
                rightDamages = [right.skill.values[1]];
                const leftBleedDamages = left.skill.values[0].displaySynergy;
                const rightBleedDamages = right.skill.values[0].displaySynergy;
                differences.push(this.buildCharacterStatDifference(leftBleedDamages, rightBleedDamages, 'Training Lance'));
            }
            // The Elder Lance
            if (left.skill.heroClass === hero_class_1.HeroClass.Mage && left.skill.id === 6) {
                leftDamages = [left.skill.values[0]];
                rightDamages = [right.skill.values[0]];
                const leftBleedDamages = left.skill.values[1].displaySynergy;
                const rightBleedDamages = right.skill.values[1].displaySynergy;
                differences.push(this.buildCharacterStatDifference(leftBleedDamages, rightBleedDamages, 'Rift Nova (distributed)'));
            }
            if (leftDamages.length > 0) {
                const leftDamagesValue = leftDamages.map(damage => damage.displaySynergy).reduce((t, v) => (0, math_util_1.add)(t, v), 0);
                const rightDamagesValue = rightDamages.map(damage => damage.displaySynergy).reduce((t, v) => (0, math_util_1.add)(t, v), 0);
                differences.push(this.buildCharacterStatDifference(leftDamagesValue, rightDamagesValue, left.skill.name));
            }
        }
    }
    addActivableDps(differences, left, right) {
        if (left && right && left.id === right.id) {
            const leftSynergyDamages = left.values.filter(value => (0, utils_1.isDamageType)(value.stat));
            const rightSynergyDamages = right.values.filter(value => (0, utils_1.isDamageType)(value.stat));
            if (leftSynergyDamages.length > 0 && rightSynergyDamages.length > 0) {
                const leftDamages = leftSynergyDamages
                    .reduce((total, value) => (0, math_util_1.add)(total, value.displaySynergy), 0);
                const rightDamages = rightSynergyDamages
                    .reduce((total, value) => (0, math_util_1.add)(total, value.displaySynergy), 0);
                differences.push(this.buildCharacterStatDifference(leftDamages, rightDamages, left.name));
            }
        }
    }
    addPassiveDamages(differences, left, right) {
        if (left && right && left.skill.heroClass === right.skill.heroClass && left.skill.id === right.skill.id) {
            const commonUpgrades = left.activeUpgrades.filter(upgrade => right.activeUpgrades.includes(upgrade));
            for (const commonUpgrade of commonUpgrades) {
                const leftUpgrade = left.upgrades.find(upgrade => upgrade.id === commonUpgrade);
                const rightUpgrade = right.upgrades.find(upgrade => upgrade.id === commonUpgrade);
                if (leftUpgrade && rightUpgrade) {
                    const leftSynergyDamage = leftUpgrade.values
                        .filter(value => (0, utils_1.isDamageType)(value.stat))
                        .reduce((total, value) => (0, math_util_1.add)(total, value.displaySynergy), 0);
                    const rightSynergyDamage = rightUpgrade.values
                        .filter(value => (0, utils_1.isDamageType)(value.stat))
                        .reduce((total, value) => (0, math_util_1.add)(total, value.displaySynergy), 0);
                    differences.push(this.buildCharacterStatDifference(leftSynergyDamage, rightSynergyDamage, leftUpgrade.name));
                }
            }
        }
    }
    addAdditionalDifferences(differences, left, right) {
        this.addCharacterStatDifference(differences, left, right, 'inner_fire_damage');
        this.addCharacterStatDifference(differences, left, right, 'overdrive_damage');
    }
    addReaperDamages(differences, left, right) {
        const leftSynergyDamages = [...left.templates.base, ...left.templates.benediction, ...left.templates.malediction]
            .map(effect => effect.values).flat()
            .filter(value => (0, utils_1.isDamageType)(value.stat))
            .map(value => value.displaySynergy);
        const rightSynergyDamages = [...right.templates.base, ...right.templates.benediction, ...right.templates.malediction]
            .map(effect => effect.values).flat()
            .filter(value => (0, utils_1.isDamageType)(value.stat))
            .map(value => value.displaySynergy);
        if (left.id === 46 && right.id === 46) {
            differences.push(this.buildCharacterStatDifference(leftSynergyDamages[0], rightSynergyDamages[0], 'Affliction'));
        }
        else if ([65, 66, 67].includes(left.id) && [65, 66, 67].includes(right.id)) {
            differences.push(this.buildCharacterStatDifference(leftSynergyDamages[0], rightSynergyDamages[0], 'Vindictive Slam'));
            if (left.primordial && right.primordial) {
                differences.push(this.buildCharacterStatDifference(leftSynergyDamages[1], rightSynergyDamages[1], 'Holy Ground'));
            }
        }
        else if ([78, 79, 80].includes(left.id) && [78, 79, 80].includes(right.id)) {
            differences.push(this.buildCharacterStatDifference(leftSynergyDamages[0], rightSynergyDamages[0], 'Exhaustion'));
        }
        else if ([81, 82, 83].includes(left.id) && [81, 82, 83].includes(right.id)) {
            differences.push(this.buildCharacterStatDifference(leftSynergyDamages[0], rightSynergyDamages[0], 'Crystal Shard'));
        }
        let commonActivableIds = left.activables
            .map(activable => activable.id)
            .filter(id => right.activables.some(activable => activable.id === id));
        for (const activableId of commonActivableIds) {
            const leftActivable = left.activables.find(activable => activable.id === activableId);
            const rightActivable = right.activables.find(activable => activable.id === activableId);
            if (leftActivable && rightActivable) {
                this.addActivableDps(differences, leftActivable, rightActivable);
            }
        }
    }
    addAncestralLegacyDamages(differences, left, right) {
        const commonIds = left.activeAncestralLegacies.filter(id => right.activeAncestralLegacies.includes(id));
        for (const commonId of commonIds) {
            const leftAncestralLegacy = left.ancestralLegacies[commonId];
            const rightAncestralLegacy = right.ancestralLegacies[commonId];
            if (leftAncestralLegacy && rightAncestralLegacy) {
                const leftSynergyDamages = leftAncestralLegacy.values
                    .filter(value => (0, utils_1.isDamageType)(value.stat))
                    .map(value => value.displaySynergy);
                const rightSynergyDamages = rightAncestralLegacy.values
                    .filter(value => (0, utils_1.isDamageType)(value.stat))
                    .map(value => value.displaySynergy);
                if (leftSynergyDamages.length > 0 && rightSynergyDamages.length > 0) {
                    differences.push(this.buildCharacterStatDifference(leftSynergyDamages[0], rightSynergyDamages[0], leftAncestralLegacy.name));
                }
            }
        }
    }
    addLegendariesDamages(differences, left, right) {
        const leftLegendaries = gear_slot_1.ALL_GEAR_SLOT_VALUES
            .map(slot => left.gear[slot]?.legendaryEffect)
            .filter(utils_1.isNotNullOrUndefined)
            .filter((effect, index, effects) => (0, utils_1.isFirst)(effect, index, effects, (a, b) => a.id === b.id));
        const rightLegendaries = gear_slot_1.ALL_GEAR_SLOT_VALUES
            .map(slot => right.gear[slot]?.legendaryEffect)
            .filter(utils_1.isNotNullOrUndefined)
            .filter((effect, index, effects) => (0, utils_1.isFirst)(effect, index, effects, (a, b) => a.id === b.id));
        let commonLegendaryIds = leftLegendaries
            .map(effect => effect.id)
            .filter(id => rightLegendaries.some(effect => effect.id === id));
        for (const commonId of commonLegendaryIds) {
            const leftLegendary = leftLegendaries.find(leftLegendary => leftLegendary.id === commonId);
            const rightLegendary = rightLegendaries.find(rightLegendary => rightLegendary.id === commonId);
            const leftSynergyDamages = leftLegendary.effects
                .filter(value => (0, utils_1.isDamageType)(value.effect.stat))
                .map(value => value.effect.displaySynergy);
            const rightSynergyDamages = rightLegendary.effects
                .filter(value => (0, utils_1.isDamageType)(value.effect.stat))
                .map(value => value.effect.displaySynergy);
            if (leftSynergyDamages.length > 0 && rightSynergyDamages.length > 0) {
                differences.push(this.buildCharacterStatDifference(leftSynergyDamages[0], rightSynergyDamages[0], leftLegendary.name));
            }
            this.addActivableDps(differences, leftLegendary.activable, rightLegendary.activable);
        }
    }
    compareCharacters(left, right) {
        let result = [];
        this.addCharacterStatDifference(result, left, right, 'max_health');
        this.addCharacterStatDifference(result, left, right, 'max_mana');
        this.addCharacterStatDifference(result, left, right, 'armor');
        this.addCharacterStatDifference(result, left, right, 'elemental_resist');
        this.addCharacterStatDifference(result, left, right, 'dodge');
        this.addCharacterStatDifference(result, left, right, 'elemental_damage');
        this.addCharacterStatDifference(result, left, right, 'physical_damage');
        let leftSkill = (0, utils_1.valueOrNull)(left.skills.find(skillAndUpgrade => skillAndUpgrade.skill === left.supportSkill));
        let rightSkill = (0, utils_1.valueOrNull)(right.skills.find(skillAndUpgrade => skillAndUpgrade.skill === right.supportSkill));
        this.addSkillDps(result, leftSkill, rightSkill);
        this.addPassiveDamages(result, leftSkill, rightSkill);
        leftSkill = (0, utils_1.valueOrNull)(left.skills.find(skillAndUpgrade => skillAndUpgrade.skill === left.primarySkill));
        rightSkill = (0, utils_1.valueOrNull)(right.skills.find(skillAndUpgrade => skillAndUpgrade.skill === right.primarySkill));
        this.addSkillDps(result, leftSkill, rightSkill);
        this.addPassiveDamages(result, leftSkill, rightSkill);
        leftSkill = (0, utils_1.valueOrNull)(left.skills.find(skillAndUpgrade => skillAndUpgrade.skill === left.secondarySkill));
        rightSkill = (0, utils_1.valueOrNull)(right.skills.find(skillAndUpgrade => skillAndUpgrade.skill === right.secondarySkill));
        this.addSkillDps(result, leftSkill, rightSkill);
        this.addPassiveDamages(result, leftSkill, rightSkill);
        this.addReaperDamages(result, left.reaper, right.reaper);
        this.addAncestralLegacyDamages(result, left.ancestralLegacies, right.ancestralLegacies);
        this.addLegendariesDamages(result, left, right);
        this.addAdditionalDifferences(result, left, right);
        return result
            .filter(difference => difference.difference !== 0)
            .sort((a, b) => -(0, utils_1.compare)(a.difference, b.difference));
    }
};
SlormancerCharacterComparatorService = __decorate([
    (0, core_1.Injectable)()
], SlormancerCharacterComparatorService);
exports.SlormancerCharacterComparatorService = SlormancerCharacterComparatorService;
//# sourceMappingURL=slormancer-character-comparator.service.js.map