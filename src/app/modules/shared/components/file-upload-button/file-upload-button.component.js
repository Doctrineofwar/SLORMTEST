"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadButtonComponent = void 0;
const core_1 = require("@angular/core");
const _slorm_api_1 = require("@slorm-api");
let FileUploadButtonComponent = class FileUploadButtonComponent {
    constructor(messageService) {
        this.messageService = messageService;
        this.MAX_UPLOAD_FILE_SIZE_MO = 1;
        this.MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * this.MAX_UPLOAD_FILE_SIZE_MO;
        this.label = null;
        this.help = null;
        this.upload = new core_1.EventEmitter();
        this.busy = false;
        this.parsing = false;
    }
    uploadFile(file) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onerror = () => {
                reader = null;
                reject();
            };
            reader.onloadend = () => {
                if (reader !== null && reader.result !== null) {
                    resolve(reader.result.toString());
                    reader = null;
                }
            };
            reader.readAsText(file);
        });
    }
    startUpload(event) {
        const target = event.target;
        if (target !== null && !this.busy) {
            const files = target.files;
            const file = files === null ? null : (0, _slorm_api_1.valueOrNull)(files[0]);
            if (file !== null) {
                if (file.size <= this.MAX_UPLOAD_FILE_SIZE) {
                    this.busy = true;
                    this.uploadFile(file).then(content => {
                        this.upload.emit(content);
                        target.value = '';
                        this.busy = false;
                    }, () => {
                        target.value = '';
                        this.messageService.error('Failed to upload this file');
                        this.busy = false;
                    });
                }
                else {
                    this.messageService.error('Cannot upload files bigger than ' + this.MAX_UPLOAD_FILE_SIZE_MO + 'Mo');
                }
            }
        }
    }
};
__decorate([
    (0, core_1.Input)()
], FileUploadButtonComponent.prototype, "label", void 0);
__decorate([
    (0, core_1.Input)()
], FileUploadButtonComponent.prototype, "help", void 0);
__decorate([
    (0, core_1.Output)()
], FileUploadButtonComponent.prototype, "upload", void 0);
FileUploadButtonComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-file-upload-button',
        templateUrl: './file-upload-button.component.html',
        styleUrls: ['./file-upload-button.component.scss']
    })
], FileUploadButtonComponent);
exports.FileUploadButtonComponent = FileUploadButtonComponent;
//# sourceMappingURL=file-upload-button.component.js.map