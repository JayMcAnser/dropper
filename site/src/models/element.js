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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var element_filters_1 = require("./element-filters");
var logging_1 = require("../vendors/lib/logging");
// const NO_UPDATE_PROPERTIES = ['id'];
var Element = /** @class */ (function () {
    /**
     * t
     * @param board
     * @param element Object the raw object return from the API
     * @param options Object {
     *   isNew boolean not yet stored on disk
     * }
     */
    function Element(board, element, options) {
        if (element === void 0) { element = undefined; }
        if (options === void 0) { options = undefined; }
        this._isDirty = false;
        // the class definition
        this._children = undefined;
        //  protected updatableFields = ['key','title','description'];
        this._changedData = {};
        // the data that was original there before the change to _changeData
        this._orgData = {};
        // properties that should not be updated/removed by the model interface for editing
        this.no_update_properties = ['id', 'type'];
        this._isNew = false;
        if (!board) {
            throw new logging_1.LocationError('missing board', 'Element.constructor');
        }
        var vm = this;
        var elementHandler = {
            deleteProperty: function (target, prop) {
                if (!vm.no_update_properties.includes(prop)) {
                    //          debug(`cancel remove property`, 'element.handler')
                    delete target[prop];
                }
                return true;
            },
            set: function (target, prop, value, receiver) {
                if (vm.no_update_properties.includes(prop)) {
                    return true;
                }
                if (target[prop] !== value) {
                    logging_1.debug(value, 'element.change');
                    vm._changedData[prop] = value;
                    vm._isDirty = true;
                    if (!vm._orgData[prop]) {
                        vm._orgData[prop] = element[prop];
                    }
                    return Reflect.set(target, prop, value, receiver);
                }
                else {
                    return true;
                }
            }
        };
        this.board = board;
        if (!element) {
            logging_1.warn("element is missing the initialisation object", 'element.constructor');
            this.element = new Proxy({}, elementHandler);
        }
        else {
            if (!element.id) {
                logging_1.warn("element is missing the id", 'element.constructor');
            }
            this.element = new Proxy(element, elementHandler);
        }
        this._isNew = !!(options && options.isNew);
        if (this.isNew) {
            // we need the id and the type to create the element on the server
            vm._changedData['id'] = element.id;
            vm._changedData['type'] = element.type;
        }
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "title", {
        // set key(v) {
        //   this.updateElementField('key', v)
        // }
        get: function () {
            return this.element.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "isNew", {
        // set title(v) {
        //   this.updateElementField('title', v)
        // }
        get: function () {
            return this._isNew;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "visibleFields", {
        get: function () {
            return Object.assign({}, this.element);
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
    Object.defineProperty(Element.prototype, "changedData", {
        get: function () {
            // if changed through the model we don't know what field did change, so send everything
            return this._changedData;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "model", {
        get: function () {
            return this.element;
        },
        enumerable: false,
        configurable: true
    });
    //
    // set model(value) {
    //   this.updateElementField(value)
    // }
    Element.prototype.editSchema = function () {
        return {
            type: 'object',
            properties: {
                key: { type: 'string', 'x-cols': 6 },
                type: { type: 'string', 'x-cols': 6, readOnly: true },
                title: { type: 'string' },
            }
        };
    };
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
    /**
     * restore the possible changes to the element
     */
    Element.prototype.restore = function () {
        logging_1.debug(this._orgData, 'element.restore');
        for (var fieldname in this._orgData) {
            if (!this._orgData.hasOwnProperty(fieldname)) {
                continue;
            }
            this.element[fieldname] = this._orgData[fieldname];
        }
        this._orgData = {};
    };
    ;
    Element.prototype.dirtyClear = function () {
        this._changedData = {};
        this._orgData = {};
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
    Element.prototype.createElementItem = function (elementLink) {
        return {
            link: elementLink,
            item: this.board.elements.get(elementLink.id)
        };
    };
    /**
     * list their reference
     * @returns Array[ElementItem])
     */
    Element.prototype.isValidFilter = function (where) {
        // return (typeof where === 'object') ||
        //        (typeof where === 'string' && where.length > 0)
    };
    /**
     * check if qry is part of elm (case insensitive)
     * @param text String
     * @param caseSensitive boolean
     * @returns boolean true if it contains the text
     */
    Element.prototype.filterContains = function (text, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (caseSensitive) {
            return this.title.indexOf(text) >= 0 ||
                this.key.indexOf(text) >= 0;
        }
        return this.title.toLowerCase().indexOf(text) >= 0 ||
            this.key.toLowerCase().indexOf(text) >= 0;
    };
    Element.prototype.children = function (qry, order) {
        var e_1, _a;
        if (!qry) {
            qry = new element_filters_1.FilterElement();
        }
        if (!this._children) {
            this._children = [];
            // we have to load them
            if (this.element.elements) {
                try {
                    for (var _b = __values(this.element.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var elm = _c.value;
                        if (!this.board.hasElement(elm.id)) {
                            logging_1.warn("element " + elm.id + " does not exist. record skipped", 'Element.children');
                        }
                        else {
                            var link = this.createElementItem(elm);
                            if (qry.compare(link.item)) {
                                this._children.push(link);
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
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
        this.element['elements'] = elmLinks;
        // this.updateElementField('elements', elmLinks);
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
        var elmLink = this.createElementItem(linkInfo);
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
    /**
     * moves the child record to a specific location
     * @param element
     * @param index 0 == first, -1 last otherwise: position
     */
    Element.prototype.childMove = function (element, index) {
        var children = this.children();
        var elementIndex = children.findIndex(function (e) { return e.link.id === element.id; });
        if (elementIndex >= 0) {
            if (index < 0 || index >= children.length) {
                index = children.length - 1;
            }
            if (elementIndex !== index) {
                children.splice(elementIndex, 1);
                children.splice(index, 0, element);
            }
        }
        else {
            logging_1.warn("the element " + element.id + " is not part of " + this.id);
        }
    };
    /**
     * Move an element one up or down
     * @param element
     * @param up true => for to 0 false move to end
     */
    Element.prototype.childMoveStep = function (element, up) {
        if (up === void 0) { up = true; }
        var children = this.children();
        var elementIndex = children.findIndex(function (e) { return e.link.id === element.id; });
        if (elementIndex) {
            this.childMove(element, elementIndex + (up ? 1 : -1));
        }
        else {
            logging_1.warn("the element " + element.id + " is not part of " + this.id);
        }
    };
    return Element;
}());
exports.default = Element;
//# sourceMappingURL=element.js.map