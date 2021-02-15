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
router.patch('/:id', boardController.update)
router.post('/:id/element', boardController.elementAdd);
router.patch('/:id/element',  boardController.elementUpdate);
router.delete('/:id/element/:elementId', boardController.elementRemove);

module.exports = router;
