"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivableViewComponent = void 0;
const core_1 = require("@angular/core");
let ActivableViewComponent = class ActivableViewComponent {
    constructor() {
        this.activable = null;
    }
};
__decorate([
    (0, core_1.Input)()
], ActivableViewComponent.prototype, "activable", void 0);
ActivableViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-activable-view',
        templateUrl: './activable-view.component.html',
        styleUrls: ['./activable-view.component.scss']
    })
], ActivableViewComponent);
exports.ActivableViewComponent = ActivableViewComponent;
//# sourceMappingURL=activable-view.component.js.map