/**
 * User Validation Rules
 */

const { body } = require("express-validator");
const models = require("../models");

/**
 * Create User validation rules
 *
 * Required: email,password,first_name(min length: 3),last_name(min length: 3)
 * Optional: -
 */
const createRules = [
	body("email")
		.exists()
		.isEmail()
		.custom(async (value) => {
			const email = await new models.User({ email: value }).fetch({
				require: false,
			});
			if (email) {
				return Promise.reject(
					"This email adress has already been used, please try a different one"
				);
			}
			return Promise.resolve();
		}),
	body("password").exists().isLength({ min: 8 }),
	// Bo Ek is not allowed to create an account according to evil teacher DrBlue
	body("first_name").exists().isLength({ min: 3 }),
	body("last_name").exists().isLength({ min: 3 }),
];

/**
 * Update Example validation rules
 *
 * Required: -
 * Optional: title, Wanna change your first and last name? Contact Skatteverket first!

 */
const updateRules = [body("title").optional().isLength({ min: 4 })];

module.exports = {
	createRules,
	updateRules,
};
