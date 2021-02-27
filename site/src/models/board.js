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
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../vendors/lib/const");
// import Axios, { setHeaders } from '../vendors/lib/axios';
// import {apiState} from '../vendors/lib/const';
var axios_1 = require("../vendors/lib/axios");
var logging_1 = require("../vendors/lib/logging");
var factory_1 = require("./factory");
var Board = /** @class */ (function () {
    function Board(board) {
        this._loaded = false;
        this._deleted = [];
        this._isDirty = false;
        this._changes = {};
        this.board = board;
        this._elements = new Map();
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
    Object.defineProperty(Board.prototype, "isDirty", {
        get: function () {
            return this._isDirty || this.dirtyElements.length > 0 || this._deleted.length > 0;
        },
        enumerable: false,
        configurable: true
    });
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
        set: function (value) {
            this.addChange('name', value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "title", {
        get: function () {
            return this.board.title;
        },
        set: function (value) {
            this.addChange('title', value);
        },
        enumerable: false,
        configurable: true
    });
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
        return this._elements.get(id);
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
    Board.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dirtyOnes, index, elmData, result, index, result, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isDirty) return [3 /*break*/, 14];
                        dirtyOnes = this.dirtyElements;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < dirtyOnes.length)) return [3 /*break*/, 7];
                        elmData = dirtyOnes[index].changedData;
                        result = void 0;
                        if (!dirtyOnes[index]._isNew) return [3 /*break*/, 3];
                        return [4 /*yield*/, axios_1.default.post("board/" + this.id + "/element", elmData)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, axios_1.default.patch("/board/" + this.id + "/element/" + dirtyOnes[index].id, elmData)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (const_1.axiosActions.isOk(result)) {
                            dirtyOnes[index].dirtyClear();
                        }
                        else {
                            // rollback the transaction
                            throw logging_1.newError(const_1.axiosActions.errors(result), 'board.elementUpdate');
                        }
                        _a.label = 6;
                    case 6:
                        index++;
                        return [3 /*break*/, 1];
                    case 7:
                        index = 0;
                        _a.label = 8;
                    case 8:
                        if (!(index < this._deleted.length)) return [3 /*break*/, 11];
                        return [4 /*yield*/, axios_1.default.delete("board/" + this.id + "/element/" + this._deleted[index].id)];
                    case 9:
                        result = _a.sent();
                        if (const_1.axiosActions.isOk(result)) {
                        }
                        else {
                            throw logging_1.newError(const_1.axiosActions.errors(result), 'board.elementDelete');
                        }
                        _a.label = 10;
                    case 10:
                        index++;
                        return [3 /*break*/, 8];
                    case 11:
                        this._deleted = [];
                        if (!this.hasChanges()) return [3 /*break*/, 13];
                        return [4 /*yield*/, axios_1.default.patch("/board/" + this.id, this.changedInfo())];
                    case 12:
                        result = _a.sent();
                        if (!const_1.axiosActions.isOk(result)) {
                            // rollback the transaction
                            throw logging_1.newError(const_1.axiosActions.errors(result), 'board.update');
                        }
                        else {
                            this._changes = {};
                        }
                        _a.label = 13;
                    case 13:
                        // commit the transaction
                        this._isDirty = false;
                        _a.label = 14;
                    case 14: return [2 /*return*/, this];
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
                            Object.assign(elementClass.changedData, data);
                            this._elements.set(data.id, elementClass);
                            return [2 /*return*/, elementClass];
                        }
                        else {
                            throw logging_1.newError(const_1.axiosActions.errors(result), 'board.elementCreate');
                        }
                        return [2 /*return*/];
                }
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
                return [2 /*return*/];
            });
        });
    };
    return Board;
}());
exports.default = Board;
//# sourceMappingURL=board.js.map