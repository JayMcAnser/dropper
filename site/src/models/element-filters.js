"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterWordSearch = exports.FilterAnd = exports.FilterContain = exports.FilterElement = void 0;
var logging_1 = require("../vendors/lib/logging");
var FilterElement = /** @class */ (function () {
    function FilterElement(value, options) {
        if (options === void 0) { options = {}; }
        options = Object.assign({}, { caseSensitive: false, noValueIsAll: true }, options);
        this.caseSensitive = options.caseSensitive;
        this.noValueIsAll = options.noValueIsAll;
    }
    FilterElement.prototype.compare = function (element) {
        return true;
    };
    return FilterElement;
}());
exports.FilterElement = FilterElement;
var FilterContain = /** @class */ (function (_super) {
    __extends(FilterContain, _super);
    function FilterContain(value, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, value, options) || this;
        if (_this.caseSensitive) {
            _this.searchValue = value;
        }
        else if (typeof value === 'string') {
            _this.searchValue = value.toLowerCase();
        }
        else if (value === null || value === undefined) {
            _this.searchValue = '';
        }
        else {
            logging_1.warn("value is unknown " + value);
        }
        return _this;
    }
    FilterContain.prototype.compare = function (element) {
        if (this.noValueIsAll && this.searchValue === undefined || this.searchValue === null || this.searchValue.trim().length === 0) {
            return true;
        }
        return element.filterContains(this.searchValue, this.caseSensitive);
    };
    ;
    return FilterContain;
}(FilterElement));
exports.FilterContain = FilterContain;
/**
 * filter that should be true for all sub filters
 */
var FilterAnd = /** @class */ (function (_super) {
    __extends(FilterAnd, _super);
    function FilterAnd(options) {
        var _this = _super.call(this, undefined, options) || this;
        _this.filters = [];
        return _this;
    }
    FilterAnd.prototype.add = function (filter) {
        this.filters.push(filter);
    };
    Object.defineProperty(FilterAnd.prototype, "length", {
        get: function () {
            return this.filters.length;
        },
        enumerable: false,
        configurable: true
    });
    FilterAnd.prototype.compare = function (element) {
        for (var index = 0; index < this.filters.length; index++) {
            if (!this.filters[index].compare(element)) {
                return false;
            }
        }
        return true;
    };
    return FilterAnd;
}(FilterElement));
exports.FilterAnd = FilterAnd;
/**
 * filter that split the string and searches on the individual words
 */
var FilterWordSearch = /** @class */ (function (_super) {
    __extends(FilterWordSearch, _super);
    function FilterWordSearch(value, options) {
        if (value === void 0) { value = ''; }
        var _this = _super.call(this, options) || this;
        if (typeof value === 'string') {
            var words = value.split(' ');
            for (var index = 0; index < words.length; index++) {
                var word = words[index].trim();
                if (word.length) {
                    _this.add(new FilterContain(word, options));
                }
            }
        }
        return _this;
    }
    return FilterWordSearch;
}(FilterAnd));
exports.FilterWordSearch = FilterWordSearch;
//# sourceMappingURL=element-filters.js.map