"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryComponent = void 0;
const core_1 = require("@angular/core");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const operators_1 = require("rxjs/operators");
let InventoryComponent = class InventoryComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, slormancerRuneService, itemMoveService) {
        super();
        this.buildStorageService = buildStorageService;
        this.slormancerRuneService = slormancerRuneService;
        this.itemMoveService = itemMoveService;
        this.character = null;
        this.isDragging = false;
        this.itemGroupBeingDraggedOn = null;
        this.itemGroupDragDropPossible = false;
        this.itemMoveService.draggingItem
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(dragging => this.isDragging = dragging);
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => this.character = layer === null ? null : layer.character);
    }
    dragInItemsGroup(itemGroup) {
        if (this.isDragging) {
            this.itemGroupDragDropPossible = itemGroup.find(item => item === null) !== undefined;
            this.itemGroupBeingDraggedOn = itemGroup;
        }
    }
    dragOutItemsGroup() {
        this.itemGroupBeingDraggedOn = null;
    }
    dragDrop(itemGroups) {
        this.itemMoveService.moveDraggedItemToItemGroup(itemGroups);
    }
    gearChanged() {
        this.buildStorageService.saveLayer();
    }
    updateReaper(reaper) {
        if (this.character !== null) {
            this.character.reaper = reaper;
            if (this.character.runes.effect !== null) {
                this.slormancerRuneService.updateRuneModel(this.character.runes.effect, reaper.id);
                this.slormancerRuneService.updateRuneView(this.character.runes.effect);
            }
            this.buildStorageService.saveLayer();
        }
    }
    updateRunes(runes) {
        if (this.character !== null) {
            this.character.runes = runes;
            this.buildStorageService.saveLayer();
        }
    }
    updateIventoryItem(index, item) {
        if (this.character !== null) {
            this.character.inventory[index] = item;
            this.buildStorageService.saveLayer();
        }
    }
    updateSharedInventoryItem(stashIndex, index, item) {
        if (this.character !== null) {
            const stash = this.character.sharedInventory[stashIndex];
            if (stash) {
                stash[index] = item;
                this.buildStorageService.saveBuild();
            }
        }
    }
};
InventoryComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-inventory',
        templateUrl: './inventory.component.html',
        styleUrls: ['./inventory.component.scss']
    })
], InventoryComponent);
exports.InventoryComponent = InventoryComponent;
//# sourceMappingURL=inventory.component.js.map