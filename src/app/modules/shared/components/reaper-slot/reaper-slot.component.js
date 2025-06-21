"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaperSlotComponent = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const reaper_edit_modal_component_1 = require("../reaper-edit-modal/reaper-edit-modal.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let ReaperSlotComponent = class ReaperSlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(dialog, slormancerCharacterBuilderService, searchService, itemMoveService) {
        super();
        this.dialog = dialog;
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.searchService = searchService;
        this.itemMoveService = itemMoveService;
        this.character = null;
        this.readonly = false;
        this.reaperView = null;
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
        this.hiddenBySearch = this.character !== null && this.searchService.hasSearch() && !this.searchService.reaperMatchSearch(this.character.reaper);
    }
    edit() {
        if (this.character !== null && !this.readonly) {
            const character = this.slormancerCharacterBuilderService.getCharacterClone(this.character);
            const data = { reaper: character.reaper, character };
            this.dialog.open(reaper_edit_modal_component_1.ReaperEditModalComponent, { data })
                .afterClosed().subscribe((reaper) => {
                if (reaper) {
                    this.changed.emit(reaper);
                }
            });
        }
    }
    handlescroll(event) {
        if (this.reaperView) {
            this.reaperView.scroll(event);
        }
        return false;
    }
    showModalTooltip(event, reaper) {
        let skip = false;
        if (event.ctrlKey) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { reaper } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], ReaperSlotComponent.prototype, "character", void 0);
__decorate([
    (0, core_1.Input)()
], ReaperSlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.ViewChild)('reaperView')
], ReaperSlotComponent.prototype, "reaperView", void 0);
__decorate([
    (0, core_1.Output)()
], ReaperSlotComponent.prototype, "changed", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], ReaperSlotComponent.prototype, "onOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], ReaperSlotComponent.prototype, "onLeave", null);
__decorate([
    (0, core_1.HostListener)('contextmenu')
], ReaperSlotComponent.prototype, "onMouseContextMenu", null);
ReaperSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-reaper-slot',
        templateUrl: './reaper-slot.component.html',
        styleUrls: ['./reaper-slot.component.scss']
    })
], ReaperSlotComponent);
exports.ReaperSlotComponent = ReaperSlotComponent;
//# sourceMappingURL=reaper-slot.component.js.map