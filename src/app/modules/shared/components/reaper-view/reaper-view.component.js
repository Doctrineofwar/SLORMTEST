"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaperViewComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let ReaperViewComponent = class ReaperViewComponent {
    constructor() {
        this.reaper = null;
        this.maxHeight = null;
        this.tooltip = false;
        this.content = null;
        this.main = null;
    }
    ngAfterViewChecked() {
        if (this.main && this.tooltip) {
            (0, _slorm_api_1.adaptOverlay)(this.main.nativeElement);
        }
    }
    ngOnDestroy() {
        (0, _slorm_api_1.resetOverlay)();
    }
    scroll(event) {
        if (this.content) {
            this.content.nativeElement.scrollTop += event.deltaY;
        }
    }
};
__decorate([
    (0, core_1.Input)()
], ReaperViewComponent.prototype, "reaper", void 0);
__decorate([
    (0, core_1.Input)()
], ReaperViewComponent.prototype, "maxHeight", void 0);
__decorate([
    (0, core_1.Input)()
], ReaperViewComponent.prototype, "tooltip", void 0);
__decorate([
    (0, core_1.ViewChild)('content')
], ReaperViewComponent.prototype, "content", void 0);
__decorate([
    (0, core_1.ViewChild)('main')
], ReaperViewComponent.prototype, "main", void 0);
ReaperViewComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-reaper-view',
        templateUrl: './reaper-view.component.html',
        styleUrls: ['./reaper-view.component.scss']
    })
], ReaperViewComponent);
exports.ReaperViewComponent = ReaperViewComponent;
//# sourceMappingURL=reaper-view.component.js.map