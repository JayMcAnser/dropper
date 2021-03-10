"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementType = void 0;
var element_1 = require("./element");
var element_column_1 = require("./element-column");
var element_text_1 = require("./element-text");
var element_image_1 = require("./element-image");
var logging_1 = require("../vendors/lib/logging");
var element_inventory_1 = require("./element-inventory");
exports.ElementType = {
    board: 'board',
    column: 'column',
    text: 'text',
    image: 'image',
    inventory: 'inventory'
};
var Factory = function (board, element, options) {
    if (element === void 0) { element = undefined; }
    if (options === void 0) { options = {}; }
    switch (element.type) {
        case exports.ElementType.text:
            return new element_text_1.default(board, element, options);
        case exports.ElementType.image:
            return new element_image_1.default(board, element, options);
        case exports.ElementType.column:
            return new element_column_1.default(board, element, options);
        case exports.ElementType.inventory:
            return new element_inventory_1.default(board, element, options);
        default:
            logging_1.warn("unknown element type: " + element.type, 'model.factory');
            return new element_1.default(board, element, options);
    }
};
exports.default = Factory;
//# sourceMappingURL=factory.js.map