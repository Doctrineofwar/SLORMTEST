"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBuildComponent = void 0;
const core_1 = require("@angular/core");
let CreateBuildComponent = class CreateBuildComponent {
    constructor() {
        this.created = new core_1.EventEmitter();
        this.more = false;
        this.buildName = 'My build';
    }
    ngOnInit() {
        this.more = false;
    }
    passCreatedEvent() {
        this.created.emit();
    }
};
__decorate([
    (0, core_1.Output)()
], CreateBuildComponent.prototype, "created", void 0);
CreateBuildComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-create-build',
        templateUrl: './create-build.component.html',
        styleUrls: ['./create-build.component.scss']
    })
], CreateBuildComponent);
exports.CreateBuildComponent = CreateBuildComponent;
//# sourceMappingURL=create-build.component.js.map