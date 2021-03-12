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
var ElementImage = /** @class */ (function (_super) {
    __extends(ElementImage, _super);
    function ElementImage(board, element, options) {
        return _super.call(this, board, element, options) || this;
    }
    ElementImage.prototype.editSchema = function () {
        var imageSchema = _super.prototype.editSchema.call(this);
        //textSchema.properties['description'] = { type: 'string', 'x-display': 'textarea', 'x-props': {autoGrow: true}, 'x-class': 'no-padding'}
        imageSchema.properties['image'] = {
            "type": "string",
            "title": "click to retrieve image",
            "contentMediaType": "image/*",
            "writeOnly": true
        };
        return imageSchema;
    };
    Object.defineProperty(ElementImage.prototype, "url", {
        get: function () {
            return process.env.VUE_APP_API_URL + "/file/image/" + this.board.id + "/" + this.id;
        },
        enumerable: false,
        configurable: true
    });
    return ElementImage;
}(element_1.default));
exports.default = ElementImage;
//# sourceMappingURL=element-image.js.map