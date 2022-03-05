/**
 * User Validation Rules
 */

const { body } = require("express-validator");
const models = require("../models");

/**
 * Create photo validation rules
 *
 * Required: url(must be an url), title(min length 3)
 * Optional: comment (min length 3)
 */
const createRules = [
	body("url").exists().isURL(),
	body("comment").optional().isLength({ min: 3 }),
	body("title").exists().isLength({ min: 3 }),
];

/**
 * Update photo validation rules
 *
 * Required: photo_id
 * Optional:
 */
const updateRules = [
	body("url").optional().isURL(),
	body("comment").optional().isLength({ min: 3 }),
	body("title").optional().isLength({ min: 3 }),
];

module.exports = {
	createRules,
	updateRules,
};
