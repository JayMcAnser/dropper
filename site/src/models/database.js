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
            var LOC, res, boardList, boardList_1, boardList_1_1, b, boardClass, err, e_1;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.boardsLoaded) return [3 /*break*/, 4];
                        LOC = 'database.load';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this._boards = [];
                        return [4 /*yield*/, axios_1.default.get('/board/list')];
                    case 2:
                        res = _b.sent();
                        if (const_1.axiosActions.isOk(res)) {
                            boardList = const_1.axiosActions.data(res);
                            try {
                                for (boardList_1 = __values(boardList), boardList_1_1 = boardList_1.next(); !boardList_1_1.done; boardList_1_1 = boardList_1.next()) {
                                    b = boardList_1_1.value;
                                    boardClass = new board_1.default(b);
                                    // debug(boardClass, `${LOC}.board`);
                                    this._boards.push(boardClass);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (boardList_1_1 && !boardList_1_1.done && (_a = boardList_1.return)) _a.call(boardList_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            //     debug(this._boards, `${LOC}.loaded`)
                        }
                        else {
                            err = logging_1.newError(const_1.axiosActions.errors(res), LOC);
                            logging_1.error(err, LOC);
                            throw err;
                        }
                        this.boardsLoaded = true;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
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
    /**
     * generate a new board id
     */
    Database.prototype.boardNew = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, newBoard, boardClass, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get('board/newid')];
                    case 1:
                        result = _a.sent();
                        if (const_1.axiosActions.isOk(result)) {
                            newBoard = const_1.axiosActions.data(result);
                            logging_1.debug(newBoard, 'new board');
                            boardClass = new board_1.default(newBoard, { isNew: true });
                            this._boards.push(boardClass);
                            return [2 /*return*/, boardClass];
                        }
                        else {
                            throw logging_1.newError(const_1.axiosActions.errors(result), 'database.boardNew');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        logging_1.error(e_3, 'database.boardNew');
                        throw logging_1.newError(e_3, 'database.boardNew');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.boardCreate = function (boardObj) {
        return __awaiter(this, void 0, void 0, function () {
            var result, board, boardClass, e_4;
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
                            throw logging_1.newError(const_1.axiosActions.errors(result), 'database.boardCreate');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        logging_1.error(e_4, 'database.boardCreate');
                        throw logging_1.newError(e_4, 'database.boardCreate');
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
                        if (!board.isNew) return [3 /*break*/, 1];
                        return [2 /*return*/, this.boardCreate(board)];
                    case 1:
                        if (!board.isDirty) return [3 /*break*/, 3];
                        return [4 /*yield*/, axios_1.default.patch("board/$(board.id}", board.changedData())];
                    case 2:
                        result = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
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
            var records, _loop_1, this_1, records_1, records_1_1, rec, e_5_1;
            var e_5, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof query === 'string') {
                            query = { id: query };
                        }
                        return [4 /*yield*/, this.find(query)];
                    case 1:
                        records = _b.sent();
                        if (!records.length) return [3 /*break*/, 10];
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
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 9]);
                        records_1 = __values(records), records_1_1 = records_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!records_1_1.done) return [3 /*break*/, 6];
                        rec = records_1_1.value;
                        return [5 /*yield**/, _loop_1(rec)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        records_1_1 = records_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_5_1 = _b.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (records_1_1 && !records_1_1.done && (_a = records_1.return)) _a.call(records_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, true];
                    case 10: return [2 /*return*/, false];
                }
            });
        });
    };
    return Database;
}());
exports.default = Database;
//# sourceMappingURL=database.js.map