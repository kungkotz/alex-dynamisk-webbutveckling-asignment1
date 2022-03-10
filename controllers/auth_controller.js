const bcrypt = require("bcrypt");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

// Register a new user with a POST request
const register = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}
	// get only the validated data from the request
	const validData = matchedData(req);
	// hasing user password
	try {
		validData.password = await bcrypt.hash(validData.password, 8);
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown when hashing the password.",
		});
		throw error;
	}

	try {
		// Even if we never use "user", we still have to save the valid data somewhere
		const user = await new models.User(validData).save();

		res.status(200).send({
			status: "success",
			data: {
				email: validData.email,
				first_name: validData.first_name,
				last_name: validData.last_name,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when registering a new user.",
		});
		throw error;
	}
};
const login = async (req, res) => {
	// logging in the user, if user doesnt exists, send error 401
	const user = await models.User.login(req.body.email, req.body.password);
	if (!user) {
		return res.status(401).send({
			status: "fail",
			data: "Authentication failed.",
		});
	}

	// response
	return res.status(200).send({
		status: "success",
		data: {
			user,
		},
	});
};

module.exports = {
	register,
	login,
};
