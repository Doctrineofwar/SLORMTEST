"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributesComponent = void 0;
const core_1 = require("@angular/core");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
let AttributesComponent = class AttributesComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService) {
        super();
        this.buildStorageService = buildStorageService;
        this.ALL_ATTRIBUTES = _slorm_api_1.ALL_ATTRIBUTES;
        this.attributes = null;
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => this.attributes = layer === null ? null : layer.character.attributes);
    }
};
AttributesComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-attributes',
        templateUrl: './attributes.component.html',
        styleUrls: ['./attributes.component.scss']
    })
], AttributesComponent);
exports.AttributesComponent = AttributesComponent;
//# sourceMappingURL=attributes.component.js.map