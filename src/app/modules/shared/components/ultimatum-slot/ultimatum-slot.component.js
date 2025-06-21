"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltimatumSlotComponent = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const ultimatum_edit_modal_component_1 = require("../ultimatum-edit-modal/ultimatum-edit-modal.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let UltimatumSlotComponent = class UltimatumSlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(dialog, itemMoveService, searchService) {
        super();
        this.dialog = dialog;
        this.itemMoveService = itemMoveService;
        this.searchService = searchService;
        this.ultimatum = null;
        this.overlay = true;
        this.readonly = false;
        this.changed = new core_1.EventEmitter();
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
    onMouseContextMenu() {
        if (!this.readonly) {
            this.itemMoveService.releaseHoldItem();
        }
        return false;
    }
    ngOnChanges() {
        this.updateSearch();
    }
    updateSearch() {
        this.hiddenBySearch = this.ultimatum !== null && this.searchService.hasSearch() && !this.searchService.ultimatumMatchSearch(this.ultimatum);
    }
    edit() {
        if (!this.readonly) {
            const data = {
                ultimatum: this.ultimatum
            };
            this.dialog.open(ultimatum_edit_modal_component_1.UltimatumEditModalComponent, { data })
                .afterClosed().subscribe((ultimatum) => {
                if (ultimatum) {
                    this.changed.emit(ultimatum);
                }
            });
        }
    }
    showModalTooltip(event, ultimatum) {
        let skip = false;
        if (event.ctrlKey && ultimatum !== null) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { ultimatum } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], UltimatumSlotComponent.prototype, "ultimatum", void 0);
__decorate([
    (0, core_1.Input)()
], UltimatumSlotComponent.prototype, "overlay", void 0);
__decorate([
    (0, core_1.Input)()
], UltimatumSlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.Output)()
], UltimatumSlotComponent.prototype, "changed", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], UltimatumSlotComponent.prototype, "onOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], UltimatumSlotComponent.prototype, "onLeave", null);
__decorate([
    (0, core_1.HostListener)('contextmenu')
], UltimatumSlotComponent.prototype, "onMouseContextMenu", null);
UltimatumSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-ultimatum-slot',
        templateUrl: './ultimatum-slot.component.html',
        styleUrls: ['./ultimatum-slot.component.scss']
    })
], UltimatumSlotComponent);
exports.UltimatumSlotComponent = UltimatumSlotComponent;
//# sourceMappingURL=ultimatum-slot.component.js.map