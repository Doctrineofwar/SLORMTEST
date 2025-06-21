"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillBarComponent = void 0;
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let SkillBarComponent = class SkillBarComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, slormancerCharacterModifierService) {
        super();
        this.buildStorageService = buildStorageService;
        this.slormancerCharacterModifierService = slormancerCharacterModifierService;
        this.character = null;
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => this.character = layer !== null && layer.character !== null ? layer.character : null);
    }
    updatePrimarySkill(skill) {
        if (this.character !== null) {
            this.slormancerCharacterModifierService.setPrimarySkill(this.character, skill);
            this.buildStorageService.saveLayer();
        }
    }
    updateSecondarySkill(skill) {
        if (this.character !== null) {
            this.slormancerCharacterModifierService.setSecondarySkill(this.character, skill);
            this.buildStorageService.saveLayer();
        }
    }
    updateSupportSkill(skill) {
        if (this.character !== null) {
            this.slormancerCharacterModifierService.setSupportSkill(this.character, skill);
            this.buildStorageService.saveLayer();
        }
    }
    updateActivable1(activable) {
        if (this.character !== null && this.character.activable1 !== activable) {
            if (activable !== null) {
                // à déplacer dans character modifier
                if (this.character.activable2 === activable) {
                    this.character.activable2 = this.character.activable1;
                }
                else if (this.character.activable3 === activable) {
                    this.character.activable3 = this.character.activable1;
                }
                else if (this.character.activable4 === activable) {
                    this.character.activable4 = this.character.activable1;
                }
            }
            this.character.activable1 = activable;
            this.buildStorageService.saveLayer();
        }
    }
    updateActivable2(activable) {
        if (this.character !== null && this.character.activable2 !== activable) {
            if (activable !== null) {
                if (this.character.activable1 === activable) {
                    this.character.activable1 = this.character.activable2;
                }
                else if (this.character.activable3 === activable) {
                    this.character.activable3 = this.character.activable2;
                }
                else if (this.character.activable4 === activable) {
                    this.character.activable4 = this.character.activable2;
                }
            }
            this.character.activable2 = activable;
            this.buildStorageService.saveLayer();
        }
    }
    updateActivable3(activable) {
        if (this.character !== null && this.character.activable3 !== activable) {
            if (activable !== null) {
                if (this.character.activable1 === activable) {
                    this.character.activable1 = this.character.activable3;
                }
                else if (this.character.activable2 === activable) {
                    this.character.activable2 = this.character.activable3;
                }
                else if (this.character.activable4 === activable) {
                    this.character.activable4 = this.character.activable3;
                }
            }
            this.character.activable3 = activable;
            this.buildStorageService.saveLayer();
        }
    }
    updateActivable4(activable) {
        if (this.character !== null && this.character.activable4 !== activable) {
            if (activable !== null) {
                if (this.character.activable1 === activable) {
                    this.character.activable1 = this.character.activable4;
                }
                else if (this.character.activable3 === activable) {
                    this.character.activable3 = this.character.activable4;
                }
                else if (this.character.activable2 === activable) {
                    this.character.activable2 = this.character.activable4;
                }
            }
            this.character.activable4 = activable;
            this.buildStorageService.saveLayer();
        }
    }
};
SkillBarComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-skill-bar',
        templateUrl: './skill-bar.component.html',
        styleUrls: ['./skill-bar.component.scss']
    })
], SkillBarComponent);
exports.SkillBarComponent = SkillBarComponent;
//# sourceMappingURL=skill-bar.component.js.map