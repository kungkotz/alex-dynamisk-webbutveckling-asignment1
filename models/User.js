/**
 * User model
 */
const bcrypt = require("bcrypt");
module.exports = (bookshelf) => {
	return bookshelf.model(
		"User",
		{
			tableName: "users",
			albums() {
				return this.hasMany("Album");
			},
			photos() {
				return this.hasMany("Photo");
			},
		},
		{
			async login(email, password) {
				const user = await new this({ email }).fetch({
					require: false,
				});
				if (!user) {
					return false;
				}
				const hash = user.get("password");

				//  compare if hash matches the requested users hash
				const result = await bcrypt.compare(password, hash);
				if (!result) {
					return false;
				}
				return user;
			},

			async fetchById(id, fetchOptions = {}) {
				return await new this({ id }).fetch(fetchOptions);
			},
		}
	);
};
