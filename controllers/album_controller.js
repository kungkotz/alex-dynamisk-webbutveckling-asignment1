/**
 * Album Controller
 */

const debug = require("debug")("albums:album_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

// Get all albums with a GET request
const index = async (req, res) => {
	const allAlbums = await models.Album.fetchAll();
	res.send({
		status: "success",
		data: { allAlbums },
	});
};

// Get a specific album based on albumId with a GET request
const show = async (req, res) => {
	const album = await new models.Album({ id: req.params.albumId }).fetch({
		withRelated: ["photos", "user"],
	});
	res.send({
		status: "success",
		data: { album },
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

const assignPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}
	// get only the validated data from request
	const validData = matchedData(req);
	// fetch album and photos relation
	const album = await models.Album.fetchById(req.params.albumId, {
		withRelated: ["photos"],
	});
	// get all photos of the related album
	const photos = album.related("photos");
	// check if the photo is already in the specific album
	const existingPhoto = photos.find(
		(photo) => photo.id == validData.photo.id
	);
	// if the photo already exists, throw bail error.
	if (existingPhoto) {
		return res.send({
			status: "fail",
			data: "Photo already exists.",
		});
	}

	try {
		const result = await album.photos().attach(validData.photo_id);
		debug("Successfully added photo to album : %O", result);

		res.send({
			status: "success",
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when adding a photo to a album.",
		});
		throw error;
	}
};
module.exports = {
	index,
	show,
	store,
	update,
	destroy,
	assignPhoto,
};
