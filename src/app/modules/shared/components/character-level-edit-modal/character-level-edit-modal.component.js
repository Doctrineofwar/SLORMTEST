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
exports.CharacterLevelEditModalComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
const _slorm_api_1 = require("@slorm-api");
let CharacterLevelEditModalComponent = class CharacterLevelEditModalComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.MAX_HERO_LEVEL = _slorm_api_1.MAX_HERO_LEVEL;
        this.form = new forms_1.FormGroup({
            level: new forms_1.FormControl(data.level, [forms_1.Validators.min(1), forms_1.Validators.max(_slorm_api_1.MAX_HERO_LEVEL)])
        });
    }
    submit() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.dialogRef.close(this.form.value.level);
        }
    }
};
CharacterLevelEditModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-character-level-edit-modal',
        templateUrl: './character-level-edit-modal.component.html',
        styleUrls: ['./character-level-edit-modal.component.scss']
    }),
    __param(1, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], CharacterLevelEditModalComponent);
exports.CharacterLevelEditModalComponent = CharacterLevelEditModalComponent;
//# sourceMappingURL=character-level-edit-modal.component.js.map