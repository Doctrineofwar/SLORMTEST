"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicsViewComponent = void 0;
const core_1 = require("@angular/core");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let MechanicsViewComponent = class MechanicsViewComponent {
    constructor(dialog) {
        this.dialog = dialog;
        this.classMechanics = [];
        this.mechanics = [];
        this.buffs = [];
        this.overlayTrigger = null;
        this.overlayMechanic = null;
    }
    showOverlay(trigger, mechanic) {
        this.overlayMechanic = mechanic;
        this.overlayTrigger = trigger;
    }
    hideOverlay() {
        this.overlayTrigger = null;
        this.overlayMechanic = null;
    }
    showModalTooltip(event, mechanic) {
        let skip = false;
        if (event.ctrlKey) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { mechanic } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], MechanicsViewComponent.prototype, "classMechanics", void 0);
__decorate([
    (0, core_1.Input)()
], MechanicsViewComponent.prototype, "mechanics", void 0);
__decorate([
    (0, core_1.Input)()
], MechanicsViewComponent.prototype, "buffs", void 0);
MechanicsViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-mechanics-view',
        templateUrl: './mechanics-view.component.html',
        styleUrls: ['./mechanics-view.component.scss']
    })
], MechanicsViewComponent);
exports.MechanicsViewComponent = MechanicsViewComponent;
//# sourceMappingURL=mechanics-view.component.js.map