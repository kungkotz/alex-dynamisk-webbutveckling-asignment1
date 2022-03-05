/**
 * Album Validation Rules
 */

const { body } = require("express-validator");
const models = require("../models");

/**
 * Create Album validation rules
 *
 * Required: title (min length: 3)
 * Optional: -
 */
const createRules = [body("title").exists().isLength({ min: 3 })];
/**
 * Update album validation rules
 *
 * Required: -
 * Optional: title (min length: 3)
 */
const updateRules = [body("title").optional().isLength({ min: 3 })];

module.exports = {
	createRules,
	updateRules,
};
