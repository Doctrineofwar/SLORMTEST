"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFirstBuildComponent = void 0;
const core_1 = require("@angular/core");
let CreateFirstBuildComponent = class CreateFirstBuildComponent {
    constructor(router) {
        this.router = router;
        this.created = new core_1.EventEmitter();
    }
    redirectToBuild() {
        this.router.navigate(['slorm-planner', 'build']);
    }
};
CreateFirstBuildComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-create-first-build',
        templateUrl: './create-first-build.component.html',
        styleUrls: ['./create-first-build.component.scss']
    })
], CreateFirstBuildComponent);
exports.CreateFirstBuildComponent = CreateFirstBuildComponent;
//# sourceMappingURL=create-first-build.component.js.map