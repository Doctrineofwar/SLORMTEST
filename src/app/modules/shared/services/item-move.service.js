"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemMoveService = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
let ItemMoveService = class ItemMoveService {
    constructor(buildStorageService) {
        this.buildStorageService = buildStorageService;
        this.draggingItem = new rxjs_1.BehaviorSubject(false);
        this.dragCount = 0;
        this.item = null;
        this.requiredBase = null;
        this.callback = null;
        this.equipCallback = null;
    }
    hold(item, requiredBase, callback = null) {
        this.dragCount = 0;
        this.item = item;
        this.requiredBase = requiredBase;
        this.callback = callback;
    }
    setEquipCallback(equipCallback) {
        this.equipCallback = equipCallback;
    }
    startDragging() {
        if (!this.draggingItem.getValue()) {
            this.dragCount++;
            if (this.item !== null && this.dragCount > 5) {
                this.draggingItem.next(true);
            }
        }
    }
    isDragItemCompatible(item, requiredBase) {
        const sourceIsCompatible = item === null || this.requiredBase === null || item.base === this.requiredBase;
        const targetIsCompatible = this.item !== null && (requiredBase === null || this.item.base === requiredBase);
        return sourceIsCompatible && targetIsCompatible;
    }
    isHoldItem(item) {
        return item === this.item && item !== null;
    }
    getHoldItem() {
        return this.item;
    }
    releaseHoldItem() {
        this.item = null;
        this.requiredBase = null;
        this.callback = null;
        this.draggingItem.next(false);
    }
    swap(item, requiredBase, callbackTarget) {
        const sourceItem = this.item;
        const callableSource = this.callback;
        const compatible = this.isDragItemCompatible(item, requiredBase);
        this.releaseHoldItem();
        if (item !== sourceItem) {
            if (compatible) {
                if (callableSource) {
                    callableSource(true, item);
                }
                if (callbackTarget) {
                    callbackTarget(true, sourceItem);
                }
            }
            else {
                if (callableSource) {
                    callableSource(false, null);
                }
                if (callbackTarget) {
                    callbackTarget(false, null);
                }
            }
        }
    }
    moveDraggedItemToItemGroup(itemGroup) {
        const holdItem = this.item;
        const sourceCallback = this.callback;
        const firstEmptyPosition = itemGroup.indexOf(null);
        const itemPosition = itemGroup.indexOf(holdItem);
        this.releaseHoldItem();
        if (firstEmptyPosition !== -1 || itemPosition !== -1) {
            if (sourceCallback) {
                sourceCallback(true, null);
            }
            const newPosition = Math.min(...[firstEmptyPosition, itemPosition].filter(v => v !== -1));
            itemGroup.splice(newPosition, 1, holdItem);
        }
        else {
            if (sourceCallback) {
                sourceCallback(false, null);
            }
        }
    }
    equip(item, callbackTarget) {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null && layer.character !== null) {
            const requiredBase = item.base;
            const compatibleGearSlot = this.getCompatibleGearSlot(layer.character, item);
            this.hold(item, requiredBase, callbackTarget);
            this.swap(layer.character.gear[compatibleGearSlot], requiredBase, (itemReplaced, swapedItem) => {
                if (this.equipCallback !== null) {
                    this.equipCallback(itemReplaced, swapedItem, compatibleGearSlot);
                }
            });
        }
    }
    moveToStash(item, callbackTarget) {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null && layer.character !== null) {
            const firstValidItemGroup = [
                layer.character.inventory,
                ...layer.character.sharedInventory
            ].filter(group => group.find(item => item === null) !== undefined)[0];
            if (firstValidItemGroup) {
                this.hold(item, null, callbackTarget);
                this.moveDraggedItemToItemGroup(firstValidItemGroup);
            }
        }
    }
    getCompatibleGearSlot(character, item) {
        let result;
        switch (item.base) {
            case _slorm_api_1.EquipableItemBase.Amulet:
                result = _slorm_api_1.GearSlot.Amulet;
                break;
            case _slorm_api_1.EquipableItemBase.Belt:
                result = _slorm_api_1.GearSlot.Belt;
                break;
            case _slorm_api_1.EquipableItemBase.Body:
                result = _slorm_api_1.GearSlot.Body;
                break;
            case _slorm_api_1.EquipableItemBase.Boot:
                result = _slorm_api_1.GearSlot.Boot;
                break;
            case _slorm_api_1.EquipableItemBase.Bracer:
                result = _slorm_api_1.GearSlot.Bracer;
                break;
            case _slorm_api_1.EquipableItemBase.Cape:
                result = _slorm_api_1.GearSlot.Cape;
                break;
            case _slorm_api_1.EquipableItemBase.Glove:
                result = _slorm_api_1.GearSlot.Glove;
                break;
            case _slorm_api_1.EquipableItemBase.Helm:
                result = _slorm_api_1.GearSlot.Helm;
                break;
            case _slorm_api_1.EquipableItemBase.Shoulder:
                result = _slorm_api_1.GearSlot.Shoulder;
                break;
            case _slorm_api_1.EquipableItemBase.Ring:
                if (character.gear.ring_r === null) {
                    result = _slorm_api_1.GearSlot.RightRing;
                }
                else {
                    result = _slorm_api_1.GearSlot.LeftRing;
                }
                break;
        }
        return result;
    }
};
ItemMoveService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], ItemMoveService);
exports.ItemMoveService = ItemMoveService;
//# sourceMappingURL=item-move.service.js.map