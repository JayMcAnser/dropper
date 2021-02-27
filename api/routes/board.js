/**
 * access to the boards
 */
/**
 * access to the api
 */

const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board');

router.get('/list', boardController.list);
//router.get('/name/:name', boardController.openByName);
router.get('/:id', boardController.open)
router.post('/', boardController.create);
router.put('/:id', boardController.replace);
router.delete('/:id', boardController.delete);
router.patch('/:id', boardController.update)
router.post('/:id/element', boardController.elementAdd);
router.post('/:id/elementId', boardController.elementId);
router.patch('/:id/element/:elementId',  boardController.elementUpdate);
router.delete('/:id/element/:elementId', boardController.elementRemove);

module.exports = router;
