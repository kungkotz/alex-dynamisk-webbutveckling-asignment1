/**
 * Photo Controller
 */

const debug = require("debug")("photos:photo_controller");
const { matchedData, validationResult } = require("express-validator");
const { User } = require("../models");
const models = require("../models");

// Get all photos with a GET request
const getAllPhotosFromUser = async (req, res) => {
	const user = await User.fetchById(req.user.id, {
		withRelated: ["photos"],
	});
	res.send({
		status: "success",
		data: {
			photos: user.related("photos"),
		},
	});
};

// Get a specific photo based on photoId with a GET request
const getPhotoFromUser = async (req, res) => {
	const user = await models.User.fetchById(req.user.id, {
		withRelated: ["photos"],
	});
	const userPhotos = user
		.related("photos")
		.userPhotos.find((photo) => photo.id == req.params.photoId);

	if (!userPhotos) {
		return res.status(404).send({
			status: "fail",
			message: "Requested photo could not be found.",
		});
	}
	const photoId = await models.Photo.fetchById(req.params.photoId, {
		withRelated: ["albums"],
	});
	res.send({
		status: "success",
		data: { photoId },
	});
};

// Store a new photo with a POST request
const store = async (req, res) => {
	// Check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);
	validData.user_id = req.user.id;

	try {
		const photo = await new models.Photo(validData).save();
		debug("Created new photo successfully: %O", photo);

		res.send({
			status: "success",
			data: { photo },
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when creating a new photo.",
		});
		throw error;
	}
};

// Update a specific photo with a PUT request
const update = async (req, res) => {
	// Fetching users id based on who logged in
	const user = await models.User.fetchById(req.user.id, {
		withRelated: ["photos"],
	});

	// Find the requsted photo that a user has requested and save the users photos to userPhotos.
	const userPhotos = user
		.related("photos")
		.find((photo) => photo.id == req.params.photoId);

	// check if the requested photo exists
	if (!userPhotos) {
		debug("photo to update was not found. %o", { id: userPhotos });
		res.status(404).send({
			status: "fail",
			data: "Photo Not Found",
		});
		return;
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedPhoto = await userPhotos.save(validData);
		debug("Updated photo successfully: %O", updatedPhoto);
		res.send({
			status: "success",
			data: { userPhotos },
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when updating a new photo.",
		});
		throw error;
	}
};
/**
 * Destroy a specific resource
 *
 * DELETE /:exampleId
 */

module.exports = {
	getAllPhotosFromUser,
	getPhotoFromUser,
	store,
	update,
};
