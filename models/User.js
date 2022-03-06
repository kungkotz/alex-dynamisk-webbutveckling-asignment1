/**
 * User model
 */
const bcrypt = require("bcrypt");
module.exports = (bookshelf) => {
	return bookshelf.model("User", {
		tableName: "users",
		albums() {
			return this.hasMany("Album");
		},
		photos() {
			return this.hasMany("Photo");
		},
	});
};
