"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../vendors/lib/const");
var logging_1 = require("../vendors/lib/logging");
// import Axios, { setHeaders } from '../vendors/lib/axios';
// import {apiState} from '../vendors/lib/const';
var axios_1 = require("../vendors/lib/axios");
var logging_2 = require("../vendors/lib/logging");
var factory_1 = require("./factory");
var element_inventory_1 = require("./element-inventory");
var Board = /** @class */ (function () {
    function Board(board, options) {
        this._loaded = false;
        this._deleted = [];
        this._isDirty = false;
        this._changes = {};
        this._orgData = {};
        this._inventory = undefined;
        this._isNew = false;
        this.no_update_properties = ['id', 'type'];
        this.board = board;
        this._elements = new Map();
        this._isNew = !!(options && options.newId);
        if (options && options.isNew) {
            logging_2.debug("create new board with " + board.id, 'board.constructor');
            this._changes['id'] = board.id;
        }
        var vm = this;
        var boardHandler = {
            deleteProperty: function (target, prop) {
                if (!vm.no_update_properties.includes(prop)) {
                    delete target[prop];
                }
                return true;
            },
            set: function (target, prop, value, receiver) {
                logging_2.debug("tracking change of " + prop, 'board.handler');
                if (vm.no_update_properties.includes(prop)) {
                    return true;
                }
                if (target[prop] !== value) {
                    logging_2.debug(value, 'board.change');
                    vm._changes[prop] = value;
                    vm._isDirty = true;
                    if (!vm._orgData[prop]) {
                        vm._orgData[prop] = board[prop];
                    }
                    return Reflect.set(target, prop, value, receiver);
                }
                else {
                    return true;
                }
            }
        };
        if (!board) {
            logging_1.warn("board is missing the initialisation object", 'board.constructor');
            this.board = (new Proxy({}, boardHandler));
        }
        else {
            if (!board.id) {
                logging_1.warn("board is missing the id", 'board.constructor');
            }
            this.board = new Proxy(board, boardHandler);
        }
    }
    /**
     * load the board information from the raw data
     * @param data Object full board returned from API
     */
    Board.prototype.load = function (data) {
        for (var id in data.elements) {
            var elm = data.elements[id];
            var elmClass = factory_1.default(this, elm);
            if (elmClass) {
                // if an error ocurred we do NOT push it
                this._elements.set(elmClass.id, elmClass);
            }
        }
        this._loaded = true;
    };
    Board.prototype._clearCache = function () {
    };
    Object.defineProperty(Board.prototype, "isNew", {
        get: function () {
            return this._isNew;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "model", {
        get: function () {
            return this.board;
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.editSchema = function () {
        return {
            type: 'object',
            properties: {
                title: { type: 'string' },
                type: { type: 'string' },
            }
        };
    };
    Object.defineProperty(Board.prototype, "inventory", {
        get: function () {
            if (!this._inventory) {
                this._inventory = new element_inventory_1.default(this);
            }
            return this._inventory;
            // if (filter && filter.length) {
            //   return this.filter(this._inventory.children(), filter).map(e => e.item)
            // } else {
            //   return this._inventory.children().map(e => e.item)
            // }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "inventoryElements", {
        get: function () {
            return this.inventory.children().map(function (e) { return e.item; });
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.layouts = function (options) {
        if (!this._inventory) {
            this._inventory = new element_inventory_1.default(this);
        }
        var result = [this._inventory];
        this.elements.forEach(function (e) {
            if (e.type === 'layout') {
                result.push(e);
            }
        });
        return result;
    };
    Object.defineProperty(Board.prototype, "isDirty", {
        get: function () {
            return this._isDirty || this.dirtyElements.length > 0 || this._deleted.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.clearDirty = function () {
        this._isDirty = false;
        this._inventory = undefined;
        this._isNew = false;
    };
    Object.defineProperty(Board.prototype, "id", {
        get: function () {
            return this.board.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "name", {
        get: function () {
            return this.board.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "title", {
        // set name(value) {
        //   this.addChange('name', value)
        // }
        get: function () {
            return this.board.title;
        },
        enumerable: false,
        configurable: true
    });
    // set title(value) {
    //   this.addChange('title', value)
    // }
    Board.prototype.addChange = function (fieldname, value) {
        if (this.board[fieldname] !== value) {
            this.board[fieldname] = value;
            this._changes[fieldname] = value;
            this._isDirty = true;
        }
    };
    /**
     * returns the changes to properties of the board NOT to the elements
     */
    Board.prototype.changedInfo = function () {
        return this._changes;
    };
    Board.prototype.hasChanges = function () {
        return Object.keys(this._changes).length > 0;
    };
    Object.defineProperty(Board.prototype, "elements", {
        /**
         * access to the all elements on the board in a none nested version
         * @returns Map index by the id of the element
         */
        get: function () {
            return this._elements;
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.element = function (id) {
        switch (id) {
            case 'inventory':
                return this.inventory;
            default:
                return this._elements.get(id);
        }
    };
    Object.defineProperty(Board.prototype, "elementCount", {
        get: function () {
            return this._elements.size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "columns", {
        /**
         * list the columns of this board
         */
        get: function () {
            var cols = [];
            this._elements.forEach(function (elm, key, map) {
                if (elm.type === factory_1.ElementType.column) {
                    cols.push(elm);
                }
            });
            return cols;
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.isLoaded = function () {
        return this._loaded;
    };
    Board.prototype.hasElement = function (id) {
        return this._elements.has(id);
    };
    Object.defineProperty(Board.prototype, "dirtyElements", {
        /**
         * returns the elements that are dirty
         * @protected
         * @returns Array<Element>
         */
        get: function () {
            var result = [];
            this._elements.forEach(function (e) {
                if (e.isDirty || e.isNew) {
                    result.push(e);
                }
            });
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, dirtyOnes, index, elmData, result, index, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.isDirty || this.isNew)) return [3 /*break*/, 17];
                        if (!(this.hasChanges() || this.isNew)) return [3 /*break*/, 5];
                        result = void 0;
                        if (!this.isNew) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.post("/board", this.changedInfo())];
                    case 1:
                        // the id should be in the changeInfo!!
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, axios_1.default.patch("/board/" + this.id, this.changedInfo())];
                    case 3:
                        result = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!const_1.axiosActions.isOk(result)) {
                            // rollback the transaction
                            throw logging_2.newError(const_1.axiosActions.errors(result), 'board.update');
                        }
                        else {
                            this._changes = {};
                        }
                        _a.label = 5;
                    case 5:
                        dirtyOnes = this.dirtyElements;
                        index = 0;
                        _a.label = 6;
                    case 6:
                        if (!(index < dirtyOnes.length)) return [3 /*break*/, 12];
                        elmData = dirtyOnes[index].changedData;
                        result = void 0;
                        if (!dirtyOnes[index]._isNew) return [3 /*break*/, 8];
                        return [4 /*yield*/, axios_1.default.post("board/" + this.id + "/element", elmData)];
                    case 7:
                        result = _a.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, axios_1.default.patch("/board/" + this.id + "/element/" + dirtyOnes[index].id, elmData)];
                    case 9:
                        result = _a.sent();
                        _a.label = 10;
                    case 10:
                        if (const_1.axiosActions.isOk(result)) {
                            dirtyOnes[index].dirtyClear();
                        }
                        else {
                            // rollback the transaction
                            throw logging_2.newError(const_1.axiosActions.errors(result), 'board.elementUpdate');
                        }
                        _a.label = 11;
                    case 11:
                        index++;
                        return [3 /*break*/, 6];
                    case 12:
                        index = 0;
                        _a.label = 13;
                    case 13:
                        if (!(index < this._deleted.length)) return [3 /*break*/, 16];
                        return [4 /*yield*/, axios_1.default.delete("board/" + this.id + "/element/" + this._deleted[index].id)];
                    case 14:
                        result = _a.sent();
                        if (const_1.axiosActions.isOk(result)) {
                        }
                        else {
                            throw logging_2.newError(const_1.axiosActions.errors(result), 'board.elementDelete');
                        }
                        _a.label = 15;
                    case 15:
                        index++;
                        return [3 /*break*/, 13];
                    case 16:
                        this._deleted = [];
                        // commit the transaction
                        this.clearDirty();
                        _a.label = 17;
                    case 17:
                        this._clearCache();
                        logging_2.debug(this._inventory, 'board.ts');
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Board.prototype.cancel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, key, elm, e_1_1;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, 6, 7]);
                        _a = __values(this._elements), _b = _a.next();
                        _e.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        _c = __read(_b.value, 2), key = _c[0], elm = _c[1];
                        if (!elm.isDirty) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.elementCancel(elm)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        this._changes = {};
                        this.clearDirty();
                        return [2 /*return*/];
                }
            });
        });
    };
    Board.prototype.elementCreate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, elementClass;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("board/" + this.id + "/elementId", data)];
                    case 1:
                        result = _a.sent();
                        if (const_1.axiosActions.isOk(result)) {
                            Object.assign(data, const_1.axiosActions.data(result));
                            elementClass = factory_1.default(this, data, { isNew: true });
                            //      elementClass.updateData(data);
                            this._elements.set(data.id, elementClass);
                            this._clearCache();
                            return [2 /*return*/, elementClass];
                        }
                        else {
                            throw logging_2.newError(const_1.axiosActions.errors(result), 'board.elementCreate');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * cancel the previous create
     */
    Board.prototype.elementCancel = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (element.isNew) {
                    logging_2.debug("remove " + element.id, 'board.elementCancel');
                    this._elements.delete(element.id);
                }
                else {
                    this.element(element.id).restore();
                }
                this._clearCache();
                return [2 /*return*/];
            });
        });
    };
    Board.prototype.elementDelete = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._deleted.push(this.element(element.id));
                this._elements.delete(element.id);
                this._elements.forEach(function (e) {
                    e.deleteRef(element);
                });
                this._clearCache();
                return [2 /*return*/];
            });
        });
    };
    return Board;
}());
exports.default = Board;
//# sourceMappingURL=board.js.map