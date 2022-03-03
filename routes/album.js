const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_Controller');
const exampleValidationRules = require('../validation/example');

/* 
// Get all resources
router.get('/', exampleController.index);

// Get a specific resource
router.get('/:exampleId', exampleController.show);

// Store a new resource
router.post('/', exampleValidationRules.createRules, exampleController.store);

// Update a specific resource
router.put('/:exampleId', exampleValidationRules.updateRules, exampleController.update);

// Destroy a specific resource
router.delete('/:exampleId', exampleController.destroy);
*/

// Get all resources
router.get('/', albumController.index);

// Get a specific resource
router.get('/:albumId', albumController.show);

// Store a new resource
router.post('/', albumController.store);

// Update a specific resource
router.put('/:albumId', albumController.update);

// Destroy a specific resource
router.delete('/:albumId', albumController.destroy);

module.exports = router;
