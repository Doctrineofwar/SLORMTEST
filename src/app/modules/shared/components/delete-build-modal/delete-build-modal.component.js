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
exports.DeleteBuildModalComponent = void 0;
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
let DeleteBuildModalComponent = class DeleteBuildModalComponent {
    constructor(data) {
        this.name = data.name;
    }
};
DeleteBuildModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-delete-build-modal',
        templateUrl: './delete-build-modal.component.html',
        styleUrls: ['./delete-build-modal.component.scss']
    }),
    __param(0, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], DeleteBuildModalComponent);
exports.DeleteBuildModalComponent = DeleteBuildModalComponent;
//# sourceMappingURL=delete-build-modal.component.js.map