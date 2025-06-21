"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegendaryEffectViewComponent = void 0;
const core_1 = require("@angular/core");
let LegendaryEffectViewComponent = class LegendaryEffectViewComponent {
    constructor() {
        this.legendaryEffect = null;
        this.reinforcement = null;
    }
};
__decorate([
    (0, core_1.Input)()
], LegendaryEffectViewComponent.prototype, "legendaryEffect", void 0);
__decorate([
    (0, core_1.Input)()
], LegendaryEffectViewComponent.prototype, "reinforcement", void 0);
LegendaryEffectViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-legendary-effect-view',
        templateUrl: './legendary-effect-view.component.html',
        styleUrls: ['./legendary-effect-view.component.scss']
    })
], LegendaryEffectViewComponent);
exports.LegendaryEffectViewComponent = LegendaryEffectViewComponent;
//# sourceMappingURL=legendary-effect-view.component.js.map