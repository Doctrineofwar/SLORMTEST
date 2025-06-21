"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBuildFromExportComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let CreateBuildFromExportComponent = class CreateBuildFromExportComponent {
    constructor(buildStorageService, buildService) {
        this.buildStorageService = buildStorageService;
        this.buildService = buildService;
        this.created = new core_1.EventEmitter();
        this.name = 'Default name';
    }
    createBuild(sharedData) {
        let config = _slorm_api_1.DEFAULT_CONFIG;
        if (sharedData.configuration !== null) {
            config = { ...config, ...sharedData.configuration };
        }
        if (sharedData.character !== null) {
            const build = this.buildService.createBuildWithCharacter(this.name, 'Imported layer', sharedData.character, config);
            this.buildStorageService.addBuild(build);
            this.created.emit();
        }
        else if (sharedData.layer !== null) {
            const build = this.buildService.createBuildWithCharacter(this.name, sharedData.layer.name, sharedData.layer.character, config);
            this.buildStorageService.addBuild(build);
            this.created.emit();
        }
        else if (sharedData.planner !== null) {
            this.buildStorageService.addBuild(sharedData.planner);
            this.created.emit();
        }
    }
};
__decorate([
    (0, core_1.Output)()
], CreateBuildFromExportComponent.prototype, "created", void 0);
__decorate([
    (0, core_1.Input)()
], CreateBuildFromExportComponent.prototype, "name", void 0);
CreateBuildFromExportComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-create-build-from-export',
        templateUrl: './create-build-from-export.component.html',
        styleUrls: ['./create-build-from-export.component.scss']
    })
], CreateBuildFromExportComponent);
exports.CreateBuildFromExportComponent = CreateBuildFromExportComponent;
//# sourceMappingURL=create-build-from-export.component.js.map