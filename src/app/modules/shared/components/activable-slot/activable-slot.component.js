"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivableSlotComponent = void 0;
const core_1 = require("@angular/core");
const menu_1 = require("@angular/material/menu");
const _slorm_api_1 = require("@slorm-api");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let ActivableSlotComponent = class ActivableSlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, itemMoveService, dialog) {
        super();
        this.buildStorageService = buildStorageService;
        this.itemMoveService = itemMoveService;
        this.dialog = dialog;
        this.activable = null;
        this.readonly = false;
        this.changed = new core_1.EventEmitter();
        this.menu = null;
        this.showOverlay = false;
    }
    onOver() {
        this.showOverlay = true;
    }
    onLeave() {
        this.showOverlay = false;
    }
    onMouseContextMenu() {
        this.itemMoveService.releaseHoldItem();
        if (this.menu !== null && !this.readonly) {
            this.menu.openMenu();
        }
        return false;
    }
    onMouseClick() {
        this.itemMoveService.releaseHoldItem();
        if (this.menu !== null && !this.readonly) {
            this.menu.openMenu();
        }
        return false;
    }
    ngOnInit() { }
    isAncestralLegacy(activable) {
        return activable.element !== undefined;
    }
    isActivable(activable) {
        return activable.element === undefined;
    }
    getAvailableActivables() {
        let result = [];
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            const legendaryActivables = [
                layer.character.gear.amulet,
                layer.character.gear.belt,
                layer.character.gear.body,
                layer.character.gear.boot,
                layer.character.gear.bracer,
                layer.character.gear.cape,
                layer.character.gear.glove,
                layer.character.gear.helm,
                layer.character.gear.ring_l,
                layer.character.gear.ring_r,
                layer.character.gear.shoulder
            ]
                .map(item => item !== null && item.legendaryEffect !== null ? item.legendaryEffect.activable : null)
                .filter(_slorm_api_1.isNotNullOrUndefined)
                .sort((a, b) => -(0, _slorm_api_1.compare)(a.level, b.level))
                .filter((value, index, values) => (0, _slorm_api_1.isFirst)(value, index, values, (a, b) => a.id === b.id));
            const reaperActivables = layer.character.reaper === null ? [] : layer.character.reaper.activables;
            const runeActivables = [layer.character.runes.activation, layer.character.runes.effect, layer.character.runes.enhancement]
                .map(rune => rune === null ? null : rune.activable)
                .filter(_slorm_api_1.isNotNullOrUndefined);
            const ancestralLegacies = layer.character.ancestralLegacies.activeAncestralLegacies
                .map(ancestralLegacy => layer.character.ancestralLegacies.ancestralLegacies[ancestralLegacy])
                .filter(_slorm_api_1.isNotNullOrUndefined)
                .filter(ancestralLegacy => ancestralLegacy.isActivable);
            result = [
                ...legendaryActivables,
                ...runeActivables,
                ...reaperActivables,
                ...ancestralLegacies
            ];
        }
        return result;
    }
    isSelectedActivable(activable) {
        const layer = this.buildStorageService.getLayer();
        return layer !== null && (layer.character.activable1 === activable
            || layer.character.activable2 === activable
            || layer.character.activable3 === activable
            || layer.character.activable4 === activable);
    }
    updateActivable(activable) {
        if (this.activable !== activable) {
            this.changed.emit(activable);
        }
    }
    showModalTooltip(event, activable) {
        if (activable !== null && event.ctrlKey) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (this.isActivable(activable)) {
                const data = { entity: { activable } };
                this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
            }
            else if (this.isAncestralLegacy(activable)) {
                const data = { entity: { ancestralLegacy: activable }, hideNextRank: true };
                this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
            }
        }
    }
};
__decorate([
    (0, core_1.Input)()
], ActivableSlotComponent.prototype, "activable", void 0);
__decorate([
    (0, core_1.Input)()
], ActivableSlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.Output)()
], ActivableSlotComponent.prototype, "changed", void 0);
__decorate([
    (0, core_1.ViewChild)(menu_1.MatMenuTrigger, { static: true })
], ActivableSlotComponent.prototype, "menu", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], ActivableSlotComponent.prototype, "onOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], ActivableSlotComponent.prototype, "onLeave", null);
__decorate([
    (0, core_1.HostListener)('contextmenu')
], ActivableSlotComponent.prototype, "onMouseContextMenu", null);
__decorate([
    (0, core_1.HostListener)('click')
], ActivableSlotComponent.prototype, "onMouseClick", null);
ActivableSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-activable-slot',
        templateUrl: './activable-slot.component.html',
        styleUrls: ['./activable-slot.component.scss']
    })
], ActivableSlotComponent);
exports.ActivableSlotComponent = ActivableSlotComponent;
//# sourceMappingURL=activable-slot.component.js.map