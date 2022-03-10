const express = require("express");
const router = express.Router();
const albumController = require("../controllers/album_controller");
const albumValidationRules = require("../validation/album");

// Get all resources
router.get("/", albumController.getAllAlbumsFromUser);

// Get a specific resource
router.get("/:albumId", albumController.getAlbumFromUser);

// Store a new resource
router.post("/", albumValidationRules.createRules, albumController.store);

// Update a specific resource
router.put(
	"/:albumId",
	albumValidationRules.updateRules,
	albumController.update
);

// Assign  a photo to an album
router.post(
	"/:albumId/photos",
	albumValidationRules.assignPhotoToAlbumRules,
	albumController.assignPhoto
);

module.exports = router;
