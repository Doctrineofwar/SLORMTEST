"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const rxjs_1 = require("rxjs");
let AppComponent = class AppComponent {
    constructor(router, titleService) {
        this.router = router;
        this.titleService = titleService;
        this.result = '';
        this.updateTitleOnRouteChange();
    }
    updateTitleOnRouteChange() {
        this.router.events
            .pipe((0, rxjs_1.filter)(event => event instanceof router_1.NavigationEnd))
            .subscribe(() => {
            const title = this.getFirstDataTitle(this.router.routerState.snapshot.root);
            if (title !== null) {
                this.titleService.setTitle(title);
            }
        });
    }
    getFirstDataTitle(route) {
        let title = null;
        while (title === null && route !== null) {
            if (route.data && typeof route.data['title'] === 'string') {
                title = route.data['title'];
            }
            route = route.firstChild;
        }
        return title;
    }
};
AppComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map