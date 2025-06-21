"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportDataComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let ImportDataComponent = class ImportDataComponent {
    constructor(importExportService) {
        this.importExportService = importExportService;
        this.MAX_UPLOAD_FILE_SIZE_MO = 1;
        this.MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * this.MAX_UPLOAD_FILE_SIZE_MO;
        this.uploadLabel = null;
        this.importLabel = null;
        this.heroClass = null;
        this.import = new core_1.EventEmitter();
        this.sharedData = null;
        this.importContent = new forms_1.FormControl(null, forms_1.Validators.maxLength(this.MAX_UPLOAD_FILE_SIZE));
        this.importContent.valueChanges.subscribe(content => {
            if (content === null || content.length === 0) {
                this.sharedData = null;
            }
            else {
                this.parseExportedData(content);
            }
        });
    }
    parseExportedData(content) {
        this.sharedData = this.importExportService.import(content, this.heroClass);
    }
    hasValidSharedData() {
        return this.sharedData !== null && ((this.sharedData.character !== null && (this.heroClass === null || this.sharedData.character.heroClass === this.heroClass)) ||
            (this.sharedData.layer !== null && (this.heroClass === null || this.sharedData.layer.character.heroClass === this.heroClass)) ||
            (this.sharedData.planner !== null && (this.heroClass === null || this.sharedData.planner.heroClass === this.heroClass)));
    }
    upload(content) {
        this.importContent.setValue(content);
    }
    importData() {
        if (this.sharedData !== null) {
            this.import.emit(this.sharedData);
            this.importContent.setValue('');
            this.sharedData = null;
        }
    }
};
__decorate([
    (0, core_1.Input)()
], ImportDataComponent.prototype, "uploadLabel", void 0);
__decorate([
    (0, core_1.Input)()
], ImportDataComponent.prototype, "importLabel", void 0);
__decorate([
    (0, core_1.Input)()
], ImportDataComponent.prototype, "heroClass", void 0);
__decorate([
    (0, core_1.Output)()
], ImportDataComponent.prototype, "import", void 0);
ImportDataComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-import-data',
        templateUrl: './import-data.component.html',
        styleUrls: ['./import-data.component.scss']
    })
], ImportDataComponent);
exports.ImportDataComponent = ImportDataComponent;
//# sourceMappingURL=import-data.component.js.map