"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncestralLegacySlotComponent = void 0;
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let AncestralLegacySlotComponent = class AncestralLegacySlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(searchService, slormancerAncestralLegacyService, buildStorageService, dialog) {
        super();
        this.searchService = searchService;
        this.slormancerAncestralLegacyService = slormancerAncestralLegacyService;
        this.buildStorageService = buildStorageService;
        this.dialog = dialog;
        this.ancestralLegacy = null;
        this.equipped = false;
        this.selected = false;
        this.readonly = false;
        this.overlay = false;
        this.changed = new core_1.EventEmitter();
        this.showOverlay = false;
        this.hiddenBySearch = false;
    }
    onOver() {
        this.showOverlay = true;
    }
    onLeave() {
        this.showOverlay = false;
    }
    ngOnInit() {
        this.searchService.searchChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(search => this.hiddenBySearch = search !== null && this.ancestralLegacy !== null && !this.searchService.ancestralLegacyMatchSearch(this.ancestralLegacy));
    }
    setRank(ancestralLegacy, newRank) {
        if (ancestralLegacy.baseRank !== newRank && this.selected) {
            this.slormancerAncestralLegacyService.updateAncestralLegacyModel(ancestralLegacy, newRank);
            this.slormancerAncestralLegacyService.updateAncestralLegacyView(ancestralLegacy);
            this.buildStorageService.saveLayer();
        }
    }
    increasesRank() {
        if (this.ancestralLegacy !== null) {
            this.setRank(this.ancestralLegacy, Math.max(0, this.ancestralLegacy.baseRank + 1));
            this.changed.emit(this.ancestralLegacy);
        }
        return false;
    }
    decreasesRank() {
        if (this.ancestralLegacy !== null) {
            this.setRank(this.ancestralLegacy, Math.max(0, this.ancestralLegacy.baseRank - 1));
            this.changed.emit(this.ancestralLegacy);
        }
        return false;
    }
    showModalTooltip(event, ancestralLegacy) {
        let skip = false;
        if (event.ctrlKey) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { ancestralLegacy } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], AncestralLegacySlotComponent.prototype, "ancestralLegacy", void 0);
__decorate([
    (0, core_1.Input)()
], AncestralLegacySlotComponent.prototype, "equipped", void 0);
__decorate([
    (0, core_1.Input)()
], AncestralLegacySlotComponent.prototype, "selected", void 0);
__decorate([
    (0, core_1.Input)()
], AncestralLegacySlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.Input)()
], AncestralLegacySlotComponent.prototype, "overlay", void 0);
__decorate([
    (0, core_1.Output)()
], AncestralLegacySlotComponent.prototype, "changed", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], AncestralLegacySlotComponent.prototype, "onOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], AncestralLegacySlotComponent.prototype, "onLeave", null);
AncestralLegacySlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-ancestral-legacy-slot',
        templateUrl: './ancestral-legacy-slot.component.html',
        styleUrls: ['./ancestral-legacy-slot.component.scss']
    })
], AncestralLegacySlotComponent);
exports.AncestralLegacySlotComponent = AncestralLegacySlotComponent;
//# sourceMappingURL=ancestral-legacy-slot.component.js.map