"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigEntryComponent = void 0;
const core_1 = require("@angular/core");
let ConfigEntryComponent = class ConfigEntryComponent {
    constructor() {
        this.control = null;
        this.config = null;
    }
    isNumber(config) {
        return config.type === 'number';
    }
    isEnum(config) {
        return config.type === 'enum';
    }
    isBoolean(config) {
        return config.type === 'boolean';
    }
};
__decorate([
    (0, core_1.Input)()
], ConfigEntryComponent.prototype, "control", void 0);
__decorate([
    (0, core_1.Input)()
], ConfigEntryComponent.prototype, "config", void 0);
ConfigEntryComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-config-entry',
        templateUrl: './config-entry.component.html',
        styleUrls: ['./config-entry.component.scss']
    })
], ConfigEntryComponent);
exports.ConfigEntryComponent = ConfigEntryComponent;
//# sourceMappingURL=config-entry.component.js.map