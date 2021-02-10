const boardModel = require('../models/board');
const Const = require('../vendors/lib/const');
const ApiReturn = require('../vendors/lib/api-return');

const _getSession = function(req) {
  return {
    userId: req.session.user.id,
    log: req.session.log
  }
}

module.exports = {

  create: async function(req, res, next) {
    try {
      let board = await boardModel.create(_getSession(req), req.body)
      ApiReturn.result(req, res, board,`[controller.board].create name: ${req.body.name}` )
      // res.json({status: Const.status.success, message: "board created", data: board});
      // req.session.log('debug', () => `[controller.board].create name: ${req.body.name}`)
    } catch(e) {
      ApiReturn.error(req, res, e, 200 )
//      req.session.log('error', () => `[controller.board].create ${req.body.name}, error: ${e.message}`)
//      res.json({status: Const.status.error, message: e.message, data:null});
    }
  },

  open: async function(req, res) {
    let LOC = 'board.controller.open';
    try {
      let board = await boardModel.open(_getSession(req), req.params.name);
      ApiReturn.result(req, res, board, LOC)
      // res.json({status: Const.status.success, message: "board loaded", data: board});
      // req.session.log('debug', () => `[controller.board] open board ${req.params.name}`)
    } catch (e) {
      ApiReturn.error(req, res, e, LOC, 200)
      // req.session.log('error', () => `[controller.board].open ${req.params.name}, error: ${e.message}`)
      // res.json({status: Const.status.error, message: e.message, data:null});
    }
  },

  replace: async function(req, res) {
    const LOC = 'board.controller.replace'
    try {
      let board = await boardModel.save(_getSession(req), req.params.id, req.body);
      ApiReturn.result(req, res, board, LOC)
//      res.json({status: Const.status.success, message: "board replaced", data: board});
    } catch (e) {
      ApiReturn.error(req, res, e, LOC, 200)
//       res.json({status: Const.status.error, message: e.message, data:null});
    }
  },

  update: async function(req, res) {
    const LOC = 'board.controller.update';
    try {
      let board = await boardModel.update(_getSession(req), req.params.id, req.body);
      ApiReturn.result(req, res, board, LOC)
      // res.json({status: Const.status.success, message: "board updated", data: board});
    } catch (e) {
      ApiReturn.error(req, res, e, LOC, 200);
      // res.json({status: Const.status.error, message: e.message, data:e.errors});
    }
  }



}
