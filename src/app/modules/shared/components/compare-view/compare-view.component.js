"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareViewComponent = void 0;
const core_1 = require("@angular/core");
let CompareViewComponent = class CompareViewComponent {
    constructor() {
        this.differences = [];
    }
    valueToString(value, noReduction = false) {
        let result = '';
        if (typeof value === 'number') {
            if (value > 10000 && !noReduction) {
                result += Math.floor(value / 1000) + 'k';
            }
            else {
                result += value;
            }
        }
        else {
            if (value.min > 10000 && value.max > 10000 && !noReduction) {
                result += Math.floor(value.min / 1000) + 'k - ' + Math.floor(value.max / 1000) + 'k';
            }
            else {
                result += value.min + ' - ' + value.max;
            }
        }
        return result;
    }
    changeToString(change) {
        let result = '';
        if (Number.isFinite(change)) {
            if (change > 0) {
                result = '+';
            }
            result += change + '%';
        }
        return result;
    }
};
__decorate([
    (0, core_1.Input)()
], CompareViewComponent.prototype, "differences", void 0);
CompareViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-compare-view',
        templateUrl: './compare-view.component.html',
        styleUrls: ['./compare-view.component.scss']
    })
], CompareViewComponent);
exports.CompareViewComponent = CompareViewComponent;
//# sourceMappingURL=compare-view.component.js.map