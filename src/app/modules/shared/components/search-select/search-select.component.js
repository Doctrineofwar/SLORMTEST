"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchSelectComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const abstract_unsubscribe_component_1 = require("../abstract-unsubscribe/abstract-unsubscribe.component");
let SearchSelectComponent = class SearchSelectComponent extends abstract_unsubscribe_component_1.AbstractUnsubscribeComponent {
    constructor() {
        super();
        this.label = null;
        this.placeholder = null;
        this.control = null;
        this.options = [];
        this.validationOptions = null;
        this.noErrorPadding = false;
        this.disabledOptions = [];
        this.notFoundMessage = null;
        this.trigger = null;
        this.filteredOptions = [];
        this.search = new forms_1.FormControl('');
        this.noResult = false;
        this.search.valueChanges.subscribe(() => this.filter());
    }
    ngOnChanges(changes) {
        if (this.control !== null && changes['control']) {
            this.control.valueChanges
                .pipe((0, rxjs_1.takeUntil)(this.unsubscribe))
                .subscribe(() => this.resetFilter());
        }
        this.filter();
    }
    opened(open, input) {
        if (open === false) {
            this.resetFilter();
        }
        else {
            input.focus();
        }
    }
    resetFilter() {
        this.search.setValue('');
    }
    filter() {
        const search = this.search.value.toLowerCase().trim();
        this.filteredOptions = this.options.map(option => ({
            option,
            filtered: option.label.toLowerCase().indexOf(search) === -1,
            disabled: this.disabledOptions.includes(option.value)
        }));
        this.noResult = !this.filteredOptions.some(filteredOption => !filteredOption.filtered);
    }
    trackBy(index, filtedOption) {
        return filtedOption.option.value;
    }
    handleSearchSpace(event) {
        event.stopPropagation();
    }
    isStatInOptions(stat) {
        let options = this.options;
        if (this.validationOptions !== null) {
            options = this.validationOptions;
        }
        return options.some(option => option.value === stat);
    }
};
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "label", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "placeholder", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "control", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "options", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "validationOptions", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "noErrorPadding", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "disabledOptions", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "notFoundMessage", void 0);
__decorate([
    (0, core_1.Input)()
], SearchSelectComponent.prototype, "trigger", void 0);
SearchSelectComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-search-select',
        templateUrl: './search-select.component.html',
        styleUrls: ['./search-select.component.scss']
    })
], SearchSelectComponent);
exports.SearchSelectComponent = SearchSelectComponent;
//# sourceMappingURL=search-select.component.js.map