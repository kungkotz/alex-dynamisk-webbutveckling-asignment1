/**
 * User Controller
 */

const debug = require("debug")("users:user_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

// Get all users with a GET request
const index = async (req, res) => {
	const allUsers = await models.User.fetchAll();
	res.send({
		status: "success",
		data: { allUsers },
	});
};

// Get a specific user based on albumId with a GET request
const show = async (req, res) => {
	const user = await new models.User({ id: req.params.userId }).fetch({
		withRelated: ["photos", "user"],
	});
	res.send({
		status: "success",
		data: { user },
	});
};

// Store a new user with a POST request
const store = async (req, res) => {
	// Check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	// const validData = matchedData(req);

	try {
		const user = await new models.User(req.body).save();
		debug("Created new user successfully: %O", user);

		res.send({
			status: "success",
			data: { user },
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when creating a new user.",
		});
		throw error;
	}
};

// Update a specific user with a PUT request
const update = async (req, res) => {
	const userId = req.params.userId;

	// make sure user exists
	const user = await new models.User({ id: userId }).fetch({
		require: false,
	});
	if (!user) {
		debug("User to update was not found. %o", { id: userId });
		res.status(404).send({
			status: "fail",
			data: "User Not Found",
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
		const updatedUser = await album.save(validData);
		debug("Updated user successfully: %O", updatedUser);
		res.send({
			status: "success",
			data: { user },
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when updating a new user.",
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
