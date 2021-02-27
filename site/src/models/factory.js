"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementType = void 0;
var element_1 = require("./element");
var element_column_1 = require("./element-column");
var element_text_1 = require("./element-text");
var logging_1 = require("../vendors/lib/logging");
exports.ElementType = {
    board: 'board',
    column: 'column',
    text: 'text'
};
var Factory = function (board, element, options) {
    if (options === void 0) { options = {}; }
    switch (element.type) {
        case exports.ElementType.text:
            return new element_text_1.default(board, element, options);
        case exports.ElementType.column:
            return new element_column_1.default(board, element, options);
        default:
            logging_1.debug("unknown element type: " + element.type);
            return new element_1.default(board, element, options);
    }
};
exports.default = Factory;
//# sourceMappingURL=factory.js.map