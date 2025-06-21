"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const operators_1 = require("rxjs/operators");
let CompareComponent = class CompareComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, slormancerCharacterComparatorService) {
        super();
        this.buildStorageService = buildStorageService;
        this.slormancerCharacterComparatorService = slormancerCharacterComparatorService;
        this.differences = null;
        this.currentLayer = null;
        this.layers = [];
        this.config = null;
        this.layerControl = new forms_1.FormControl(null);
        this.buildStorageService.buildChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(build => {
            this.layers = build === null ? [] : build.layers;
            this.layerControl.setValue(this.layers[0] ?? null);
        });
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => {
            this.currentLayer = layer;
            if (layer !== null) {
                const layerIndex = this.layers.indexOf(layer);
                if (layerIndex !== -1) {
                    const newCompareToIndex = layerIndex === 0 && this.layers.length > 1 ? 1 : 0;
                    this.layerControl.setValue(this.layers[newCompareToIndex] ?? null);
                    this.updateDifferences();
                }
            }
        });
        this.layerControl.valueChanges.subscribe(() => this.updateDifferences());
    }
    ngOnInit() {
    }
    updateDifferences() {
        this.differences = null;
        if (this.currentLayer !== null && this.layerControl.value && this.currentLayer !== this.layerControl.value) {
            this.differences = this.slormancerCharacterComparatorService.compareCharacters(this.currentLayer.character, this.layerControl.value.character);
        }
    }
};
CompareComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-compare',
        templateUrl: './compare.component.html',
        styleUrls: ['./compare.component.scss']
    })
], CompareComponent);
exports.CompareComponent = CompareComponent;
//# sourceMappingURL=compare.component.js.map