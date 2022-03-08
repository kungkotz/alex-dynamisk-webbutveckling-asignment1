/**
 * Album Controller
 */
const debug = require("debug")("albums:album_controller");
const { matchedData, validationResult } = require("express-validator");
const { User } = require("../models");
const models = require("../models");

// Get all albums with from an authenticated user
const getAllAlbumsFromUser = async (req, res) => {
	const user = await User.fetchById(req.user.id, {
		withRelated: ["albums"],
	});
	res.send({
		status: "success",
		data: {
			albums: user.related("albums"),
		},
	});
};

// Get a specific album and it's photos from an authenticated user
const getAlbumFromUser = async (req, res) => {
	const user = await models.User.fetchById(req.user.id, {
		withRelated: ["albums"],
	});
	const userAlbums = user.related("albums");
	const requestedAlbum = userAlbums.find(
		(album) => album.id == req.params.albumId
	);

	if (!requestedAlbum) {
		return res.status(404).send({
			status: "fail",
			message: "Requested album could not be found.",
		});
	}

	const albumId = await models.Album.fetchById(req.params.albumId, {
		withRelated: ["photos"],
	});

	res.send({
		status: "success",
		data: { albumId },
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
	const validData = matchedData(req);
	validData.user_id = req.user.id;

	try {
		const album = await new models.Album(validData).save();
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
// Assign a photo to an album belonging to a authenticated user.
const assignPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}
	// get only the validated data from request
	const validData = matchedData(req);
	// fetch album and photos relation
	const album = await models.Album.fetchById(validData, {
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
			data: "Photo already exists in this album.",
		});
	}

	try {
		const result = await album.photos().attach(validData.photo_id);
		debug("Successfully added photo to the album : %O", result);

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
	getAllAlbumsFromUser,
	getAlbumFromUser,
	store,
	update,
	assignPhoto,
};
