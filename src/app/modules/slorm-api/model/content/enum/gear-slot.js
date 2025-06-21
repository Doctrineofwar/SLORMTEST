"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gearSlotToBase = exports.ALL_GEAR_SLOT_VALUES = exports.GearSlot = void 0;
const equipable_item_base_1 = require("./equipable-item-base");
var GearSlot;
(function (GearSlot) {
    GearSlot["Helm"] = "helm";
    GearSlot["Body"] = "body";
    GearSlot["Shoulder"] = "shoulder";
    GearSlot["Bracer"] = "bracer";
    GearSlot["Glove"] = "glove";
    GearSlot["Boot"] = "boot";
    GearSlot["LeftRing"] = "ring_l";
    GearSlot["RightRing"] = "ring_r";
    GearSlot["Amulet"] = "amulet";
    GearSlot["Belt"] = "belt";
    GearSlot["Cape"] = "cape";
})(GearSlot = exports.GearSlot || (exports.GearSlot = {}));
exports.ALL_GEAR_SLOT_VALUES = [
    GearSlot.Helm,
    GearSlot.Body,
    GearSlot.Shoulder,
    GearSlot.Bracer,
    GearSlot.Glove,
    GearSlot.Boot,
    GearSlot.LeftRing,
    GearSlot.RightRing,
    GearSlot.Amulet,
    GearSlot.Belt,
    GearSlot.Cape
];
function gearSlotToBase(slot) {
    let result;
    if (slot === GearSlot.Helm) {
        result = equipable_item_base_1.EquipableItemBase.Helm;
    }
    else if (slot === GearSlot.Body) {
        result = equipable_item_base_1.EquipableItemBase.Body;
    }
    else if (slot === GearSlot.Shoulder) {
        result = equipable_item_base_1.EquipableItemBase.Shoulder;
    }
    else if (slot === GearSlot.Bracer) {
        result = equipable_item_base_1.EquipableItemBase.Bracer;
    }
    else if (slot === GearSlot.Glove) {
        result = equipable_item_base_1.EquipableItemBase.Glove;
    }
    else if (slot === GearSlot.Boot) {
        result = equipable_item_base_1.EquipableItemBase.Boot;
    }
    else if (slot === GearSlot.LeftRing || slot === GearSlot.RightRing) {
        result = equipable_item_base_1.EquipableItemBase.Ring;
    }
    else if (slot === GearSlot.Amulet) {
        result = equipable_item_base_1.EquipableItemBase.Amulet;
    }
    else if (slot === GearSlot.Belt) {
        result = equipable_item_base_1.EquipableItemBase.Belt;
    }
    else {
        result = equipable_item_base_1.EquipableItemBase.Cape;
    }
    return result;
}
exports.gearSlotToBase = gearSlotToBase;
//# sourceMappingURL=gear-slot.js.map