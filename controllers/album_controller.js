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
	res.status(200).send({
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
	// Find a authenticated users album based on it's id
	const userAlbums = user
		.related("albums")
		.find((album) => album.id == req.params.albumId);

	if (!userAlbums) {
		return res.status(404).send({
			status: "fail",
			message: "Requested album could not be found.",
		});
	}
	// get the requested album along with it's photos.
	const albumId = await models.Album.fetchById(req.params.albumId, {
		withRelated: ["photos"],
	});

	res.status(200).send({
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

		res.status(200).send({
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
	// Fetching users id based on who logged in
	const user = await models.User.fetchById(req.user.id, {
		withRelated: ["albums"],
	});

	// save the users albums to userAlbums
	const userAlbums = user.related("albums");

	// Find the requsted album that a user has requested
	const album = userAlbums.find((album) => album.id == req.params.albumId);

	// check if the requested album exists

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
		res.status(200).send({
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
// Assign a photo to an album belonging to an authenticated user.
const assignPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}
	// get only the validated data from request
	const validData = matchedData(req);

	// Get authenticated user along with its relations
	const user = await models.User.fetchById(req.user.id, {
		withRelated: ["albums", "photos"],
	});

	// Find the requested album from the authenticated users albums.
	const userAlbum = user
		.related("albums")
		.find((album) => album.id == req.params.albumId);

	// Find the requested photo from the authenticated users photos.
	const userPhoto = user
		.related("photos")
		.find((photo) => photo.id == validData.photo_id);
	// check if album or photo exists, if not send 404 error.
	if (!userAlbum) {
		res.status(404).send({
			status: "fail",
			data: "Album could not be found",
		});
		return;
	} else if (!userPhoto) {
		res.status(404).send({
			status: "fail",
			data: "Photo could not be found",
		});
		return;
	}
	// saving album id in album variable
	const album = await models.Album.fetchById(req.params.albumId, {
		withRelated: ["photos"],
	});

	// check if the photo a user is trying to add already exists in the album.
	const existingPhoto = album
		.related("photos")
		.find((photo) => photo.id == validData.photo_id);

	// If photo already exists in the album, return fail, else try to attach
	if (existingPhoto) {
		return res.status(409).send({
			// https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists
			status: "fail",
			data: "The photo already exists",
		});
	}

	try {
		await album.photos().attach(validData.photo_id);

		res.status(200).send({
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
