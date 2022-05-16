const jwt = require("jsonwebtoken");

const TOKEN_KEY = "P3jMJYJyN53R5RMQfVEzx58s4xNGShwX";
const ADMIN_EMAIL = "admin@gmail.com";

const verify_token = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"];
	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}
	try {
		req.user = jwt.verify(token, TOKEN_KEY);
		console.log(req.user);
		if (!req.user.admin)
			return res.status(401).send("Need administrator credentials to access this route");
	} catch (err) {
		return res.status(401).send("Invalid Token");
	}
	return next();
}

const create_token = (name, email) => {
	const is_admin = (email === ADMIN_EMAIL);
	const token = jwt.sign(
		{email: email, name: name, admin: is_admin},
		TOKEN_KEY,
		{expiresIn: "2h"}
	);
	return token;
}

module.exports = {verify_token, create_token};
