"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEditStatComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let ItemEditStatComponent = class ItemEditStatComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(itemFormService, slormancerAffixService) {
        super();
        this.itemFormService = itemFormService;
        this.slormancerAffixService = slormancerAffixService;
        this.itemBase = _slorm_api_1.EquipableItemBase.Amulet;
        this.itemLevel = 0;
        this.itemReinforcement = 0;
        this.alreadyUsedStats = [];
        this.form = null;
        this.removable = false;
        this.hideGrafts = false;
        this.remove = new core_1.EventEmitter();
        this.options = [];
        this.validationOptions = [];
        this.displayedValue = '';
        this.affix = null;
        this.STATS_LABELS = this.itemFormService.getStatsLabels();
    }
    ngOnChanges(changes) {
        if (this.form !== null) {
            if ('form' in changes) {
                this.form.controls.rarity.valueChanges
                    .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
                    .subscribe(rarity => {
                    this.options = this.getOptions(this.itemLevel, this.itemBase, rarity, this.hideGrafts);
                    this.validationOptions = this.getOptions(this.itemLevel, this.itemBase, rarity);
                });
                this.form.valueChanges
                    .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
                    .subscribe(() => this.updateAffix());
            }
            if ('form' in changes || 'itemBase' in changes || 'itemLevel' in changes || 'hideGrafts' in changes) {
                this.options = this.getOptions(this.itemLevel, this.itemBase, this.form.controls.rarity.value, this.hideGrafts);
                this.validationOptions = this.getOptions(this.itemLevel, this.itemBase, this.form.controls.rarity.value);
            }
            if ('form' in changes || 'itemLevel' in changes || 'itemReinforcement' in changes) {
                this.updateAffix();
            }
        }
    }
    getOptions(itemLevel, base, rarity, hideGrafts = false) {
        return (itemLevel > _slorm_api_1.MAX_ITEM_LEVEL && !hideGrafts)
            ? this.itemFormService.getAllStatsOptions()
            : this.itemFormService.getStatsOptions(this.itemBase, rarity);
    }
    updateAffix() {
        if (this.form !== null) {
            this.affix = this.slormancerAffixService.getAffixFromStat(this.form.controls.stat.value, this.itemLevel, this.itemReinforcement, this.form.controls.rarity.value, this.form.controls.value.value, this.form.controls.purity.value);
            if (this.affix !== null) {
                this.slormancerAffixService.updateAffix(this.affix);
            }
            this.updatePurity(this.form.controls.pure.value, this.form.controls.purity.value, this.form.controls.value.value);
        }
    }
    updatePurity(pure, purity, value) {
        if (pure) {
            this.setPuritylabel(purity);
        }
        else {
            this.setStatLabel(value);
        }
    }
    updateSliderPurity(change) {
        if (change.value !== null) {
            this.setPuritylabel(change.value);
        }
    }
    updateSliderStat(change) {
        if (change.value !== null) {
            this.setStatLabel(change.value);
        }
    }
    setPuritylabel(value) {
        this.displayedValue = Math.round(value - 100) + '%';
    }
    setStatLabel(value) {
        this.displayedValue = '';
        if (this.affix !== null) {
            const percent = this.affix.craftedEffect.effect.percent ? '%' : '';
            this.displayedValue = this.affix === null ? '' : '+' + ((0, _slorm_api_1.getCraftValue)(this.affix.craftedEffect, value) + percent);
        }
    }
    removeStat() {
        this.remove.emit();
    }
};
__decorate([
    (0, core_1.Input)()
], ItemEditStatComponent.prototype, "itemBase", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditStatComponent.prototype, "itemLevel", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditStatComponent.prototype, "itemReinforcement", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditStatComponent.prototype, "alreadyUsedStats", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditStatComponent.prototype, "form", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditStatComponent.prototype, "removable", void 0);
__decorate([
    (0, core_1.Input)()
], ItemEditStatComponent.prototype, "hideGrafts", void 0);
__decorate([
    (0, core_1.Output)()
], ItemEditStatComponent.prototype, "remove", void 0);
ItemEditStatComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-edit-stat',
        templateUrl: './item-edit-stat.component.html',
        styleUrls: ['./item-edit-stat.component.scss']
    })
], ItemEditStatComponent);
exports.ItemEditStatComponent = ItemEditStatComponent;
//# sourceMappingURL=item-edit-stat.component.js.map