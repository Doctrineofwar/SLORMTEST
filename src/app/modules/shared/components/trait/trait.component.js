"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraitComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let TraitComponent = class TraitComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(searchService, dialog) {
        super();
        this.searchService = searchService;
        this.dialog = dialog;
        this.trait = null;
        this.first = false;
        this.last = false;
        this.highlight = false;
        this.unlocked = false;
        this.bonus = false;
        this.isMouseOver = false;
        this.isHiddenBySearch = false;
    }
    onMouseEnter() {
        this.isMouseOver = true;
    }
    onMouseLeave() {
        this.isMouseOver = false;
    }
    ngOnInit() {
        this.searchService.searchChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(() => this.isHiddenBySearch = this.trait !== null && !this.searchService.traitMatchSearch(this.trait));
    }
    isMinor(trait) {
        return trait.traitLevel === _slorm_api_1.TraitLevel.Minor;
    }
    isMajor(trait) {
        return trait.traitLevel === _slorm_api_1.TraitLevel.Major;
    }
    isGreater(trait) {
        return trait.traitLevel === _slorm_api_1.TraitLevel.Greater;
    }
    showModalTooltip(event, trait) {
        let skip = false;
        if (event.ctrlKey) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { trait } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], TraitComponent.prototype, "trait", void 0);
__decorate([
    (0, core_1.Input)()
], TraitComponent.prototype, "first", void 0);
__decorate([
    (0, core_1.Input)()
], TraitComponent.prototype, "last", void 0);
__decorate([
    (0, core_1.Input)()
], TraitComponent.prototype, "highlight", void 0);
__decorate([
    (0, core_1.Input)()
], TraitComponent.prototype, "unlocked", void 0);
__decorate([
    (0, core_1.Input)()
], TraitComponent.prototype, "bonus", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], TraitComponent.prototype, "onMouseEnter", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], TraitComponent.prototype, "onMouseLeave", null);
TraitComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-trait',
        templateUrl: './trait.component.html',
        styleUrls: ['./trait.component.scss']
    })
], TraitComponent);
exports.TraitComponent = TraitComponent;
//# sourceMappingURL=trait.component.js.map