"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemSlotComponent = void 0;
const core_1 = require("@angular/core");
const menu_1 = require("@angular/material/menu");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const compare_item_modal_component_1 = require("../compare-item-modal/compare-item-modal.component");
const item_base_choice_modal_component_1 = require("../item-base-choice-modal/item-base-choice-modal.component");
const item_edit_modal_component_1 = require("../item-edit-modal/item-edit-modal.component");
const remove_confirm_modal_component_1 = require("../remove-confirm-modal/remove-confirm-modal.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let ItemSlotComponent = class ItemSlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(dialog, itemMoveService, searchService, slormancerCharacterBuilderService, slormancerItemService, buildStorageService) {
        super();
        this.dialog = dialog;
        this.itemMoveService = itemMoveService;
        this.searchService = searchService;
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.slormancerItemService = slormancerItemService;
        this.buildStorageService = buildStorageService;
        this.GearSlot = _slorm_api_1.GearSlot;
        this.character = null;
        this.item = null;
        this.base = null;
        this.readonly = false;
        this.changed = new core_1.EventEmitter();
        this.menu = null;
        this.isDragging = false;
        this.isMouseOver = false;
        this.isItemCompatible = false;
        this.isDraggedItem = false;
        this.hiddenBySearch = false;
        this.comparableGearSlots = [];
        this.itemMoveService.draggingItem
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(holding => {
            this.isDragging = holding;
            this.isDraggedItem = this.itemMoveService.isHoldItem(this.item);
            this.isItemCompatible = this.itemMoveService.isDragItemCompatible(this.item, this.base);
        });
        this.searchService.searchChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(() => this.updateSearch());
    }
    onMouseOver() {
        this.isMouseOver = true;
    }
    onMouseLeave() {
        this.isMouseOver = false;
    }
    onMouseDown(event) {
        if (event.button === 0 && !this.readonly) {
            this.take();
        }
        return false;
    }
    onMouseUp(event) {
        if (event.button === 0) {
            if (this.isDragging && !this.readonly) {
                this.itemMoveService.swap(this.item, this.base, ((success, item) => this.moveCallback(success, item)));
            }
            else if (event.ctrlKey && this.item !== null) {
                const data = { entity: { item: this.item } };
                this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
            }
            else if (!this.readonly) {
                this.edit();
            }
        }
        return false;
    }
    onMouseContextMenu() {
        this.itemMoveService.releaseHoldItem();
        if (this.menu && !this.readonly) {
            this.updateComparableSlots();
            this.menu.openMenu();
        }
        return false;
    }
    ngOnInit() { }
    ngOnChanges() {
        this.updateSearch();
    }
    isMenuOpen() {
        return this.menu !== null && this.menu !== undefined && this.menu.menuOpen;
    }
    updateComparableSlots() {
        this.comparableGearSlots = [];
        const character = this.character;
        const item = this.item;
        if (character !== null && item !== null && this.base === null) {
            this.comparableGearSlots = _slorm_api_1.ALL_GEAR_SLOT_VALUES.filter(slot => {
                const characterItem = character.gear[slot];
                return characterItem !== null && characterItem.base === item.base;
            });
        }
    }
    updateSearch() {
        this.hiddenBySearch = this.item !== null && this.searchService.hasSearch() && !this.searchService.itemMatchSearch(this.item);
    }
    moveCallback(itemReplaced, item) {
        if (itemReplaced) {
            this.changed.emit(item);
        }
        this.isDraggedItem = false;
        this.isItemCompatible = false;
    }
    getItemEditModalData(character, item) {
        const characterClone = this.slormancerCharacterBuilderService.getCharacterClone(character);
        const itemGearSlot = _slorm_api_1.ALL_GEAR_SLOT_VALUES.find(gear => character.gear[gear] === item);
        const itemFromGear = itemGearSlot ? characterClone.gear[itemGearSlot] : null;
        const itemClone = itemFromGear !== null ? itemFromGear : this.slormancerItemService.getEquipableItemClone(item);
        return { character: characterClone, item: itemClone, maxLevel: characterClone.level };
    }
    edit(item = this.item) {
        const character = this.character;
        if (character !== null) {
            const defensiveStatMultiplier = this.slormancerItemService.getDefensiveStatMultiplier((0, _slorm_api_1.getAllLegendaryEffects)(character.gear));
            if (item === null) {
                if (this.base !== null) {
                    this.edit(this.slormancerItemService.getEmptyEquipableItem(this.base, character.heroClass, character.level, defensiveStatMultiplier));
                }
                else {
                    this.dialog.open(item_base_choice_modal_component_1.ItemBaseChoiceModalComponent)
                        .afterClosed().subscribe((base) => {
                        if (base !== undefined && base !== null) {
                            this.edit(this.slormancerItemService.getEmptyEquipableItem(base, character.heroClass, character.level, defensiveStatMultiplier));
                        }
                    });
                }
            }
            else {
                const data = this.getItemEditModalData(character, item);
                this.dialog.open(item_edit_modal_component_1.ItemEditModalComponent, { data, width: '80vw', maxWidth: '1000px' })
                    .afterClosed().subscribe((data) => {
                    if (data !== undefined) {
                        this.changed.emit(data);
                    }
                });
            }
        }
    }
    take() {
        if (this.item !== null) {
            this.itemMoveService.hold(this.item, this.base, (success, item) => this.moveCallback(success, item));
        }
    }
    copy() {
        if (this.item !== null) {
            const itemCopy = this.slormancerItemService.getEquipableItemClone(this.item);
            this.itemMoveService.hold(itemCopy, itemCopy.base);
        }
    }
    remove() {
        this.dialog.open(remove_confirm_modal_component_1.RemoveConfirmModalComponent)
            .afterClosed().subscribe((choice) => {
            if (choice === true) {
                this.changed.emit(null);
            }
        });
    }
    equip() {
        if (this.item !== null) {
            this.itemMoveService.equip(this.item, (success, item) => this.moveCallback(success, item));
        }
    }
    unequip() {
        if (this.item !== null) {
            this.itemMoveService.moveToStash(this.item, (success, item) => this.moveCallback(success, item));
        }
    }
    compareWithSlot(slot) {
        if (this.item !== null && this.character !== null) {
            const leftItem = this.character.gear[slot];
            const build = this.buildStorageService.getBuild();
            if (leftItem !== null && build !== null && build.configuration !== null) {
                const data = {
                    character: this.character,
                    slot,
                    config: build.configuration,
                    left: leftItem,
                    right: this.item,
                };
                this.dialog.open(compare_item_modal_component_1.CompareItemModalComponent, { data });
            }
        }
    }
};
__decorate([
    (0, core_1.Input)()
], ItemSlotComponent.prototype, "character", void 0);
__decorate([
    (0, core_1.Input)()
], ItemSlotComponent.prototype, "item", void 0);
__decorate([
    (0, core_1.Input)()
], ItemSlotComponent.prototype, "base", void 0);
__decorate([
    (0, core_1.Input)()
], ItemSlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.Output)()
], ItemSlotComponent.prototype, "changed", void 0);
__decorate([
    (0, core_1.ViewChild)(menu_1.MatMenuTrigger)
], ItemSlotComponent.prototype, "menu", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], ItemSlotComponent.prototype, "onMouseOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], ItemSlotComponent.prototype, "onMouseLeave", null);
__decorate([
    (0, core_1.HostListener)('mousedown', ['$event'])
], ItemSlotComponent.prototype, "onMouseDown", null);
__decorate([
    (0, core_1.HostListener)('mouseup', ['$event'])
], ItemSlotComponent.prototype, "onMouseUp", null);
__decorate([
    (0, core_1.HostListener)('contextmenu')
], ItemSlotComponent.prototype, "onMouseContextMenu", null);
ItemSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-item-slot',
        templateUrl: './item-slot.component.html',
        styleUrls: ['./item-slot.component.scss']
    })
], ItemSlotComponent);
exports.ItemSlotComponent = ItemSlotComponent;
//# sourceMappingURL=item-slot.component.js.map