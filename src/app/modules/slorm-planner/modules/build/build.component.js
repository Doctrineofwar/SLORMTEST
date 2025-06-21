"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildComponent = void 0;
const core_1 = require("@angular/core");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const operators_1 = require("rxjs/operators");
let BuildComponent = class BuildComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(itemMoveService, buildStorageService, clipboardService, messageService) {
        super();
        this.itemMoveService = itemMoveService;
        this.buildStorageService = buildStorageService;
        this.clipboardService = clipboardService;
        this.messageService = messageService;
        this.ROUTES = [
            { name: 'Inventory', route: 'inventory' },
            { name: 'Skills', route: 'skills' },
            { name: 'Ancestral legacies', route: 'ancestral-legacies' },
            { name: 'Attributes', route: 'attributes' },
            { name: 'Stats', route: 'stats' },
            { name: 'Config', route: 'config' },
            { name: 'Compare', route: 'compare' },
        ];
        this.isDragging = false;
        this.error = null;
        this.dragImage = null;
        this.dragBackground = null;
        this.itemMoveService.draggingItem
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(dragging => {
            this.isDragging = dragging;
            const item = this.itemMoveService.getHoldItem();
            if (item !== null && this.dragImage && this.dragBackground) {
                this.dragImage.nativeElement.src = item.icon;
                this.dragBackground.nativeElement.src = item.itemIconBackground;
            }
        });
        this.buildStorageService.errorChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(error => this.error = error);
    }
    onMouseMove(event) {
        this.itemMoveService.startDragging();
        if (this.isDragging && this.itemMoveService.getHoldItem() !== null && this.dragImage && this.dragBackground) {
            const top = (event.clientY - this.dragImage.nativeElement.height / 2) + 'px';
            const left = (event.clientX - this.dragImage.nativeElement.width / 2) + 'px';
            this.dragImage.nativeElement.style.top = top;
            this.dragImage.nativeElement.style.left = left;
            this.dragBackground.nativeElement.style.top = top;
            this.dragBackground.nativeElement.style.left = left;
        }
    }
    onMouseUp() {
        this.itemMoveService.releaseHoldItem();
    }
    onMouseContextMenu() {
        this.itemMoveService.releaseHoldItem();
    }
    copyCrash() {
        if (this.error !== null) {
            ;
            if (this.clipboardService.copyToClipboard(JSON.stringify(this.error))) {
                this.messageService.message('Crash report copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy crash report to clipboard');
            }
        }
    }
};
__decorate([
    (0, core_1.ViewChild)('dragImage')
], BuildComponent.prototype, "dragImage", void 0);
__decorate([
    (0, core_1.ViewChild)('dragBackground')
], BuildComponent.prototype, "dragBackground", void 0);
__decorate([
    (0, core_1.HostListener)('mousemove', ['$event'])
], BuildComponent.prototype, "onMouseMove", null);
__decorate([
    (0, core_1.HostListener)('mouseup')
], BuildComponent.prototype, "onMouseUp", null);
__decorate([
    (0, core_1.HostListener)('contextmenu')
], BuildComponent.prototype, "onMouseContextMenu", null);
BuildComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-build',
        templateUrl: './build.component.html',
        styleUrls: ['./build.component.scss']
    })
], BuildComponent);
exports.BuildComponent = BuildComponent;
//# sourceMappingURL=build.component.js.map