"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const core_1 = require("@angular/core");
const snackbar_component_1 = require("../components/snackbar/snackbar.component");
let MessageService = class MessageService {
    constructor(snackBar) {
        this.snackBar = snackBar;
        this.DEFAULT_DURATION = 5000;
        this.ACTION_DURATION = 20000;
        this.currentSnackBar = null;
    }
    getConfig(message, action = null, actionCallback = null) {
        return {
            duration: (action !== null && actionCallback !== null) ? this.ACTION_DURATION : this.DEFAULT_DURATION,
            data: {
                message,
                action,
                actionCallback
            }
        };
    }
    message(message, action = null, actionCallback = null) {
        this.currentSnackBar = this.snackBar.openFromComponent(snackbar_component_1.SnackbarComponent, this.getConfig(message, action, actionCallback));
    }
    error(message, action = null, actionCallback = null) {
        if (this.currentSnackBar !== null) {
            this.currentSnackBar.dismiss();
        }
        this.currentSnackBar = this.snackBar.openFromComponent(snackbar_component_1.SnackbarComponent, this.getConfig(message, action, actionCallback));
    }
};
MessageService = __decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map