"use strict";
/**
 * Element and it's linked children
 *
 *
 * {
 *     id,
 *     key,
 *     title,
 *     elements: Array [{
 *         ref: {
 *             id,
 *             extra info
 *         },
 *         element: {
 *             id,
 *             key,
 *             title,
 *             elements
 *         }
 *     }]
 * }
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = require("../vendors/lib/logging");
var Element = /** @class */ (function () {
    /**
     * t
     * @param board
     * @param element Object the raw object return from the API
     */
    function Element(board, element, options) {
        this._isDirty = false;
        // the class definition
        this._children = undefined;
        this.updatableFields = ['key', 'title', 'description'];
        this.changedData = {};
        this._isNew = false;
        if (!board) {
            throw new logging_1.LocationError('missing board', 'Element.constructor');
        }
        this.board = board;
        this.element = element;
        this._isNew = !!(options && options.isNew);
    }
    Object.defineProperty(Element.prototype, "type", {
        get: function () {
            return this.element.type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "id", {
        get: function () {
            return this.element.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "key", {
        get: function () {
            return this.element.key;
        },
        set: function (v) {
            this.updateElementField('key', v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "title", {
        get: function () {
            return this.element.title;
        },
        set: function (v) {
            this.updateElementField('title', v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "isDirty", {
        get: function () {
            return this._isDirty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "isNew", {
        get: function () {
            return this._isNew;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * remove the link this id
     * @param id
     */
    Element.prototype.linkDelete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Element.prototype.updateElementField = function (field, value) {
        if (this.element[field] !== value) {
            this.element[field] = value;
            this.changedData[field] = value;
            this._isDirty = true;
        }
    };
    Element.prototype.dirtyClear = function () {
        this._isDirty = false;
        this._isNew = false;
    };
    /**
     * called when a element is removed and we request all other elements to remove any reference to this id
     * @param element
     */
    Element.prototype.deleteRef = function (element) {
    };
    Object.defineProperty(Element.prototype, "childItems", {
        /**
         * returns the list Elements in order
         * @returns Array[<Element>]
         */
        get: function () {
            return this.children().map(function (c) { return c.item; });
        },
        enumerable: false,
        configurable: true
    });
    Element.prototype.createElementLink = function (elementLink) {
        return {
            link: elementLink,
            item: this.board.elements.get(elementLink.id)
        };
    };
    /**
     * list their reference
     * @returns Array[ElementItem])
     */
    // get elementLinks() {
    Element.prototype.children = function (order) {
        if (order === void 0) { order = false; }
        if (!this._children) {
            this._children = [];
            // we have to load them
            if (this.element.elements) {
                for (var _i = 0, _a = this.element.elements; _i < _a.length; _i++) {
                    var elm = _a[_i];
                    if (!this.board.hasElement(elm.id)) {
                        logging_1.warn("element " + elm.id + " does not exist. record skipped", 'Element.children');
                    }
                    else {
                        this._children.push(this.createElementLink(elm));
                    }
                }
            }
        }
        return this._children;
    };
    /**
     * set the update for the changed linked elements
     */
    Element.prototype._storeChildren = function () {
        var elmLinks = [];
        var children = this.children();
        for (var index = 0; index < children.length; index++) {
            elmLinks.push(children[index].link);
        }
        this.updateElementField('elements', elmLinks);
    };
    /**
     * add a new element ot this on
     * @param element
     * @param linkInfo Possible extra information
     * @param position Where to place it
     */
    Element.prototype.childAdd = function (element, linkInfo, position) {
        if (linkInfo === void 0) { linkInfo = {}; }
        if (position === void 0) { position = -1; }
        // load the children if they are not there yet
        var children = this.children();
        Object.assign(linkInfo, { id: element.id });
        var elmLink = this.createElementLink(linkInfo);
        if (Number.isInteger(position) && position >= 0 && position < children.length) {
            children.splice(position, 0, elmLink);
        }
        else {
            children.push(elmLink);
        }
        this._storeChildren();
    };
    Element.prototype.childRemove = function (element) {
        var children = this.children();
        var index = children.findIndex(function (e) { return e.link.id === element.id; });
        if (index >= 0) {
            children.splice(index, 1);
            this._storeChildren();
        }
    };
    return Element;
}());
exports.default = Element;
//# sourceMappingURL=element.js.map