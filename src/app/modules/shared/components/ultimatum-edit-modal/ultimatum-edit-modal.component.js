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
exports.UltimatumEditModalComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
const _slorm_api_1 = require("@slorm-api");
let UltimatumEditModalComponent = class UltimatumEditModalComponent {
    constructor(dialogRef, slormancerUltimatumService, formOptionsService, data) {
        this.dialogRef = dialogRef;
        this.slormancerUltimatumService = slormancerUltimatumService;
        this.formOptionsService = formOptionsService;
        this.ULTIMATUM_MAX_LEVEL = _slorm_api_1.ULTIMATUM_MAX_LEVEL;
        this.options = [];
        this.bonusLevel = data.ultimatum === null ? 0 : data.ultimatum.bonusLevel;
        this.originalUltimatum = data.ultimatum === null
            ? this.slormancerUltimatumService.getUltimatum(_slorm_api_1.UltimatumType.AdamantAbundance, 1, this.bonusLevel)
            : this.slormancerUltimatumService.getUltimatumClone(data.ultimatum);
        this.options = this.formOptionsService.getUltimatumOptions();
        this.reset();
    }
    reset() {
        this.ultimatum = this.slormancerUltimatumService.getUltimatumClone(this.originalUltimatum);
        this.form = this.buildForm();
    }
    submit() {
        if (this.form.valid) {
            this.dialogRef.close(this.ultimatum);
        }
    }
    updatePreview(form) {
        if (form.valid) {
            const value = form.value;
            this.ultimatum = this.slormancerUltimatumService.getUltimatum(value.type, value.level, this.bonusLevel);
        }
    }
    getTypeControl() {
        return this.form.get('type');
    }
    buildForm() {
        const newForm = new forms_1.FormGroup({
            level: new forms_1.FormControl(this.ultimatum.baseLevel, [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.max(_slorm_api_1.ULTIMATUM_MAX_LEVEL)]),
            type: new forms_1.FormControl(this.ultimatum.type, [forms_1.Validators.required]),
        });
        newForm.valueChanges.subscribe(() => {
            this.updatePreview(newForm);
        });
        this.updatePreview(newForm);
        return newForm;
    }
};
UltimatumEditModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-ultimatum-edit-modal',
        templateUrl: './ultimatum-edit-modal.component.html',
        styleUrls: ['./ultimatum-edit-modal.component.scss']
    }),
    __param(3, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], UltimatumEditModalComponent);
exports.UltimatumEditModalComponent = UltimatumEditModalComponent;
//# sourceMappingURL=ultimatum-edit-modal.component.js.map