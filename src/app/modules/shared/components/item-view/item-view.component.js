"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemViewComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let ItemViewComponent = class ItemViewComponent {
    constructor() {
        this.item = null;
        this.equipped = false;
        this.details = true;
        this.tooltip = false;
        this.main = null;
    }
    ngAfterViewChecked() {
        if (this.main && this.tooltip) {
            (0, _slorm_api_1.adaptOverlay)(this.main.nativeElement);
        }
    }
    ngOnDestroy() {
        (0, _slorm_api_1.resetOverlay)();
    }
    getNormalAffixes() {
        return this.item === null ? [] : this.item.affixes.filter(affix => affix.rarity === _slorm_api_1.Rarity.Normal);
    }
    getDefensiveAffixes() {
        return this.item === null ? [] : this.item.affixes.filter(affix => affix.rarity === _slorm_api_1.Rarity.Defensive);
    }
    getMagicAffixes() {
        return this.item === null ? [] : this.item.affixes.filter(affix => affix.rarity === _slorm_api_1.Rarity.Magic);
    }
    getRareAffixes() {
        return this.item === null ? [] : this.item.affixes.filter(affix => affix.rarity === _slorm_api_1.Rarity.Rare);
    }
    getEpicAffixes() {
        return this.item === null ? [] : this.item.affixes.filter(affix => affix.rarity === _slorm_api_1.Rarity.Epic);
    }
    hasAffixes() {
        return this.item !== null && this.item.affixes.length > 0;
    }
};
__decorate([
    (0, core_1.Input)()
], ItemViewComponent.prototype, "item", void 0);
__decorate([
    (0, core_1.Input)()
], ItemViewComponent.prototype, "equipped", void 0);
__decorate([
    (0, core_1.Input)()
], ItemViewComponent.prototype, "details", void 0);
__decorate([
    (0, core_1.Input)()
], ItemViewComponent.prototype, "tooltip", void 0);
__decorate([
    (0, core_1.ViewChild)('main')
], ItemViewComponent.prototype, "main", void 0);
ItemViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-view',
        templateUrl: './item-view.component.html',
        styleUrls: ['./item-view.component.scss']
    })
], ItemViewComponent);
exports.ItemViewComponent = ItemViewComponent;
//# sourceMappingURL=item-view.component.js.map