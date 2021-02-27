"use strict";
/**
 * WAT GAAT HIER FOUT!!!!!!
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
var board_1 = require("./board");
var logging_1 = require("../vendors/lib/logging");
var axios_1 = require("../vendors/lib/axios");
var const_1 = require("../vendors/lib/const");
var Database = /** @class */ (function () {
    function Database() {
        this.boardsLoaded = false;
    }
    Database.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var LOC, res, boardList, _i, boardList_1, b, boardClass, err, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.boardsLoaded) return [3 /*break*/, 4];
                        LOC = 'database.load';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this._boards = [];
                        logging_1.debug("loading all", LOC);
                        return [4 /*yield*/, axios_1.default.get('/board/list')];
                    case 2:
                        res = _a.sent();
                        if (const_1.axiosActions.isOk(res)) {
                            boardList = const_1.axiosActions.data(res);
                            for (_i = 0, boardList_1 = boardList; _i < boardList_1.length; _i++) {
                                b = boardList_1[_i];
                                boardClass = new board_1.default(b);
                                logging_1.debug(boardClass, LOC + ".board");
                                this._boards.push(boardClass);
                            }
                            logging_1.debug(this._boards, LOC + ".loaded");
                        }
                        else {
                            err = logging_1.newError(const_1.axiosActions.errors(res), LOC);
                            logging_1.error(err, LOC);
                            throw err;
                        }
                        this.boardsLoaded = true;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        logging_1.error(e_1, LOC);
                        throw e_1;
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    Database.prototype.reload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.boardsLoaded = false;
                return [2 /*return*/, this.load()];
            });
        });
    };
    Database.prototype.boards = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._boards];
                }
            });
        });
    };
    Database.prototype._load = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var LOC, url, res, boardData, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!data.isLoaded()) return [3 /*break*/, 2];
                        LOC = 'database.boardById';
                        url = "/board/" + data.id;
                        logging_1.debug("loading board " + url, LOC);
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        res = _a.sent();
                        if (const_1.axiosActions.isOk(res)) {
                            boardData = const_1.axiosActions.data(res);
                            data.load(boardData);
                        }
                        else {
                            err = logging_1.newError(const_1.axiosActions.errors(res), LOC);
                            logging_1.error(err, LOC);
                            throw err;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, data];
                }
            });
        });
    };
    Database.prototype.boardByIndex = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var boards;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.boards()];
                    case 1:
                        boards = _a.sent();
                        if (!Number.isInteger(index) || index < 0 || index >= boards.length) {
                            throw logging_1.newError("index " + index + " out of range", 'database.boardByIndex');
                        }
                        return [4 /*yield*/, this._load(boards[index])];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    Database.prototype.boardById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var boards, b;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.boards()];
                    case 1:
                        boards = _a.sent();
                        b = boards.find(function (x) { return x.id === id; });
                        if (!b) {
                            throw logging_1.newError("board " + id + " not found", 'database.boardById');
                        }
                        return [2 /*return*/, this._load(b)];
                }
            });
        });
    };
    Database.prototype.find = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var result, boards, index, isEqual, fieldname;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        return [4 /*yield*/, this.boards()];
                    case 1:
                        boards = _a.sent();
                        for (index = 0; index < boards.length; index++) {
                            isEqual = true;
                            for (fieldname in query) {
                                if (!query.hasOwnProperty(fieldname)) {
                                    continue;
                                }
                                if (boards[index].board[fieldname] != query[fieldname]) {
                                    isEqual = false;
                                    break;
                                }
                            }
                            if (isEqual) {
                                result.push(boards[index]);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Database.prototype.boardCreate = function (boardObj) {
        return __awaiter(this, void 0, void 0, function () {
            var result, board, boardClass, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post('board', boardObj)];
                    case 1:
                        result = _a.sent();
                        if (const_1.axiosActions.isOk(result)) {
                            board = const_1.axiosActions.data(result);
                            boardClass = new board_1.default(board);
                            this._boards.push(boardClass);
                            return [2 /*return*/, boardClass];
                        }
                        else {
                            throw logging_1.newError(const_1.axiosActions.errors(result), 'database.boardDelete');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        logging_1.error(e_2, 'database.boardCreate');
                        throw logging_1.newError(e_2, 'database.boardDelete');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.boardUpdate = function (board) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!board.isDirty) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.patch("board/$(board.id}", board.changedData())];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * delete all
     * @param query Object as filter of String: the id
     * @return Boolean true: found and deleted, false: not found
     */
    Database.prototype.boardDelete = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var records, _loop_1, this_1, _i, records_1, rec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof query === 'string') {
                            query = { id: query };
                        }
                        return [4 /*yield*/, this.find(query)];
                    case 1:
                        records = _a.sent();
                        if (!records.length) return [3 /*break*/, 6];
                        _loop_1 = function (rec) {
                            var result, index;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, axios_1.default.delete("board/" + rec.id)];
                                    case 1:
                                        result = _a.sent();
                                        if (const_1.axiosActions.isOk(result)) {
                                            index = this_1._boards.findIndex(function (b) { return b.id === rec.id; });
                                            if (index < 0) {
                                                throw new logging_1.LocationError("could not find board " + rec.id, 'database.boardDelete');
                                            }
                                            this_1._boards.splice(index, 1);
                                        }
                                        else {
                                            throw logging_1.newError(const_1.axiosActions.errors(result), 'database.boardDelete');
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, records_1 = records;
                        _a.label = 2;
                    case 2:
                        if (!(_i < records_1.length)) return [3 /*break*/, 5];
                        rec = records_1[_i];
                        return [5 /*yield**/, _loop_1(rec)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, true];
                    case 6: return [2 /*return*/, false];
                }
            });
        });
    };
    return Database;
}());
exports.default = Database;
//# sourceMappingURL=database.js.map