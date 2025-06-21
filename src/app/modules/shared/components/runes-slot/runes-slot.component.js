"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunesSlotComponent = void 0;
const core_1 = require("@angular/core");
const runes_edit_modal_component_1 = require("../runes-edit-modal/runes-edit-modal.component");
let RunesSlotComponent = class RunesSlotComponent {
    constructor(dialog, slormancerCharacterBuilderService) {
        this.dialog = dialog;
        this.slormancerCharacterBuilderService = slormancerCharacterBuilderService;
        this.character = null;
        this.readonly = false;
        this.changed = new core_1.EventEmitter();
    }
    edit() {
        if (this.character !== null && !this.readonly) {
            const character = this.slormancerCharacterBuilderService.getCharacterClone(this.character);
            const data = { character };
            this.dialog.open(runes_edit_modal_component_1.RunesEditModalComponent, { data })
                .afterClosed().subscribe((runes) => {
                if (runes) {
                    this.changed.emit(runes);
                }
            });
        }
    }
};
__decorate([
    (0, core_1.Input)()
], RunesSlotComponent.prototype, "character", void 0);
__decorate([
    (0, core_1.Input)()
], RunesSlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.Output)()
], RunesSlotComponent.prototype, "changed", void 0);
RunesSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-runes-slot',
        templateUrl: './runes-slot.component.html',
        styleUrls: ['./runes-slot.component.scss']
    })
], RunesSlotComponent);
exports.RunesSlotComponent = RunesSlotComponent;
//# sourceMappingURL=runes-slot.component.js.map