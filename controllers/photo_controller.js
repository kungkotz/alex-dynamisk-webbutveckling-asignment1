/**
 * Photo Controller
 */

const debug = require("debug")("photos:photo_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

// Get all photos with a GET request
const index = async (req, res) => {
	const allPhotos = await models.Photo.fetchAll();
	res.send({
		status: "success",
		data: { allPhotos },
	});
};

// Get a specific photo based on photoId with a GET request
const show = async (req, res) => {
	const photo = await new models.Photo({ id: req.params.photoId }).fetch({
		withRelated: ["photos", "user"],
	});
	res.send({
		status: "success",
		data: { photo },
	});
};

// Store a new Album with a POST request
const store = async (req, res) => {
	// Check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	// const validData = matchedData(req);

	try {
		const album = await new models.Album(req.body).save();
		debug("Created new album successfully: %O", album);

		res.send({
			status: "success",
			data: { album },
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when creating a new album.",
		});
		throw error;
	}
};

// Update a specific album with a PUT request
const update = async (req, res) => {
	const albumId = req.params.albumId;

	// make sure album exists
	const album = await new models.Album({ id: albumId }).fetch({
		require: false,
	});
	if (!album) {
		debug("Album to update was not found. %o", { id: albumId });
		res.status(404).send({
			status: "fail",
			data: "Album Not Found",
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
		const updatedAlbum = await album.save(validData);
		debug("Updated album successfully: %O", updatedAlbum);
		res.send({
			status: "success",
			data: { album },
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when updating a new album.",
		});
		throw error;
	}
};
/**
 * Destroy a specific resource
 *
 * DELETE /:exampleId
 */
const destroy = (req, res) => {
	res.status(400).send({
		status: "fail",
		message:
			"You need to write the code for deleting this resource yourself.",
	});
};

module.exports = {
	index,
	show,
	store,
	update,
	destroy,
};
