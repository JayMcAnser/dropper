/**
 * Board model.
 *
 * These are currently stored in files. All board are global (not user specific
 *
 * version 1.0
 *
 */
const Config = require('config');
const Fs = require('fs');
const Path = require('path');
const Helper = require('../vendors/lib/helper');
const { v4 : uuidv4} = require('uuid');
const JsonFile = require('jsonfile');
const Const = require('../vendors/lib/const')
const Logging = require('../vendors/lib/logging');
const Joi = require('joi');
const {ValidationError, StatusError} = require('../vendors/lib/model-helper')

const historyActions = {
  imageAdd: 'image.add',
  imageDelete: 'image.delete',
  imageUpdate: 'image.update',
  dataUpate: 'data.update',
  elementAdd: 'element.add',
  elementUpdate: 'element.update',
  elementRemove: 'element.remove'
}

const InsertSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  name: Joi.string().max(50).required(),
  description: Joi.string().allow(null, ''),
  isPublic: Joi.bool().default(false)
});

const UpdateSchema = Joi.object({
  id: Joi.string().allow(null, ''),     // is allowed but we do NOT write it
  title: Joi.string().min(3).max(100).allow(null, ''),
  name: Joi.string().max(50).allow(null, ''),
  description: Joi.string().allow(null, ''),
  isPublic: Joi.bool().default(false)
})

const ElementInsertSchema = Joi.object({
  key: Joi.string().max(50).required(),
  type: Joi.string().required(),
  title: Joi.string().min(3).max(100),

  description: Joi.string().allow(null, ''),
})

const ElementUpdateSchema = Joi.object({
  id: Joi.string(),
  key: Joi.string().max(50),
  type: Joi.string(),
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow(null, ''),
})


const READ = 1;
const WRITE = 2;
const READWRITE = 3;
const DELETE = 4;

