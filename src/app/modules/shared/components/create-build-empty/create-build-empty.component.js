"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBuildEmptyComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let CreateBuildEmptyComponent = class CreateBuildEmptyComponent {
    constructor(buildService, buildStorageService) {
        this.buildService = buildService;
        this.buildStorageService = buildStorageService;
        this.HERO_CLASSES = [_slorm_api_1.HeroClass.Warrior, _slorm_api_1.HeroClass.Huntress, _slorm_api_1.HeroClass.Mage];
        this.created = new core_1.EventEmitter();
        this.name = 'Default name';
        this.selectedClass = null;
    }
    createBuild() {
        if (this.selectedClass !== null) {
            const build = this.buildService.createBuild(this.selectedClass, this.name, _slorm_api_1.DEFAULT_CONFIG);
            this.buildService.addLayer(build, this.name);
            this.buildStorageService.addBuild(build);
            this.created.emit();
        }
    }
};
__decorate([
    (0, core_1.Output)()
], CreateBuildEmptyComponent.prototype, "created", void 0);
__decorate([
    (0, core_1.Input)()
], CreateBuildEmptyComponent.prototype, "name", void 0);
CreateBuildEmptyComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-create-build-empty',
        templateUrl: './create-build-empty.component.html',
        styleUrls: ['./create-build-empty.component.scss']
    })
], CreateBuildEmptyComponent);
exports.CreateBuildEmptyComponent = CreateBuildEmptyComponent;
//# sourceMappingURL=create-build-empty.component.js.map