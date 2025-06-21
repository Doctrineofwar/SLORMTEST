"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterAnimationComponent = void 0;
const core_1 = require("@angular/core");
let CharacterAnimationComponent = class CharacterAnimationComponent {
    constructor() {
        this.heroClass = null;
        this.suffix = '';
        this.flipAnimation = false;
        this.animation = null;
    }
    mouseMoved(event) {
        if (this.animation !== null) {
            const bounding = this.animation.nativeElement.getBoundingClientRect();
            const center = bounding.left + this.animation.nativeElement.clientWidth / 2;
            const flip = center < event.clientX;
            if (this.flipAnimation !== flip) {
                this.flipAnimation = flip;
            }
        }
    }
    ngOnInit() { }
};
__decorate([
    (0, core_1.Input)()
], CharacterAnimationComponent.prototype, "heroClass", void 0);
__decorate([
    (0, core_1.Input)()
], CharacterAnimationComponent.prototype, "suffix", void 0);
__decorate([
    (0, core_1.ViewChild)('animation')
], CharacterAnimationComponent.prototype, "animation", void 0);
__decorate([
    (0, core_1.HostListener)('window:mousemove', ['$event'])
], CharacterAnimationComponent.prototype, "mouseMoved", null);
CharacterAnimationComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-character-animation',
        templateUrl: './character-animation.component.html',
        styleUrls: ['./character-animation.component.scss']
    })
], CharacterAnimationComponent);
exports.CharacterAnimationComponent = CharacterAnimationComponent;
//# sourceMappingURL=character-animation.component.js.map