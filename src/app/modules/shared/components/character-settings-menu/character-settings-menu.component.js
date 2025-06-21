"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterSettingsMenuComponent = void 0;
const core_1 = require("@angular/core");
const menu_1 = require("@angular/material/menu");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const character_level_edit_modal_component_1 = require("../character-level-edit-modal/character-level-edit-modal.component");
const item_reinforcement_edit_modal_component_1 = require("../item-reinforcement-edit-modal/item-reinforcement-edit-modal.component");
const optimize_items_affixes_modal_component_1 = require("../optimize-items-affixes-modal/optimize-items-affixes-modal.component");
let CharacterSettingsMenuComponent = class CharacterSettingsMenuComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, dialog, messageService, slormancerItemService) {
        super();
        this.buildStorageService = buildStorageService;
        this.dialog = dialog;
        this.messageService = messageService;
        this.slormancerItemService = slormancerItemService;
        this.character = null;
        this.menu = null;
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => this.character = layer === null ? null : layer.character);
    }
    openCharacterSettings() {
        if (this.menu !== null) {
            this.menu.openMenu();
        }
        return false;
    }
    editCharacterLevel() {
        if (this.character !== null) {
            this.dialog.open(character_level_edit_modal_component_1.CharacterLevelEditModalComponent, { data: { level: this.character.level } })
                .afterClosed().subscribe(level => {
                if (level && this.character !== null) {
                    this.character.level = level;
                    this.buildStorageService.saveLayer();
                }
            });
        }
    }
    getGearItems() {
        let result = [];
        const character = this.character;
        if (character !== null) {
            result = _slorm_api_1.ALL_GEAR_SLOT_VALUES.map(slot => character.gear[slot]).filter(_slorm_api_1.isNotNullOrUndefined);
        }
        return result;
    }
    hasItems() {
        return this.getGearItems().length > 0;
    }
    canOptimizeReaperEnchantements(character) {
        return character.reaper !== null && character.reaper.smith.id !== _slorm_api_1.ReaperSmith.ReapersmithBrotherhood;
    }
    optimizeReaperEnchantments() {
        if (this.character !== null) {
            const reaperEnchantment = this.slormancerItemService.getReaperEnchantment(this.character.reaper.smith.id, 5);
            this.getGearItems().forEach(item => {
                item.reaperEnchantment = this.slormancerItemService.getReaperEnchantmentClone(reaperEnchantment);
                const defensiveStatMultiplier = this.getDefensiveStatMultiplier();
                this.slormancerItemService.updateEquipableItemModel(item, defensiveStatMultiplier);
                this.slormancerItemService.updateEquipableItemView(item, defensiveStatMultiplier);
            });
            this.buildStorageService.saveLayer();
        }
    }
    getTraits() {
        let result = [];
        const character = this.character;
        if (character !== null) {
            result = _slorm_api_1.ALL_ATTRIBUTES.map(attribute => character.attributes.allocated[attribute]);
        }
        return result;
    }
    optimizeAttributeEnchantments(traits) {
        if (this.character !== null && this.character.reaper !== null) {
            const attributeEnchantment = this.slormancerItemService.getAttributeEnchantment(traits.attribute, 3);
            this.getGearItems().forEach(item => {
                item.attributeEnchantment = this.slormancerItemService.getAttributeEnchantmentClone(attributeEnchantment);
                const defensiveStatMultiplier = this.getDefensiveStatMultiplier();
                this.slormancerItemService.updateEquipableItemModel(item, defensiveStatMultiplier);
                this.slormancerItemService.updateEquipableItemView(item, defensiveStatMultiplier);
            });
            this.buildStorageService.saveLayer();
        }
    }
    getSkills() {
        let result = [];
        const character = this.character;
        if (character !== null) {
            result = character.skills.map(skillsAndPassives => skillsAndPassives.skill);
        }
        return result;
    }
    optimizeSkillEnchantments(skill) {
        if (this.character !== null) {
            const skillEnchantment = this.slormancerItemService.getSkillEnchantment(skill.id, 2);
            this.getGearItems().forEach(item => {
                item.skillEnchantment = this.slormancerItemService.getSkillEnchantmentClone(skillEnchantment);
                const defensiveStatMultiplier = this.getDefensiveStatMultiplier();
                this.slormancerItemService.updateEquipableItemModel(item, defensiveStatMultiplier);
                this.slormancerItemService.updateEquipableItemView(item, defensiveStatMultiplier);
            });
            this.buildStorageService.saveLayer();
        }
    }
    maximizeItemsLevel() {
        if (this.character !== null) {
            const level = this.character.level;
            this.getGearItems().forEach(item => {
                item.level = level;
                const defensiveStatMultiplier = this.getDefensiveStatMultiplier();
                this.slormancerItemService.updateEquipableItemModel(item, defensiveStatMultiplier);
                this.slormancerItemService.updateEquipableItemView(item, defensiveStatMultiplier);
            });
            this.buildStorageService.saveLayer();
        }
    }
    changeReinforcementLevel() {
        if (this.character !== null) {
            const maxReinforcement = Math.max(...this.getGearItems().map(item => item.reinforcement));
            this.dialog.open(item_reinforcement_edit_modal_component_1.ItemReinforcementEditModalComponent, { data: { reinforcement: maxReinforcement } })
                .afterClosed().subscribe(reinforcement => {
                if (typeof reinforcement === 'number') {
                    this.getGearItems().forEach(item => {
                        item.reinforcement = reinforcement;
                        const defensiveStatMultiplier = this.getDefensiveStatMultiplier();
                        this.slormancerItemService.updateEquipableItemModel(item, defensiveStatMultiplier);
                        this.slormancerItemService.updateEquipableItemView(item, defensiveStatMultiplier);
                    });
                    this.buildStorageService.saveLayer();
                }
            });
        }
    }
    optimizeItemsAffixes() {
        if (this.character !== null) {
            const data = { items: this.getGearItems() };
            this.dialog.open(optimize_items_affixes_modal_component_1.OptimizeItemsAffixesModalComponent, { data })
                .afterClosed().subscribe(changed => {
                if (changed) {
                    this.buildStorageService.saveLayer();
                    this.messageService.message('All equipped items have been updated');
                }
            });
        }
    }
    getDefensiveStatMultiplier() {
        return this.character === null
            ? 0
            : this.slormancerItemService.getDefensiveStatMultiplier((0, _slorm_api_1.getAllLegendaryEffects)(this.character.gear));
    }
};
__decorate([
    (0, core_1.ViewChild)(menu_1.MatMenuTrigger, { static: true })
], CharacterSettingsMenuComponent.prototype, "menu", void 0);
CharacterSettingsMenuComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-character-settings-menu',
        templateUrl: './character-settings-menu.component.html',
        styleUrls: ['./character-settings-menu.component.scss']
    })
], CharacterSettingsMenuComponent);
exports.CharacterSettingsMenuComponent = CharacterSettingsMenuComponent;
//# sourceMappingURL=character-settings-menu.component.js.map