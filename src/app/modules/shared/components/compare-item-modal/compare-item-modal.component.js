"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareItemModalComponent = void 0;
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
let CompareItemModalComponent = class CompareItemModalComponent {
    constructor(data, slormancerItemService, slormancerCharacterBuilderService, slormancerCharacterUpdaterService, slormancerCharacterComparatorService) {
        this.slormancerItemService = slormancerItemService;
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.slormancerCharacterUpdaterService = slormancerCharacterUpdaterService;
        this.slormancerCharacterComparatorService = slormancerCharacterComparatorService;
        const leftCharacter = this.slormancerCharacterBuilderService.getCharacterClone(data.character);
        const rightCharacter = this.slormancerCharacterBuilderService.getCharacterClone(data.character);
        leftCharacter.gear[data.slot] = this.slormancerItemService.getEquipableItemClone(data.left);
        rightCharacter.gear[data.slot] = this.slormancerItemService.getEquipableItemClone(data.right);
        this.slormancerCharacterUpdaterService.updateCharacter(leftCharacter, data.config);
        this.slormancerCharacterUpdaterService.updateCharacter(rightCharacter, data.config);
        this.left = data.left;
        this.right = data.right;
        this.differences = this.slormancerCharacterComparatorService.compareCharacters(leftCharacter, rightCharacter);
    }
};
CompareItemModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-compare-item-modal',
        templateUrl: './compare-item-modal.component.html',
        styleUrls: ['./compare-item-modal.component.scss']
    }),
    __param(0, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], CompareItemModalComponent);
exports.CompareItemModalComponent = CompareItemModalComponent;
//# sourceMappingURL=compare-item-modal.component.js.map