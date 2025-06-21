"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEditBuffSkillComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let ItemEditBuffSkillComponent = class ItemEditBuffSkillComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(itemFormService, slormancerItemService) {
        super();
        this.itemFormService = itemFormService;
        this.slormancerItemService = slormancerItemService;
        this.heroClass = _slorm_api_1.HeroClass.Huntress;
        this.form = null;
        this.options = [];
        this.displayedValue = '';
        this.skillEnchantment = null;
    }
    ngOnChanges(changes) {
        this.options = this.itemFormService.getSkillBuffOptions(this.heroClass);
        if (this.form !== null) {
            if ('form' in changes) {
                this.form.valueChanges
                    .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
                    .subscribe(skillEnchantment => {
                    this.updateSkillEnchantment(skillEnchantment.skill ?? null, skillEnchantment.value ?? 0);
                });
            }
            this.updateSkillEnchantment(this.form.controls.skill.value, this.form.controls.value.value);
        }
    }
    updateSkillEnchantment(skill, value) {
        this.skillEnchantment = skill === null ? null
            : this.slormancerItemService.getSkillEnchantment(skill, value);
        this.displayedValue = '';
        if (this.skillEnchantment !== null && value !== null) {
            this.displayedValue = '+' + (0, _slorm_api_1.valueOrDefault)(this.skillEnchantment.craftableValues[value], 0);
        }
    }
    updateSliderValue(change) {
        this.displayedValue = '';
        const value = change.value;
        if (this.skillEnchantment !== null && value !== null) {
            this.updateSkillEnchantment(this.skillEnchantment.craftedSkill, value);
        }
    }
    removeSkillEnchantment() {
        if (this.form !== null) {
            this.form.patchValue({ skill: null });
        }
    }
    addSkillEnchantment() {
        const firstOption = this.options[0];
        if (this.form !== null && firstOption) {
            this.form.patchValue({
                skill: firstOption.value,
                value: 2
            });
        }
    }
};
__decorate([
    (0, core_1.Input)()
], ItemEditBuffSkillComponent.prototype, "heroClass", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditBuffSkillComponent.prototype, "form", void 0);
ItemEditBuffSkillComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-edit-buff-skill',
        templateUrl: './item-edit-buff-skill.component.html',
        styleUrls: ['./item-edit-buff-skill.component.scss']
    })
], ItemEditBuffSkillComponent);
exports.ItemEditBuffSkillComponent = ItemEditBuffSkillComponent;
//# sourceMappingURL=item-edit-buff-skill.component.js.map