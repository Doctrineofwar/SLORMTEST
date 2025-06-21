"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialModule = void 0;
const overlay_1 = require("@angular/cdk/overlay");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const button_1 = require("@angular/material/button");
const card_1 = require("@angular/material/card");
const checkbox_1 = require("@angular/material/checkbox");
const core_2 = require("@angular/material/core");
const dialog_1 = require("@angular/material/dialog");
const form_field_1 = require("@angular/material/form-field");
const icon_1 = require("@angular/material/icon");
const input_1 = require("@angular/material/input");
const menu_1 = require("@angular/material/menu");
const select_1 = require("@angular/material/select");
const sidenav_1 = require("@angular/material/sidenav");
const slider_1 = require("@angular/material/slider");
const snack_bar_1 = require("@angular/material/snack-bar");
const tabs_1 = require("@angular/material/tabs");
const tooltip_1 = require("@angular/material/tooltip");
const globalRippleConfig = {
    disabled: true,
    animation: {
        enterDuration: 0,
        exitDuration: 0
    }
};
const globalTooltipConfig = {
    showDelay: 0,
    hideDelay: 0,
    touchendHideDelay: 0,
    position: 'above'
};
let MaterialModule = class MaterialModule {
};
MaterialModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [],
        imports: [
            tabs_1.MatTabsModule,
            button_1.MatButtonModule,
            icon_1.MatIconModule,
            card_1.MatCardModule,
            dialog_1.MatDialogModule,
            form_field_1.MatFormFieldModule,
            input_1.MatInputModule,
            select_1.MatSelectModule,
            core_2.MatOptionModule,
            slider_1.MatSliderModule,
            checkbox_1.MatCheckboxModule,
            menu_1.MatMenuModule,
            snack_bar_1.MatSnackBarModule,
            sidenav_1.MatSidenavModule,
            tooltip_1.MatTooltipModule,
            overlay_1.OverlayModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
        ],
        exports: [
            tabs_1.MatTabsModule,
            button_1.MatButtonModule,
            icon_1.MatIconModule,
            card_1.MatCardModule,
            dialog_1.MatDialogModule,
            form_field_1.MatFormFieldModule,
            input_1.MatInputModule,
            select_1.MatSelectModule,
            core_2.MatOptionModule,
            slider_1.MatSliderModule,
            checkbox_1.MatCheckboxModule,
            menu_1.MatMenuModule,
            snack_bar_1.MatSnackBarModule,
            sidenav_1.MatSidenavModule,
            tooltip_1.MatTooltipModule,
            overlay_1.OverlayModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
        ],
        providers: [
            { provide: core_2.MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
            { provide: tooltip_1.MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: globalTooltipConfig }
        ],
    })
], MaterialModule);
exports.MaterialModule = MaterialModule;
//# sourceMappingURL=material.module.js.map