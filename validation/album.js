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

// Asign a photo to an album validation rules
const assignPhotoToAlbumRules = [
	body("photo_id")
		.exists()
		.bail()
		.custom(async (value) => {
			const photo = await new models.Photo({ id: value }).fetch({
				require: false,
			});
			if (!photo) {
				return Promise.reject(
					` Photo with the id ${value} does not exist.`
				);
			}

			return Promise.resolve();
		}),
];

module.exports = {
	createRules,
	updateRules,
	assignPhotoToAlbumRules,
};
