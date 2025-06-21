"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildHeaderComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const delete_layer_modal_component_1 = require("@shared/components/delete-layer-modal/delete-layer-modal.component");
const edit_layer_modal_component_1 = require("@shared/components/edit-layer-modal/edit-layer-modal.component");
const _slorm_api_1 = require("@slorm-api");
const operators_1 = require("rxjs/operators");
let BuildHeaderComponent = class BuildHeaderComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(buildStorageService, buildService, searchService, dialog) {
        super();
        this.buildStorageService = buildStorageService;
        this.buildService = buildService;
        this.searchService = searchService;
        this.dialog = dialog;
        this.searchControl = new forms_1.FormControl('');
        this.layerControl = new forms_1.FormControl(null);
        this.layerOptions = [];
    }
    ngOnInit() {
        this.buildStorageService.layerChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(layer => this.layerControl.setValue(layer, { emitEvent: false }));
        this.buildStorageService.buildChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(build => {
            this.layerOptions = build === null ? [] : build.layers.map(layer => ({ label: layer.name, value: layer }));
        });
        this.searchService.searchChanged
            .pipe((0, operators_1.takeUntil)(this.unsubscribe))
            .subscribe(search => this.searchControl.setValue(search, { emitEvent: false }));
        this.layerControl.setValue(this.buildStorageService.getLayer(), { emitEvent: false });
        this.layerControl.valueChanges
            .pipe((0, operators_1.filter)(_slorm_api_1.isNotNullOrUndefined))
            .subscribe(layer => this.buildStorageService.loadLayer(layer));
        this.searchControl.valueChanges.subscribe(search => this.searchService.setSearch(search));
    }
    hasSearch() {
        return this.searchService.hasSearch();
    }
    removeSearch() {
        this.searchService.setSearch(null);
    }
    editLayer() {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            const data = {
                title: 'Edit layer name',
                name: layer.name
            };
            this.dialog.open(edit_layer_modal_component_1.EditLayerModalComponent, { data })
                .afterClosed().subscribe(name => {
                if (name) {
                    layer.name = name;
                    this.buildStorageService.saveLayer();
                }
            });
        }
    }
    addLayer() {
        const data = {
            title: 'New layer name',
            name: null
        };
        this.dialog.open(edit_layer_modal_component_1.EditLayerModalComponent, { data })
            .afterClosed().subscribe(name => {
            const build = this.buildStorageService.getBuild();
            if (name && build !== null) {
                const addedLayer = this.buildService.addLayer(build, name);
                this.buildStorageService.loadLayer(addedLayer);
            }
        });
    }
    duplicateLayer() {
        const data = {
            title: 'New layer name',
            name: null
        };
        this.dialog.open(edit_layer_modal_component_1.EditLayerModalComponent, { data })
            .afterClosed().subscribe(name => {
            const build = this.buildStorageService.getBuild();
            const layer = this.buildStorageService.getLayer();
            if (name && build !== null && layer !== null) {
                const addedLayer = this.buildService.duplicateLayer(build, layer, name);
                this.buildStorageService.loadLayer(addedLayer);
            }
        });
    }
    removeLayer() {
        const layer = this.buildStorageService.getLayer();
        const build = this.buildStorageService.getBuild();
        if (layer !== null) {
            const data = {
                name: layer.name
            };
            this.dialog.open(delete_layer_modal_component_1.DeleteLayerModalComponent, { data })
                .afterClosed().subscribe(del => {
                if (del && build !== null) {
                    this.buildService.deleteLayer(build, layer);
                    this.buildStorageService.saveBuild(true);
                }
            });
        }
    }
    hasRoomForMoreLayer() {
        return this.buildStorageService.hasRoomForAnotherLayer();
    }
};
BuildHeaderComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-build-header',
        templateUrl: './build-header.component.html',
        styleUrls: ['./build-header.component.scss']
    })
], BuildHeaderComponent);
exports.BuildHeaderComponent = BuildHeaderComponent;
//# sourceMappingURL=build-header.component.js.map