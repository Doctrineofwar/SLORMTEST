"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsSkillsComponent = void 0;
const core_1 = require("@angular/core");
const menu_1 = require("@angular/material/menu");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const _slorm_api_1 = require("@slorm-api");
let SettingsSkillsComponent = class SettingsSkillsComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, slormancerSkillService, slormancerCharacterModifierService) {
        super();
        this.buildStorageService = buildStorageService;
        this.slormancerSkillService = slormancerSkillService;
        this.slormancerCharacterModifierService = slormancerCharacterModifierService;
        this.selectedSkill = null;
        this.menu = null;
    }
    ngOnInit() { }
    openSettings() {
        if (this.menu !== null) {
            this.menu.openMenu();
        }
        return false;
    }
    isSupport(skill) {
        return skill.skill.type === _slorm_api_1.SkillType.Support;
    }
    maximize(skill) {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            skill.skill.baseLevel = skill.skill.maxLevel;
            this.slormancerSkillService.updateSkillModel(skill.skill);
            for (const upgrade of skill.upgrades) {
                upgrade.baseRank = upgrade.maxRank;
                this.slormancerSkillService.updateUpgradeModel(upgrade);
            }
            this.buildStorageService.saveLayer();
        }
    }
    equipSupport(skill) {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            if (this.slormancerCharacterModifierService.setSupportSkill(layer.character, skill.skill)) {
                this.buildStorageService.saveLayer();
            }
        }
    }
    equipPrimary(skill) {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            if (this.slormancerCharacterModifierService.setPrimarySkill(layer.character, skill.skill)) {
                this.buildStorageService.saveLayer();
            }
        }
    }
    equipSecondary(skill) {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            if (this.slormancerCharacterModifierService.setSecondarySkill(layer.character, skill.skill)) {
                this.buildStorageService.saveLayer();
            }
        }
    }
    isEquippedSupportSkill(skill) {
        const layer = this.buildStorageService.getLayer();
        return layer !== null && layer.character.supportSkill === skill.skill;
    }
    isEquippedPrimarySkill(skill) {
        const layer = this.buildStorageService.getLayer();
        return layer !== null && layer.character.primarySkill === skill.skill;
    }
    isEquippedSecondarySkill(skill) {
        const layer = this.buildStorageService.getLayer();
        return layer !== null && layer.character.secondarySkill === skill.skill;
    }
};
__decorate([
    (0, core_1.Input)()
], SettingsSkillsComponent.prototype, "selectedSkill", void 0);
__decorate([
    (0, core_1.ViewChild)(menu_1.MatMenuTrigger, { static: true })
], SettingsSkillsComponent.prototype, "menu", void 0);
SettingsSkillsComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-settings-skills',
        templateUrl: './settings-skills.component.html',
        styleUrls: ['./settings-skills.component.scss']
    })
], SettingsSkillsComponent);
exports.SettingsSkillsComponent = SettingsSkillsComponent;
//# sourceMappingURL=settings-skills.component.js.map