"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeLineComponent = void 0;
const core_1 = require("@angular/core");
const view_modalcomponent_1 = require("../view-modal/view-modalcomponent");
let AttributeLineComponent = class AttributeLineComponent {
    constructor(slormancerAttributeService, buildStorageService, dialog) {
        this.slormancerAttributeService = slormancerAttributeService;
        this.buildStorageService = buildStorageService;
        this.dialog = dialog;
        this.MAX_RANK = 75;
        this.attribute = null;
        this.remainingPoints = 0;
        this.iconShift = false;
        this.short = false;
        this.readonly = false;
        this.unlockedRange = { min: 0, max: 0 };
        this.highlightRange = { min: 0, max: 0 };
        this.bonusRange = { min: 0, max: 0 };
        this.cappedCursor = 0;
        this.showSummary = false;
        this.cursorIndex = null;
    }
    ngOnInit() {
        this.updateCursor();
    }
    ngOnChanges() {
        this.updateCursor();
    }
    updateCursor() {
        if (this.attribute !== null) {
            if (this.cursorIndex === null) {
                this.cappedCursor = this.attribute.baseRank;
                this.highlightRange = { min: 0, max: 0 };
                this.unlockedRange = { min: 0, max: this.attribute.baseRank };
                this.bonusRange = { min: this.attribute.baseRank, max: this.attribute.baseRank + this.attribute.bonusRank };
            }
            else {
                this.cappedCursor = Math.min(this.attribute.baseRank + this.remainingPoints, this.cursorIndex + 1);
                this.bonusRange = { min: Math.max(this.cappedCursor, this.attribute.baseRank), max: this.attribute.baseRank + this.attribute.bonusRank };
                if (this.cursorIndex < this.attribute.baseRank) {
                    this.highlightRange = { min: this.cursorIndex + 1, max: Math.max(this.attribute.baseRank, this.cursorIndex + 1) };
                }
                else {
                    this.highlightRange = { min: this.attribute.baseRank, max: this.cappedCursor };
                }
            }
        }
    }
    nodeEnter(index) {
        this.cursorIndex = index;
        this.updateCursor();
    }
    nodeLeave() {
        this.cursorIndex = null;
        this.updateCursor();
    }
    setRank(rank) {
        if (this.attribute !== null && this.attribute.baseRank !== rank && !this.readonly) {
            this.attribute.baseRank = rank;
            this.slormancerAttributeService.updateAttributeTraits(this.attribute);
            this.buildStorageService.saveLayer();
            this.updateCursor();
        }
    }
    nodeClick(index) {
        if (this.attribute !== null) {
            this.setRank(this.cappedCursor);
            console.log(this.attribute.traits[index]);
        }
    }
    isUnlocked(index) {
        return index >= this.unlockedRange.min && index < this.unlockedRange.max;
    }
    isHighlight(index) {
        return index >= this.highlightRange.min && index < this.highlightRange.max;
    }
    isBonus(index) {
        return index >= this.bonusRange.min && index < this.bonusRange.max;
    }
    addPoint(event) {
        if (this.attribute !== null && this.remainingPoints > 0) {
            let maxPoints = Math.min(this.remainingPoints, (this.MAX_RANK - this.attribute.baseRank));
            this.setRank(this.attribute.baseRank + Math.min(maxPoints, event.shiftKey ? 10 : 1));
        }
    }
    removePoint(event) {
        if (this.attribute !== null && this.attribute.baseRank > 0) {
            this.setRank(this.attribute.baseRank - Math.min(this.attribute.baseRank, event.shiftKey ? 10 : 1));
        }
    }
    trackByTrait(index, trait) {
        return index;
    }
    showModalTooltip(event, attribute) {
        let skip = false;
        if (event.ctrlKey) {
            skip = true;
            event.stopPropagation();
            event.stopImmediatePropagation();
            const data = { entity: { attribute } };
            this.dialog.open(view_modalcomponent_1.ViewModalComponent, { data });
        }
        return skip;
    }
};
__decorate([
    (0, core_1.Input)()
], AttributeLineComponent.prototype, "attribute", void 0);
__decorate([
    (0, core_1.Input)()
], AttributeLineComponent.prototype, "remainingPoints", void 0);
__decorate([
    (0, core_1.Input)()
], AttributeLineComponent.prototype, "iconShift", void 0);
__decorate([
    (0, core_1.Input)()
], AttributeLineComponent.prototype, "short", void 0);
__decorate([
    (0, core_1.Input)()
], AttributeLineComponent.prototype, "readonly", void 0);
AttributeLineComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-attribute-line',
        templateUrl: './attribute-line.component.html',
        styleUrls: ['./attribute-line.component.scss']
    })
], AttributeLineComponent);
exports.AttributeLineComponent = AttributeLineComponent;
//# sourceMappingURL=attribute-line.component.js.map