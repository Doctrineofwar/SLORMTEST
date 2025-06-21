"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsComponent = void 0;
const core_1 = require("@angular/core");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
let SkillsComponent = class SkillsComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, slormancerSkillService, slormancerCharacterModifierService, slormancerTranslateService) {
        super();
        this.buildStorageService = buildStorageService;
        this.slormancerSkillService = slormancerSkillService;
        this.slormancerCharacterModifierService = slormancerCharacterModifierService;
        this.slormancerTranslateService = slormancerTranslateService;
        this.character = null;
        this.selectedSkill = null;
        this.selectedUpgrade = null;
        this.selectedSkillLines = [];
        this.MIGHT_MESSAGE = this.slormancerTranslateService.translate('bonus_raw_damage');
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => {
            this.character = layer === null ? null : layer.character;
            this.updateSelectedSkill();
        });
    }
    updateSelectedSkill() {
        const character = this.character;
        const selectedSkill = this.selectedSkill;
        let newSelectedSkill = null;
        if (character === null) {
            newSelectedSkill = null;
        }
        else if (selectedSkill === null) {
            newSelectedSkill = character.supportSkill !== null
                ? (0, _slorm_api_1.valueOrNull)(character.skills.find(s => s.skill === character.supportSkill))
                : (0, _slorm_api_1.valueOrNull)(character.skills[0]);
        }
        else {
            newSelectedSkill = (0, _slorm_api_1.valueOrNull)(character.skills.find(skill => skill.skill.id === selectedSkill.skill.id));
            if (newSelectedSkill === null) {
                newSelectedSkill = (0, _slorm_api_1.valueOrNull)(character.skills[0]);
            }
        }
        this.selectSkill(newSelectedSkill);
    }
    getSupportSkills(character) {
        return character.skills.filter(skill => skill.skill.type === _slorm_api_1.SkillType.Support);
    }
    getActiveSkills(character) {
        return character.skills.filter(skill => skill.skill.type === _slorm_api_1.SkillType.Active);
    }
    isSkillEquipped(skill) {
        return this.character !== null && (this.character.primarySkill === skill.skill
            || this.character.secondarySkill === skill.skill
            || this.character.supportSkill === skill.skill);
    }
    isEquippedSupportSkill(skill) {
        return this.character !== null && this.character.supportSkill === skill.skill;
    }
    isEquippedPrimarySkill(skill) {
        return this.character !== null && this.character.primarySkill === skill.skill;
    }
    isEquippedSecondarySkill(skill) {
        return this.character !== null && this.character.secondarySkill === skill.skill;
    }
    isSkillSelected(skill) {
        return this.selectedSkill === skill;
    }
    selectSkill(skill) {
        if (this.selectedSkill !== skill) {
            this.selectedSkill = skill;
            this.selectedSkillLines = skill === null ? [] : skill.upgrades.map(passive => passive.line).filter(_slorm_api_1.isFirst).sort();
            this.selectedUpgrade = skill === null ? null : (0, _slorm_api_1.valueOrNull)(skill.upgrades[0]);
        }
    }
    incrementSkill(skill) {
        console.log(skill.skill);
        if (this.selectedSkill === skill) {
            if (skill.skill.baseLevel < skill.skill.maxLevel) {
                skill.skill.baseLevel++;
                this.slormancerSkillService.updateSkillModel(skill.skill);
                this.buildStorageService.saveLayer();
            }
        }
        else {
            this.selectSkill(skill);
        }
        return false;
    }
    decrementSkill(skill) {
        if (this.selectedSkill === skill) {
            if (skill.skill.baseLevel > 1) {
                skill.skill.baseLevel--;
                this.slormancerSkillService.updateSkillModel(skill.skill);
                this.buildStorageService.saveLayer();
            }
        }
        else {
            this.selectSkill(skill);
        }
        return false;
    }
    getLineUpgrades(line) {
        let result = [];
        if (this.selectedSkill !== null) {
            result = this.selectedSkill.upgrades.filter(passive => passive.line === line).sort((a, b) => (0, _slorm_api_1.compare)(a.order, b.order));
        }
        return result;
    }
    isUpgradeEquipped(upgrade) {
        let result = false;
        if (this.selectedSkill !== null) {
            result = this.selectedSkill.selectedUpgrades.find(id => upgrade.id === id) !== undefined;
        }
        return result;
    }
    incrementUpgrade(selectedUpgrade) {
        console.log(selectedUpgrade);
        if (this.selectedSkill !== null && this.character !== null) {
            let selectionChanged = false;
            if (this.selectedUpgrade !== selectedUpgrade) {
                this.selectedUpgrade = selectedUpgrade;
                selectionChanged = true;
            }
            if (!this.isUpgradeEquipped(selectedUpgrade)) {
                this.slormancerCharacterModifierService.selectUpgrade(this.character, selectedUpgrade);
                if (selectedUpgrade.baseRank === 0) {
                    selectedUpgrade.baseRank = 1;
                    this.slormancerSkillService.updateUpgradeModel(selectedUpgrade);
                }
                this.buildStorageService.saveLayer();
            }
            else if (!selectionChanged && selectedUpgrade.baseRank < selectedUpgrade.maxRank) {
                selectedUpgrade.baseRank++;
                this.slormancerSkillService.updateUpgradeModel(selectedUpgrade);
                this.buildStorageService.saveLayer();
            }
        }
        return false;
    }
    decrementUpgrade(selectedUpgrade) {
        console.log(selectedUpgrade);
        if (this.selectedSkill !== null && this.character !== null) {
            let selectionChanged = false;
            if (this.selectedUpgrade !== selectedUpgrade) {
                this.selectedUpgrade = selectedUpgrade;
                selectionChanged = true;
            }
            if (!this.isUpgradeEquipped(selectedUpgrade)) {
                this.slormancerCharacterModifierService.selectUpgrade(this.character, selectedUpgrade);
                this.buildStorageService.saveLayer();
            }
            else if (!selectionChanged && selectedUpgrade.baseRank > 1) {
                selectedUpgrade.baseRank--;
                this.slormancerSkillService.updateUpgradeModel(selectedUpgrade);
                this.buildStorageService.saveLayer();
            }
        }
        return false;
    }
    isSupport(skill) {
        return skill.skill.type === _slorm_api_1.SkillType.Support;
    }
    equipSupport(skill) {
        if (this.character !== null) {
            this.slormancerCharacterModifierService.setSupportSkill(this.character, skill.skill);
            this.buildStorageService.saveLayer();
        }
    }
    equipPrimary(skill) {
        if (this.character !== null) {
            this.slormancerCharacterModifierService.setPrimarySkill(this.character, skill.skill);
            this.buildStorageService.saveLayer();
        }
    }
    equipSecondary(skill) {
        if (this.character !== null) {
            this.slormancerCharacterModifierService.setSecondarySkill(this.character, skill.skill);
            this.buildStorageService.saveLayer();
        }
    }
};
SkillsComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-skills',
        templateUrl: './skills.component.html',
        styleUrls: ['./skills.component.scss']
    })
], SkillsComponent);
exports.SkillsComponent = SkillsComponent;
//# sourceMappingURL=skills.component.js.map