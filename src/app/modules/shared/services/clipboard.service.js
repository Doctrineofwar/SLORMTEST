"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClipboardService = void 0;
const core_1 = require("@angular/core");
let ClipboardService = class ClipboardService {
    constructor() { }
    copyToClipboard(value) {
        let element = null;
        try {
            element = document.createElement('textarea');
            element.style.position = 'fixed';
            element.style.left = '0';
            element.style.top = '0';
            element.style.opacity = '0';
            element.value = value;
            document.body.appendChild(element);
            element.focus();
            element.select();
            document.execCommand('copy');
            document.body.removeChild(element);
            return true;
        }
        catch (e) {
            if (element !== null && document.body.contains(element)) {
                document.body.removeChild(element);
            }
        }
        return false;
    }
    copyImageToClipboard(blob) {
        try {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            return true;
        }
        catch (_) { }
        return false;
    }
    async getClipboardText() {
        let text = null;
        if (navigator.clipboard) {
            try {
                text = await navigator.clipboard.readText();
            }
            catch (e) {
            }
        }
        return text;
    }
    canCopyImage() {
        return typeof ClipboardItem !== 'undefined';
    }
};
ClipboardService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], ClipboardService);
exports.ClipboardService = ClipboardService;
//# sourceMappingURL=clipboard.service.js.map