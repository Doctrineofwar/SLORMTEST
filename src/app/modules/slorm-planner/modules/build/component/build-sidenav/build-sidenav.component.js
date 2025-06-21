"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSidenavComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const abstract_unsubscribe_component_1 = require("@shared/components/abstract-unsubscribe/abstract-unsubscribe.component");
const create_build_modal_component_1 = require("@shared/components/create-build-modal/create-build-modal.component");
const delete_build_modal_component_1 = require("@shared/components/delete-build-modal/delete-build-modal.component");
const edit_build_modal_component_1 = require("@shared/components/edit-build-modal/edit-build-modal.component");
const edit_layer_modal_component_1 = require("@shared/components/edit-layer-modal/edit-layer-modal.component");
const constants_1 = require("@shared/constants");
const _slorm_api_1 = require("@slorm-api");
const rxjs_1 = require("rxjs");
const environment_1 = require("../../../../../../../environments/environment");
let BuildSidenavComponent = class BuildSidenavComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor(messageService, downloadService, clipboardService, importExportService, buildStorageService, buildService, router, dialog) {
        super();
        this.messageService = messageService;
        this.downloadService = downloadService;
        this.clipboardService = clipboardService;
        this.importExportService = importExportService;
        this.buildStorageService = buildStorageService;
        this.buildService = buildService;
        this.router = router;
        this.dialog = dialog;
        this.SHORTCUTS = [
            { link: '/slorm-reaper', icon: 'assets/img/reaper/0/0.png', label: 'Slorm reapers' },
            { link: '/slorm-legendary', icon: 'assets/img/icon/item/ring/adventure.png', label: 'Slorm legendaries' }
        ];
        this.VERSION = environment_1.environment.version;
        this.GITHUB_PROJECT_LINK = constants_1.GITHUB_PROJECT_LINK;
        this.GAME_LINK = constants_1.GAME_LINK;
        this.sidenav = null;
        this.busy = false;
        this.crashed = false;
        this.buildControl = new forms_1.FormControl();
        this.buildControl.valueChanges
            .pipe((0, rxjs_1.takeUntil)(this.unsubscribe), (0, rxjs_1.filter)(_slorm_api_1.isNotNullOrUndefined))
            .subscribe(preview => this.buildStorageService.loadBuild(preview));
        this.buildStorageService.buildChanged
            .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
            .subscribe(() => {
            this.buildControl.setValue(this.buildStorageService.getBuildPreview(), { emitEvent: false });
        });
        this.buildStorageService.errorChanged
            .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
            .subscribe(error => this.crashed = error !== null);
    }
    ngOnInit() {
        this.buildControl.reset(this.buildStorageService.getBuildPreview());
    }
    closeSideNav() {
        if (this.sidenav !== null) {
            this.sidenav.close();
        }
    }
    getBuilds() {
        return this.buildStorageService.getBuilds();
    }
    getHeroClass() {
        let heroClass = _slorm_api_1.HeroClass.Warrior;
        const planner = this.buildStorageService.getBuild();
        if (planner !== null) {
            heroClass = planner.heroClass;
        }
        return heroClass;
    }
    import(sharedData) {
        const build = this.buildStorageService.getBuild();
        if (sharedData !== null && build !== null) {
            if (sharedData.character !== null) {
                const data = {
                    title: 'New character layer\'s name',
                    name: null
                };
                this.dialog.open(edit_layer_modal_component_1.EditLayerModalComponent, { data })
                    .afterClosed().subscribe((name) => {
                    if (name) {
                        const addedLayer = this.buildService.addLayer(build, name, sharedData.character);
                        this.buildStorageService.loadLayer(addedLayer);
                        this.closeSideNav();
                    }
                });
            }
            else if (sharedData.layer !== null) {
                const addedLayer = this.buildService.addLayer(build, sharedData.layer.name, sharedData.layer.character);
                this.buildStorageService.loadLayer(addedLayer);
                this.closeSideNav();
            }
            else if (sharedData.planner !== null) {
                let lastlayer = null;
                for (const layer of sharedData.planner.layers) {
                    lastlayer = this.buildService.addLayer(build, layer.name, layer.character);
                }
                if (lastlayer !== null) {
                    this.buildStorageService.loadLayer(lastlayer);
                }
                this.closeSideNav();
            }
        }
    }
    downloadLayer() {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            const exportedLayer = this.importExportService.exportLayer(layer);
            this.downloadService.downloadFile(exportedLayer, layer.name);
        }
    }
    copyLayer() {
        const layer = this.buildStorageService.getLayer();
        if (layer !== null) {
            const exportedLayer = this.importExportService.exportLayer(layer);
            if (this.clipboardService.copyToClipboard(exportedLayer)) {
                this.messageService.message('Layer copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy layer to clipboard');
            }
        }
    }
    downloadBuild() {
        const build = this.buildStorageService.getBuild();
        if (build !== null) {
            const exportedPlanner = this.importExportService.exportBuild(build);
            this.downloadService.downloadFile(exportedPlanner, 'build.sav');
        }
    }
    copyBuild() {
        const build = this.buildStorageService.getBuild();
        if (build !== null) {
            const exportedBuild = this.importExportService.exportBuild(build);
            if (this.clipboardService.copyToClipboard(exportedBuild)) {
                this.messageService.message('Build copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy build to clipboard');
            }
        }
    }
    copyExternalLink() {
        const layer = this.buildStorageService.getLayer();
        const build = this.buildStorageService.getBuild();
        if (layer !== null && build !== null) {
            const link = this.importExportService.exportCharacterAsLink(layer.character, build.configuration);
            if (this.clipboardService.copyToClipboard(link)) {
                this.messageService.message('Link copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy link to clipboard');
            }
        }
    }
    copyDiscordLink() {
        const layer = this.buildStorageService.getLayer();
        const build = this.buildStorageService.getBuild();
        if (layer !== null && build !== null) {
            const discordLink = this.importExportService.exportCharacterAsDiscordLink(build.name, layer.character, build.configuration);
            if (this.clipboardService.copyToClipboard(discordLink)) {
                this.messageService.message('Discord link copied to clipboard');
            }
            else {
                this.messageService.error('Failed to copy discord link to clipboard');
            }
        }
    }
    deleteBuild() {
        const preview = this.buildStorageService.getBuildPreview();
        console.log('delete build');
        if (preview !== null) {
            const data = {
                name: preview.name
            };
            this.dialog.open(delete_build_modal_component_1.DeleteBuildModalComponent, { data })
                .afterClosed().subscribe((confirm) => {
                if (confirm) {
                    this.buildStorageService.deleteBuild();
                    if (this.buildStorageService.getBuilds().length === 0) {
                        this.router.navigate(['slorm-planner', 'create']);
                    }
                }
            });
        }
    }
    editBuild() {
        const build = this.buildStorageService.getBuild();
        if (build !== null) {
            const data = {
                title: 'Edit build name',
                name: build.name
            };
            this.dialog.open(edit_build_modal_component_1.EditBuildModalComponent, { data })
                .afterClosed().subscribe((name) => {
                if (name) {
                    build.name = name;
                    this.buildStorageService.saveBuild(true);
                }
            });
        }
    }
    createNewBuild() {
        this.dialog.open(create_build_modal_component_1.CreateBuildModalComponent);
    }
    trackbyBuildPreview(index, preview) {
        return preview.storageKey;
    }
};
__decorate([
    (0, core_1.Input)()
], BuildSidenavComponent.prototype, "sidenav", void 0);
BuildSidenavComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-build-sidenav',
        templateUrl: './build-sidenav.component.html',
        styleUrls: ['./build-sidenav.component.scss']
    })
], BuildSidenavComponent);
exports.BuildSidenavComponent = BuildSidenavComponent;
//# sourceMappingURL=build-sidenav.component.js.map