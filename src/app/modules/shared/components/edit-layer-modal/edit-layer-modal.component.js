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
exports.EditLayerModalComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
let EditLayerModalComponent = class EditLayerModalComponent {
    constructor(dialog, data) {
        this.dialog = dialog;
        this.title = data.title;
        this.form = new forms_1.FormGroup({
            name: new forms_1.FormControl(data.name, forms_1.Validators.required)
        });
    }
    submit() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            const name = this.form.value.name;
            this.dialog.close(name);
        }
    }
};
EditLayerModalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-edit-layer-modal',
        templateUrl: './edit-layer-modal.component.html',
        styleUrls: ['./edit-layer-modal.component.scss']
    }),
    __param(1, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], EditLayerModalComponent);
exports.EditLayerModalComponent = EditLayerModalComponent;
//# sourceMappingURL=edit-layer-modal.component.js.map