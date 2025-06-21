"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEditBuffAttributeComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let ItemEditBuffAttributeComponent = class ItemEditBuffAttributeComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(itemFormService, slormancerItemService) {
        super();
        this.itemFormService = itemFormService;
        this.slormancerItemService = slormancerItemService;
        this.form = null;
        this.options = [];
        this.displayedValue = '';
        this.attributeEnchantment = null;
    }
    ngOnChanges(changes) {
        this.options = this.itemFormService.getAttributeBuffOptions();
        if (this.form !== null) {
            if ('form' in changes) {
                this.form.valueChanges
                    .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
                    .subscribe(attributeEnchantment => {
                    this.updateAttributeEnchantment(attributeEnchantment.attribute ?? null, attributeEnchantment.value ?? 0);
                });
            }
            this.updateAttributeEnchantment(this.form.controls.attribute.value, this.form.controls.value.value);
        }
    }
    updateAttributeEnchantment(attribute, value) {
        this.attributeEnchantment = attribute === null ? null
            : this.slormancerItemService.getAttributeEnchantment(attribute, value);
        this.displayedValue = '';
        if (this.attributeEnchantment !== null) {
            this.displayedValue = '+' + (0, _slorm_api_1.valueOrDefault)(this.attributeEnchantment.craftableValues[this.attributeEnchantment.craftedValue], 0);
        }
    }
    updateSliderValue(change) {
        this.displayedValue = '';
        const value = change.value;
        if (this.attributeEnchantment !== null && value !== null) {
            this.updateAttributeEnchantment(this.attributeEnchantment.craftedValue, value);
        }
    }
    removeAttributeEnchantment() {
        if (this.form !== null) {
            this.form.patchValue({ attribute: null });
        }
    }
    addAttributeEnchantment() {
        const firstOption = this.options[0];
        if (this.form !== null && firstOption) {
            this.form.patchValue({
                attribute: firstOption.value,
                value: 3
            });
        }
    }
};
__decorate([
    (0, core_1.Input)()
], ItemEditBuffAttributeComponent.prototype, "form", void 0);
ItemEditBuffAttributeComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-edit-buff-attribute',
        templateUrl: './item-edit-buff-attribute.component.html',
        styleUrls: ['./item-edit-buff-attribute.component.scss']
    })
], ItemEditBuffAttributeComponent);
exports.ItemEditBuffAttributeComponent = ItemEditBuffAttributeComponent;
//# sourceMappingURL=item-edit-buff-attribute.component.js.map