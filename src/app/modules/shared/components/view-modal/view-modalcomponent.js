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
exports.ViewModalComponent = void 0;
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
let ViewModalComponent = class ViewModalComponent {
    constructor(data) {
        this.tooltip = false;
        this.details = false;
        this.hideNextRank = false;
        this.entity = data.entity;
        this.tooltip = this.tooltip ?? false;
        this.details = this.details ?? false;
        this.hideNextRank = this.hideNextRank ?? false;
    }
    isReaper(entity) {
        return 'reaper' in entity;
    }
    isAttribute(entity) {
        return 'attribute' in entity;
    }
    isItem(entity) {
        return 'item' in entity;
    }
    isAncestralLegacy(entity) {
        return 'ancestralLegacy' in entity;
    }
    isActivable(entity) {
        return 'activable' in entity;
    }
    isMechanic(entity) {
        return 'mechanic' in entity;
    }
    isRune(entity) {
        return 'rune' in entity;
    }
    isSkill(entity) {
        return 'skill' in entity;
    }
    isTrait(entity) {
        return 'trait' in entity;
    }
    isUltimatum(entity) {
        return 'ultimatum' in entity;
    }
    isUpgrade(entity) {
        return 'upgrade' in entity;
    }
};
ViewModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-view-modal',
        templateUrl: './view-modal.component.html',
        styleUrls: ['./view-modal.component.scss']
    }),
    __param(0, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], ViewModalComponent);
exports.ViewModalComponent = ViewModalComponent;
//# sourceMappingURL=view-modalcomponent.js.map