module.exports = {
  ROOT_USER: 'f4500bab-6ce1-445c-89da-6a884e723915',
  get rootDir() {
    return Helper.getFullPath('', {rootKey:'Path.dataRoot'})
  },

  _validateSession: function(session) {
    if (!session.userId) {
      throw new Error(`[board] ${Const.results.missingSession}`);
    }
    return true;
  },

  _validateRights: function(session, board, rights) {
    if (session.userId === this.ROOT_USER || session.userId === board.ownerId) {
      return true; // owner has ALL rights
    }
    if (board.isPublic) {
      return true;
    }
    // TODO: check the assigned rights
    throw new StatusError({ message: Const.results.noRights, status: 403});
  },
  _loadBoards: function(session, all= true) {
    let dirName = Helper.getFullPath('', {  rootKey: 'Path.dataRoot'})
    let boardIds = Fs.readdirSync(dirName);
    boardIds = boardIds.filter( (dirent) => {
      return Fs.statSync(Path.join(dirName, dirent)).isDirectory()
    })

    let boards = []
    for (let index = 0; index < boardIds.length; index++) {
      try {
        let board = JsonFile.readFileSync(Path.join(dirName, boardIds[index], Config.get('Board.indexFilename')));
        if (board.ownerId === session.userId ||
          board.isPublic ||
          session.userId === this.ROOT_USER ||
          board.users.findIndex( (u) => u.userId === session.userId) >= 0) {
          boards.push({
            id: boardIds[index],
            name: board.name,
            title: board.title,
            isPublic: board.isPublic,
            description: board.description,
          })
        }
      } catch (e) {
        Logging.log('warn', `opening baord ${boardIds[index]} returns an error: ${e.message}`)
      }
    }
    return boards;
  },

  _historyAdd(session, board, action, message = false) {
    if (!board.history) { board.history = []}
    let hist = {
      date: Date.now(),
      userId: session.userId,
      action: action
    }
    if (message) {
      hist.message = message
    }
    board.history.push(hist)
  },

  /**
   * validate the data for Editing
   *
   * @param data
   * @returns {Joi.ValidationError|boolean} false if all is well
   */
  validate: function(schema, data, ) {
    const {error, value} = schema.validate(data)
    if (error) {
      throw new ValidationError({ message: Const.results.dataNotValid, errors: error, status: 422});
    }
    return true
  },

  create: async function(session, board) {
    this._validateSession(session);
    this.validate(InsertSchema, board);

    // check the name in unique
    let b = await this.findOne(session, { name: board.name})
    if (b) {
      throw new Error(`[board] ${Const.results.boardExists}`);
    }

    let boardStore = {
      id: uuidv4(),
      name: board.name,
      title: board.title ? board.title: board.name,
      ownerId: session.userId,
      isPublic: !!board.isPublic,
      users: [],
      description: '',
      history: [{userId: session.userId, date: Date.now(), type: 'created'}],
      elements: board.elements ? board.elements: {}
    }

    let filename = Helper.getFullPath(Config.get('Board.indexFilename'),{
      rootKey: 'Path.dataRoot',
      subDirectory: boardStore.id,
      makePath: true, returnPaths: true})
    let result = await JsonFile.writeFile(filename, boardStore);
    session.log('debug', `generate board ${boardStore.id} at ${filename}`);
    //ToDo: we should register our board to in the database
    Fs.mkdirSync(Path.join(Path.dirname(filename), 'media'));
    return this._returnData(boardStore, ['description', 'elements'])
    // use to be only the number return boardStore.id
  },

  async findOne(session, what) {
    this._validateSession(session);
    let boards = this._loadBoards(session)
    return boards.find( (u) => {
      for (let key in what) {
        if (!what.hasOwnProperty(key)) { continue }
        if (what[key] === undefined || u[key] != what[key]) {
          return false
        }
      }
      return true;
    })
  },

  async findById(session, id) {
    this._validateSession(session);
    let filename = Helper.getFullPath(Config.get('Board.indexFilename'), { rootKey: 'Path.dataRoot', subDirectory: id, alwaysReturnPath: true})
    if (Fs.existsSync(filename)) {
      let board = JsonFile.readFileSync(filename)
      if (this._validateRights(session, board, READ)) {
        return board
      }
    }
    throw new Error(Const.results.boardNotFound);
  },
  /**
   * retrieve all boards allowed
   *
   * @param session
   * @param filter  {name | title | isPublic}
   * @returns {Promise<[]>}
   */
  async findAll(session, filter = false) {
    this._validateSession(session);

    let boards = this._loadBoards(session)
    if (filter) {
      return boards.find( (u) => {
        for (let key in whfilterat) {
          if (!filter.hasOwnProperty(key)) { continue }
          if (!filter[key] === undefined || u[key] != filter[key]) {
            return false
          }
        }
        return true;
      })
    }
    return boards;
  },

  /**
   * one a board
   *
   * @param session
   * @param name Object | string Object is the board self (inc id and name). string: id
   * @returns {Promise<*>}
   * @private
   */
  async _read(session, name) {
    let board;
    if (typeof name === 'string') {
      board = await this.findById(session, name);
    } else {
      board = await this.findOne(session,{name:  name.name});
    }
    if (board) {
      let filename = Helper.getFullPath(Config.get('Board.indexFilename'), {
        rootKey: 'Path.dataRoot',
        subDirectory: board.id
      })
      if (Fs.existsSync(filename)) {
        return JsonFile.readFile(filename);
      }
    }
    throw new StatusError({message: Const.results.boardNotFound, status: 404});
  },
  /**
   * lowlevel writing a board
   *
   * @param session
   * @param board
   * @returns {Promise<*>}
   * @private
   */
  async _write(session, board) {
    this._validateRights(session, board, WRITE)
    let filename = Helper.getFullPath(Config.get('Board.indexFilename'), {
      rootKey: 'Path.dataRoot',
      subDirectory: board.id
    });
    if (Fs.existsSync(filename)) {
      return JsonFile.writeFile(filename, board);
    }
    throw new Error(Const.results.boardNotFound)
  },

  _returnData(raw, fields) {
    let result = {
      id: raw.id,
      title: raw.title,
      name: raw.name,
      isPublic: raw.isPublic,
      description: raw.description
    }
    for (let index = 0; index < fields.length; index++) {
      result[fields[index]] = raw[fields[index]];
    }
    return result;
  },


  async open(session, name, fields = ['description', 'elements']) {
    this._validateSession(session);
    let raw = await this._read(session, {name: name});
    return this._returnData(raw, fields)
  },

  async openById(session, id, fields = ['description', 'elements']) {
    this._validateSession(session);
    let raw = await this._read(session, id);
    return this._returnData(raw, fields)
  },
  /**
   * saving a board is only saving the group information
   * @param session
   * @param id
   * @param board Object
   * @returns {Promise<void>}
   */
  async save(session, id, board, fields = ['elements']) {
    this._validateSession(session);
    let boardDef = await this._read(session, id)
    for (let index = 0; index < fields.length; index++) {
      boardDef[fields[index]] = board[fields[index]];
    }
    return this._write(session, boardDef, { spaces: 2, EOL: '\r\n' })
  },

  _fieldIsWritable(fieldname) {
    return ['id'].indexOf(fieldname) < 0
  },
  async update(session, id, board, fields = ['description']) {
    this._validateSession(session);
    this.validate(UpdateSchema, board);
    let boardDef = await this._read(session, id)
    for (let fieldname in board) {
      if (this._fieldIsWritable(fieldname)) {
        boardDef[fieldname] = board[fieldname]
      }
    }
    return this._write(session, boardDef, { spaces: 2, EOL: '\r\n' }).then( () => {
      return this._returnData(boardDef, fields)
    })
  },
  /**
   * set the view right for a board
   * @param session
   * @param board
   * @param isPublic
   * @returns {Promise<void>}
   */
  async setPublic(session, board, isPublic) {
    this._validateSession(session);
    let boardDef = await this._read(session, board)
    boardDef.isPublic = !!isPublic
    return this._write(session, boardDef, { spaces: 2, EOL: '\r\n' })
  },

  /**
   *
   * @param session
   * @param boardName
   * @returns {Promise<boolean>} True did succeed. false could not find recod
   */

  async delete(session, boardName) {
    this._validateSession(session);
    let board = await this.findOne(session, {name: boardName});
    if (board) {
      this._validateRights(session, board, DELETE)
      const Rimraf = require('rimraf');
      Rimraf.sync(Helper.getFullPath(board.id,{rootKey: 'Path.dataRoot'}));
      return true;
    } else {
      return false;
    }

  },

  _getImageRec(image) {
    return {
      id: typeof image === 'object' && image.id ? image.id : uuidv4(),
      filename: typeof image === 'object' ? image.filename : image,
      name: typeof image === 'object' ? image.name : Path.basename(image)
    }
  },

  /**
   *  add add a new image. Return
   * @param {Session} session
   * @param {Object} board
   * @param {} image
   * @return String id of image
   */
  async imageAdd(session, board, image) {
    let imageObj = this._getImageRec(image);
    let filename = Helper.getFullPath(imageObj.id, {
      rootKey: 'Path.dataRoot',
      extension: Path.extname(imageObj.filename),
      subDirectory: Path.join(board.id, 'media'),
      alwaysReturnPath: true,
      makePath: true
    })
    Fs.renameSync(imageObj.filename, filename )
    imageObj.filename = Path.basename((imageObj.filename)); // strip the path, only the name is important
    if (!board.images) {
      board.images = [imageObj];
    } else {
      board.images.push(imageObj)
    }
    this._historyAdd(session, board, historyActions.imageAdd, imageObj.id)
    return this.save(session, board, ['history', 'images']).then( () => {
      return imageObj.id
    });
  },
  /**
   *
   * @param {Session} session
   * @param {Board} board Full board or partial board
   * @param {String} imageId
   * @returns {String} the name of the file
   */
  async imageGet(session, board, imageId) {
    let boardDef = board;
    if (!boardDef.images) {
      boardDef = await this.openById(session, board.id, ['images'])
    }
    let image = boardDef.images.find( (img) => img.id === imageId);
    if (image) {
      let filename = Helper.getFullPath(image.id, {
        rootKey: 'Path.dataRoot',
        extension: Path.extname(image.filename),
        subDirectory: Path.join(boardDef.id, 'media')
      })
      if (filename && Fs.existsSync(filename)) {
        return filename
      }
    }
    let err = new Error(Const.results.imageNotFound);
    err.statusCode = 404;
    throw err;
  },
  /**
   * changes the image to an different
   * @param {} session
   * @param {*} board
   * @param {*} image
   */
  async imagePut(session, board, image) {
    throw new Error(Const.notImplemented)
  },


  /**
   *  add add a new image. Return
   * @param {Session} session
   * @param {Object} board
   * @param {Object} element
   * @return Object element with the unique id
   */
  async elementAdd(session, board, element) {
    this._validateSession(session);
    this.validate(ElementInsertSchema, element)

    element.id = uuidv4();
    if (!board.elements) {
      board.elements = {}
    }
    board.elements[element.id] = element
    this._historyAdd(session, board, historyActions.elementAdd, element)
    return this.save(session, board.id, board, ['history', 'elements']).then( () => {
      return element
    });
  },

  async elementUpdate(session, board, element) {
    this._validateSession(session);
    this.validate(ElementUpdateSchema, element)
    if (!element.id || !board.elements.hasOwnProperty(element.id)) {
      throw new StatusError({message: 'element not found', status: 404})
    }
    for (let fieldname in element) {
      board.elements[element.id][fieldname] = element[fieldname]
    }
    this._historyAdd(session, board, historyActions.elementUpdate, element)
    return this.save(session, board.id, board, ['history', 'elements']).then( () => {
      return element
    });
  },

  async elementRemove(session, board, elementId) {
    this._validateSession(session);
    if (!board.elements.hasOwnProperty(elementId)) {
      throw new StatusError({message: 'element not found', status: 404})
    }
    delete board.elements[elementId]
    this._historyAdd(session, board, historyActions.elementRemove, elementId)
    return this.save(session, board.id, board, ['history', 'elements']).then( () => {
      return board
    });

  }

}
