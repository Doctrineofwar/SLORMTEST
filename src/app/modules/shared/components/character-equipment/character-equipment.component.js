"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterEquipmentComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let CharacterEquipmentComponent = class CharacterEquipmentComponent {
    constructor(itemMoveService) {
        this.itemMoveService = itemMoveService;
        this.gearSlot = _slorm_api_1.GearSlot;
        this.bases = _slorm_api_1.EquipableItemBase;
        this.character = null;
        this.readonly = false;
        this.changed = new core_1.EventEmitter();
    }
    ngOnInit() {
        const equipCallback = (itemReplaced, item, gearSlot) => this.updateItemCallback(itemReplaced, item, gearSlot);
        this.itemMoveService.setEquipCallback(equipCallback);
    }
    ngOnDestroy() {
        this.itemMoveService.setEquipCallback(null);
    }
    updateItemCallback(itemReplaced, item, gearSlot) {
        if (item !== null && this.character !== null) {
            if (gearSlot !== null) {
                this.updateItem(gearSlot, item);
            }
        }
    }
    updateItem(slot, item) {
        if (this.character !== null) {
            this.character.gear[slot] = item;
            this.changed.emit(this.character);
        }
    }
    updateUltimatum(ultimatum) {
        if (this.character !== null) {
            this.character.ultimatum = ultimatum;
            this.changed.emit(this.character);
        }
    }
};
__decorate([
    (0, core_1.Input)()
], CharacterEquipmentComponent.prototype, "character", void 0);
__decorate([
    (0, core_1.Input)()
], CharacterEquipmentComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.Output)()
], CharacterEquipmentComponent.prototype, "changed", void 0);
CharacterEquipmentComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-character-equipment',
        templateUrl: './character-equipment.component.html',
        styleUrls: ['./character-equipment.component.scss']
    })
], CharacterEquipmentComponent);
exports.CharacterEquipmentComponent = CharacterEquipmentComponent;
//# sourceMappingURL=character-equipment.component.js.map