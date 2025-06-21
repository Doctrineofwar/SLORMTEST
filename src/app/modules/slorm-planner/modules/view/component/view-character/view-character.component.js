"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewCharacterComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const _slorm_api_1 = require("@slorm-api");
// TODO
// trouver formules réductions défenses
let ViewCharacterComponent = class ViewCharacterComponent {
    constructor(activatedRoute, router, buildStorageService, buildService, slormancerCharacterUpdaterService, slormancerDpsService, slormancerTranslateService) {
        this.router = router;
        this.buildStorageService = buildStorageService;
        this.buildService = buildService;
        this.slormancerCharacterUpdaterService = slormancerCharacterUpdaterService;
        this.slormancerDpsService = slormancerDpsService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.ALL_ATTRIBUTES = _slorm_api_1.ALL_ATTRIBUTES;
        this.showSummary = true;
        this.combatBuffControl = new forms_1.FormControl(false);
        const sharedData = activatedRoute.snapshot.data['sharedData'];
        this.character = sharedData.character;
        this.defaultConfig = { ..._slorm_api_1.DEFAULT_CONFIG };
        this.combatConfig = { ..._slorm_api_1.COMBAT_CONFIG };
        if (sharedData.configuration !== null) {
            this.defaultConfig = { ...this.defaultConfig, ...sharedData.configuration };
            this.combatConfig = { ...this.combatConfig, ...sharedData.configuration };
        }
        this.config = this.defaultConfig;
        this.combatBuffControl.valueChanges.subscribe(() => this.updateConfiguration());
        this.updateConfiguration();
        this.SKILL_MIGHT_LABEL = this.slormancerTranslateService.translate('bonus_raw_damage');
        this.ANCESTRAL_MIGHT_LABEL = this.slormancerTranslateService.translate('bonus_elemental_damage');
        this.PHYSICAL_DAMAGE_LABEL = this.slormancerTranslateService.translate('tt_physical_damage');
        this.ELEMENTAL_DAMAGE_LABEL = this.slormancerTranslateService.translate('tt_elemental_damage');
        this.MAX_LIFE_LABEL = this.slormancerTranslateService.translate('max_health');
        this.MAX_MANA_LABEL = this.slormancerTranslateService.translate('max_mana');
        this.MAX_ARMOR_LABEL = this.slormancerTranslateService.translate('armor');
        this.MAX_DODGE_LABEL = this.slormancerTranslateService.translate('dodge');
        this.MAX_ELEMENTAL_RESISTANCE_LABEL = this.slormancerTranslateService.translate('elemental_resist');
    }
    updateConfiguration() {
        this.config = this.combatBuffControl.value ? { ...this.combatConfig } : { ...this.defaultConfig };
        const highestManaCost = [
            this.character.primarySkill,
            this.character.secondarySkill,
            this.character.activable1,
            this.character.activable2,
            this.character.activable3,
            this.character.activable4
        ].filter(_slorm_api_1.isNotNullOrUndefined)
            .map(skill => 'manaCost' in skill ? skill.manaCost : skill.cost)
            .filter(_slorm_api_1.isNotNullOrUndefined);
        this.config.minimum_unreserved_mana = Math.max(...highestManaCost, 0);
        this.slormancerCharacterUpdaterService.updateCharacter(this.character, this.config);
    }
    getStat(stat) {
        let result = 0;
        const found = this.character.stats.find(mergedStat => mergedStat.stat === stat);
        if (found) {
            result = found.total;
        }
        return result;
    }
    valueToString(value) {
        return typeof value === 'number' ? value.toString() : value.min + '-' + value.max;
    }
    getPhysicalDamages() {
        const critChance = this.getStat('critical_chance');
        const critDamage = this.getStat('critical_damage');
        const brutChance = this.getStat('ancestral_chance');
        const brutDamage = this.getStat('ancestral_damage');
        const damages = this.getStat('physical_damage');
        return this.valueToString(Math.round(this.slormancerDpsService.getAverageHitDamage(damages, critChance, brutChance, critDamage, brutDamage)));
    }
    getElementalDamages() {
        const critChance = this.getStat('critical_chance');
        const critDamage = this.getStat('critical_damage');
        const brutChance = this.getStat('ancestral_chance');
        const brutDamage = this.getStat('ancestral_damage');
        const damages = this.getStat('elemental_damage');
        return this.valueToString(Math.round(this.slormancerDpsService.getAverageHitDamage(damages, critChance, brutChance, critDamage, brutDamage)));
    }
    getMaximumLife() {
        return this.valueToString(this.getStat('max_health'));
    }
    getMaximumMana() {
        return this.valueToString(this.getStat('max_mana'));
    }
    getArmor() {
        return this.valueToString(this.getStat('armor'));
    }
    getDodge() {
        return this.valueToString(this.getStat('dodge'));
    }
    getElementalResistance() {
        return this.valueToString(this.getStat('elemental_resist'));
    }
    getSkillUpgrades(skill) {
        let upgrades = [];
        const skillAndUpgrades = this.character.skills.find(s => s.skill === skill);
        if (skillAndUpgrades) {
            upgrades = skillAndUpgrades.upgrades.filter(upgrade => skillAndUpgrades.activeUpgrades.includes(upgrade.id));
        }
        return upgrades;
    }
    hasExtraPassives() {
        return this.getExtraPassives().length > 0;
    }
    getExtraPassives() {
        return this.character.skills.filter(skill => skill.skill.type === _slorm_api_1.SkillType.Support && skill.skill !== this.character.supportSkill)
            .map(skill => skill.upgrades.filter(upgrade => skill.activeUpgrades.includes(upgrade.id)))
            .flat();
    }
    getAncestralLegacies() {
        return this.character.ancestralLegacies.ancestralLegacies
            .filter(ancestralLegacy => this.character.ancestralLegacies.activeAncestralLegacies.includes(ancestralLegacy.id));
    }
    showAttribute(attribute) {
        const traits = this.character.attributes.allocated[attribute];
        return traits.rank > 0;
    }
    import() {
        const config = {
            ...this.config,
            maxed_upgrades: null
        };
        const build = this.buildService.createBuildWithCharacter('Imported build', 'Imported layer', this.character, config);
        this.buildStorageService.addBuild(build);
        this.router.navigate(['slorm-planner', 'build']);
    }
};
ViewCharacterComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-view-character',
        templateUrl: './view-character.component.html',
        styleUrls: ['./view-character.component.scss']
    })
], ViewCharacterComponent);
exports.ViewCharacterComponent = ViewCharacterComponent;
//# sourceMappingURL=view-character.component.js.map