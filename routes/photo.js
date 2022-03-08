const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photo_controller");
const photoValidationRules = require("../validation/photo");

// Get all resources
router.get("/", photoController.getAllPhotosFromUser);

//  Get a specific resource
router.get("/:photoId", photoController.getPhotoFromUser);

//  Store a new resource
router.post("/", photoValidationRules.createRules, photoController.store);

// Update a specific resource
router.put(
	"/:photoId",
	photoValidationRules.updateRules,
	photoController.update
);
module.exports = router;
