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
		withRelated: ["albums", "user"],
	});
	res.send({
		status: "success",
		data: { photo },
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
	const photoId = req.params.photoId;

	// make sure photo exists
	const photo = await new models.Photo({ id: photoId }).fetch({
		require: false,
	});
	if (!photo) {
		debug("photo to update was not found. %o", { id: photoId });
		res.status(404).send({
			status: "fail",
			data: "photo Not Found",
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
		const updatedphoto = await photo.save(validData);
		debug("Updated photo successfully: %O", updatedphoto);
		res.send({
			status: "success",
			data: { photo },
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
