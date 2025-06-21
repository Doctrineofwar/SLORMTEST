"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEditLegendaryEffectComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let ItemEditLegendaryEffectComponent = class ItemEditLegendaryEffectComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(itemFormService, slormancerLegendaryEffectService) {
        super();
        this.itemFormService = itemFormService;
        this.slormancerLegendaryEffectService = slormancerLegendaryEffectService;
        this.base = _slorm_api_1.EquipableItemBase.Amulet;
        this.heroClass = _slorm_api_1.HeroClass.Huntress;
        this.itemLevel = 0;
        this.itemReinforcement = 0;
        this.form = null;
        this.hideGrafts = false;
        this.options = [];
        this.validationOptions = [];
        this.displayedValue = '';
        this.legendaryEffect = null;
        this.placeholder = null;
        this.possible = true;
    }
    ngOnChanges(changes) {
        if (this.form !== null) {
            if ('form' in changes) {
                this.form.valueChanges
                    .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
                    .subscribe(legendaryEffect => {
                    this.updateLegendaryEffect(legendaryEffect.id ?? null, legendaryEffect.value ?? 0);
                    this.possible = this.isLegendaryPossible(legendaryEffect.id ?? null);
                });
            }
            this.updateLegendaryEffect(this.form.controls.id.value, this.form.controls.value.value);
        }
        const graft = this.itemLevel > _slorm_api_1.MAX_ITEM_LEVEL;
        this.options = (graft && !this.hideGrafts)
            ? this.itemFormService.getAllLegendaryOptions(this.heroClass)
            : this.itemFormService.getLegendaryOptions(this.base, this.heroClass);
        this.validationOptions = this.itemFormService.getAllLegendaryOptions(this.heroClass);
        if (this.form !== null) {
            this.possible = this.isLegendaryPossible(this.form.controls.id.value);
        }
    }
    updateLegendaryEffect(id, value) {
        this.legendaryEffect = (this.form === null || id === null) ? null
            : this.slormancerLegendaryEffectService.getLegendaryEffectById(id, this.form.controls.value.value, this.itemReinforcement, this.heroClass);
        this.placeholder = this.legendaryEffect === null ? null : this.legendaryEffect.name;
        if (this.legendaryEffect !== null) {
            this.updateLegendaryValueLabel(this.legendaryEffect.value);
        }
    }
    updateLegendaryValueLabel(value) {
        this.displayedValue = '';
        if (this.legendaryEffect !== null && value !== null) {
            this.displayedValue = this.legendaryEffect.effects
                .filter(craftedEffect => craftedEffect.possibleCraftedValues.length > 1) // mieux à faire ?
                .map(craftedEffect => {
                const percent = craftedEffect.effect.percent ? '%' : '';
                return (0, _slorm_api_1.getCraftValue)(craftedEffect, value) + percent;
            }).join(' / ');
        }
    }
    hasLegendaryValues() {
        return this.legendaryEffect !== null && this.legendaryEffect.effects
            .filter(craftedEffect => craftedEffect.possibleCraftedValues.length > 1).length > 0;
    }
    updateSliderValue(change) {
        this.displayedValue = '';
        const value = change.value;
        if (this.legendaryEffect !== null && value !== null) {
            this.updateLegendaryValueLabel(value);
        }
    }
    removeLegendaryEffect() {
        if (this.form !== null) {
            this.form.patchValue({ id: null });
        }
    }
    addLegendaryEffect() {
        const firstOption = this.options[0];
        if (this.form !== null && firstOption) {
            this.form.patchValue({
                id: firstOption.value,
                value: 100
            });
        }
    }
    isLegendaryPossible(id) {
        return this.options.some(option => option.value === id);
    }
};
__decorate([
    (0, core_1.Input)()
], ItemEditLegendaryEffectComponent.prototype, "base", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditLegendaryEffectComponent.prototype, "heroClass", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditLegendaryEffectComponent.prototype, "itemLevel", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditLegendaryEffectComponent.prototype, "itemReinforcement", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditLegendaryEffectComponent.prototype, "form", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditLegendaryEffectComponent.prototype, "hideGrafts", void 0);
ItemEditLegendaryEffectComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-edit-legendary-effect',
        templateUrl: './item-edit-legendary-effect.component.html',
        styleUrls: ['./item-edit-legendary-effect.component.scss']
    })
], ItemEditLegendaryEffectComponent);
exports.ItemEditLegendaryEffectComponent = ItemEditLegendaryEffectComponent;
//# sourceMappingURL=item-edit-legendary-effect.component.js.map