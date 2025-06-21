"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsComponent = void 0;
const core_1 = require("@angular/core");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const operators_1 = require("rxjs/operators");
let StatsComponent = class StatsComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService) {
        super();
        this.buildStorageService = buildStorageService;
        this.stats = null;
        this.selectedMergedStat = null;
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => {
            this.stats = layer === null ? null : layer.character.stats;
        });
    }
    selectMergedStat(mergedStat) {
        console.log(mergedStat);
        this.selectedMergedStat = mergedStat;
    }
};
StatsComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-stats',
        templateUrl: './stats.component.html',
        styleUrls: ['./stats.component.scss']
    })
], StatsComponent);
exports.StatsComponent = StatsComponent;
//# sourceMappingURL=stats.component.js.map