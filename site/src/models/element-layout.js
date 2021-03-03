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
/**
 * the basic definition for layouts / presentations of a board
 *
 * version 0.0.1 Jay 2021-02-28
 */
var element_1 = require("./element");
var logging_1 = require("../vendors/lib/logging");
var ElementLayout = /** @class */ (function (_super) {
    __extends(ElementLayout, _super);
    function ElementLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementLayout.prototype.orderArray = function (arr, order) {
        if (typeof order === 'string' && arr[order] !== undefined) {
            this._children.sort(function (a, b) {
                return a[order].localeCompare(b[order], undefined, { sensitivity: 'base' });
            });
        }
        else if (typeof order === 'string' && order.indexOf('.') >= 0) {
            // looking into an object that is part of the child record
            logging_1.warn("the order by child object (" + order + ") is not yet implemented", 'layout.orderArray');
        }
        else if (typeof order === 'function') {
            logging_1.warn("the order by function is not yet implemented", 'layout.orderArray');
        }
        return arr;
    };
    return ElementLayout;
}(element_1.default));
exports.default = ElementLayout;
//# sourceMappingURL=element-layout.js.map