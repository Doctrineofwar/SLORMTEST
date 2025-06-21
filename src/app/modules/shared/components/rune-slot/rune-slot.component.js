"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuneSlotComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let RuneSlotComponent = class RuneSlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(searchService, dialog) {
        super();
        this.searchService = searchService;
        this.dialog = dialog;
        this.rune = null;
        this.showLevel = true;
        this.selected = false;
        this.showOverlay = false;
        this.hiddenBySearch = false;
        this.searchService.searchChanged
            .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
            .subscribe(() => this.updateSearch());
    }
    onOver() {
        this.showOverlay = true;
    }
    onLeave() {
        this.showOverlay = false;
    }
    ngOnChanges() {
        this.updateSearch();
    }
    updateSearch() {
        this.hiddenBySearch = this.rune !== null && this.searchService.hasSearch() && !this.searchService.runeMatchSearch(this.rune);
    }
    hasAura(rune) {
        return rune.type === _slorm_api_1.RuneType.Effect;
    }
    showModalTooltip(event, rune) {
        let skip = false;
        if (event.ctrlKey && rune !== null) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { rune } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], RuneSlotComponent.prototype, "rune", void 0);
__decorate([
    (0, core_1.Input)()
], RuneSlotComponent.prototype, "showLevel", void 0);
__decorate([
    (0, core_1.Input)()
], RuneSlotComponent.prototype, "selected", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], RuneSlotComponent.prototype, "onOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], RuneSlotComponent.prototype, "onLeave", null);
RuneSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-rune-slot',
        templateUrl: './rune-slot.component.html',
        styleUrls: ['./rune-slot.component.scss']
    })
], RuneSlotComponent);
exports.RuneSlotComponent = RuneSlotComponent;
//# sourceMappingURL=rune-slot.component.js.map