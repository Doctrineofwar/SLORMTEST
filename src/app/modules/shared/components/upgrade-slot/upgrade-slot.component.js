"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeSlotComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let UpgradeSlotComponent = class UpgradeSlotComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(searchService, dialog) {
        super();
        this.searchService = searchService;
        this.dialog = dialog;
        this.upgrade = null;
        this.selected = false;
        this.equipped = false;
        this.overlay = false;
        this.readonly = false;
        this.hiddenBySearch = false;
        this.showOverlay = false;
    }
    onOver() {
        this.showOverlay = true;
    }
    onLeave() {
        this.showOverlay = false;
    }
    ngOnInit() {
        this.searchService.searchChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(search => this.hiddenBySearch = search !== null && this.upgrade !== null && !this.searchService.upgradeMatchSearch(this.upgrade));
    }
    isPassive(upgrade) {
        return upgrade.type === _slorm_api_1.SkillType.Passive;
    }
    showModalTooltip(event, upgrade) {
        let skip = false;
        if (event.ctrlKey && upgrade) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { upgrade } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], UpgradeSlotComponent.prototype, "upgrade", void 0);
__decorate([
    (0, core_1.Input)()
], UpgradeSlotComponent.prototype, "selected", void 0);
__decorate([
    (0, core_1.Input)()
], UpgradeSlotComponent.prototype, "equipped", void 0);
__decorate([
    (0, core_1.Input)()
], UpgradeSlotComponent.prototype, "overlay", void 0);
__decorate([
    (0, core_1.Input)()
], UpgradeSlotComponent.prototype, "readonly", void 0);
__decorate([
    (0, core_1.HostListener)('mouseenter')
], UpgradeSlotComponent.prototype, "onOver", null);
__decorate([
    (0, core_1.HostListener)('mouseleave')
], UpgradeSlotComponent.prototype, "onLeave", null);
UpgradeSlotComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-upgrade-slot',
        templateUrl: './upgrade-slot.component.html',
        styleUrls: ['./upgrade-slot.component.scss']
    })
], UpgradeSlotComponent);
exports.UpgradeSlotComponent = UpgradeSlotComponent;
//# sourceMappingURL=upgrade-slot.component.js.map