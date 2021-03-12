"use strict";
/**
 * auto generated layout that display all elements of the board
 */
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
var element_layout_1 = require("./element-layout");
var element_filters_1 = require("./element-filters");
var ElementInventory = /** @class */ (function (_super) {
    __extends(ElementInventory, _super);
    function ElementInventory(board, element, options) {
        if (element === void 0) { element = undefined; }
        if (options === void 0) { options = undefined; }
        return _super.call(this, board, { id: 'inventory', type: 'inventory' }, options) || this;
    }
    Object.defineProperty(ElementInventory.prototype, "type", {
        get: function () {
            return 'inventory';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElementInventory.prototype, "id", {
        get: function () {
            return 'inventory';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElementInventory.prototype, "title", {
        get: function () {
            return 'Inventory';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * this overloaded version reads all elements from the board and returns
     * them as if they are the children
     *
     * @param order String \\ Function(a, b)
     */
    ElementInventory.prototype.children = function (qry, order) {
        var _this = this;
        if (!qry) {
            qry = new element_filters_1.FilterElement();
        }
        this._children = [];
        this.board.elements.forEach(function (element) {
            if (qry.compare(element)) {
                _this._children.push(_this.createElementItem(element));
            }
        });
        this.order = order;
        if (this._children.length && order) {
            this.orderArray(this._children, this.order);
        }
        return this._children;
    };
    Object.defineProperty(ElementInventory.prototype, "length", {
        get: function () {
            return this.children().length;
        },
        enumerable: false,
        configurable: true
    });
    return ElementInventory;
}(element_layout_1.default));
exports.default = ElementInventory;
//# sourceMappingURL=element-inventory.js.map