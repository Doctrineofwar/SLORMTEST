"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEditBuffReaperComponent = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let ItemEditBuffReaperComponent = class ItemEditBuffReaperComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(itemFormService, slormancerItemService) {
        super();
        this.itemFormService = itemFormService;
        this.slormancerItemService = slormancerItemService;
        this.form = null;
        this.options = [];
        this.displayedValue = '';
        this.reaperEnchantment = null;
    }
    ngOnChanges(changes) {
        if (this.form !== null) {
            if ('form' in changes) {
                this.form.valueChanges
                    .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
                    .subscribe(reaperEnchantment => {
                    this.updateReaperEnchantment(reaperEnchantment.smith ?? null, reaperEnchantment.value ?? 0);
                });
            }
            this.updateReaperEnchantment(this.form.controls.smith.value, this.form.controls.value.value);
        }
        this.options = this.itemFormService.getReaperBuffOptions();
    }
    updateReaperEnchantment(smith, value) {
        this.displayedValue = '';
        this.reaperEnchantment = smith === null ? null
            : this.slormancerItemService.getReaperEnchantment(smith, value);
        if (this.reaperEnchantment !== null) {
            this.displayedValue = '+' + this.reaperEnchantment.craftedValue;
        }
    }
    updateSliderValue(change) {
        this.displayedValue = '';
        const value = change.value;
        if (this.reaperEnchantment !== null && value !== null) {
            this.updateReaperEnchantment(this.reaperEnchantment.craftedReaperSmith, value);
        }
    }
    removeReaperEnchantment() {
        if (this.form !== null) {
            this.form.patchValue({ smith: null });
        }
    }
    addReaperEnchantment() {
        const firstOption = this.options[0];
        if (this.form !== null && firstOption) {
            this.form.patchValue({
                smith: firstOption.value,
                value: 5
            });
        }
    }
};
__decorate([
    (0, core_1.Input)()
], ItemEditBuffReaperComponent.prototype, "form", void 0);
ItemEditBuffReaperComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-edit-buff-reaper',
        templateUrl: './item-edit-buff-reaper.component.html',
        styleUrls: ['./item-edit-buff-reaper.component.scss']
    })
], ItemEditBuffReaperComponent);
exports.ItemEditBuffReaperComponent = ItemEditBuffReaperComponent;
//# sourceMappingURL=item-edit-buff-reaper.component.js.map