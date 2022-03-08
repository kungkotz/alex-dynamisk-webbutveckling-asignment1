// Auth Middleware
const models = require("../models");
// HTTP Basic Authentication
const basic = async (req, res, next) => {
	// check if auth header exists, if !true, return 401
	if (!req.headers.authorization) {
		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		});
	}
	// Split header into two  (authSchema) & (base64Payload)
	const [authSchema, base64Payload] = req.headers.authorization.split(" ");

	// If authSchema doesnt have value "basic...", then bail out.
	if (authSchema.toLowerCase() !== "basic") {
		debug("Authorization schema isn't basic");

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		});
	}

	// Decoding payload from base64 to ascii
	const decodedPayload = Buffer.from(base64Payload, "base64").toString(
		"ascii"
	);
	// DecodedPayload = email:password

	// Split the decoded payload into <username>:<password>
	const [email, password] = decodedPayload.split(":");

	const user = await models.User.login(email, password);
	// if user does not exist, throw 401 error
	if (!user) {
		return res.status(401).send({
			status: "fail",
			data: "Authorization failed",
		});
	}

	// Assign user to the request.
	req.user = user;

	// Move along.
	next();
};

module.exports = {
	basic,
};
