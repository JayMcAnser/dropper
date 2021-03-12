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
var element_1 = require("./element");
var ElementText = /** @class */ (function (_super) {
    __extends(ElementText, _super);
    function ElementText(board, element, options) {
        return _super.call(this, board, element, options) || this;
    }
    Object.defineProperty(ElementText.prototype, "description", {
        get: function () {
            return this.element.description;
        },
        enumerable: false,
        configurable: true
    });
    ElementText.prototype.editSchema = function () {
        var textSchema = _super.prototype.editSchema.call(this);
        textSchema.properties['description'] = { type: 'string', 'x-display': 'textarea', 'x-props': { autoGrow: true }, 'x-class': 'no-padding' };
        return textSchema;
    };
    return ElementText;
}(element_1.default));
exports.default = ElementText;
//# sourceMappingURL=element-text.js.map