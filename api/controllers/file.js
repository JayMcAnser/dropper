const boardModel = require('../models/board');
const Const = require('../vendors/lib/const');
const ApiReturn = require('../vendors/lib/api-return');
const AuthController = require('../vendors/controllers/auth')
const Messages = require('../lib/const')


const _getSession = function(req) {
  if (req.session) {
    return req.session
  }
  console.error('missing req.session');
  return {
    userId: req.session.user ? req.session.user.id : '0',
    log: req.session.log,
  }
}

module.exports = {

  validate: function(req, res, next) {
    // we have to check for the /list and the /:id. They can be public
    if (req.method === 'GET' &&  !(req.headers && req.headers.authorization)) {
      // this could be public access
      // only url === /list and url === does not contain a /
      if (req.url === '/list' || req.url.substr(1).indexOf('/') < 0) {
        console.log('possible public access')
        AuthController.setupLogging(req);
        next();
        return
      }
    }
    AuthController.validate(req, res, next)
  },
  /**
   * retrieve an image from the board
   *
   * boardId: string id of the requested board
   * elementId: string the id of requested element
   * index: number / string optional the element of a multi-image element
   * @returns {Promise<void>}
   */
  image: async function (req, res, next) {
    try {
      let board = await boardModel.findById(_getSession(req), req.params.boardId);
      if (board) {
        let elementId = req.params.elementId
        let index = req.params.index !== undefined ? req.params.index : 0;
        let streamInfo = boardModel.getStreamInfo(_getSession(req),board, elementId, index,'image')
        res.set('Content-Type', streamInfo.mimeType);
        res.set('Content-Length',streamInfo.size);
//         res.writeHeader(200, {'Content-Type': $ );
        let stream = boardModel.getStream(_getSession(req), board, elementId, index);
        stream.on('open', function () {
          stream.pipe(res)
        })
        stream.on('error', function() {
          ApiReturn.error(req, res, e, 200)
          res.end(err)
        })
        stream.on('end', function() {
          res.end();
        })
        // ApiReturn.result(req, res, board, `[controller.file].image`)
      } else {
        ApiReturn.error(req, res, Messages.errors.boardNotFound, 200)
      }
    } catch (e) {
      ApiReturn.error(req, res, e, 200)
    }
  }
}
